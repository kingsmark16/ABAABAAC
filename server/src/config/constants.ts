/**
 * Error messages
 */
export const ERRORS = {
  MOOD_REQUIRED: 'mood is required',
  POST_NOT_FOUND: 'Post not found',
  POST_ID_REQUIRED: 'Post ID is required',
  MEDIA_BOTH_PROVIDED: 'Post must contain either images or videos, not both',
  MEDIA_NONE_PROVIDED: 'Post must contain at least one image or video',
  TOO_MANY_IMAGES: 'Post can only contain one image',
  TOO_MANY_VIDEOS: 'Post can only contain one video',
  FAILED_TO_FETCH_POSTS: 'Failed to fetch posts',
  FAILED_TO_CREATE_POST: 'Failed to create post',
  FAILED_TO_DELETE_POST: 'Failed to delete post',
  NO_POSTS_AVAILABLE: 'No posts available',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USERNAME_PASSWORD_REQUIRED: 'Username and password are required',
} as const

/**
 * Dropbox upload paths
 */
export const UPLOAD_PATHS = {
  IMAGES: '/posts/images',
  VIDEOS: '/posts/videos',
  THUMBNAILS: '/posts/thumbnails',
} as const

/**
 * File naming prefixes
 */
export const FILE_PREFIXES = {
  THUMBNAIL: 'thumb',
} as const
