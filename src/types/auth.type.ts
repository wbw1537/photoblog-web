export interface RegisterData extends LoginData {
  name: string;
  basePath: string;
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
  admin: boolean;
  basePath: string;
}

export interface UserLoginResponse extends UserResponse {
  token: string;
}

export interface EmailAvailabilityResponse {
  exists: boolean;
}