
import { Request, Response } from 'express'
import { prisma } from '../lib/db'
import { getPermanentLink, getVideoDuration, uploadToDropbox, getVideoThumbnail, deleteFromDropbox } from '../services/dropbox.service'
import { normalizeMediaUrl, withTimeout } from '../utils/media.utils'
import { TIMEOUTS } from '../constants/timeouts'
import { ERRORS, UPLOAD_PATHS, FILE_PREFIXES } from '../config/constants'
import { NormalizedPost, FileRecord, UploadedPictureData, UploadedVideoData } from '../types'

const uploadPicture = async (file: FileRecord): Promise<UploadedPictureData> => {
  const filename = `${Date.now()}-${file.originalname}`
  await uploadToDropbox({ buffer: file.buffer, filename, path: UPLOAD_PATHS.IMAGES })
  const filepath = `${UPLOAD_PATHS.IMAGES}/${filename}`

  try {
    const url = await withTimeout(getPermanentLink(filepath), TIMEOUTS.UPLOAD_SHORT, 'Get permanent link timeout')
    return { url }
  } catch (error) {
    console.warn('Failed to get permanent link, using filepath:', filepath, error)
    return { url: filepath }
  }
}

const uploadVideo = async (file: FileRecord): Promise<UploadedVideoData> => {
  const filename = `${Date.now()}-${file.originalname}`
  await uploadToDropbox({ buffer: file.buffer, filename, path: UPLOAD_PATHS.VIDEOS })
  const filepath = `${UPLOAD_PATHS.VIDEOS}/${filename}`

  let url = filepath
  let length = 0
  let thumbnailUrl = ''

  try {
    url = await withTimeout(getPermanentLink(filepath), TIMEOUTS.UPLOAD_SHORT, 'Get video link timeout')
  } catch (error) {
    console.warn('Failed to get video permanent link, using filepath:', filepath, error)
  }

  try {
    const duration = await withTimeout(getVideoDuration(file.buffer), TIMEOUTS.UPLOAD_LONG, 'Get video duration timeout')
    length = (duration ?? 0) || 0
  } catch (error) {
    console.warn('Failed to get video duration:', error)
    length = 0
  }

  try {
    const thumbnailBuffer = await withTimeout(
      getVideoThumbnail(file.buffer),
      TIMEOUTS.UPLOAD_LONG,
      'Generate thumbnail timeout'
    )
    const thumbnailFilename = `${Date.now()}-${FILE_PREFIXES.THUMBNAIL}-${file.originalname.split('.')[0]}.png`
    await uploadToDropbox({ buffer: thumbnailBuffer, filename: thumbnailFilename, path: UPLOAD_PATHS.THUMBNAILS })
    thumbnailUrl = await withTimeout(
      getPermanentLink(`${UPLOAD_PATHS.THUMBNAILS}/${thumbnailFilename}`),
      TIMEOUTS.UPLOAD_SHORT,
      'Get thumbnail link timeout'
    )
  } catch (error) {
    console.warn('Failed to generate/upload thumbnail:', error)
  }

  return {
    url,
    thumbnailUrl,
    length: Math.round(length)
  }
}

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        picture: true,
        video: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const normalizedPosts: NormalizedPost[] = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        picture: post.picture
          ? {
              ...post.picture,
              url: await normalizeMediaUrl(post.picture.url)
            }
          : null,
        video: post.video
          ? {
              ...post.video,
              url: await normalizeMediaUrl(post.video.url),
              thumbnailUrl: await normalizeMediaUrl(post.video.thumbnailUrl)
            }
          : null
      }))
    )

    console.log('getAllPosts - Returning posts:', JSON.stringify(normalizedPosts, null, 2))
    res.json(normalizedPosts)
  } catch (error) {
    console.error('getAllPosts error:', error)
    res.status(500).json({ error: ERRORS.FAILED_TO_FETCH_POSTS })
  }
}

