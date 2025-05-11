import {
  PhotosRequest,
  PhotosListResponse,
  PhotoResponse
} from '@/types/photo.type';
import api from '@/lib/utils/api.util';

export const photoApi = {
  getPhotoList: async (data: PhotosRequest) => api.get<PhotosListResponse>('/v1/photos', { params: data }),
  getPhotoById: async (id: string) => api.get<PhotoResponse>(`/v1/photos/${id}`),

  privateGetPhotoList: async (id: string) => api.post<PhotosListResponse>('/v1/shared-user/request', {
    requestToUserInfo: {
      id: id,
    },
    requestUrl: '/v1/photos',
    requestMethod: 'GET',
  }),
};