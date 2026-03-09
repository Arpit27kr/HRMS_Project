import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEmployee,
  deleteEmployee as removeEmployee,
  getEmployeeById,
  getEmployees
} from '../services/employeeService';
import { normalizeEmployeesResponse } from '../utils/formatters';
import { getFriendlyErrorMessage } from '../utils/errorUtils';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = await getEmployees();
      const normalizedEmployees = normalizeEmployeesResponse(payload);
      setEmployees(normalizedEmployees);
      return normalizedEmployees;
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEmployee = useCallback(
    async (employeePayload) => {
      setIsMutating(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await createEmployee(employeePayload);
        setSuccessMessage('Employee added successfully.');
        await fetchEmployees();
        return { success: true };
      } catch (error) {
        const message = getFriendlyErrorMessage(error);
        setErrorMessage(message);
        return { success: false, error, message };
      } finally {
        setIsMutating(false);
      }
    },
    [fetchEmployees]
  );

  const deleteEmployee = useCallback(
    async (employeeId) => {
      setIsMutating(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        await removeEmployee(employeeId);
        setSuccessMessage('Employee deleted successfully.');
        await fetchEmployees();
        return { success: true };
      } catch (error) {
        const message = getFriendlyErrorMessage(error);
        setErrorMessage(message);
        return { success: false, error, message };
      } finally {
        setIsMutating(false);
      }
    },
    [fetchEmployees]
  );

  const findEmployeeById = useCallback(async (employeeId) => {
    try {
      return await getEmployeeById(employeeId);
    } catch {
      return null;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const totalEmployees = useMemo(() => employees.length, [employees]);

  return {
    employees,
    totalEmployees,
    isLoading,
    isMutating,
    errorMessage,
    successMessage,
    fetchEmployees,
    addEmployee,
    deleteEmployee,
    findEmployeeById,
    clearMessages
  };
}
