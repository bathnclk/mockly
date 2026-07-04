import { useState } from "react";
import PdfViewer from "./PdfViewer";

function Workspace() {
  const [pdfFile, setPdfFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [numPages, setNumPages] = useState(0);

  const [questions, setQuestions] = useState([]);

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
