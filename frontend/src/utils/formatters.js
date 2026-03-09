export function formatDateForDisplay(dateValue) {
  if (!dateValue) {
    return '-';
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(parsedDate);
}

export function getTodayInputDate() {
  return new Date().toISOString().split('T')[0];
}

export function normalizeEmployeesResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.employees)) {
    return payload.employees;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export function normalizeAttendanceResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.attendance_records)) {
    return payload.attendance_records;
  }

  if (Array.isArray(payload?.records)) {
    return payload.records;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}
