export interface FileRecord {
  fieldname: string
  originalname: string
  buffer: Buffer
}

export interface UploadedPictureData {
  url: string
}

export interface UploadedVideoData {
  url: string
  thumbnailUrl: string
  length: number
}
