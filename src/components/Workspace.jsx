import { useState } from "react";
import PdfViewer from "./PdfViewer";

function Workspace({
    activeTool,
    examStatus,
    questions,
    setQuestions,
    activeQuestionId,
    setActiveQuestionId, 
    drawings,
setDrawings,
}) {
  const [pdfFile, setPdfFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [numPages, setNumPages] = useState(0);
 

  const [draggingQuestionId, setDraggingQuestionId] = useState(null);

const [isDragging, setIsDragging] = useState(false);

const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
 

function handleQuestionMouseDown(id) {
  console.log("MouseDown:", id);

  if (activeTool !== "question") return;

  setDraggingQuestionId(id);
  setIsDragging(true);
}

  function handlePdfClick(position) {
    setQuestions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        number: current.length + 1,
        page: position.page,
        x: position.x,
        y: position.y,
        elapsedSeconds: 0,
      },
    ]);
  }
  function handleDeleteQuestion(id) {
  setQuestions((current) =>
    current.filter((question) => question.id !== id)
  );
}



function moveQuestion(id, x, y) {
  setQuestions((current) =>
    current.map((question) =>
      question.id === id
        ? {
            ...question,
            x,
            y,
          }
        : question
    )
  );
}

function handlePointerUp() {
  setDraggingQuestionId(null);
  setIsDragging(false);
}
function handleQuestionClick(id) {
    setActiveQuestionId(id); 
}
  return (
    <section className="workspace">
      <PdfViewer
  pdfFile={pdfFile}
  setPdfFile={setPdfFile}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  numPages={numPages}
  setNumPages={setNumPages}
  onPdfClick={handlePdfClick}
  questions={questions}
  activeTool={activeTool}
  onDeleteQuestion={handleDeleteQuestion}
  onQuestionMouseDown={handleQuestionMouseDown}
  moveQuestion={moveQuestion}
  draggingQuestionId={draggingQuestionId}
  onPointerUp={handlePointerUp}
  onQuestionClick={handleQuestionClick}
  activeQuestionId={activeQuestionId}
  drawings={drawings}
 setDrawings={setDrawings}
/>
      <div className="debug-panel">
        {questions.map((q) => (
          <div key={q.id}>
            Soru {q.number} - Sayfa {q.page}
            <br />
            X: {q.x.toFixed(2)}
            <br />
            Y: {q.y.toFixed(2)}
          </div>
        ))}
      </div>
      {questions.map((q) => (
        <div key={q.id}>
          Soru {q.number}
          Page {q.page}X {q.x.toFixed(2)}Y {q.y.toFixed(2)}
        </div>
      ))}
    </section>
  );
}

export default Workspace;
