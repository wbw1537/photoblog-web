export interface PhotoFile {
  id: string
  photoId: string
  fileName: string
  fileType: string
  filePath: string
  fileHash: string
  fileSize: number
  fileModifiedTime: Date | null
  fileAccessDate: Date | null
  status: PhotoFileStatus
  imageHeight: number
  imageWidth: number
  orientation: number
  createdAt: Date
  updatedAt: Date
}

export enum PhotoFileStatus {
  Source = 'Source',  
  Offshoot = 'Offshoot',
}

export enum FileResolution {
  ORIGINAL = "original",
  COMPRESSED_4K = "4k",
  COMPRESSED_1080p = "1080p",
  PREVIEW = "preview"
}

export interface PhotoViewRequest {
  resolution: FileResolution
}