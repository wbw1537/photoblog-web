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
  email_availability: async (data: EmailAvailabilityData) => api.post<EmailAvailabilityResponse>('/v1/email-availability', data),
};