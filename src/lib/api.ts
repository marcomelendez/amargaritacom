import { env } from '@/config/env'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions {
  revalidate?: number | false
  tags?: string[]
  headers?: Record<string, string>
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  opts: RequestOptions = {}
): Promise<T> {
  const url = `${env.apiUrl}${endpoint}`

  const fetchOpts: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...opts.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    next: {
      ...(opts.revalidate !== undefined && { revalidate: opts.revalidate }),
      ...(opts.tags && { tags: opts.tags }),
    },
  }

  const res = await fetch(url, fetchOpts)

  if (!res.ok) {
    let data: unknown
    try { data = await res.json() } catch { data = null }
    throw new ApiError(`HTTP ${res.status}`, res.status, data)
  }

  const json = await res.json()
  // Unwrap Laravel { data: ... } response
  return (json?.data !== undefined ? json.data : json) as T
}

export async function safeRequest<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (env.isProd) console.error('[API Error]', err)
    return fallback
  }
}

export const http = {
  get: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>('GET', endpoint, undefined, opts),
  post: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
    request<T>('POST', endpoint, body, opts),
  put: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
    request<T>('PUT', endpoint, body, opts),
  patch: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', endpoint, body, opts),
  delete: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>('DELETE', endpoint, undefined, opts),
}
