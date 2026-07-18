import { formatDuration } from "../utils/formatTime";
import {
  PencilLine,
  Eraser,
  MapPin,
  MapPinMinus,
} from "lucide-react";
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
  hasPdf,
  hideQuestionBoxes,
setHideQuestionBoxes,
}) {
  return (
    <header className="toolbar">
      <div className="brand">Mockly</div>

      {hasPdf && (
  <div className="tools">
        {examStatus === "setup" && (
          <div className="setup-tools">
            <button
  className={activeTool === "question" ? "selected-tool" : ""}
  onClick={() => setActiveTool("question")}
>
  📍 Odak
</button>

<button
  className={activeTool === "delete" ? "selected-tool" : ""}
  onClick={() => setActiveTool("delete")}
>
  🗑️ Kaldır
</button>

<button
    className={activeTool === "box" ? "selected-tool" : ""}
    onClick={() => setActiveTool("box")}
>
    ⬛ Alan
</button>

<button
    className={activeTool === "box-delete" ? "selected-tool" : ""}
    onClick={() => setActiveTool("box-delete")}
>
    🗑 Alan Sil
</button>
          </div>
        )}
        {examStatus === "running" && (
          <>
            <button
  className={activeTool === "pen" ? "selected-tool" : ""}
  onClick={() => setActiveTool("pen")}
>
  ✏️ Kalem
</button>

<button
  className={activeTool === "eraser" ? "selected-tool" : ""}
  onClick={() => setActiveTool("eraser")}
>
  🩹 Silgi
</button>
<label className="hide-boxes-toggle">
    <input
      type="checkbox"
      checked={hideQuestionBoxes}
      onChange={(e) => setHideQuestionBoxes(e.target.checked)}
    />

    <span>Alanları Gizle</span>
  </label>
          </>
        )}
      </div>
)}
      {hasPdf && (
  <div className="exam-actions">
        {examStatus === "setup" && (
          <button onClick={onStartExam}>
  🚀 Başlat
</button>
        )}
        {examStatus === "running" && (
          <>
            <button
  className="finish-button"
  onClick={onFinishExam}
>
  🏁 Bitir
</button>

            <span className="remaining-time">
              {formatDuration(remainingSeconds)}
            </span>
          </>
        )}
      </div>
      )}
    </header>
  );
}

export default Toolbar;
