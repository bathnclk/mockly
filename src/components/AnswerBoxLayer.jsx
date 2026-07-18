function AnswerBoxLayer({
  currentPage,
  answerBoxes,
  setAnswerBoxes,
  examStatus,
}) {
  function handlePointerDown(event, answerBox) {
    if (examStatus !== "setup") return;

    event.preventDefault();
    event.stopPropagation();

    const parentRect =
      event.currentTarget.parentElement.getBoundingClientRect();

    const offsetX =
      (event.clientX - parentRect.left) / parentRect.width -
      answerBox.x;

    const offsetY =
      (event.clientY - parentRect.top) / parentRect.height -
      answerBox.y;

    const pointerId = event.pointerId;
    const target = event.currentTarget;

    target.setPointerCapture(pointerId);

    function handleMove(moveEvent) {
      const x =
        (moveEvent.clientX - parentRect.left) /
          parentRect.width -
        offsetX;

      const y =
        (moveEvent.clientY - parentRect.top) /
          parentRect.height -
        offsetY;

      setAnswerBoxes((current) =>
        current.map((item) =>
          item.id === answerBox.id
            ? {
                ...item,
                x,
                y,
              }
            : item
        )
      );
    }

    function handleUp() {
      target.removeEventListener(
        "pointermove",
        handleMove
      );

      target.removeEventListener(
        "pointerup",
        handleUp
      );
    }

    target.addEventListener(
      "pointermove",
      handleMove
    );

    target.addEventListener(
      "pointerup",
      handleUp
    );
  }

  if (examStatus !== "setup") {
    return null;
  }

  return (
    <>
      {answerBoxes
        .filter(
          (answerBox) =>
            answerBox.page === currentPage
        )
        .map((answerBox) => (
          <div
            key={answerBox.id}
            className="answer-box"
            style={{
              left: `${answerBox.x * 100}%`,
              top: `${answerBox.y * 100}%`,
              width: `${answerBox.width * 100}%`,
              height: `${answerBox.height * 100}%`,
            }}
            onPointerDown={(event) =>
              handlePointerDown(event, answerBox)
            }
          >
            {answerBox.value}
          </div>
        ))}
    </>
  );
}

export default AnswerBoxLayer;