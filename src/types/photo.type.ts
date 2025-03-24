import { PhotoFile } from '@/types/photo-file.type';
import { PhotoTagResponse } from '@/types/tag.type';
import { Pagination } from '@/types/utils.type';

export interface PhotosRequest {
  title?: string;
  liked?: boolean;
  cameraMake?: string;
  cameraModel?: string;
  lensMake?: string;
  lensModel?: string;

  minFocalLength?: number;
  maxFocalLength?: number;

  minFNumber?: number;
  maxFNumber?: number;

  minIso?: number;
  maxIso?: number;

  minExposureTime?: number;
  maxExposureTime?: number;

  dateTakenStart?: Date;
  dateTakenEnd?: Date;

  tags?: string[];

  latitude?: number;
  longitude?: number;
  radius?: number;

  skip: number;
  take: number;
}

export interface Photo {
  id: string
  userId: string
  title: string
  description: string | null
  liked: boolean
  iso: number | null
  exposureTime: number | null
  exposureTimeValue: string | null
  fNumber: number | null
  cameraMake: string | null
  cameraModel: string | null
  lensMake: string | null
  lensModel: string | null
  focalLength: number | null
  focalLength35mm: number | null
  dateTaken: Date | null
  timeZone: string | null
  gpsLatitude: number | null
  gpsLongitude: number | null
  gpsTimestamp: Date | null
  createdAt: Date
  updatedAt: Date

  files: PhotoFile[];
  tags: PhotoTagResponse[];
}

export interface PhotosListResponse{
  data: Photo[];
  pagination: Pagination;
}

export interface PhotoResponse {
  data: Photo;
}