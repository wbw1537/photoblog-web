import { SharedUserInfo, SharedUserInitRequestDTO, SharedUserRequest, SharedUsersResponse } from "@/types/shared-user.type";
import api from "../utils/api.util";
import { PublicUserInfoResponse } from "@/types/shared-user.type";

export const sharedUserApi = {
  /**
   * Fetches the shared user
   */
  getSharedUsers: async (body: SharedUserRequest) =>
    api.get<SharedUsersResponse>('/v1/shared-user', { params: body }),

  initSharingRequest: async (body: SharedUserInitRequestDTO) =>
    api.post<SharedUserInfo>('/v1/shared-user/init', body),

  setSharedUserActive: async (id: string) =>
    api.post<SharedUserInfo>(`/v1/shared-user/active/${id}`),

  setSharedUserBlocked: async (id: string) =>
    api.post<SharedUserInfo>(`/v1/shared-user/block/${id}`),

  // Public API
  getPublicUserInfo: async (remoteAddress: string) => 
    api.get<PublicUserInfoResponse[]>(`/v1/shared-user/fetch-remote`, { params: { remoteAddress } }),
}