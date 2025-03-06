export interface RegisterData extends LoginData {
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
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