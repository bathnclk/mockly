import { useRef, useEffect } from "react";

function DrawingCanvas({
  currentPage,
  drawings,
  setDrawings,
  activeTool,
  questionBoxes,
  setActiveQuestionId,
}) {
  const canvasRef = useRef(null); 
const isDrawing = useRef(false);
const currentStroke = useRef([]);

const animationFrame = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;

  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");

  ctx.scale(dpr, dpr);

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}, []);

useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw(){

        ctx.clearRect(0,0,canvas.width,canvas.height);

        drawings
            .filter(d=>d.page===currentPage)
            .forEach(stroke=>{

                if(stroke.points.length===0) return;

                ctx.beginPath();

                ctx.moveTo(
                    stroke.points[0].x,
                    stroke.points[0].y
                );

                stroke.points.forEach(point=>{

                    ctx.lineTo(point.x,point.y);

                });

                ctx.stroke();

            });

        if(currentStroke.current.length>0){

            ctx.beginPath();

            ctx.moveTo(
                currentStroke.current[0].x,
                currentStroke.current[0].y
            );

            currentStroke.current.forEach(point=>{

                ctx.lineTo(point.x,point.y);

            });

            ctx.stroke();

        }

        animationFrame.current=requestAnimationFrame(draw);

    }

    draw();

    return ()=>cancelAnimationFrame(animationFrame.current);

},[drawings,currentPage]);

function eraseAt(x, y) {

    setDrawings(current =>
        current.filter(stroke => {

            if (stroke.page !== currentPage)
                return true;

            return !stroke.points.some(point => {

                const dx = point.x - x;
                const dy = point.y - y;

                return Math.sqrt(dx*dx + dy*dy) < 18;

            });

        })
    );

}

function handlePointerDown(event) {
  event.preventDefault();
  event.stopPropagation();

  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Kalem veya silgi değilse çık
  if (!["pen", "eraser"].includes(activeTool)) return;

  // Dokunulan noktanın hangi soru alanında olduğunu bul
  const normalizedX = x / rect.width;
  const normalizedY = y / rect.height;

  const touchedBox = questionBoxes.find((box) => {
    if (box.page !== currentPage) return false;

    return (
      normalizedX >= box.x &&
      normalizedX <= box.x + box.width &&
      normalizedY >= box.y &&
      normalizedY <= box.y + box.height
    );
  });

  // Kalem veya silgi bir soru alanında kullanıldıysa
  // ilgili soruyu aktif et
  if (touchedBox?.questionId) {
    setActiveQuestionId(touchedBox.questionId);
  }

  // Silgi seçiliyse sil ve çık
  if (activeTool === "eraser") {
    eraseAt(x, y);
    return;
  }

  // Buradan sonrası kalem
  isDrawing.current = true;

  event.currentTarget.setPointerCapture(event.pointerId);

  const ctx = canvas.getContext("2d");

  currentStroke.current = [];
  currentStroke.current.push({ x, y });

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(x, y);
}

function handlePointerMove(event) {
  event.preventDefault();
  event.stopPropagation();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Önce silgiyi kontrol et
  if (activeTool === "eraser") {
    eraseAt(x, y);
    return;
  }

  // Sonra kalem kontrolü
  if (!isDrawing.current) return;

  currentStroke.current.push({ x, y });
 
}
function handlePointerUp(event) {
  if (!isDrawing.current) return;

  isDrawing.current = false;

  const points = [...currentStroke.current];

  console.log("KAYDEDİLEN POINTS:", points);

  setDrawings((current) => [
    ...current,
    {
      page: currentPage,
      points,
    },
  ]);

  currentStroke.current = [];

  event.currentTarget.releasePointerCapture(event.pointerId);
}

useEffect(() => {
  console.log("DRAWINGS:", JSON.stringify(drawings, null, 2));
}, [drawings]);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Canvas'ı temizle
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Sadece mevcut sayfanın çizimlerini al
  const pageDrawings = drawings.filter(
    drawing => drawing.page === currentPage
  );

  pageDrawings.forEach(stroke => {
    if (stroke.points.length === 0) return;

    ctx.beginPath();

    ctx.moveTo(
      stroke.points[0].x,
      stroke.points[0].y
    );

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(
        stroke.points[i].x,
        stroke.points[i].y
      );
    }

    ctx.stroke();
  });

}, [drawings, currentPage]);

  return (
    <canvas
  ref={canvasRef}
  className="drawing-canvas"
  style={{
  pointerEvents:
    ["pen", "eraser"].includes(activeTool)
      ? "auto"
      : "none",

  cursor:
    activeTool === "pen"
      ? "crosshair"
      : activeTool === "eraser"
      ? "not-allowed"
      : "default",
}}
  onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerLeave={handlePointerUp}
onPointerCancel={handlePointerUp}
/>
  );
}

export default DrawingCanvas;