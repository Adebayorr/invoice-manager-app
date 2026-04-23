import { useEffect, useRef } from 'react'

function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null)

  // Focus trap — focus cancel button when modal opens
  useEffect(() => {
    cancelBtnRef.current?.focus()

    // Close on ESC key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-overlay"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
      >
        <h2 id="delete-modal-title">Confirm Deletion</h2>
        <p id="delete-modal-desc">
          Are you sure you want to delete invoice{' '}
          <strong>#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div className="delete-modal__actions">
          <button
            ref={cancelBtnRef}
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}

export default DeleteModal