export const getPost = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement get single post
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { caption, mood } = req.body
  const files = req.files as Record<string, Express.Multer.File[]> | undefined

  // Validate mood
  if (!mood) {
    res.status(400).json({ error: ERRORS.MOOD_REQUIRED })
    return
  }

  const upperMood = mood.toUpperCase()

  // Validate that either images or videos are provided, not both
  const hasImages = files?.images && files.images.length > 0
  const hasVideos = files?.videos && files.videos.length > 0

  if (hasImages && hasVideos) {
    res.status(400).json({ error: ERRORS.MEDIA_BOTH_PROVIDED })
    return
  }

  if (!hasImages && !hasVideos) {
    res.status(400).json({ error: ERRORS.MEDIA_NONE_PROVIDED })
    return
  }

  // Validate only one image or one video
  if (hasImages && files!.images!.length > 1) {
    res.status(400).json({ error: ERRORS.TOO_MANY_IMAGES })
    return
  }

  if (hasVideos && files!.videos!.length > 1) {
    res.status(400).json({ error: ERRORS.TOO_MANY_VIDEOS })
    return
  }

  try {
    let pictureData: UploadedPictureData | null = null
    let videoData: UploadedVideoData | null = null

    if (hasImages) {
      pictureData = await uploadPicture(files!.images![0]!)
    }

    if (hasVideos) {
      videoData = await uploadVideo(files!.videos![0]!)
    }

    // Build data object conditionally to avoid undefined values
    const postData: any = {
      caption,
      mood: upperMood,
      createdAt: new Date()
    }

    if (pictureData) {
      postData.picture = { create: pictureData }
    }

    if (videoData) {
      postData.video = { create: videoData }
    }

    const newPost = await prisma.post.create({
      data: postData,
      include: {
        picture: true,
        video: true
      }
    })

    const normalizedPost: NormalizedPost = {
      ...newPost,
      picture: (newPost as any).picture
        ? {
            ...(newPost as any).picture,
            url: await normalizeMediaUrl((newPost as any).picture.url)
          }
        : null,
      video: (newPost as any).video
        ? {
            ...(newPost as any).video,
            url: await normalizeMediaUrl((newPost as any).video.url),
            thumbnailUrl: await normalizeMediaUrl((newPost as any).video.thumbnailUrl)
          }
        : null
    }

    console.log('createPost - Created post:', JSON.stringify(normalizedPost, null, 2))
    res.status(201).json(normalizedPost)
  } catch (error) {
    console.error('createPost error:', error)
    const message = error instanceof Error ? error.message : String(error)
    res.status(500).json({ error: ERRORS.FAILED_TO_CREATE_POST, details: message })
  }
}

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id || Array.isArray(id)) {
    res.status(400).json({ error: ERRORS.POST_ID_REQUIRED })
    return
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        picture: true,
        video: true
      }
    })

    if (!post) {
      res.status(404).json({ error: ERRORS.POST_NOT_FOUND })
      return
    }

    if (post.picture) {
      try {
        console.log(`Deleting picture - URL: ${post.picture.url}`)
        await deleteFromDropbox(post.picture.url)
      } catch (error) {
        console.warn(`Failed to delete picture from Dropbox: ${post.picture.url}`, error)
      }
    }

    if (post.video) {
      try {
        console.log(`Deleting video - URL: ${post.video.url}`)
        await deleteFromDropbox(post.video.url)
      } catch (error) {
        console.warn(`Failed to delete video from Dropbox: ${post.video.url}`, error)
      }

      if (post.video.thumbnailUrl) {
        try {
          console.log(`Deleting thumbnail - URL: ${post.video.thumbnailUrl}`)
          await deleteFromDropbox(post.video.thumbnailUrl)
        } catch (error) {
          console.warn(`Failed to delete thumbnail from Dropbox: ${post.video.thumbnailUrl}`, error)
        }
      }
    }

    const deletedPost = await prisma.post.delete({
      where: { id }
    })

    res.json({ message: 'Post deleted successfully', post: deletedPost })
  } catch (error) {
    console.error('deletePost error:', error)
    const message = error instanceof Error ? error.message : String(error)
    res.status(500).json({ error: ERRORS.FAILED_TO_DELETE_POST, details: message })
  }
}