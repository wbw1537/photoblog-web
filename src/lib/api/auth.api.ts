import { 
  EmailAvailabilityResponse,
  LoginRequest, 
  RegisterRequest, 
  UserLoginResponse, 
  UserResponse,
  EmailAvailabilityRequest
} from "@/types/auth.type";
import api from "@/lib/utils/api.util";

export const authApi = {
  register: async (data: RegisterRequest) => api.post<UserResponse>('/v1/register', data),
  login: async (data: LoginRequest) => api.post<UserLoginResponse>('/v1/login', data),
  emailAvailability: async (data: EmailAvailabilityRequest) => api.post<EmailAvailabilityResponse>('/v1/email-availability', data),
  getUserInfo: async () => api.post<UserLoginResponse>('/v1/user-info'),
};