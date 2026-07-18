function QuestionBoxLayer({
  currentPage,
  questionBoxes,
  previewBox,
  activeTool,
  activeBoxId,
  setActiveBoxId,
  draggingBoxId,
setDraggingBoxId,
boxDragOffset,
setBoxDragOffset,
setQuestionBoxes,
setQuestions,
hideQuestionBoxes,
setResizingBox,
setAnswerBoxes,
}) {
  return (
    <>
      {questionBoxes
        .filter(box => box.page === currentPage)
        .map(box => (
          <div
  key={box.id}
  className={`question-box ${
  activeBoxId === box.id ? "question-box-active" : ""
} ${
  hideQuestionBoxes ? "question-box-hidden" : ""
}`}
  style={{
  left: `${box.x * 100}%`,
  top: `${box.y * 100}%`,
  width: `${box.width * 100}%`,
  height: `${box.height * 100}%`,

  pointerEvents:
    activeTool === "box" || activeTool === "box-delete"
      ? "auto"
      : "none",
}}
  onPointerDown={(e) => {
    e.stopPropagation();

    if (activeTool === "box-delete") {
      setQuestionBoxes((current) =>
        current.filter((item) => item.id !== box.id)
      );

      setAnswerBoxes((current) =>
  current.filter(
    (answerBox) => answerBox.questionBoxId !== box.id
  )
);

      if (box.questionId) {
        setQuestions((current) =>
          current.filter(
            (question) => question.id !== box.questionId
          )
        );
      }

      setActiveBoxId(null);
      return;
    }

    if (activeTool !== "box") return;

    const rect =
      e.currentTarget.parentElement.getBoundingClientRect();

    setBoxDragOffset({
      x: (e.clientX - rect.left) / rect.width - box.x,
      y: (e.clientY - rect.top) / rect.height - box.y,
    });

    setActiveBoxId(box.id);
    setDraggingBoxId(box.id);
  }}
>
  {activeBoxId === box.id && activeTool === "box" && (
  <>
    <div
      className="resize-handle resize-nw"
      onPointerDown={(e) => {
        e.stopPropagation();
        setResizingBox({
          id: box.id,
          direction: "nw",
        });
      }}
    />

    <div
      className="resize-handle resize-ne"
      onPointerDown={(e) => {
        e.stopPropagation();
        setResizingBox({
          id: box.id,
          direction: "ne",
        });
      }}
    />

    <div
      className="resize-handle resize-sw"
      onPointerDown={(e) => {
        e.stopPropagation();
        setResizingBox({
          id: box.id,
          direction: "sw",
        });
      }}
    />

    <div
      className="resize-handle resize-se"
      onPointerDown={(e) => {
        e.stopPropagation();
        setResizingBox({
          id: box.id,
          direction: "se",
        });
      }}
    />
  </>
)}
</div>
        ))}

      {previewBox && (
        <div
          className="question-box-preview"
          style={{
            left: `${previewBox.x * 100}%`,
            top: `${previewBox.y * 100}%`,
            width: `${previewBox.width * 100}%`,
            height: `${previewBox.height * 100}%`,
          }}
        />
      )}
    </>
  );
}

export default QuestionBoxLayer;