export const DEFAULT_API_BASE_URL = 'https://hrms-project-delta.vercel.app';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const API_ENDPOINTS = {
  employees: '/api/v1/employees',
  attendance: '/api/v1/attendance',
  health: '/health'
};

export const ATTENDANCE_STATUS_OPTIONS = [
  { label: 'Present', value: 'Present' },
  { label: 'Absent', value: 'Absent' }
];

export const DASHBOARD_ROUTES = [
  {
    title: 'Manage Employees',
    description: 'Create and remove employee records from HRMS Lite.',
    path: '/employees',
    ctaLabel: 'Go to Employees'
  },
  {
    title: 'Track Attendance',
    description: 'Mark daily attendance and review employee records.',
    path: '/attendance',
    ctaLabel: 'Go to Attendance'
  }
];