import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRef } from "react";


import QuestionLayer from "./QuestionLayer";
import QuestionBoxLayer from "./QuestionBoxLayer";
import QuestionBoxTool from "./QuestionBoxTool";
import AnswerBoxLayer from "./AnswerBoxLayer";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import DrawingCanvas from "./DrawingCanvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({
  pdfFile,
  setPdfFile,
  currentPage,
  setCurrentPage,
  numPages,
  setNumPages,
  onPdfClick,
  questions,
  activeTool,
  onDeleteQuestion,
  onQuestionMouseDown,
  moveQuestion,
draggingQuestionId,
onPointerUp,
onQuestionClick, 
  activeQuestionId,
  drawings,
setDrawings,
questionBoxes,
setQuestionBoxes,
previewBox,
setPreviewBox,
activeBoxId,
setActiveBoxId,
draggingBoxId,
setDraggingBoxId,
boxDragOffset,
setBoxDragOffset,
setQuestions,
setActiveQuestionId,
hideQuestionBoxes,
onUserActivity,
answerBoxes,
setAnswerBoxes,
examStatus,
}){ 
   const pageContainerRef = useRef(null);
const boxStartRef = useRef(null);
const [resizingBox, setResizingBox] = useState(null);

  function handlePageClick(event) {
    if (activeTool !== "question") return;
    if (!pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();
 

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const normalizedX = mouseX / rect.width;
    const normalizedY = mouseY / rect.height;
 
    
    onPdfClick({
      page: currentPage,
      x: normalizedX,
      y: normalizedY,
    });
 
  }

  function handleBoxPointerDown(event) {

  if (activeTool !== "box") return;

  if (!pageContainerRef.current) return;

  const rect = pageContainerRef.current.getBoundingClientRect();

  boxStartRef.current = {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };

}
function handleBoxPointerMove(event) {

  if (activeTool !== "box") return;

  if (!boxStartRef.current) return;

  const rect = pageContainerRef.current.getBoundingClientRect();

  const currentX = (event.clientX - rect.left) / rect.width;
  const currentY = (event.clientY - rect.top) / rect.height;

  setPreviewBox({
    page: currentPage,
    x: Math.min(boxStartRef.current.x, currentX),
    y: Math.min(boxStartRef.current.y, currentY),
    width: Math.abs(currentX - boxStartRef.current.x),
    height: Math.abs(currentY - boxStartRef.current.y),
  });

}
function moveQuestionBox(id, x, y){

    setQuestionBoxes(current=>

        current.map(box=>{

            if(box.id!==id) return box;

            return{

                ...box,

                x,

                y,

            }

        })

    )

}
function handleBoxPointerUp() {
  if (activeTool !== "box") return;
  if (!previewBox) return;

  const boxId = `box-${Date.now()}`;
  const questionId = `question-${Date.now()}`;

  const newBox = {
    id: boxId,
    ...previewBox,
    questionId: questionId,
  };

  setQuestionBoxes(current => [
    ...current,
    newBox
  ]);

  setQuestions(current => [
    ...current,
    {
      id: questionId,
      number: current.length + 1,
      page: previewBox.page,

      // Şimdilik soru seçiciyi alanın sol üstüne koyuyoruz.
      // Sonra konumunu polish edebiliriz.
      x: previewBox.x,
      y: previewBox.y,

      elapsedSeconds: 0,

      // Alan ile ilişki
      boxId: boxId,
    }
  ]);

  const answers = ["A", "B", "C", "D", "E"];

const answerWidth = 0.045;
const answerHeight = 0.035;
const gap = 0.012;

const startX = previewBox.x;
const startY =
  previewBox.y +
  previewBox.height -
  answerHeight;

const newAnswerBoxes = answers.map((value, index) => ({
  id: `${boxId}-answer-${value}`,

  questionBoxId: boxId,
  questionId: questionId,

  page: currentPage,

  value,

  x: startX + index * (answerWidth + gap),
  y: startY,

  width: answerWidth,
  height: answerHeight,
}));

setAnswerBoxes((current) => [
  ...current,
  ...newAnswerBoxes,
]);

  boxStartRef.current = null;
  setPreviewBox(null);
}
   
  

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    setPdfFile(file);

    setCurrentPage(1);
  }

  function handlePointerDown(event){

    // Eğer kutuya basıldıysa QuestionBoxLayer stopPropagation yapacak.
    // Buraya hiç gelmeyecek.

    if(activeTool==="question"){
        handlePageClick(event);
        return;
    }

    if(activeTool==="box"){
        handleBoxPointerDown(event);
        return;
    }
}
function handlePointerMove(event) {

    if (!pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();
    const pointerX =
    (event.clientX - rect.left) / rect.width;

  const pointerY =
    (event.clientY - rect.top) / rect.height;


  // RESIZE
  if (resizingBox) {
    setQuestionBoxes((current) =>
      current.map((box) => {
        if (box.id !== resizingBox.id) return box;

        let x = box.x;
        let y = box.y;
        let width = box.width;
        let height = box.height;

        const right = box.x + box.width;
        const bottom = box.y + box.height;

        if (resizingBox.direction === "se") {
          width = pointerX - box.x;
          height = pointerY - box.y;
        }

        if (resizingBox.direction === "sw") {
          x = pointerX;
          width = right - pointerX;
          height = pointerY - box.y;
        }

        if (resizingBox.direction === "ne") {
          y = pointerY;
          width = pointerX - box.x;
          height = bottom - pointerY;
        }

        if (resizingBox.direction === "nw") {
          x = pointerX;
          y = pointerY;
          width = right - pointerX;
          height = bottom - pointerY;
        }

        // Minimum kutu boyutu
        if (width < 0.03 || height < 0.03) {
          return box;
        }

        return {
          ...box,
          x,
          y,
          width,
          height,
        };
      })
    );

    return;
  }
    // KUTU TAŞIMA
    if (draggingBoxId) {

        moveQuestionBox(
    draggingBoxId,
    (event.clientX - rect.left) / rect.width - boxDragOffset.x,
    (event.clientY - rect.top) / rect.height - boxDragOffset.y
);

        return;
    }

    // KUTU ÇİZME
    if (activeTool === "box" && boxStartRef.current) {

        handleBoxPointerMove(event);

        return;
    }

    // BALON TAŞIMA
    if (draggingQuestionId) {

        moveQuestion(
            draggingQuestionId,
            (event.clientX - rect.left) / rect.width,
            (event.clientY - rect.top) / rect.height
        );

    }
}
function handlePointerUp(event){

  if (resizingBox) {
  setResizingBox(null);
  return;
}
    if (draggingBoxId){

        setDraggingBoxId(null);

        return;
    }

    onPointerUp();

    if(activeTool==="box"){
        handleBoxPointerUp(event);
    }
}
  return (
    <div className="pdf-viewer">
      {!pdfFile && (
  <div className="upload-screen">
    <div className="upload-card">
      <div className="upload-icon">📄</div>

      <h2>PDF'ni Seç</h2>

      <p>
        Deneme sınavını içe aktar ve çözmeye başla.
      </p>

      <label className="upload-button">
        PDF Seç
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          hidden
        />
      </label>
    </div>
  </div>
)}

      {pdfFile && (
        <>
          <Document
            file={pdfFile}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
          >
            <div
  ref={pageContainerRef}
  className="pdf-page-container"
  onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerLeave={handlePointerUp}
>
              <Page
                pageNumber={currentPage}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={false} 
              />
              <DrawingCanvas
    currentPage={currentPage}
    drawings={drawings}
    setDrawings={setDrawings}
    activeTool={activeTool}
    questionBoxes={questionBoxes}
  setActiveQuestionId={setActiveQuestionId}
  onUserActivity={onUserActivity}
  answerBoxes={answerBoxes}
  questions={questions}
  setQuestions={setQuestions}
/>
<QuestionBoxLayer
    currentPage={currentPage}
    questionBoxes={questionBoxes}
    setQuestionBoxes={setQuestionBoxes}
    activeTool={activeTool}
    previewBox={previewBox}
    activeBoxId={activeBoxId}
setActiveBoxId={setActiveBoxId}
draggingBoxId ={draggingBoxId}
setDraggingBoxId ={setDraggingBoxId}
boxDragOffset={boxDragOffset}
setBoxDragOffset={setBoxDragOffset}
setQuestions={setQuestions}
hideQuestionBoxes={hideQuestionBoxes}
 setResizingBox={setResizingBox}
 setAnswerBoxes={setAnswerBoxes}
/>
 <AnswerBoxLayer
  currentPage={currentPage}
  answerBoxes={answerBoxes}
  setAnswerBoxes={setAnswerBoxes}
  examStatus={examStatus}
/>
             <QuestionLayer
  questions={questions}
  currentPage={currentPage}
  activeTool={activeTool}
  onDeleteQuestion={onDeleteQuestion}
  onQuestionMouseDown={onQuestionMouseDown} 
  onQuestionClick={onQuestionClick}
  activeQuestionId={activeQuestionId}
/>
            </div>
            
          </Document>

          <div className="pdf-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => {
    setActiveQuestionId(null);
    setCurrentPage((page) => page - 1);
  }}
            >
              ◀
            </button>

            <span>
              {currentPage} / {numPages}
            </span>

            <button
              disabled={currentPage === numPages}
              onClick={() => {
    setActiveQuestionId(null);
    setCurrentPage((page) => page + 1);
  }}
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PdfViewer;
