import api from '@/lib/utils/api.util';
import { PhotoScanResponse } from '@/types/photo-scan.type';

export const photoScanApi = {
  /**
   * Trigger scan for the whole based path
   */
  scan: async () =>
    api.post<PhotoScanResponse>('/v1/scan'),

  /**
   * Trigger scan for the increased part in based path
   */
  deltaScan: async () =>
    api.post<PhotoScanResponse>('/v1/delta-scan'),
}