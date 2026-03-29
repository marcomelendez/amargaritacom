'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Building2, MapPin, Star, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { hotelService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import SearchFormHoteles from '@/components/SearchFormHoteles'
import { useSearchStore } from '@/store/useSearchStore'
import type { Hotel, PropertyResult } from '@/types'

const MARGARITA_DESTINATION_ID = 3

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

function HotelesPageInner() {
  const searchParams = useSearchParams()
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

  // Price search state
  const [priceMap, setPriceMap]         = useState<Map<string, PropertyResult>>(new Map())
  const [pricesLoading, setPricesLoading] = useState(false)

  const searchStore = useSearchStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    hotelService.getAll().then((data) => {
      setHotels(data)
      setLoading(false)
    })
  }, [])

  // Fetch prices when URL search params change
  useEffect(() => {
    if (!hydrated) return

    let checkIn  = searchParams.get('check_in')
    let checkOut = searchParams.get('check_out')
    let roomsRaw = searchParams.get('rooms')

    if (!checkIn || !checkOut) {
      checkIn = searchStore.checkIn
      checkOut = searchStore.checkOut
      if (searchStore.rooms && searchStore.rooms.length > 0) {
        roomsRaw = JSON.stringify(searchStore.rooms.map(r => ({
          adults: r.adults, children: r.children, children_ages: r.childrenAges
        })))
      }
    }

    if (!checkIn || !checkOut) {
      setPriceMap(new Map())
      return
    }

    let rooms: Array<{ adults: number; children: number; children_ages: number[] }> = [
      { adults: 2, children: 0, children_ages: [] },
    ]
    if (roomsRaw) {
      try { rooms = JSON.parse(roomsRaw) } catch { /* ignore */ }
    }

    setPricesLoading(true)
    hotelService.searchCombinations({
      destination_id: MARGARITA_DESTINATION_ID,
      check_in: checkIn,
      check_out: checkOut,
      rooms,
    }).then(({ properties }) => {
      setPriceMap(new Map(properties.map(p => [p.slug, p])))
      setPricesLoading(false)
    }).catch(() => setPricesLoading(false))
  }, [searchParams, hydrated, searchStore.checkIn, searchStore.checkOut, searchStore.rooms])

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
      <div id="main-search-form" className="bg-[#4a43c4] pt-14 md:pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wide">
            Isla de Margarita
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Hoteles en Margarita
          </h1>
          <p className="text-white/75 text-sm mb-6">
            Ingresá las fechas para ver precios y disponibilidad en tiempo real
          </p>
          <SearchFormHoteles mode="listing" />
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
                  const priceResult = priceMap.get(hotel.slug)
                  const cheapest = priceResult?.combinations?.length
                    ? [...priceResult.combinations].sort((a, b) => a.total_price - b.total_price)[0]
                    : null
                    
                  let activeCheckIn = searchParams.get('check_in') || searchStore.checkIn
                  let activeCheckOut = searchParams.get('check_out') || searchStore.checkOut
                  let activeRoomsRaw = searchParams.get('rooms') || (searchStore.rooms.length ? JSON.stringify(searchStore.rooms.map(r=>({adults:r.adults,children:r.children,children_ages:r.childrenAges}))) : null)
              
                  const searchQsParams = new URLSearchParams(searchParams.toString())
                  if (!searchParams.has('check_in') && activeCheckIn) searchQsParams.set('check_in', activeCheckIn)
                  if (!searchParams.has('check_out') && activeCheckOut) searchQsParams.set('check_out', activeCheckOut)
                  if (!searchParams.has('rooms') && activeRoomsRaw) searchQsParams.set('rooms', activeRoomsRaw)
              
                  const qsString = searchQsParams.toString()

                  const detailUrl  = `/hotel/${hotel.slug}${qsString ? `?${qsString}` : ''}`
                  const reservarUrl = cheapest && qsString
                    ? `/hotel/${hotel.slug}?${qsString}&selected_plan_id=${cheapest.plan_id}&selected_plan_name=${encodeURIComponent(cheapest.plan_name ?? '')}&selected_price=${cheapest.total_price}&selected_formatted_price=${encodeURIComponent(cheapest.formatted_price)}`
                    : detailUrl

                  return (
                    <article
                      key={hotel.id ?? i}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#4a43c4]/20 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
                    >
                      {/* Image */}
                      <Link
                        href={`/hotel/${hotel.slug}`}
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

                          <Link href={`/hotel/${hotel.slug}`}>
                            <h2 className="text-lg font-bold text-gray-900 hover:text-[#4a43c4] transition-colors leading-tight mb-1.5">
                              {hotel.name}
                            </h2>
                          </Link>

                          {(hotel.direction || extractZone(hotel.direction ?? '')) && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 text-[#FE6604] shrink-0" />
                              <span className="line-clamp-1 font-medium">
                                {extractZone(hotel.direction ?? '') ?? hotel.direction}
                              </span>
                            </div>
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

                          <div className="flex flex-wrap gap-1.5">
                            {cheapest?.plan_name && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                                ✓ {cheapest.plan_name}
                              </span>
                            )}
                            {priceResult?.combinations?.length ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#4a43c4]/8 text-[#4a43c4] border border-[#4a43c4]/15 px-2 py-0.5 rounded-full">
                                🏨 {priceResult.combinations.length} opción{priceResult.combinations.length !== 1 ? 'es' : ''}
                              </span>
                            ) : hotel.plans && hotel.plans.length > 0 ? hotel.plans.map(plan => (
                              <span
                                key={plan.plan_id}
                                className="text-[11px] font-semibold bg-[#4a43c4]/10 text-[#4a43c4] border border-[#4a43c4]/20 px-2.5 py-0.5 rounded-full"
                              >
                                {plan.name}
                              </span>
                            )) : null}
                          </div>
                        </div>
                      </div>

                      {/* Right: rating + precio + CTA */}
                      <div className="sm:w-[200px] shrink-0 p-4 sm:p-5 flex flex-col items-end justify-between border-t sm:border-t-0 sm:border-l border-gray-100 bg-[#F8FAFC] sm:bg-white">
                        {/* Rating */}
                        {label && hotel.rating > 0 ? (
                          <div className="flex items-center gap-2 w-full sm:justify-end mb-3">
                            <div className="text-right">
                              <p className="text-xs font-semibold text-[#4a43c4]">{label}</p>
                              <p className="text-[11px] text-gray-400">Puntuación general</p>
                            </div>
                            <div className="w-10 h-10 bg-[#4a43c4] text-white rounded-xl rounded-br-none flex items-center justify-center font-bold text-sm shadow shrink-0">
                              {hotel.rating}
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Price + CTA */}
                        {pricesLoading ? (
                          <div className="w-full mt-auto text-right">
                            <div className="flex items-center justify-end gap-1.5 mb-3">
                              <div className="w-3 h-3 border-2 border-[#4a43c4]/30 border-t-[#4a43c4] rounded-full animate-spin" />
                              <span className="text-[11px] text-gray-400">Consultando...</span>
                            </div>
                            <Link href={detailUrl} className="w-full">
                              <button className="w-full bg-gray-100 hover:bg-[#4a43c4] hover:text-white text-[#4a43c4] font-bold py-2.5 px-4 rounded-xl text-sm transition-all border border-gray-200">
                                Ver detalles
                              </button>
                            </Link>
                          </div>
                        ) : cheapest ? (
                          <div className="w-full text-right mt-auto">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Desde</p>
                            <p className="text-xs text-red-500 line-through mb-0.5">
                              $ {(cheapest.total_price * 1.15).toFixed(2)}
                            </p>
                            <p className="text-2xl font-black text-[#4a43c4] leading-none">
                              {cheapest.formatted_price}
                            </p>
                            {priceResult?.pricing_mode === 'instant' ? (
                              <p className="text-[10px] text-green-600 font-semibold mt-1">✓ Confirmación inmediata</p>
                            ) : (
                              <p className="text-[10px] text-orange-500 font-semibold mt-1">A confirmar disponibilidad</p>
                            )}
                            <Link href={reservarUrl}>
                              <button className="mt-3 w-full bg-[#FE6604] hover:bg-[#e55a00] active:bg-[#cc5000] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
                                Reservar
                              </button>
                            </Link>
                          </div>
                        ) : priceMap.size > 0 ? (
                          <div className="w-full mt-auto text-right">
                            <p className="text-[11px] text-gray-400 mb-3">Sin disponibilidad para estas fechas</p>
                            <Link href={detailUrl} className="w-full">
                              <button className="w-full bg-gray-100 hover:bg-[#4a43c4] hover:text-white text-[#4a43c4] font-bold py-2.5 px-4 rounded-xl text-sm transition-all border border-gray-200">
                                Ver detalles
                              </button>
                            </Link>
                          </div>
                        ) : (
                          <div className="w-full text-right mt-auto">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Desde</p>
                            <p className="text-2xl font-black text-[#4a43c4] leading-none mb-3">
                              $ {((hotel as any).base_price || 95.00).toFixed(2)}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('main-search-form')?.scrollIntoView({ behavior: 'smooth' });
                                const dateInput = document.querySelector('.flatpickr-input, input[placeholder*=\"Entrada\"]') as HTMLElement;
                                if (dateInput) setTimeout(() => dateInput.click(), 500);
                              }}
                              className="w-full bg-[#FE6604] hover:bg-[#e55a00] active:bg-[#cc5000] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-orange-200 hover:-translate-y-0.5"
                            >
                              Reservar
                            </button>
                          </div>
                        )}
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

export default function HotelesPage() {
  return (
    <Suspense fallback={null}>
      <HotelesPageInner />
    </Suspense>
  )
}
