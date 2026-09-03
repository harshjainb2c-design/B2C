import { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';

/**
 * Error codes for API responses
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Business logic errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  ORDER_ALREADY_PROCESSED = 'ORDER_ALREADY_PROCESSED',

  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * API Error response structure
 */
export interface APIErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
  status: number;
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, status: number = 500, details?: unknown) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends APIError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error class
 */
export class AuthError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, message, 401);
    this.name = 'AuthError';
  }
}

/**
 * Authorization Error class
 */
export class ForbiddenError extends APIError {
  constructor(message: string = 'Access denied') {
    super(ErrorCode.FORBIDDEN, message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(ErrorCode.NOT_FOUND, message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Database Error class
 */
export class DatabaseError extends APIError {
  constructor(message: string = 'Database error occurred', details?: unknown) {
    super(ErrorCode.DATABASE_ERROR, message, 500, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Log error details for debugging
 */
function logError(error: unknown, req: VercelRequest): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.error(`[${timestamp}] ${method} ${url}`);

  if (error instanceof APIError) {
    console.error(`APIError: ${error.code} - ${error.message}`);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  } else if (error instanceof Error) {
    console.error(`Error: ${error.name} - ${error.message}`);
    console.error('Stack:', error.stack);
  } else {
    console.error('Unknown error:', error);
  }
}

/**
 * Format error response
 */
function formatErrorResponse(error: unknown): APIErrorResponse {
  // Handle APIError instances
  if (error instanceof APIError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      },
      status: error.status,
    };
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return {
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: process.env.NODE_ENV === 'development' ? error.issues : undefined,
      },
      status: 400,
    };
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string; details?: string };

    // Map common Supabase error codes
    if (supabaseError.code === '23505') {
      // Unique violation
      return {
        error: {
          code: ErrorCode.ALREADY_EXISTS,
          message: 'Resource already exists',
          details: process.env.NODE_ENV === 'development' ? supabaseError.details : undefined,
        },
        status: 409,
      };
    }

    if (supabaseError.code === '23503') {
      // Foreign key violation
      return {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Referenced resource not found',
          details: process.env.NODE_ENV === 'development' ? supabaseError.details : undefined,
        },
        status: 404,
      };
    }

    return {
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: 'Database error occurred',
        details: process.env.NODE_ENV === 'development' ? supabaseError.message : undefined,
      },
      status: 500,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: process.env.NODE_ENV === 'development' ? error.message : 'An internal error occurred',
      },
      status: 500,
    };
  }

  // Handle unknown errors
  return {
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
    status: 500,
  };
}

/**
 * Error handler middleware
 * Catches and formats errors for API responses
 */
export function handleError(error: unknown, req: VercelRequest, res: VercelResponse): void {
  // Log the error
  logError(error, req);

  // Format and send error response
  const errorResponse = formatErrorResponse(error);
  res.status(errorResponse.status).json(errorResponse);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<any>
) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      handleError(error, req, res);
    }
  };
}

/**
 * Validate request body against a Zod schema
 */
export function validateRequest<T>(schema: any, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Validation failed', error.issues);
    }
    throw error;
  }
}
