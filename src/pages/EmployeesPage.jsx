import PageContainer from '../components/layout/PageContainer';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeTable from '../components/employees/EmployeeTable';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { useEmployees } from '../hooks/useEmployees';
import Button from '../components/common/Button';
import './EmployeesPage.css';

function EmployeesPage() {
  const {
    employees,
    isLoading,
    isMutating,
    errorMessage,
    successMessage,
    fetchEmployees,
    addEmployee,
    deleteEmployee,
    clearMessages
  } = useEmployees();

  const handleAddEmployee = async (payload) => {
    clearMessages();
    return addEmployee(payload);
  };

  const handleDeleteEmployee = async (employeeId) => {
    clearMessages();
    return deleteEmployee(employeeId);
  };

  return (
    <PageContainer
      title="Employees"
      subtitle="Add, review, and delete employee records with immediate backend sync."
      actions={
        <Button variant="secondary" onClick={fetchEmployees} disabled={isLoading || isMutating}>
          Refresh
        </Button>
      }
    >
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      {successMessage ? <div className="page-alert page-alert--success">{successMessage}</div> : null}

      <EmployeeForm onAddEmployee={handleAddEmployee} isSubmitting={isMutating} />

      {isLoading ? <Loader label="Loading employees..." /> : null}

      {!isLoading && employees.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Add your first employee using the form above to begin tracking attendance."
          actionLabel="Reload"
          onAction={fetchEmployees}
        />
      ) : null}

      {!isLoading && employees.length > 0 ? (
        <EmployeeTable
          employees={employees}
          onDeleteEmployee={handleDeleteEmployee}
          isDeleting={isMutating}
        />
      ) : null}
    </PageContainer>
  );
}

export default EmployeesPage;
