import Button from './Button';
import './ConfirmDialog.css';

function ConfirmDialog({
  isOpen,
  title = 'Confirm action',
  description = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirm-dialog">
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__description">{description}</p>
        <div className="confirm-dialog__actions">
          <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isProcessing}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
