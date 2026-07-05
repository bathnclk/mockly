import { useRef, useEffect } from "react";

function DrawingCanvas({
  currentPage,
  drawings,
  setDrawings,
  activeTool,
}) {
  const canvasRef = useRef(null); 
const isDrawing = useRef(false);

useEffect(() => {
  const canvas = canvasRef.current;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext("2d");

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}, []);

function handlePointerDown(event) {
  event.preventDefault();
event.stopPropagation();
  console.log("Pointer Down");

  if (activeTool !== "pen") return;

  isDrawing.current = true;
  event.currentTarget.setPointerCapture(event.pointerId);
  const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");

const rect = canvas.getBoundingClientRect();

ctx.strokeStyle = "#111827";
ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.lineJoin = "round";

ctx.beginPath();

ctx.moveTo(
    event.clientX - rect.left,
    event.clientY - rect.top
);
}
function handlePointerMove(event) {
  event.preventDefault();
event.stopPropagation();

console.log("MOVE");
  if (!isDrawing.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ctx.lineTo(x, y);

ctx.strokeStyle = "#111827";
ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.lineJoin = "round";

ctx.stroke();

ctx.beginPath();
ctx.moveTo(x, y);
}
function handlePointerUp(event) {
  isDrawing.current = false;
  event.currentTarget.releasePointerCapture(event.pointerId);
}
  return (
    <canvas
  ref={canvasRef}
  className="drawing-canvas"
  style={{ 
    pointerEvents: activeTool === "pen" ? "auto" : "none",
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