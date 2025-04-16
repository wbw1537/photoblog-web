import { PhotoViewRequest } from '@/types/photo-file.type';

import api from '@/lib/utils/api.util';

export const photoFileApi = {
  getPhotoView: async (id: string, data: PhotoViewRequest) => 
    api.get<Blob>(`/v1/photos/view/${id}`, { params: data, responseType: 'blob' }),
  getPhotoPreview: async (id: string) =>
    api.get<Blob>(`/v1/photos/preview/${id}`, { responseType: 'blob' }),
}