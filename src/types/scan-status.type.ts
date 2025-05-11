export enum JobStatusType {
  INITIALIZING = 'initializing',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface ScanStatus {
  jobId: string;
  status: JobStatusType;
  photosIncreased: number;
  photosIncreasedScanned: number;
  photosNotMatched: number;
  photosNotMatchedMatchedWithIncrease: number;
  photosNotMatchedDeleted: number;
  photosMatched: number;
  photosMatchedUpdated: number;
}