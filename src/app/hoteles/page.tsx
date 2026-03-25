'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, MapPin, Star, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { hotelService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import type { Hotel } from '@/types'

const VISIBLE_STEP = 12

const MARGARITA_ZONES = [
  'Porlamar', 'Pampatar', 'Juan Griego', 'La Asuncion', 'La Asunción',
  'Playa el Agua', 'Pedro Gonzalez', 'Pedro González',
  'Altagracia', 'Playa el Yaque', 'Isla de Coche',
  'El Agua', 'Manzanillo', 'Boca del Río', 'Boca del Rio',
  'El Tirano', 'Guacuco', 'Paraguachi',
]

function extractZone(direction: string): string | null {
  if (!direction) return null
  const lower = direction.toLowerCase()
  for (const zone of MARGARITA_ZONES) {
    if (lower.includes(zone.toLowerCase())) return zone
  }
  return null
}

function ratingLabel(r: number) {
  if (r >= 9) return 'Excepcional'
  if (r >= 8) return 'Muy bueno'
  if (r >= 7) return 'Bueno'
  if (r > 0)  return 'Aceptable'
  return null
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#4a43c4]" />
          : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#4a43c4]" />
        }
      </button>

      {open && (
        <div className="space-y-2">
          {options.map(opt => {
            const checked = selected.includes(opt)
            return (
              <label
                key={opt}
                className="flex items-center gap-2.5 cursor-pointer group/item"
              >
                <div
                  onClick={() => onToggle(opt)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked
                      ? 'bg-[#4a43c4] border-[#4a43c4]'
                      : 'border-gray-300 group-hover/item:border-[#4a43c4]'
                  }`}
                >
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => onToggle(opt)}
                  className={`text-sm transition-colors ${checked ? 'text-[#4a43c4] font-semibold' : 'text-gray-600 group-hover/item:text-gray-900'}`}
                >
                  {opt}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function HotelesPage() {
  const [hotels, setHotels]         = useState<Hotel[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP)

  // Multi-select filters
  const [selCats, setSelCats]       = useState<string[]>([])
  const [selPlans, setSelPlans]     = useState<string[]>([])
  const [selZones, setSelZones]     = useState<string[]>([])

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    hotelService.getAll().then((data) => {
      setHotels(data)
      setLoading(false)
    })
  }, [])

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
    setVisibleCount(VISIBLE_STEP)
  }

  // Derive filter options from data
  const categories = useMemo(() =>
    Array.from(new Set(hotels.map(h => h.category).filter(Boolean))) as string[]
  , [hotels])

  const plans = useMemo(() =>
    Array.from(new Set(hotels.flatMap(h => h.plans?.map(p => p.name).filter(Boolean) ?? []))) as string[]
  , [hotels])

  const zones = useMemo(() => {
    const found = new Set<string>()
    for (const h of hotels) {
      const z = extractZone(h.direction ?? '')
      // normalize: strip accent variants
      if (z) {
        const normalized = z
          .replace('González', 'Gonzalez')
          .replace('Asunción', 'Asuncion')
          .replace('Río', 'Rio')
        found.add(normalized)
      }
    }
    return Array.from(found).sort()
  }, [hotels])

  const filtered = useMemo(() => hotels.filter(h => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      h.name.toLowerCase().includes(q) ||
      (h.category ?? '').toLowerCase().includes(q) ||
      (h.direction ?? '').toLowerCase().includes(q)

    const matchCat  = selCats.length === 0  || selCats.includes(h.category ?? '')
    const matchPlan = selPlans.length === 0 || h.plans?.some(p => selPlans.includes(p.name))

    let matchZone = selZones.length === 0
    if (!matchZone) {
      const z = extractZone(h.direction ?? '')
      if (z) {
        const normalized = z
          .replace('González', 'Gonzalez')
          .replace('Asunción', 'Asuncion')
          .replace('Río', 'Rio')
        matchZone = selZones.includes(normalized)
      }
    }

    return matchSearch && matchCat && matchPlan && matchZone
  }), [hotels, search, selCats, selPlans, selZones])

  const visible  = filtered.slice(0, visibleCount)
  const hasMore  = filtered.length > visibleCount
  const hasFilter = !!search || selCats.length > 0 || selPlans.length > 0 || selZones.length > 0

  const activeFilterCount = selCats.length + selPlans.length + selZones.length

  function clearFilters() {
    setSearch('')
    setSelCats([])
    setSelPlans([])
    setSelZones([])
    setVisibleCount(VISIBLE_STEP)
  }

  const sidebar = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Sidebar header */}
      <div className="bg-[#4a43c4] text-white text-sm font-bold uppercase tracking-wide text-center py-2.5 px-4 rounded-xl mb-5">
        Encuentra tu Hotel en Margarita
      </div>

      {categories.length > 0 && (
        <FilterSection
          title="Por categoría"
          options={categories}
          selected={selCats}
          onToggle={(v) => toggle(selCats, setSelCats, v)}
        />
      )}

      {plans.length > 0 && (
        <FilterSection
          title="Por tipo de plan"
          options={plans}
          selected={selPlans}
          onToggle={(v) => toggle(selPlans, setSelPlans, v)}
        />
      )}

      {zones.length > 0 && (
        <FilterSection
          title="Por ubicación"
          options={zones}
          selected={selZones}
          onToggle={(v) => toggle(selZones, setSelZones, v)}
        />
      )}

      {hasFilter && (
        <button
          onClick={clearFilters}
          className="mt-4 w-full text-xs font-semibold text-[#4a43c4] border border-[#4a43c4] py-2 rounded-xl hover:bg-[#4a43c4]/5 transition-colors flex items-center justify-center gap-1"
        >
          <X className="w-3 h-3" /> Limpiar filtros
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-[#4a43c4] pt-28 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wide">
            Isla de Margarita
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Hoteles en Margarita
          </h1>
          <p className="text-white/75 text-sm">
            Encontrá el alojamiento ideal para tu viaje a la isla
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search bar + mobile filter toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 -mt-6 relative z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o ubicación..."
                value={search}
                onChange={e => { setSearch(e.target.value); setVisibleCount(VISIBLE_STEP) }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition-all"
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile filter button */}
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold text-[#4a43c4] border border-[#4a43c4] px-4 py-2 rounded-xl hover:bg-[#4a43c4]/5 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="bg-[#4a43c4] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                {loading ? '...' : `${filtered.length} hoteles`}
              </span>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-[#4a43c4] font-semibold hover:underline"
                >
                  <X className="w-3 h-3" /> Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-80 max-w-[85vw] bg-gray-50 h-full overflow-y-auto p-4 z-50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-800">Filtros</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {sidebar}
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            {sidebar}
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selCats.map(c => (
                  <span key={c} className="flex items-center gap-1 text-xs font-semibold bg-[#4a43c4] text-white px-3 py-1.5 rounded-full">
                    {c}
                    <button onClick={() => toggle(selCats, setSelCats, c)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {selPlans.map(p => (
                  <span key={p} className="flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-[#FE6604] to-[#F59C0B] text-white px-3 py-1.5 rounded-full">
                    {p}
                    <button onClick={() => toggle(selPlans, setSelPlans, p)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {selZones.map(z => (
                  <span key={z} className="flex items-center gap-1 text-xs font-semibold bg-emerald-500 text-white px-3 py-1.5 rounded-full">
                    <MapPin className="w-3 h-3" />{z}
                    <button onClick={() => toggle(selZones, setSelZones, z)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-[#4a43c4]/20 border-t-[#4a43c4] rounded-full animate-spin" />
                <p className="text-gray-500 text-sm font-medium animate-pulse">Cargando hoteles...</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
                <Building2 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-1">Sin resultados</h3>
                <p className="text-gray-400 text-sm mb-4">No encontramos hoteles con esos filtros.</p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#4a43c4] border border-[#4a43c4] px-5 py-2 rounded-full hover:bg-[#4a43c4]/5 transition-colors"
                >
                  Ver todos los hoteles
                </button>
              </div>
            )}

            {/* Hotel cards */}
            {!loading && visible.length > 0 && (
              <div className="space-y-4">
                {visible.map((hotel, i) => {
                  const image = hotel.cover_photo
                    ? (hotel.cover_photo.startsWith('http') ? hotel.cover_photo : resolveMediaUrl(hotel.cover_photo))
                    : resolveMediaUrl(hotel.main_photo_lg)
                  const label = ratingLabel(hotel.rating)

                  return (
                    <article
                      key={hotel.id ?? i}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#4a43c4]/20 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
                    >
                      {/* Image */}
                      <Link
                        href={`/hoteles/${hotel.slug}`}
                        className="sm:w-[240px] shrink-0 relative h-48 sm:h-auto overflow-hidden block"
                      >
                        <Image
                          src={image}
                          alt={hotel.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                        {hotel.category && (
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                            {hotel.category}
                          </span>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                        <div>
                          {hotel.stars > 0 && (
                            <div className="flex items-center gap-0.5 mb-1.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3.5 h-3.5 ${idx < hotel.stars ? 'text-orange-400 fill-orange-400' : 'text-gray-200 fill-gray-200'}`}
                                />
                              ))}
                            </div>
                          )}

                          <Link href={`/hoteles/${hotel.slug}`}>
                            <h2 className="text-lg font-bold text-gray-900 hover:text-[#4a43c4] transition-colors leading-tight mb-1.5">
                              {hotel.name}
                            </h2>
                          </Link>

                          {hotel.direction && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                              <MapPin className="w-3.5 h-3.5 text-[#FE6604] shrink-0" />
                              <span className="line-clamp-1">{hotel.direction}</span>
                            </div>
                          )}

                          {hotel.short_description && (
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2">
                              {hotel.short_description}
                            </p>
                          )}

                          {hotel.highlights && hotel.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {hotel.highlights.slice(0, 3).map(h => (
                                <span key={h} className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                  ✓ {h}
                                </span>
                              ))}
                            </div>
                          )}

                          {hotel.plans && hotel.plans.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {hotel.plans.map(plan => (
                                <span
                                  key={plan.plan_id}
                                  className="text-[11px] font-semibold bg-[#4a43c4]/10 text-[#4a43c4] border border-[#4a43c4]/20 px-2.5 py-0.5 rounded-full"
                                >
                                  {plan.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: rating + CTA */}
                      <div className="sm:w-[160px] shrink-0 p-4 sm:p-5 flex flex-col items-end justify-between border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/60">
                        {label && hotel.rating > 0 ? (
                          <div className="flex items-center gap-2 w-full sm:justify-end mb-3">
                            <div className="text-right">
                              <p className="text-xs font-bold text-gray-700">{label}</p>
                              <p className="text-[10px] text-gray-400">Puntuación</p>
                            </div>
                            <div className="w-10 h-10 bg-[#4a43c4] text-white rounded-xl rounded-br-none flex items-center justify-center font-bold text-sm shadow shrink-0">
                              {hotel.rating}
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}

                        <Link href={`/hoteles/${hotel.slug}`} className="w-full mt-auto">
                          <button className="w-full bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all">
                            Ver detalles
                          </button>
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {/* Cargar más */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount(c => c + VISIBLE_STEP)}
                  className="bg-white text-[#4a43c4] border-2 border-[#4a43c4] hover:bg-[#4a43c4] hover:text-white font-bold py-3 px-10 rounded-full transition-all duration-300 shadow-sm text-sm"
                >
                  Cargar más hoteles
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
