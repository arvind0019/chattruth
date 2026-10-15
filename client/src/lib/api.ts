import { ApiResponse } from '../shared/types/api';

const rawBase = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBase ? `${rawBase.replace(/\/$/, '')}/api/v1` : '/api/v1';

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Include credentials for HTTP-only cookies
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Failed to parse server response.', 'PARSE_ERROR');
  }

  if (!response.ok || !data.success) {
    const errorMsg = data.error?.message || response.statusText || 'Request failed';
    const errorCode = data.error?.code || `HTTP_${response.status}`;
    throw new ApiError(errorMsg, errorCode, data.error?.details);
  }

  return data.data as T;
}
