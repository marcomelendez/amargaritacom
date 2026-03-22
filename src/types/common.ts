export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}

export interface MediaItem {
  url: string
  thumb: string
}

export interface Review {
  id: number
  user: string
  avatar: string
  rating: number
  comment: string
  date: string
}
