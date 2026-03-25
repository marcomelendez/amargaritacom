import { http, safeRequest } from '@/lib/api'
import type { Hotel, PropertyResult, SearchCombinationsRequest } from '@/types'

// BFF fetch — calls Next.js API routes which merge Laravel + MongoDB
async function bffGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(path, { cache: 'no-store' })
    if (!res.ok) throw new Error(`BFF ${path} → ${res.status}`)
    return (await res.json()) as T
  } catch (err) {
    console.error('[hotelService bffGet]', err)
    return fallback
  }
}

export const hotelService = {
  // Uses BFF → merges Laravel API + MongoDB short_description + highlights
  getAll: () => bffGet<Hotel[]>('/api/hotels', []),

  // Uses BFF → full detail with MongoDB description, faqs, seo, check_in/out
  getBySlug: (slug: string) => bffGet<Hotel | null>(`/api/hotels/${slug}`, null),

  getFeatured: () =>
    safeRequest(() => http.get<Hotel[]>('/hotels/featured', { revalidate: 300 }), []),

  getByIds: (ids: number[]) =>
    safeRequest(
      () => http.post<Hotel[]>('/hotels/by-ids', { ids }, { revalidate: 300, tags: ['hotels-featured'] }),
      []
    ),

  searchCombinations: async (params: SearchCombinationsRequest) => {
    const normalized = {
      ...params,
      rooms: params.rooms.map((r) => ({
        adults: r.adults,
        children: r.children ?? 0,
        children_ages: r.children_ages ?? [],
      })),
    }
    const raw = await safeRequest(
      () =>
        http.post<{
          properties: PropertyResult[]
          total: number
          page: number
          per_page: number
        }>('/booking/combinations', normalized),
      { properties: [], total: 0, page: 1, per_page: 10 }
    )
    return {
      properties: raw.properties,
      totalProperties: raw.total,
      page: raw.page,
      perPage: raw.per_page,
    }
  },
}
