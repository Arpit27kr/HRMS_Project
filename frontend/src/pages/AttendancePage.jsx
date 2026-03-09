import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import AttendanceForm from '../components/attendance/AttendanceForm';
import AttendanceTable from '../components/attendance/AttendanceTable';
import SelectField from '../components/common/SelectField';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { useEmployees } from '../hooks/useEmployees';
import { useAttendance } from '../hooks/useAttendance';
import './AttendancePage.css';

function AttendancePage() {
  const {
    employees,
    isLoading: isLoadingEmployees,
    errorMessage: employeeError,
    fetchEmployees
  } = useEmployees();

  const {
    records,
    isLoadingRecords,
    isSubmitting,
    errorMessage: attendanceError,
    successMessage,
    fetchAttendanceByEmployeeId,
    markAttendance,
    clearMessages
  } = useAttendance();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        value: employee.employee_id,
        label: `${employee.full_name} (${employee.employee_id})`
      })),
    [employees]
  );

  useEffect(() => {
    if (!selectedEmployeeId) {
      return;
    }

    fetchAttendanceByEmployeeId(selectedEmployeeId);
  }, [selectedEmployeeId, fetchAttendanceByEmployeeId]);

  const handleRecordFilterChange = (event) => {
    setSelectedEmployeeId(event.target.value);
    clearMessages();
  };

  const handleMarkAttendance = async (payload) => {
    clearMessages();
    const response = await markAttendance(payload);

    if (response.success) {
      const employeeIdForRefresh = selectedEmployeeId || payload.employee_id;
      setSelectedEmployeeId(employeeIdForRefresh);
      await fetchAttendanceByEmployeeId(employeeIdForRefresh);
    }

    return response;
  };

  return (
    <PageContainer
      title="Attendance"
      subtitle="Mark attendance by employee and review attendance history."
      actions={
        <Button variant="secondary" onClick={fetchEmployees} disabled={isLoadingEmployees || isSubmitting}>
          Refresh Employees
        </Button>
      }
    >
      {employeeError ? <ErrorMessage message={employeeError} /> : null}
      {attendanceError ? <ErrorMessage message={attendanceError} /> : null}
      {successMessage ? <div className="page-alert page-alert--success">{successMessage}</div> : null}

      <AttendanceForm
        employees={employees}
        onMarkAttendance={handleMarkAttendance}
        isSubmitting={isSubmitting}
      />

      <section className="attendance-records-filter-card">
        <SelectField
          label="View records by employee"
          name="selectedEmployee"
          value={selectedEmployeeId}
          onChange={handleRecordFilterChange}
          options={employeeOptions}
          placeholder="Select employee to load records"
          disabled={isLoadingEmployees || employees.length === 0}
        />
      </section>

      {isLoadingEmployees ? <Loader label="Loading employees..." /> : null}

      {!isLoadingEmployees && employees.length === 0 ? (
        <EmptyState
          title="No employees available"
          description="Add employees before marking attendance records."
        />
      ) : null}

      {!isLoadingEmployees && employees.length > 0 && !selectedEmployeeId ? (
        <EmptyState
          title="Select an employee"
          description="Choose an employee above to view attendance history."
        />
      ) : null}

      {selectedEmployeeId && isLoadingRecords ? <Loader label="Loading attendance records..." /> : null}

      {selectedEmployeeId && !isLoadingRecords && records.length === 0 ? (
        <EmptyState
          title="No attendance records"
          description="No attendance found for this employee yet."
        />
      ) : null}

      {selectedEmployeeId && !isLoadingRecords && records.length > 0 ? (
        <AttendanceTable records={records} />
      ) : null}
    </PageContainer>
  );
}

export default AttendancePage;
