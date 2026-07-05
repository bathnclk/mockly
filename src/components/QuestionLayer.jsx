import QuestionMarker from "./QuestionMarker";

function QuestionLayer({
  questions,
  currentPage,
  activeTool,
  onDeleteQuestion,
  onQuestionMouseDown,
  pageWidth,
  pageHeight,
}) {
  return (
    <>
      {questions
        .filter((question) => question.page === currentPage)
        .map((question) => (
          <QuestionMarker
  key={question.id}
  question={question}
  activeTool={activeTool}
  onDeleteQuestion={onDeleteQuestion}
  onMouseDown={() => onQuestionMouseDown(question.id)}
  pageWidth={pageWidth}
  pageHeight={pageHeight}
/>
        ))}
    </>
  );
}

export default QuestionLayer;