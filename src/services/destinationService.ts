import { http, safeRequest } from '@/lib/api'
import type { Destination } from '@/types'

export const destinationService = {
  getAll: () =>
    safeRequest(() => http.get<Destination[]>('/destinations', { revalidate: 600 }), []),

  search: (q: string) =>
    safeRequest(
      () => http.get<Destination[]>(`/destinations/search?q=${encodeURIComponent(q)}`),
      []
    ),
}
