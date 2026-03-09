import './InputField.css';

function InputField({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false
}) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id || name}>
        {label}
      </label>
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`field-input ${error ? 'field-input--error' : ''}`.trim()}
        required={required}
        disabled={disabled}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

export default InputField;
