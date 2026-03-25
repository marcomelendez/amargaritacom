'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface AdminHotel {
  id: number
  slug: string
  name: string
  category: string | null
  stars: number
  rating: number
  cover_photo: string | null
  has_content: boolean
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="text-yellow-400 text-xs">
      {'★'.repeat(Math.max(0, Math.min(5, count)))}
      {'☆'.repeat(Math.max(0, 5 - Math.min(5, count)))}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#4a43c4]/20 border-t-[#4a43c4] rounded-full animate-spin" />
    </div>
  )
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<AdminHotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchHotels = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/hotels', { cache: 'no-store' })
      if (!res.ok) throw new Error('Error al cargar hoteles')
      const data = await res.json()
      setHotels(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`¿Eliminar el contenido de "${name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(slug)
    try {
      const res = await fetch(`/api/admin/hotels/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      await fetchHotels()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar contenido')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase())
  )

  const withContent = hotels.filter(h => h.has_content).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Contenido — Hoteles</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold text-[#4a43c4]">{withContent}</span>
              {' / '}
              <span className="font-semibold">{hotels.length}</span>
              {' hoteles con contenido'}
            </p>
          )}
        </div>
        <input
          type="search"
          placeholder="Buscar hotel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-64 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <Spinner />}

      {/* List */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No se encontraron hoteles
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map(hotel => (
                <li key={hotel.slug} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {hotel.cover_photo ? (
                      <Image
                        src={hotel.cover_photo}
                        alt={hotel.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm truncate">{hotel.name}</span>
                      {hotel.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#FE6604] to-[#F59C0B]">
                          {hotel.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <StarRow count={hotel.stars} />
                      <span className="text-xs text-gray-400">slug: {hotel.slug}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex-shrink-0">
                    {hotel.has_content ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Con contenido
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                        Sin contenido
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/hotels/${hotel.slug}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4a43c4] text-white hover:bg-[#3730a3] transition-colors"
                    >
                      Editar contenido
                    </Link>
                    {hotel.has_content && (
                      <button
                        onClick={() => handleDelete(hotel.slug, hotel.name)}
                        disabled={deleting === hotel.slug}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deleting === hotel.slug ? '...' : 'Eliminar contenido'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
