export interface Picture {
  id: string
  url: string
  views: number
  uploadedAt: string
}

export interface Video {
  id: string
  url: string
  thumbnailUrl: string
  length: number
  views: number
  uploadedAt: string
}

export interface Post {
  id: string
  caption?: string
  mood: Mood
  picture: Picture | null
  video: Video | null
  createdAt: string
  updatedAt?: string
  lastFeaturedAt?: string | null
}

export type Mood = 'HAPPY' | 'SAD' | 'RAGE'

export interface PostFormData {
  caption: string
  mood: Mood
  images: File[]
  videos: File[]
}
