import { Pagination } from "./utils.type";

export enum SharedUserStatus {
  Pending = 'Pending',
  Active = 'Active',
  Blocked = 'Blocked',
}

export enum SharedUserDirection {
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
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

export interface SharedUserInfo {
  id: string;
  name: string;
  email: string;
  remoteAddress: string;
  status: SharedUserStatus;
  direction: SharedUserDirection;
  comment: string;
}

export interface PublicUserInfo {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface PublicUserInfoResponse {
  users: PublicUserInfo[];
}

export interface SharedUserInitRequestDTO {
  requestToUserInfo: {
    id: string;
    address: string;
  }
  comment: string;
}