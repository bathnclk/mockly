import { useRef, useState } from "react";
import QuestionMarker from "./QuestionMarker";

function FakeExamPage({
  examStatus,
  activeTool,
  questions,
  setQuestions,
  activeQuestionId,
  setActiveQuestionId,
}) {
  const [draggingQuestionId, setDraggingQuestionId] = useState(null);
  const pageRef = useRef(null);

  function handlePageClick(event) {
    if (event.detail > 1) return;
    if (event.target !== event.currentTarget) return;

    if (examStatus !== "setup") return;
    if (activeTool !== "question") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const MARKER_SIZE = 42;

    const x = event.clientX - rect.left - MARKER_SIZE / 2;
    const y = event.clientY - rect.top - MARKER_SIZE / 2;

    setQuestions((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        number: current.length + 1,
        x,
        y,
        elapsedSeconds: 0,
      },
    ]);
  }
  function handleMouseMove(event) {
    if (draggingQuestionId === null) return;

    const rect = pageRef.current.getBoundingClientRect();

    const MARKER_SIZE = 42;

    const x = event.clientX - rect.left - MARKER_SIZE / 2;
    const y = event.clientY - rect.top - MARKER_SIZE / 2;

    const maxX = rect.width - MARKER_SIZE;
    const maxY = rect.height - MARKER_SIZE;

    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));

    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== draggingQuestionId) {
          return question;
        }

        return {
          ...question,
          x: clampedX,
          y: clampedY,
        };
      }),
    );
  }
  function handleMouseUp() {
    if (draggingQuestionId === null) return;

    setDraggingQuestionId(null);
  }
  return (
    <div
      ref={pageRef}
      className="fake-exam-page"
      onClick={handlePageClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h1>Deneme Sınavı</h1>

      <p>1. Aşağıdaki ifadelerden hangisi doğrudur?</p>

      <p>A) ...</p>

      <p>B) ...</p>

      <p>C) ...</p>

      <p className="second-question">
        2. Bu soru alanına soru balonu bırakılacak.
      </p>
      {questions.map((question) => (
        <QuestionMarker
          key={question.id}
          question={question}
          examStatus={examStatus}
          isActive={question.id === activeQuestionId}
          onClick={() => {
            if (examStatus === "setup") {
              if (activeTool === "delete") {
                setQuestions((current) =>
                  current
                    .filter((item) => item.id !== question.id)
                    .map((item, index) => ({
                      ...item,
                      number: index + 1,
                    })),
                );

                return;
              }

              return;
            }

            if (examStatus !== "running") return;

            setActiveQuestionId(question.id);
          }}
          onMouseDown={(event) => {
            if (examStatus !== "setup") return;

            event.stopPropagation();

            setDraggingQuestionId(question.id);
          }}
        />
      ))}
    </div>
  );
}

export default FakeExamPage;
