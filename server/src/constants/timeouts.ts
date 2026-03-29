/**
 * Timeout constants for async operations (in milliseconds)
 */
export const TIMEOUTS = {
  UPLOAD_SHORT: 5000,   // For quick operations like getting permanent links
  UPLOAD_LONG: 30000,   // For longer operations like video processing
} as const
