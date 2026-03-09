import { useCallback, useState } from 'react';
import { createAttendance, getAttendanceByEmployee } from '../services/attendanceService';
import { normalizeAttendanceResponse } from '../utils/formatters';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

export function useAttendance() {
  const [records, setRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAttendanceByEmployeeId = useCallback(async (employeeId) => {
    if (!employeeId) {
      setRecords([]);
      return [];
    }

    setIsLoadingRecords(true);
    setErrorMessage('');

    try {
      const payload = await getAttendanceByEmployee(employeeId);
      const normalizedRecords = normalizeAttendanceResponse(payload);
      setRecords(normalizedRecords);
      return normalizedRecords;
    } catch (error) {
      setRecords([]);
      setErrorMessage(getFriendlyErrorMessage(error));
      return [];
    } finally {
      setIsLoadingRecords(false);
    }
  }, []);

  const markAttendance = useCallback(async (attendancePayload) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await createAttendance(attendancePayload);
      setSuccessMessage('Attendance marked successfully.');
      return { success: true };
    } catch (error) {
      const message = getFriendlyErrorMessage(error);
      setErrorMessage(message);
      return { success: false, error, message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  return {
    records,
    isLoadingRecords,
    isSubmitting,
    errorMessage,
    successMessage,
    fetchAttendanceByEmployeeId,
    markAttendance,
    clearMessages
  };
}
