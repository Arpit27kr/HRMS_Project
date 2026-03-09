import './Button.css';

function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  className = ''
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}

export default Button;
