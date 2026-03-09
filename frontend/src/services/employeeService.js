import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export async function getEmployees() {
  const response = await apiClient.get(API_ENDPOINTS.employees);
  return response.data;
}

export async function getEmployeeById(employeeId) {
  const response = await apiClient.get(`${API_ENDPOINTS.employees}/${employeeId}`);
  return response.data;
}

export async function createEmployee(employeePayload) {
  const response = await apiClient.post(API_ENDPOINTS.employees, employeePayload);
  return response.data;
}

export async function deleteEmployee(employeeId) {
  await apiClient.delete(`${API_ENDPOINTS.employees}/${employeeId}`);
}