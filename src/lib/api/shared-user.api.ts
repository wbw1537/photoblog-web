import { SharedUserRequest, SharedUsersResponse } from "@/types/shared-user.type";
import api from "../utils/api.util";

export const sharedUserApi = {
  /**
   * Fetches the shared user
   */
  getSharedUsers: async (body: SharedUserRequest) =>
    api.get<SharedUsersResponse>('/v1/shared-user', { params: body })
}