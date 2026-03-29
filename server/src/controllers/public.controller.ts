import { Request, Response } from "express"
import { prisma } from "../lib/db"
import { getPermanentLink, getStreamableLink } from "../services/dropbox.service"
import { normalizeMediaUrl } from "../utils/media.utils"
import { ERRORS } from "../config/constants"
import { PublicPost } from "../types"

const normalizeFeaturedPostMedia = async (post: {
  id: string
  caption: string | null
  mood: string
  createdAt: Date
  picture: { id: string; url: string; views: number; uploadedAt: Date } | null
  video: {
    id: string
    url: string
    length: number
    thumbnailUrl: string
    views: number
    uploadedAt: Date
  } | null
}): Promise<PublicPost> => {
  const picture =
    post.picture === null
      ? null
      : {
          ...post.picture,
          url: await normalizeMediaUrl(post.picture.url)
        }

  const video =
    post.video === null
      ? null
      : {
          ...post.video,
          url: await normalizeMediaUrl(post.video.url),
          thumbnailUrl: await normalizeMediaUrl(post.video.thumbnailUrl)
        }

  return {
    ...post,
    picture,
    video
  }
}

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        caption: true,
        mood: true,
        createdAt: true,
        picture: {
          select: {
            id: true,
            url: true,
            views: true,
            uploadedAt: true
          }
        },
        video: {
          select: {
            id: true,
            url: true,
            length: true,
            thumbnailUrl: true,
            views: true,
            uploadedAt: true
          }
        }
      }
    })

    if (posts.length === 0) {
      res.status(200).json([])
      return
    }

    const normalizedPosts: PublicPost[] = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        picture:
          post.picture === null
            ? null
            : {
                ...post.picture,
                url: await normalizeMediaUrl(post.picture.url)
              },
        video:
          post.video === null
            ? null
            : {
                ...post.video,
                url: await normalizeMediaUrl(post.video.url),
                thumbnailUrl: await normalizeMediaUrl(post.video.thumbnailUrl)
              }
      }))
    )

    res.status(200).json(normalizedPosts)
  } catch (error) {
    console.error('getPosts error:', (error as Error).message)
    res.status(500).json({ message: ERRORS.FAILED_TO_FETCH_POSTS })
  }
}

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string }

  if (!id) {
    res.status(400).json({ message: 'Post ID is required' })
    return
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        caption: true,
        mood: true,
        createdAt: true,
        picture: {
          select: {
            id: true,
            url: true,
            views: true,
            uploadedAt: true
          }
        },
        video: {
          select: {
            id: true,
            url: true,
            length: true,
            thumbnailUrl: true,
            views: true,
            uploadedAt: true
          }
        }
      }
    })

    if (!post) {
      res.status(404).json({ message: 'Post not found' })
      return
    }

    const normalizedPost: PublicPost = await normalizeFeaturedPostMedia(post)
    res.status(200).json(normalizedPost)
  } catch (error) {
    console.error('getPostById error:', (error as Error).message)
    res.status(500).json({ message: 'Error fetching post' })
  }
}

export const getFeaturedPost = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all posts, preferring unfeatured ones
    const unFeaturedPosts = await prisma.post.findMany({
      where: { lastFeaturedAt: null },
      select: {
        id: true,
        caption: true,
        mood: true,
        createdAt: true,
        picture: {
          select: {
            id: true,
            url: true,
            views: true,
            uploadedAt: true
          }
        },
        video: {
          select: {
            id: true,
            url: true,
            length: true,
            thumbnailUrl: true,
            views: true,
            uploadedAt: true
          }
        }
      }
    })

    let post = unFeaturedPosts.length > 0
      ? unFeaturedPosts[Math.floor(Math.random() * unFeaturedPosts.length)]
      : null

    if (!post) {
      // All posts featured, get the least recently featured one
      const allPosts = await prisma.post.findMany({
        orderBy: { lastFeaturedAt: 'asc' },
        select: {
          id: true,
          caption: true,
          mood: true,
          createdAt: true,
          picture: {
            select: {
              id: true,
              url: true,
              views: true,
              uploadedAt: true
            }
          },
          video: {
            select: {
              id: true,
              url: true,
              length: true,
              thumbnailUrl: true,
              views: true,
              uploadedAt: true
            }
          }
        }
      })

      if (allPosts.length === 0) {
        res.status(404).json({ message: ERRORS.NO_POSTS_AVAILABLE })
        return
      }

      post = allPosts[0]
    }

    // Update lastFeaturedAt for the selected post
    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: { lastFeaturedAt: new Date() }
      })
    }

    const normalizedPost: PublicPost | null = post
      ? await normalizeFeaturedPostMedia(post)
      : null

    res.status(200).json(normalizedPost)
  } catch (error) {
    console.error('getFeaturedPost error:', (error as Error).message)
    res.status(500).json({ message: 'Error fetching featured posts' })
  }
}