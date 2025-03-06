export interface RegisterData extends LoginData {
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EmailAvailabilityData {
  email: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  type: UserType;
  basePath: string;
}

export interface UserLoginResponse extends UserResponse {
  token: string;
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