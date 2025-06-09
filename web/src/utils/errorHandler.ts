import { toast } from 'react-toastify';

/**
 * Type guard to check if error is an Error instance
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Type guard to check if error has a message property
 */
export const hasMessage = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

/**
 * Type guard to check if error is an API error response
 */
export const isApiError = (
  error: unknown
): error is { response?: { data?: { message?: string } } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

/**
 * Extract a meaningful error message from any error type
 */
export const getErrorMessage = (error: unknown, fallback = 'An unknown error occurred'): string => {
  if (isError(error)) {
    return error.message;
  }

  if (isApiError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

/**
 * Enhanced error handler that logs and shows toast notifications
 */
export const handleError = (
  error: unknown,
  context = 'Operation',
  showToast = true,
  customFallback?: string
): string => {
  const errorMessage = getErrorMessage(error, customFallback || `${context} failed`);

  console.error(`${context} error:`, error); // debug log

  // Show user-friendly toast notification
  if (showToast) {
    toast.error(errorMessage);
  }

  return errorMessage;
};

/**
 * Async error wrapper for async operations
 */
export const withErrorHandling = async function <T>(
  operation: () => Promise<T>,
  context = 'Operation',
  showToast = true,
  customFallback?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error: unknown) {
    handleError(error, context, showToast, customFallback);
    return null;
  }
};

/**
 * Error boundary helper for component error states
 */
export interface ErrorState {
  hasError: boolean;
  message: string;
  retry?: () => void;
}

export const createErrorState = (
  error: unknown,
  retry?: () => void,
  customMessage?: string
): ErrorState => {
  return {
    hasError: true,
    message: getErrorMessage(error, customMessage),
    retry,
  };
};

/**
 * Network-specific error handler
 */
export const handleNetworkError = (error: unknown): string => {
  if (isError(error)) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      return 'Network connection failed. Please check your internet connection.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
  }

  return handleError(error, 'Network request', false);
};

/**
 * Authentication-specific error handler
 */
export const handleAuthError = (error: unknown): string => {
  const message = getErrorMessage(error);

  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'Your session has expired. Please log in again.';
  }

  if (message.includes('403') || message.includes('Forbidden')) {
    return 'You do not have permission to perform this action.';
  }

  return handleError(error, 'Authentication', false);
};

/**
 * Validation error handler for form submissions
 */
export const handleValidationError = (error: unknown): Record<string, string> | null => {
  if (isApiError(error) && error.response?.data) {
    const { data } = error.response;

    // Handle validation errors that come as an object
    if (typeof data === 'object' && data !== null && !('message' in data)) {
      return data as Record<string, string>;
    }
  }

  return null;
};
