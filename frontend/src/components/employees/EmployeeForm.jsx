import { useMemo, useState } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { extractFieldErrors } from '../../utils/errorUtils';
import './EmployeeForm.css';

const initialFormState = {
  employee_id: '',
  full_name: '',
  email: '',
  department: ''
};

function validateEmployeeForm(values) {
  const errors = {};

  if (!values.employee_id.trim()) {
    errors.employee_id = 'Employee ID is required.';
  }

  if (!values.full_name.trim()) {
    errors.full_name = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!values.department.trim()) {
    errors.department = 'Department is required.';
  }

  return errors;
}

function EmployeeForm({ onAddEmployee, isSubmitting }) {
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const mergedErrors = useMemo(() => formErrors, [formErrors]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ''
    }));

    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateEmployeeForm(formValues);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      employee_id: formValues.employee_id.trim(),
      full_name: formValues.full_name.trim(),
      email: formValues.email.trim(),
      department: formValues.department.trim()
    };

    const response = await onAddEmployee(payload);

    if (response.success) {
      setFormValues(initialFormState);
      setFormErrors({});
      setSubmitError('');
      return;
    }

    const backendFieldErrors = extractFieldErrors(response.error);
    if (Object.keys(backendFieldErrors).length > 0) {
      setFormErrors((previousErrors) => ({ ...previousErrors, ...backendFieldErrors }));
    }

    setSubmitError(response.message || 'Unable to add employee.');
  };

  return (
    <article className="employee-form-card">
      <h3 className="employee-form-card__title">Add Employee</h3>
      <form className="employee-form" onSubmit={handleSubmit} noValidate>
        <InputField
          label="Employee ID"
          name="employee_id"
          value={formValues.employee_id}
          onChange={handleChange}
          error={mergedErrors.employee_id}
          placeholder="EMP001"
          required
          disabled={isSubmitting}
        />

        <InputField
          label="Full Name"
          name="full_name"
          value={formValues.full_name}
          onChange={handleChange}
          error={mergedErrors.full_name}
          placeholder="Avery Morgan"
          required
          disabled={isSubmitting}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          error={mergedErrors.email}
          placeholder="avery@example.com"
          required
          disabled={isSubmitting}
        />

        <InputField
          label="Department"
          name="department"
          value={formValues.department}
          onChange={handleChange}
          error={mergedErrors.department}
          placeholder="Engineering"
          required
          disabled={isSubmitting}
        />

        {submitError ? <p className="employee-form-card__submit-error">{submitError}</p> : null}

        <div className="employee-form-card__actions">
          <Button type="submit" loading={isSubmitting}>
            Add Employee
          </Button>
        </div>
      </form>
    </article>
  );
}

export default EmployeeForm;
