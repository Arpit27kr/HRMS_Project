const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function asString(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean).join(' | ');
  }

  if (value && typeof value === 'object') {
    if (typeof value.message === 'string') {
      return value.message;
    }

    if (typeof value.msg === 'string') {
      return value.msg;
    }
  }

  return '';
}

export function extractApiError(error) {
  if (!error) {
    return DEFAULT_ERROR_MESSAGE;
  }

  const apiError = error.response?.data?.error;
  if (typeof apiError?.message === 'string' && apiError.message.trim()) {
    return apiError.message;
  }

  const detail = error.response?.data?.detail;
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  const detailMessage = asString(detail);
  if (detailMessage) {
    return detailMessage;
  }

  if (typeof error.response?.data?.message === 'string' && error.response.data.message.trim()) {
    return error.response.data.message;
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function extractFieldErrors(error) {
  const fieldErrors = {};

  const structuredDetails = error?.response?.data?.error?.details;
  if (structuredDetails && typeof structuredDetails === 'object' && !Array.isArray(structuredDetails)) {
    Object.entries(structuredDetails).forEach(([fieldName, value]) => {
      const message = asString(value);
      if (message) {
        fieldErrors[fieldName] = message;
      }
    });
  }

  const details = error?.response?.data?.detail;
  if (Array.isArray(details)) {
    details.forEach((issue) => {
      const location = issue?.loc;
      const message = issue?.msg || issue?.message;

      if (Array.isArray(location) && location.length > 0 && message) {
        const fieldName = location[location.length - 1];
        fieldErrors[fieldName] = message;
      }
    });
  }

  return fieldErrors;
}

export function isBackendUnavailable(error) {
  if (!error) {
    return false;
  }

  return Boolean(error.code === 'ERR_NETWORK' || !error.response);
}

export function getFriendlyErrorMessage(error) {
  if (isBackendUnavailable(error)) {
    return 'Cannot connect to server. Please verify backend is running and try again.';
  }

  return extractApiError(error);
}