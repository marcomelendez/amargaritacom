import { http, safeRequest } from '@/lib/api'
import type { Package, Excursion, Service } from '@/types'

export const packageService = {
  getAll: () =>
    safeRequest(() => http.get<Package[]>('/packages', { revalidate: 300 }), []),

  getFeatured: () =>
    safeRequest(() => http.get<Package[]>('/packages/featured', { revalidate: 300 }), []),

  getBySlug: (slug: string) =>
    safeRequest(() => http.get<Package>(`/packages/${slug}`, { revalidate: 300 }), null),
}

export const excursionService = {
  getAll: () =>
    safeRequest(() => http.get<Excursion[]>('/excursions', { revalidate: 300 }), []),

  getFeatured: () =>
    safeRequest(() => http.get<Excursion[]>('/excursions/featured', { revalidate: 300 }), []),

  getBySlug: (slug: string) =>
    safeRequest(() => http.get<Excursion>(`/excursions/${slug}`, { revalidate: 300 }), null),
}

export const serviceService = {
  getAll: () =>
    safeRequest(() => http.get<Service[]>('/services', { revalidate: 300 }), []),
}
