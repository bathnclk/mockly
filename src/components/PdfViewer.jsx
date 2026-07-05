import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRef } from "react";

import QuestionLayer from "./QuestionLayer";

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
setDrawings
}){
  const pageContainerRef = useRef(null);
   
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
  function handlePointerMove(event) {
  if (!draggingQuestionId) return;

  if (!pageContainerRef.current) return;

  const rect = pageContainerRef.current.getBoundingClientRect();

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  moveQuestion(draggingQuestionId, x, y);
}
  

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    setPdfFile(file);

    setCurrentPage(1);
  }

  return (
    <div className="pdf-viewer">
      {!pdfFile && (
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
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
    onClick={handlePageClick}
    onPointerMove={handlePointerMove}
    onPointerUp={onPointerUp}
    onPointerLeave={onPointerUp} 
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
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              ◀
            </button>

            <span>
              {currentPage} / {numPages}
            </span>

            <button
              disabled={currentPage === numPages}
              onClick={() => setCurrentPage((page) => page + 1)}
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
