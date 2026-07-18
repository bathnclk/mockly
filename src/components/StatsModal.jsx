import { formatDuration, formatQuestionTime } from "../utils/formatTime";

function StatsModal({  questions,
  idleSeconds,
  onClose, }) {
  const solvedQuestions = questions.filter(
    (question) => question.elapsedSeconds > 0,
  );

  const totalSolved = solvedQuestions.length;

  const totalSeconds = solvedQuestions.reduce(
    (sum, question) => sum + question.elapsedSeconds,
    0,
  );

  const averageSeconds =
    totalSolved === 0 ? 0 : Math.round(totalSeconds / totalSolved);

  const longestQuestion =
    totalSolved === 0
      ? null
      : solvedQuestions.reduce((longest, current) =>
          current.elapsedSeconds > longest.elapsedSeconds ? current : longest,
        );

  return (
    <div className="modal-backdrop">
      <div className="stats-modal">
        <h2>🎉 Sınav Tamamlandı</h2>

        <div className="summary-card">
          <div className="summary-row">
            <span>Toplam Çalışma Süresi</span>
            <strong>{formatDuration(totalSeconds)}</strong>
          </div>

          <div className="summary-row">
            <span>Çözülen Soru</span>
            <strong>{totalSolved}</strong>
          </div>

          <div className="summary-row">
            <span>Ortalama Soru Süresi</span>
            <strong>{formatQuestionTime(averageSeconds)}</strong>
          </div>

          <div className="stat-row">
  <span>Eylemsiz Süre</span>
  <strong>{formatQuestionTime(idleSeconds)}</strong>
</div>

          {longestQuestion && (
            <div className="summary-row">
              <span>En Çok Zaman Harcanan Soru</span>

              <strong>
                Soru {longestQuestion.number}
                {" • "}
                {formatQuestionTime(longestQuestion.elapsedSeconds)}
              </strong>
            </div>
          )}
        </div>

        <h3>Soru Süreleri</h3>

        {questions.map((question) => (
          <div className="stat-row" key={question.id}>
            <span>Soru {question.number}</span>

            <strong>{formatQuestionTime(question.elapsedSeconds)}</strong>
          </div>
        ))}

        <button
          className="finish-button"
          style={{ marginTop: 24, width: "100%" }}
          onClick={() => window.location.reload()}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

export default StatsModal;
