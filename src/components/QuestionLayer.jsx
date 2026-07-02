import QuestionMarker from "./QuestionMarker";

function QuestionLayer({ questions, currentPage, pageWidth, pageHeight }) {
  return (
    <>
      {questions
        .filter((question) => question.page === currentPage)
        .map((question) => (
          <QuestionMarker
            key={question.id}
            question={question}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
          />
        ))}
    </>
  );
}

export default QuestionLayer;
