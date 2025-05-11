import { Pagination } from "./utils.type";

export enum SharedUserStatus {
  Pending = 'PENDING',
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
}

export enum SharedUserDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export interface SharedUserRequest {
  name?: string;
  email?: string;
  remoteAddress?: string;
  status?: SharedUserStatus;
  direction?: SharedUserDirection;

  skip: number;
  take: number;
}

export interface SharedUserResponse {
  id: string;
  userId: string;
  sharedUserId: string;
  sharedUserName: string;
  sharedUserEmail: string;
  sharedUserAddress: string;
  status: SharedUserStatus;
  direction: SharedUserDirection;
  comment: string;
}

export interface SharedUsersResponse {
  data: SharedUserResponse[] | SharedUserResponse;
  pagination: Pagination;
}