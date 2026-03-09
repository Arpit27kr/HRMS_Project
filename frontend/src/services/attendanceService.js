import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export async function createAttendance(attendancePayload) {
  const response = await apiClient.post(API_ENDPOINTS.attendance, attendancePayload);
  return response.data;
}

export async function getAttendanceByEmployee(employeeId) {
  const response = await apiClient.get(`${API_ENDPOINTS.attendance}/${employeeId}`);
  return response.data;
}

export async function checkHealth() {
  const response = await apiClient.get(API_ENDPOINTS.health);
  return response.data;
}
