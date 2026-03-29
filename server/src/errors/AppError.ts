/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Validation error for request validation failures
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, details)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Unauthorized error for authentication failures
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
