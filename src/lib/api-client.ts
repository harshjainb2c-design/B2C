import { useAuthStore } from '../stores/authStore';
import { supabase } from './supabase';

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
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * API Error response structure
 */
export interface APIError {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
  status: number;
}

/**
 * Custom API Exception class
 */
export class APIException extends Error {
  public readonly apiError: APIError;

  constructor(apiError: APIError) {
    super(apiError.error.message);
    this.name = 'APIException';
    this.apiError = apiError;
  }

  get code(): ErrorCode {
    return this.apiError.error.code;
  }

  get status(): number {
    return this.apiError.status;
  }

  get details(): unknown {
    return this.apiError.error.details;
  }
}

/**
 * API Client configuration
 */
interface APIClientConfig {
  baseURL?: string;
  timeout?: number;
}

/**
 * Request options
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  requiresAuth?: boolean;
}

/**
 * API Client class for making HTTP requests
 */
export class APIClient {
  private baseURL: string;
  private timeout: number;
  private pendingRequests: Map<string, Promise<any>>;

  constructor(config: APIClientConfig = {}) {
    this.baseURL = config.baseURL || '/api';
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.pendingRequests = new Map();
  }

  /**
   * Generate a unique key for request deduplication
   */
  private getRequestKey(endpoint: string, options: RequestOptions): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  /**
   * Get a current authentication token for protected requests
   */
  private async getAuthToken(): Promise<string | null> {
    // Use Supabase's session so expired access tokens are refreshed before a request.
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (!sessionError && sessionData.session?.access_token) {
      return sessionData.session.access_token;
    }

    // Restore sessions persisted by the app before Supabase session persistence was enabled.
    const storedSession = useAuthStore.getState().session;
    if (!storedSession?.refreshToken) {
      return null;
    }

    const { data: restoredSession, error: restoreError } = await supabase.auth.setSession({
      access_token: storedSession.accessToken,
      refresh_token: storedSession.refreshToken,
    });

    return restoreError ? null : restoredSession.session?.access_token || null;
  }

  /**
   * Make an HTTP request with error handling
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.timeout, requiresAuth = false, ...fetchOptions } = options;

    // Request deduplication for GET requests
    const requestKey = this.getRequestKey(endpoint, options);
    if (options.method === 'GET' || !options.method) {
      const pendingRequest = this.pendingRequests.get(requestKey);
      if (pendingRequest) {
        return pendingRequest;
      }
    }

    const requestPromise = (async () => {
      try {
        // Build headers
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Merge custom headers
        if (fetchOptions.headers) {
          const customHeaders = new Headers(fetchOptions.headers);
          customHeaders.forEach((value, key) => {
            headers[key] = value;
          });
        }

        // Add authentication token if required
        if (requiresAuth) {
          const token = await this.getAuthToken();
          if (!token) {
            throw new APIException({
              error: {
                code: ErrorCode.UNAUTHORIZED,
                message: 'Authentication required',
              },
              status: 401,
            });
          }
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Make the request
        const url = endpoint.startsWith('http')
          ? endpoint
          : `${this.baseURL}${endpoint}`;

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
          let errorData: APIError;

          try {
            errorData = await response.json();
          } catch {
            // If response is not JSON, create a generic error
            errorData = {
              error: {
                code: ErrorCode.INTERNAL_ERROR,
                message: `Request failed with status ${response.status}`,
              },
              status: response.status,
            };
          }

          throw new APIException(errorData);
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return {} as T;
        }

        return await response.json();
      } catch (error) {
      // Handle APIException
      if (error instanceof APIException) {
        throw error;
      }

      // Handle abort/timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIException({
          error: {
            code: ErrorCode.NETWORK_ERROR,
            message: 'Request timeout',
          },
          status: 408,
        });
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new APIException({
          error: {
            code: ErrorCode.NETWORK_ERROR,
            message: 'Network error. Please check your connection.',
          },
          status: 0,
        });
      }

        // Handle unexpected errors
        throw new APIException({
          error: {
            code: ErrorCode.INTERNAL_ERROR,
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
          },
          status: 500,
        });
      } finally {
        // Clean up pending request
        this.pendingRequests.delete(requestKey);
      }
    })();

    // Store pending request for deduplication
    if (options.method === 'GET' || !options.method) {
      this.pendingRequests.set(requestKey, requestPromise);
    }

    return requestPromise;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

/**
 * Default API client instance
 */
export const apiClient = new APIClient();

/**
 * Helper function to check if an error is an APIException
 */
export const isAPIException = (error: unknown): error is APIException => {
  return error instanceof APIException;
};

/**
 * Helper function to get error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAPIException(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
