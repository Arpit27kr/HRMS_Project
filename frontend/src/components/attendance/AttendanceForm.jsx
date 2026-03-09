import { useMemo, useState } from 'react';
import Button from '../common/Button';
import SelectField from '../common/SelectField';
import InputField from '../common/InputField';
import { ATTENDANCE_STATUS_OPTIONS } from '../../utils/constants';
import { extractFieldErrors } from '../../utils/errorUtils';
import { getTodayInputDate } from '../../utils/formatters';
import './AttendanceForm.css';

const initialAttendanceState = {
  employee_id: '',
  attendance_date: getTodayInputDate(),
  status: ''
};

function validateAttendanceForm(values) {
  const errors = {};

  if (!values.employee_id) {
    errors.employee_id = 'Please select an employee.';
  }

  if (!values.attendance_date) {
    errors.attendance_date = 'Attendance date is required.';
  }

  if (!values.status) {
    errors.status = 'Attendance status is required.';
  }

  return errors;
}

function AttendanceForm({ employees, onMarkAttendance, isSubmitting }) {
  const [formValues, setFormValues] = useState(initialAttendanceState);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        value: employee.employee_id,
        label: `${employee.full_name} (${employee.employee_id})`
      })),
    [employees]
  );

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

    const validationErrors = validateAttendanceForm(formValues);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      employee_id: formValues.employee_id,
      attendance_date: formValues.attendance_date,
      status: formValues.status
    };

    const response = await onMarkAttendance(payload);

    if (response.success) {
      setSubmitError('');
      return;
    }

    const backendFieldErrors = extractFieldErrors(response.error);
    if (Object.keys(backendFieldErrors).length > 0) {
      setFormErrors((previousErrors) => ({ ...previousErrors, ...backendFieldErrors }));
    }

    setSubmitError(response.message || 'Unable to mark attendance.');
  };

  return (
    <article className="attendance-form-card">
      <h3 className="attendance-form-card__title">Mark Attendance</h3>
      <form className="attendance-form" onSubmit={handleSubmit} noValidate>
        <SelectField
          label="Employee"
          name="employee_id"
          value={formValues.employee_id}
          onChange={handleChange}
          options={employeeOptions}
          placeholder="Choose an employee"
          error={formErrors.employee_id}
          required
          disabled={isSubmitting || employees.length === 0}
        />

        <InputField
          label="Date"
          name="attendance_date"
          type="date"
          value={formValues.attendance_date}
          onChange={handleChange}
          error={formErrors.attendance_date}
          required
          disabled={isSubmitting}
        />

        <SelectField
          label="Status"
          name="status"
          value={formValues.status}
          onChange={handleChange}
          options={ATTENDANCE_STATUS_OPTIONS}
          placeholder="Choose status"
          error={formErrors.status}
          required
          disabled={isSubmitting}
        />

        {submitError ? <p className="attendance-form-card__submit-error">{submitError}</p> : null}

        <div className="attendance-form-card__actions">
          <Button type="submit" loading={isSubmitting} disabled={employees.length === 0}>
            Save Attendance
          </Button>
        </div>
      </form>
    </article>
  );
}

export default AttendanceForm;
