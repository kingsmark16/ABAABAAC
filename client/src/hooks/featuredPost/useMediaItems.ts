import { useMemo } from "react";
import type { MediaItem } from "../../types/rage-of-the-day.types";

export const useMediaItems = (post: {pictures: Array<{id: string; url?: string}>; videos: Array<{id: string; url?: string; thumbnailUrl?: string}>} | null | undefined) => {
  return useMemo<MediaItem[]>(() => {
    if (!post) return [];

    const images: MediaItem[] = post.pictures
      .filter((picture): picture is {id: string; url: string} => Boolean(picture.url))
      .map((picture) => ({
        id: `image-${picture.id}`,
        type: "image" as const,
        src: picture.url,
      }));

    const videos: MediaItem[] = post.videos
      .filter((video): video is {id: string; url: string; thumbnailUrl?: string} => Boolean(video.url))
      .map((video) => ({
        id: `video-${video.id}`,
        type: "video" as const,
        src: video.url,
        poster: video.thumbnailUrl || undefined,
      }));

    return [...images, ...videos];
  }, [post]);
};
