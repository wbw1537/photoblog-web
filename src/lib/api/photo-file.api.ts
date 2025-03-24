import { PhotoViewRequest } from '@/types/photo-file.type';

import api from '@/lib/utils/api.util';

export const photoFileApi = {
  getPhotoView: async (id: string, data: PhotoViewRequest) => 
    api.get<Blob>(`/v1/photos/view/${id}`, { params: data, responseType: 'blob' }),
}