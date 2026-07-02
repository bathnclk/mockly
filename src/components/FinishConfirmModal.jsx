function FinishConfirmModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="stats-modal">
        <h2>Sınavı Bitir</h2>

        <p>Sınavı bitirmek istediğinize emin misiniz?</p>

        <div className="modal-buttons">
          <button onClick={onCancel}>Vazgeç</button>

          <button className="finish-button" onClick={onConfirm}>
            Bitir
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinishConfirmModal;
