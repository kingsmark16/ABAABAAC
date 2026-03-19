export interface Picture {
  id: string;
  url: string;
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl: string;
  length: number;
}

export interface Post {
  id: string;
  caption?: string;
  mood: Mood;
  pictures: Picture[];
  videos: Video[];
  createdAt: string;
  updatedAt: string;
}

export type Mood = 'HAPPY' | 'SAD' | 'RAGE';

export interface PostFormData {
  caption: string;
  mood: Mood;
  images: File[];
  videos: File[];
}
