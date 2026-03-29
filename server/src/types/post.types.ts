import { Mood } from '../generated/prisma'

export interface NormalizedPicture {
  id: string
  url: string
  views: number
  postId: string
  uploadedAt: Date
}

export interface NormalizedVideo {
  id: string
  length: number
  url: string
  thumbnailUrl: string
  views: number
  postId: string
  uploadedAt: Date
}

export interface NormalizedPost {
  id: string
  caption: string | null
  picture: NormalizedPicture | null
  video: NormalizedVideo | null
  mood: Mood
  createdAt: Date
  updatedAt: Date
  lastFeaturedAt: Date | null
}

export interface PublicPost {
  id: string
  caption: string | null
  mood: string
  createdAt: Date
  picture: {
    id: string
    url: string
    views: number
    uploadedAt: Date
  } | null
  video: {
    id: string
    url: string
    length: number
    thumbnailUrl: string
    views: number
    uploadedAt: Date
  } | null
}
