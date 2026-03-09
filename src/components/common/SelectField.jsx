import './SelectField.css';

function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false
}) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id || name}>
        {label}
      </label>
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        className={`field-select ${error ? 'field-select--error' : ''}`.trim()}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

export default SelectField;
