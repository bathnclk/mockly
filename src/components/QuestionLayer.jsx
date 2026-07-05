import QuestionMarker from "./QuestionMarker";

function QuestionLayer({
  questions,
  currentPage,
  activeTool,
  onDeleteQuestion,
  onQuestionMouseDown,
  pageWidth,
  pageHeight,
  onQuestionClick,
  activeQuestionId,
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
  onClick={() => onQuestionClick(question.id)}  
  isActive={question.id === activeQuestionId} 
/>
        ))}
    </>
  );
}

export default QuestionLayer;