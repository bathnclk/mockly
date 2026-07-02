import { formatDuration, formatQuestionTime } from "../utils/formatTime";

function QuestionMarker({ question, isActive, onClick, onMouseDown }) {
  return (
    <div
      className={`question-item ${isActive ? "active-question" : ""}`}
      style={{
        left: question.x,
        top: question.y,
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="question-marker"
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        {question.number}
      </button>

      {question.elapsedSeconds > 0 && (
        <div
          className={`question-timer ${
            isActive ? "question-timer-active" : "question-timer-passive"
          }`}
        >
          {formatQuestionTime(question.elapsedSeconds)}
        </div>
      )}
    </div>
  );
}

export default QuestionMarker;
