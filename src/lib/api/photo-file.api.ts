import { PhotoViewRequest } from '@/types/photo-file.type';

import api from '@/lib/utils/api.util';

export const photoFileApi = {
  getPhotoView: async (id: string, data: PhotoViewRequest) => 
    api.get<Blob>(`/v1/photos/view/${id}`, { params: data, responseType: 'blob' }),
  getPhotoPreview: async (id: string) =>
    api.get<Blob>(`/v1/photos/preview/${id}`, { responseType: 'blob' }),

  privateGetPhotoPreview: async (id: string, remoteId: string) =>
    api.post<Blob>('/v1/shared-user/request', {
      requestToUserInfo: {
        id: remoteId,
      },
      requestUrl: `/v1/photos/preview/${id}`,
      requestMethod: 'GET',
      requestHeaders: { 'Content-Type': 'application/json' }
    }, { responseType: 'blob' }),
}