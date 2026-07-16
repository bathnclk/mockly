import { formatDuration, formatQuestionTime } from "../utils/formatTime";

function QuestionMarker({
  question,
  isActive,
  onClick,
  onMouseDown,
  activeTool,
  onDeleteQuestion,
  pageWidth,
  pageHeight, 
}) {
  return (
    <div
  className={`question-item ${isActive ? "active-question" : ""}`}
  style={{
  left: `${question.x * 100}%`,
  top: `${question.y * 100}%`,
  transform: "translate(-50%, -50%)",
}}
  onPointerDown={(event) => event.stopPropagation()}
  onClick={(event) => {
    event.stopPropagation();

    if (activeTool === "delete") {
      onDeleteQuestion(question.id);
      return;
    }

    onClick?.();
  }}
>
      <button
  className="question-marker"
  onClick={onClick}
  onPointerDown={onMouseDown}
>
  {question.number}
</button>

      {(question.elapsedSeconds > 0 || isActive) && (
    <div
      className={`question-timer ${
        isActive
          ? "question-timer-active"
          : "question-timer-passive"
      }`}
    >
      {formatQuestionTime(question.elapsedSeconds)}
    </div>
)}
    </div>
  );
}

export default QuestionMarker;
