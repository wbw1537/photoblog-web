import { 
  LoginData, 
  RegisterData, 
  UserLoginResponse, 
  UserResponse 
} from "@/types/auth.type";
import api from "../utils/api.util";


export const authApi = {
  register: async (data: RegisterData) => api.post<UserResponse>('/v1/register', data),
  login: async (data: LoginData) => api.post<UserLoginResponse>('/v1/login', data),
};