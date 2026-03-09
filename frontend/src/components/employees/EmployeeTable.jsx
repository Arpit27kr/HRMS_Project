import { useMemo, useState } from 'react';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import './EmployeeTable.css';

function EmployeeTable({ employees, onDeleteEmployee, isDeleting }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const hasRows = useMemo(() => employees.length > 0, [employees]);

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCancelDelete = () => {
    setSelectedEmployee(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) {
      return;
    }

    const response = await onDeleteEmployee(selectedEmployee.employee_id);

    if (response.success) {
      setSelectedEmployee(null);
    }
  };

  return (
    <article className="employee-table-card">
      <div className="employee-table-card__header">
        <h3 className="employee-table-card__title">Employees</h3>
        <p className="employee-table-card__count">{employees.length} records</p>
      </div>

      {hasRows ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(employee)}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(selectedEmployee)}
        title="Delete Employee"
        description={`Delete ${selectedEmployee?.full_name || 'this employee'} permanently?`}
        confirmLabel="Delete"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isProcessing={isDeleting}
      />
    </article>
  );
}

export default EmployeeTable;
