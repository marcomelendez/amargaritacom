import type { Package, Excursion } from '@/types'

// BFF fetch — calls Next.js API routes
async function bffGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const base = typeof window === 'undefined'
      ? (process.env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${process.env.PORT ?? 3000}`)
      : ''
    const res = await fetch(`${base}${path}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`BFF ${path} → ${res.status}`)
    return (await res.json()) as T
  } catch (err) {
    console.error('[travelService bffGet]', err)
    return fallback
  }
}

export const packageService = {
  getAll: () => bffGet<Package[]>('/api/packages', []),
  getByIds: async (ids: number[]) => {
    const all = await bffGet<Package[]>('/api/packages', [])
    return all.filter(p => ids.includes(p.id))
  },
  getFeatured: async () => {
    const all = await bffGet<Package[]>('/api/packages', [])
    return all.filter(p => p.recommended)
  }
}

export const excursionService = {
  getAll: () => bffGet<Excursion[]>('/api/excursiones', []),
  getFeatured: async () => {
    const all = await bffGet<Excursion[]>('/api/excursiones', [])
    return all.slice(0, 9)
  }
}

export const serviceService = {
  // dummy for index
}

