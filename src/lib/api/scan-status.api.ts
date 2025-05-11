import api from '@/lib/utils/api.util';
import { ScanStatus } from '@/types/scan-status.type';

export const scanStatusApi = {
  /**
   * Fetches the status of the scan
   */
  getScanStatus: async () =>
    api.get<ScanStatus>(`/v1/scan-status`), 
}