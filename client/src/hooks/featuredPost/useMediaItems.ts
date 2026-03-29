import { useMemo } from "react"
import type { MediaItem } from "../../types/rage-of-the-day.types"

interface PostMedia {
  picture: { id: string; url?: string } | null
  video: { id: string; url?: string; thumbnailUrl?: string } | null
}

export const useMediaItems = (post: PostMedia | null | undefined): MediaItem[] => {
  return useMemo<MediaItem[]>(() => {
    if (!post) return []

    const items: MediaItem[] = []

    if (post.picture?.url) {
      items.push({
        id: `image-${post.picture.id}`,
        type: "image" as const,
        src: post.picture.url
      })
    }

    if (post.video?.url) {
      items.push({
        id: `video-${post.video.id}`,
        type: "video" as const,
        src: post.video.url,
        poster: post.video.thumbnailUrl || undefined
      })
    }

    return items
  }, [post])
}
