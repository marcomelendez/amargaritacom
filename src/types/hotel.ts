import type { MediaItem, Review } from './common'

// MongoDB document — content stored independently of the MySQL API
export interface HotelContent {
  hotel_id: number
  slug: string
  short_description?: string
  description?: string
  highlights?: string[]
  amenities_list?: string[]           // e.g. ['wifi', 'pool', 'gym']
  gallery?: Array<{ url: string; alt: string; order: number }>
  check_in?: string                   // e.g. '15:00'
  check_out?: string                  // e.g. '12:00'
  faqs?: Array<{ q: string; a: string }>
  seo?: {
    title?: string
    meta_description?: string
    keywords?: string[]
  }
  updated_at?: string
}

export interface HotelPlan {
  code: string
  name: string
  plan_id: number
  slug: string
}

export interface Hotel {
  id: number
  slug: string
  name: string
  category: string | null
  description: string
  short_description?: string | null
  latlng: string | null
  direction: string
  cover_photo: string | null
  main_photo_lg: string | null
  main_photo_md: string | null
  main_photo_sm: string | null
  rating: number
  stars: number
  base_price?: number
  plans?: HotelPlan[]
  images?: { url: string; name: string }[]
  gallery?: { url: string; file_name: string; name: string }[]
  amenities?: { id: number; name: string; icon: string | null }[]
  rooms?: HotelRoom[]
  // Enriched from MongoDB (BFF merge)
  highlights?: string[]
  amenities_list?: string[]
  check_in?: string
  check_out?: string
  faqs?: Array<{ q: string; a: string }>
  seo?: { title?: string; meta_description?: string; keywords?: string[] }
}

export interface HotelRoom {
  id: number
  name: string
  max_persons: number
  image?: string | null
}

export interface RoomRequest {
  adults: number
  children?: number
  children_ages?: number[]
}

export interface SearchCombinationsRequest {
  destination_id: number
  check_in: string
  check_out: string
  rooms: RoomRequest[]
  page?: number
  per_page?: number
}

export interface RoomDistribution {
  roomId?: number
  roomName?: string
  roomImage?: string | null
  adults: number
  children?: number
  infants?: number
  price?: number
  price_breakdown?: { adults: number; children: number }
}

export interface Combination {
  plan_id: number
  plan_name?: string
  total_price: number
  formatted_price: string
  currency: string
  rooms_distribution: RoomDistribution[]
}

export interface PropertyResult {
  id: number
  name: string
  slug: string
  short_description: string | null
  category: string | null
  image: string | null
  pricing_mode: string
  combinations: Combination[]
  rating?: number
}
