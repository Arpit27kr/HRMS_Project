import Button from './Button';
import './EmptyState.css';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
