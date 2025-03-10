import { 
  EmailAvailabilityResponse,
  LoginData, 
  RegisterData, 
  UserLoginResponse, 
  UserResponse,
  EmailAvailabilityData
} from "@/types/auth.type";
import api from "../utils/api.util";

export const authApi = {
  register: async (data: RegisterData) => api.post<UserResponse>('/v1/register', data),
  login: async (data: LoginData) => api.post<UserLoginResponse>('/v1/login', data),
  emailAvailability: async (data: EmailAvailabilityData) => api.post<EmailAvailabilityResponse>('/v1/email-availability', data),
  getUserInfo: async () => api.post<UserLoginResponse>('/v1/user-info'),
};