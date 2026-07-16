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
            }`}
            style={{
              left: `${box.x * 100}%`,
              top: `${box.y * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
            }}
            onPointerDown={(e) => {
    e.stopPropagation();

    // Alan Sil
    if (activeTool === "box-delete") {
        setQuestionBoxes(current =>
            current.filter(item => item.id !== box.id)
        );

        if (activeBoxId === box.id) {
            setActiveBoxId(null);
        }

        return;
    }

    // Alan Düzenle
    if (activeTool === "box-delete") {
    setQuestionBoxes(current =>
        current.filter(item => item.id !== box.id)
    );

    setActiveBoxId(null);
    return;
}

if (activeTool !== "box") return;

    setBoxDragOffset({
        x: (e.clientX - e.currentTarget.parentElement.getBoundingClientRect().left) /
            e.currentTarget.parentElement.getBoundingClientRect().width - box.x,

        y: (e.clientY - e.currentTarget.parentElement.getBoundingClientRect().top) /
            e.currentTarget.parentElement.getBoundingClientRect().height - box.y,
    });

    setActiveBoxId(box.id);
    setDraggingBoxId(box.id);
}}
          />
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