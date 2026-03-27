'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Check, ImageIcon, Loader2, BedDouble, Info, ChevronRight, AlertCircle, Calendar } from 'lucide-react'
import { hotelService } from '@/services'
import { useSearchStore } from '@/store/useSearchStore'
import { resolveMediaUrl } from '@/config/env'
import type { Hotel, Combination } from '@/types'

interface Props {
  hotel: Hotel
  searchParams: Record<string, string>
}

export default function RoomGrid({ hotel, searchParams }: Props) {
  const searchStore = useSearchStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  const check_in = searchParams.check_in || (hydrated ? searchStore.checkIn : '')
  const check_out = searchParams.check_out || (hydrated ? searchStore.checkOut : '')
  const rooms = searchParams.rooms || (hydrated && searchStore.rooms.length > 0 ? JSON.stringify(searchStore.rooms.map(r => ({
    adults: r.adults, children: r.children, children_ages: r.childrenAges
  }))) : '')

  const hasSearch = !!(check_in && check_out && rooms)

  const [combinations, setCombinations] = useState<Combination[]>([])
  const [loading, setLoading] = useState(hasSearch)
  const [searched, setSearched] = useState(false)
  const [pricingMode, setPricingMode] = useState<string>('request')

  const roomsParsed = (() => {
    try { return JSON.parse(rooms) } catch { return [{ adults: 2, children: 0 }] }
  })()

  useEffect(() => {
    if (!hasSearch) return
    if (!hydrated && !searchParams.check_in) return
    let cancelled = false
    setLoading(true)

    hotelService.searchCombinations({
      destination_id: 3,
      check_in,
      check_out,
      rooms: roomsParsed,
    }).then(result => {
      if (cancelled) return
      const property = result.properties?.find((p: { slug: string }) => p.slug === hotel.slug)
      setPricingMode(property?.pricing_mode || 'request')
      const sorted = [...(property?.combinations ?? [])].sort(
        (a: Combination, b: Combination) => a.total_price - b.total_price
      )
      setCombinations(sorted)
      setSearched(true)
      setLoading(false)
    }).catch(() => {
      if (!cancelled) { setSearched(true); setLoading(false) }
    })

    return () => { cancelled = true }
  }, [check_in, check_out, rooms, hotel.slug, hasSearch, hydrated, searchParams.check_in])

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4a43c4] mb-4" />
        <p className="text-gray-500 font-medium">Buscando las mejores tarifas y disponibilidad...</p>
      </section>
    )
  }

  // Si hay combinaciones
  if (searched && combinations.length > 0) {
    // Agrupar combinaciones por la distribución de la habitación
    const groupedCombinations = Object.values(combinations.reduce((acc, comb) => {
      const key = comb.rooms_distribution.map((r: any) => `${r.roomId}-${r.adults}-${r.children}`).join('|')
      if (!acc[key]) acc[key] = { rooms: comb.rooms_distribution, options: [] }
      acc[key].options.push(comb)
      return acc
    }, {} as Record<string, { rooms: any[], options: Combination[] }>))

    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mt-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <BedDouble className="w-6 h-6 text-[#4a43c4]" />
          <h2 className="text-xl font-bold text-gray-800">Opciones Disponibles Sugeridas</h2>
        </div>

        <div className="space-y-6">
          {groupedCombinations.map((group, gIdx) => (
            <div key={gIdx} className="bg-white border border-gray-200 hover:border-[#4a43c4]/40 transition duration-300 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md">
              
              {/* Left Column: Room Info */}
              <div className="w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50 flex flex-col">
                {Object.values(group.rooms.reduce((acc: any, r: any, idx: number) => {
                  const reqRoom = roomsParsed[idx] || {}
                  const cAdults = typeof r.adults === 'number' ? r.adults : (reqRoom.adults || 1)
                  const cChildren = typeof r.children === 'number' ? r.children : (reqRoom.children || 0)
                  const cAges = r.children_ages || reqRoom.children_ages || []

                  const rawName = r.roomName || r.room_name || 'Habitación'
                  // Limpiar el sufijo (Hab. X) o cualquier paréntesis al final
                  const cleanName = rawName.replace(/\s*\([^)]+\)\s*$/, '').trim()

                  if (!acc[cleanName]) {
                    acc[cleanName] = { ...r, cleanName, count: 0, totalAdults: 0, totalChildren: 0, allAges: [] }
                  }
                  acc[cleanName].count += 1
                  acc[cleanName].totalAdults += cAdults
                  acc[cleanName].totalChildren += cChildren
                  if (Array.isArray(cAges)) acc[cleanName].allAges.push(...cAges)
                  return acc
                }, {} as Record<string, any>)).map((r: any, rIdx: number) => {
                  const imageSrc = resolveMediaUrl(r.roomImage) || '/placeholder.svg'
                  const title = r.count > 1 ? `${r.count}x ${r.cleanName}` : r.cleanName
                  
                  let guestsText = `${r.totalAdults} adulto${r.totalAdults !== 1 ? 's' : ''}`
                  if (r.totalChildren > 0) {
                     guestsText += ` + ${r.totalChildren} niño${r.totalChildren > 1 ? 's' : ''}`
                     if (r.allAges && r.allAges.length > 0) {
                        guestsText += ` (${r.allAges.map((age: any) => `${age} año${age !== 1 ? 's' : ''}`).join(', ')})`
                     }
                  }

                  return (
                    <div key={rIdx} className="flex flex-col flex-1 border-b border-gray-200 last:border-0">
                      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                        <Image src={imageSrc} alt={r.cleanName} fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <h3 className="absolute bottom-3 left-4 text-white font-bold text-base pr-4 leading-tight drop-shadow-md">
                          {title}
                        </h3>
                      </div>

                      <div className="p-4 flex flex-col gap-3 text-sm text-gray-600 flex-1">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold bg-white border border-gray-100 px-3 py-1.5 rounded-lg w-max shadow-sm">
                          <User size={15} className="text-[#4a43c4]" shrink-0 />
                          <span>{guestsText}</span>
                        </div>
                        
                        {/* Fake Amenities to match Booking UI */}
                        <div className="space-y-1.5 mt-1">
                          <div className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span className="text-xs">Aire acondicionado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span className="text-xs">Baño privado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span className="text-xs">TV pantalla plana</span>
                          </div>
                        </div>

                        <button className="text-[#4a43c4] font-semibold hover:underline text-left flex items-center gap-1.5 w-max mt-auto pt-2 text-xs">
                           Ver más detalles
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Right Column: Pricing Options */}
              <div className="w-full md:w-[65%] lg:w-[70%] flex flex-col">
                {group.options.map((opt: Combination, oIdx: number) => {
                  const qs = `hotel_slug=${encodeURIComponent(hotel.slug)}&hotel_name=${encodeURIComponent(hotel.name)}&plan_id=${opt.plan_id}&plan_name=${encodeURIComponent(opt.plan_name ?? 'Estándar')}&check_in=${check_in}&check_out=${check_out}&price=${opt.total_price}&formatted_price=${encodeURIComponent(opt.formatted_price)}&pricing_mode=${pricingMode}`;
                  return (
                    <div key={oIdx} className={`p-5 lg:p-6 flex flex-col sm:flex-row sm:items-start justify-between ${oIdx !== group.options.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-[#4a43c4]/[0.02] transition-colors`}>
                      
                      {/* Plan details */}
                      <div className="flex-1 mb-5 sm:mb-0 pr-4">
                        <h4 className="font-bold text-gray-900 text-base mb-2.5 flex items-center gap-2">
                          {opt.plan_name || 'Sólo alojamiento'}
                          {pricingMode === 'instant' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Confirmación inmediata</span>
                          )}
                        </h4>

                        <div className="space-y-2">
                          <p className="text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
                            <Check size={16} /> Opciones incluidas según plan
                          </p>
                          {oIdx % 2 === 0 ? (
                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                              <Info size={14} className="text-gray-400" />
                              <span className="line-through px-1">Tarifa reembolsable</span> (Mejor precio)
                            </p>
                          ) : (
                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                              <Check size={14} /> Cancelación gratis antes del viaje
                            </p>
                          )}
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Check size={14} className="text-gray-400" /> Paga de forma segura
                          </p>
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="flex flex-col sm:items-end min-w-[200px] sm:ml-4 bg-gray-50/80 sm:bg-transparent rounded-xl p-4 sm:p-0 border border-gray-100 sm:border-none">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center sm:text-right">Total Estancia</p>
                        <p className="text-[11px] text-red-500 line-through text-center sm:text-right mb-0.5">$ {(opt.total_price * 1.15).toFixed(2)}</p>
                        <p className="font-black text-3xl text-[#4a43c4] leading-none mb-1 text-center sm:text-right">{opt.formatted_price}</p>
                        <p className="text-xs tracking-wide text-gray-400 text-center sm:text-right mb-4">Impuestos incluidos</p>

                        <Link
                          href={`/reservar?${qs}`}
                          className="w-full sm:w-auto"
                        >
                          <button className="w-full bg-[#FE6604] hover:bg-[#e55a00] active:transform active:scale-95 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 transition duration-300 flex items-center justify-center gap-2 group">
                            <span>Reservar</span>
                            <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                        <p className="text-[10px] text-gray-400 mt-2 text-center sm:text-right w-full">No se te cobrará nada aún</p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          ))}
        </div>
      </section>
    )
  }

  // Si hay búsqueda pero no hay combinaciones
  if (searched && combinations.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-8 text-center flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-orange-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sin disponibilidad</h2>
        <p className="text-gray-500 max-w-md">Lo sentimos, no encontramos opciones que coincidan exactamente con las fechas y ocupación solicitada. Intenta ajustando tu búsqueda.</p>
        <button 
          onClick={() => {
            const bar = document.getElementById('search-bar') || document.getElementById('main-search-form');
            bar?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-6 bg-[#4a43c4] hover:bg-[#3d37a8] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
        >
          Modificar búsqueda
        </button>
      </section>
    )
  }

  // Fallback a cuartos estáticos si no hay búsqueda
  if (hotel.rooms && hotel.rooms.length > 0) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <BedDouble className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800">Tipos de habitación</h2>
        </div>
        
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-4">
          <Calendar className="w-6 h-6 text-[#4a43c4] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#4a43c4]">Ingresa tus fechas para ver tarifas</p>
            <p className="text-xs text-gray-600 mt-0.5">Necesitamos conocer de cuándo a cuándo viajas para poder cotizarte estas habitaciones.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {hotel.rooms.map(room => (
            <div key={room.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex">
              {room.image ? (
                <div className="relative w-1/3 min-h-[100px]">
                  <Image src={resolveMediaUrl(room.image)} alt={room.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-1/3 bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2 border-r border-gray-100">Sin foto</div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-center">
                <p className="font-bold text-gray-800 leading-tight">{room.name}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 font-medium">
                  <User size={14} />
                  Hasta {room.max_persons} persona{room.max_persons !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return null
}
