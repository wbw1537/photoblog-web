
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal'
}

export class AppError extends Error {
  code: string;
  severity: ErrorSeverity;
  timestamp: Date;
  originalError?: unknown;

  constructor(message: string, code: string, severity: ErrorSeverity = ErrorSeverity.ERROR, originalError?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.timestamp = new Date();
    this.originalError = originalError;
    
    // Maintains proper stack trace for where our error was thrown (only available in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      timestamp: this.timestamp
    };
  }
}