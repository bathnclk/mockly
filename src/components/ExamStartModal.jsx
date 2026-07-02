function ExamStartModal({ examMinutes, setExamMinutes, onCancel, onStart }) {
  return (
    <div className="modal-backdrop">
      <div className="stats-modal">
        <h2>Sınav Süresi</h2>

        <p>Sınav süresini dakika olarak giriniz.</p>

        <input
          type="number"
          value={examMinutes}
          min={1}
          onChange={(event) => setExamMinutes(Number(event.target.value))}
          autoFocus
        />

        <div className="modal-buttons">
          <button onClick={onCancel}>İptal</button>

          <button className="finish-button" onClick={onStart}>
            Başlat
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamStartModal;
