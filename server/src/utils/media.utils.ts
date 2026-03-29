import { getPermanentLink, getStreamableLink } from '../services/dropbox.service'

/**
 * Normalize media URLs by converting Dropbox paths to permanent/streamable links
 */
export const normalizeMediaUrl = async (url?: string | null): Promise<string> => {
  if (!url) return ''

  if (url.startsWith('/')) {
    try {
      const permanent = await getPermanentLink(url)
      return getStreamableLink(permanent) || ''
    } catch (error) {
      console.warn('Failed to normalize URL:', url, error)
      return ''
    }
  }

  return getStreamableLink(url) || ''
}

/**
 * Wrap a promise with a timeout
 */
export const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMsg: string
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    )
  ])
}
