import { formatDuration } from "../utils/formatTime";
function Toolbar({
  examStatus,

  activeTool,

  setActiveTool,

  setExamStatus,

  setShowStats,

  setActiveQuestionId,

  remainingSeconds,
  onStartExam,
  onFinishExam,
}) {
  return (
    <header className="toolbar">
      <div className="brand">Mockly</div>

      <div className="tools">
        {examStatus === "setup" && (
          <div className="setup-tools">
            <button
              className={activeTool === "question" ? "selected-tool" : ""}
              onClick={() => setActiveTool("question")}
            >
              Soru Seçici
            </button>

            <button
              className={activeTool === "delete" ? "selected-tool" : ""}
              onClick={() => setActiveTool("delete")}
            >
              Balon Sil
            </button>
          </div>
        )}
        {examStatus === "running" && (
          <>
            <button
              className={activeTool === "pen" ? "selected-tool" : ""}
              onClick={() => setActiveTool("pen")}
            >
              Kalem
            </button>

            <button
              className={activeTool === "eraser" ? "selected-tool" : ""}
              onClick={() => setActiveTool("eraser")}
            >
              Silgi
            </button>
          </>
        )}
      </div>

      <div className="exam-actions">
        {examStatus === "setup" && (
          <button onClick={onStartExam}>Sınavı Başlat</button>
        )}
        {examStatus === "running" && (
          <>
            <button className="finish-button" onClick={onFinishExam}>
              Sınavı Bitir
            </button>

            <span className="remaining-time">
              {formatDuration(remainingSeconds)}
            </span>
          </>
        )}
      </div>
    </header>
  );
}

export default Toolbar;
