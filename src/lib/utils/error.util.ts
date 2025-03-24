import axios, { AxiosError } from 'axios';
import { AppError, ErrorSeverity } from '@/types/error.type';
import { 
  AuthenticationError, 
  UnauthorizedError,
  RegistrationError
} from '@/types/auth.type';

/**
 * Handles API errors and transforms them into appropriate AppError instances
 */
export const handleApiError = (error: unknown): AppError => {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }
  
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{message?: string}>;
    const message = axiosError.response?.data?.message || axiosError.message || 'API request failed';
    
    // Handle auth-related errors based on status
    if (axiosError.response) {
      const status = axiosError.response.status;
      const url = axiosError.config?.url || '';
      
      // Authentication errors
      if (status === 401) {
        return new AuthenticationError(message, error);
      }
      
      // Authorization errors
      if (status === 403) {
        return new UnauthorizedError(message, error);
      }
      
      // Handle specific endpoints
      if (url.includes('/v1/login')) {
        return new AuthenticationError(message, error);
      } else if (url.includes('/v1/register')) {
        return new RegistrationError(message, error);
      }
    }
    
    // Generic API error
    return new AppError(message, 'API_ERROR', ErrorSeverity.ERROR, error);
  }
  
  // Handle other types of errors
  let message = 'Unknown error occurred';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  return new AppError(message, 'UNKNOWN_ERROR', ErrorSeverity.ERROR, error);
};

/**
 * Logs error details to console with appropriate severity
 */
export const logError = (error: unknown): void => {
  const appError = error instanceof AppError ? error : handleApiError(error);
  
  switch (appError.severity) {
    case ErrorSeverity.FATAL:
      console.error('[FATAL]', appError);
      break;
    case ErrorSeverity.ERROR:
      console.error('[ERROR]', appError);
      break;
    case ErrorSeverity.WARNING:
      console.warn('[WARNING]', appError);
      break;
    case ErrorSeverity.INFO:
      console.info('[INFO]', appError);
      break;
  }
};

/**
 * Gets a user-friendly error message that can be displayed to users
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'An unexpected error occurred'): string => {
  if (!error) return defaultMessage;
  
  const appError = error instanceof AppError ? error : handleApiError(error);
  return appError.message || defaultMessage;
};
