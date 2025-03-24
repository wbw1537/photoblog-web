import { AppError, ErrorSeverity } from './error.type';

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EmailAvailabilityRequest {
  email: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  type: UserType;
  basePath: string;
  cachePath: string;
}

export interface Token {
  token: string;
  expiresAt: number;
  tokenType: string;
}

export interface UserLoginResponse extends UserResponse {
  accessToken: Token;
  refreshToken: Token;
}

export interface EmailAvailabilityResponse {
  exists: boolean;
}

export const placeholder = "**PLACEHOLDER**" as const;

export const enum UserType {
  Admin = 'Admin',
  Normal = 'Normal',
  Pending = 'Pending'
};

// Auth-specific error classes
export class AuthError extends AppError {
  constructor(message: string, code: string = 'AUTH_ERROR', severity: ErrorSeverity = ErrorSeverity.ERROR, originalError?: unknown) {
    super(message, code, severity, originalError);
  }
}

export class AuthenticationError extends AuthError {
  constructor(message: string = 'Authentication failed', originalError?: unknown) {
    super(message, 'AUTH_FAILED', ErrorSeverity.ERROR, originalError);
  }
}

export class RegistrationError extends AuthError {
  constructor(message: string = 'Registration failed', originalError?: unknown) {
    super(message, 'REGISTRATION_FAILED', ErrorSeverity.ERROR, originalError);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string = 'Unauthorized access', originalError?: unknown) {
    super(message, 'UNAUTHORIZED', ErrorSeverity.ERROR, originalError);
  }
}