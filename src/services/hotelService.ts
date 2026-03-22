import { http, safeRequest } from '@/lib/api'
import type { Hotel, PropertyResult, SearchCombinationsRequest } from '@/types'

export const hotelService = {
  getAll: () =>
    safeRequest(() => http.get<Hotel[]>('/hotels', { revalidate: 300 }), []),

  getBySlug: (slug: string) =>
    safeRequest(() => http.get<Hotel>(`/hotel/${slug}`, { revalidate: 300 }), null),

  getFeatured: () =>
    safeRequest(() => http.get<Hotel[]>('/hotels/featured', { revalidate: 300 }), []),

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
