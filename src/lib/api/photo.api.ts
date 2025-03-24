import {
  PhotosRequest,
  PhotosListResponse,
  PhotoResponse
} from '@/types/photo.type';
import api from '@/lib/utils/api.util';

export const photoApi = {
  getPhotoList: async (data: PhotosRequest) => api.get<PhotosListResponse>('/v1/photos', { params: data }),
  getPhotoById: async (id: string) => api.get<PhotoResponse>(`/v1/photos/${id}`),
};