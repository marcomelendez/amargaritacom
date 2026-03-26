'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import dayjs from 'dayjs'
import { Calendar, Users, Search, ChevronDown, Pencil } from 'lucide-react'

interface Room {
  id: number
  adults: number
  children: number
  childrenAges: number[]
}

interface FormFieldsProps {
  checkIn: Date | null
  checkOut: Date | null
  locked: boolean
  guestLabel: string
  showOccupancy: boolean
  rooms: Room[]
  checkOutRef: React.MutableRefObject<any>
  occupancyRef: React.RefObject<HTMLDivElement>
  onCheckInChange: (date: Date) => void
  onCheckOutChange: (date: Date) => void
  onToggleOccupancy: () => void
  onAddRoom: () => void
  onRemoveRoom: (i: number) => void
  onUpdateAdults: (i: number, inc: boolean) => void
  onUpdateChildren: (i: number, inc: boolean) => void
  onUpdateChildAge: (ri: number, ai: number, age: number) => void
  onCloseOccupancy: () => void
  onSubmit: (e: React.FormEvent) => void
  compact?: boolean
}

function FormFields({
  checkIn, checkOut, locked, guestLabel,
  showOccupancy, rooms,
  checkOutRef, occupancyRef,
  onCheckInChange, onCheckOutChange,
  onToggleOccupancy,
  onAddRoom, onRemoveRoom, onUpdateAdults, onUpdateChildren, onUpdateChildAge,
  onCloseOccupancy, onSubmit,
  compact = false,
}: FormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className={compact
      ? 'max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row gap-3 items-end'
      : 'flex flex-col sm:flex-row gap-3 items-end'
    }>

      {/* Fechas */}
      <div className="flex-[1.4] min-w-0">
        {!compact && (
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Fechas
          </label>
        )}
        <div className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[42px] gap-2 transition ${locked ? 'opacity-70 cursor-default' : 'focus-within:ring-2 focus-within:ring-[#4a43c4]/30 focus-within:border-[#4a43c4]'}`}>
          <Calendar className="w-4 h-4 text-[#4a43c4] shrink-0" />
          <Flatpickr
            options={{ locale: Spanish, minDate: 'today', dateFormat: 'd/m/Y' }}
            value={checkIn ?? ''}
            onChange={([date]: Date[]) => onCheckInChange(date)}
            placeholder="Entrada"
            className="bg-transparent border-none text-sm text-gray-700 placeholder-gray-400 w-full outline-none cursor-pointer"
            disabled={locked}
          />
          <span className="text-gray-300 shrink-0">→</span>
          <Flatpickr
            ref={checkOutRef}
            options={{ locale: Spanish, minDate: checkIn ?? 'today', dateFormat: 'd/m/Y' }}
            value={checkOut ?? ''}
            onChange={([date]: Date[]) => onCheckOutChange(date)}
            placeholder="Salida"
            className="bg-transparent border-none text-sm text-gray-700 placeholder-gray-400 w-full outline-none cursor-pointer"
            disabled={locked}
          />
        </div>
      </div>

      {/* Ocupación */}
      <div className="flex-1 min-w-0 relative" ref={occupancyRef}>
        {!compact && (
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Ocupación
          </label>
        )}
        <button
          type="button"
          onClick={locked ? undefined : onToggleOccupancy}
          className={`w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl h-[42px] px-3 text-sm text-gray-700 transition ${locked ? 'opacity-70 cursor-default' : 'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4]'}`}
        >
          <Users className="w-4 h-4 text-[#4a43c4] shrink-0" />
          <span className="flex-1 text-left">{guestLabel}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showOccupancy ? 'rotate-180' : ''}`} />
        </button>

        {showOccupancy && !locked && (
          <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
              {rooms.map((room, index) => (
                <div key={room.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm text-[#4a43c4]">Habitación {index + 1}</span>
                    {rooms.length > 1 && (
                      <button type="button" onClick={() => onRemoveRoom(index)}
                        className="text-red-400 text-xs hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Adultos</p>
                      <p className="text-xs text-gray-400">+13 años</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => onUpdateAdults(index, false)} disabled={room.adults <= 1}
                        className="w-8 h-8 rounded-full border-2 border-[#4a43c4] text-[#4a43c4] font-bold flex items-center justify-center disabled:opacity-30 disabled:border-gray-200 disabled:text-gray-300 hover:bg-[#4a43c4]/10 transition-colors"
                      >−</button>
                      <span className="w-5 text-center text-sm font-bold text-gray-800">{room.adults}</span>
                      <button type="button" onClick={() => onUpdateAdults(index, true)} disabled={room.adults >= 4}
                        className="w-8 h-8 rounded-full border-2 border-[#4a43c4] text-[#4a43c4] font-bold flex items-center justify-center disabled:opacity-30 hover:bg-[#4a43c4]/10 transition-colors"
                      >+</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Niños</p>
                      <p className="text-xs text-gray-400">0–12 años</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => onUpdateChildren(index, false)} disabled={room.children <= 0}
                        className="w-8 h-8 rounded-full border-2 border-[#4a43c4] text-[#4a43c4] font-bold flex items-center justify-center disabled:opacity-30 disabled:border-gray-200 disabled:text-gray-300 hover:bg-[#4a43c4]/10 transition-colors"
                      >−</button>
                      <span className="w-5 text-center text-sm font-bold text-gray-800">{room.children}</span>
                      <button type="button" onClick={() => onUpdateChildren(index, true)} disabled={room.children >= 2}
                        className="w-8 h-8 rounded-full border-2 border-[#4a43c4] text-[#4a43c4] font-bold flex items-center justify-center disabled:opacity-30 hover:bg-[#4a43c4]/10 transition-colors"
                      >+</button>
                    </div>
                  </div>

                  {room.children > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Edad de los niños</p>
                      <div className="grid grid-cols-2 gap-2">
                        {room.childrenAges.map((age, ageIdx) => (
                          <select key={ageIdx} value={age}
                            onChange={e => onUpdateChildAge(index, ageIdx, parseInt(e.target.value))}
                            className="border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] outline-none"
                          >
                            {Array.from({ length: 13 }, (_, n) => (
                              <option key={n} value={n}>{n} años</option>
                            ))}
                          </select>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {rooms.length < 4 && (
              <div className="px-4 pb-2">
                <button type="button" onClick={onAddRoom}
                  className="text-sm text-[#4a43c4] font-bold hover:text-[#FE6604] transition-colors"
                >
                  + Añadir habitación
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 p-3 bg-gray-50">
              <button type="button" onClick={onCloseOccupancy}
                className="w-full bg-[#4a43c4] hover:bg-[#3d37a8] text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buscar / Modificar */}
      {locked ? (
        <button type="submit"
          className="shrink-0 flex items-center gap-2 bg-white hover:bg-gray-50 text-[#4a43c4] border border-[#4a43c4]/30 font-bold py-2.5 px-6 rounded-xl transition-all whitespace-nowrap"
        >
          <Pencil className="w-4 h-4" />
          Modificar
        </button>
      ) : (
        <button type="submit" disabled={!checkIn || !checkOut}
          className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#FE6604] to-[#F59C0B] hover:from-[#e55a00] hover:to-[#d98a00] disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      )}
    </form>
  )
}

function SearchFormInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [checkIn, setCheckIn]   = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, adults: 2, children: 0, childrenAges: [] },
  ])
  const [showOccupancy, setShowOccupancy]   = useState(false)
  const [locked, setLocked]                 = useState(false)
  const [showFixed, setShowFixed]           = useState(false)

  // Two separate checkOut refs — one per form instance
  const checkOutRef      = useRef<any>(null)
  const checkOutRefFixed = useRef<any>(null)
  const occupancyRef      = useRef<HTMLDivElement>(null)
  const occupancyRefFixed = useRef<HTMLDivElement>(null)
  const sentinelRef       = useRef<HTMLDivElement>(null)

  // Restore from URL + lock if all params present
  useEffect(() => {
    const ci = searchParams.get('check_in')
    const co = searchParams.get('check_out')
    const rp = searchParams.get('rooms')
    if (ci) setCheckIn(dayjs(ci, 'YYYY-MM-DD').toDate())
    if (co) setCheckOut(dayjs(co, 'YYYY-MM-DD').toDate())
    if (rp) {
      try {
        const parsed: Array<{ adults?: number; children?: number; children_ages?: number[] }> = JSON.parse(rp)
        setRooms(parsed.map((r, i) => ({
          id: i + 1,
          adults: r.adults ?? 2,
          children: r.children ?? (r.children_ages?.length ?? 0),
          childrenAges: r.children_ages ?? [],
        })))
      } catch { /* ignore */ }
    }
    if (ci && co && rp) setLocked(true)
  }, [searchParams])

  // IntersectionObserver — show fixed bar when hero form scrolls out of view
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowFixed(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  // Close occupancy on outside click (covers both refs)
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const target = e.target as Node
      const insideHero  = occupancyRef.current?.contains(target)
      const insideFixed = occupancyRefFixed.current?.contains(target)
      if (!insideHero && !insideFixed) setShowOccupancy(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  // Shared handlers
  function handleCheckInChange(date: Date, coRef: React.MutableRefObject<any>) {
    setCheckIn(date)
    if (checkOut && date > checkOut) setCheckOut(null)
    if (coRef.current?.flatpickr)
      setTimeout(() => coRef.current.flatpickr.open(), 100)
  }

  function addRoom() {
    if (rooms.length >= 4) return
    setRooms(r => [...r, { id: Date.now(), adults: 2, children: 0, childrenAges: [] }])
  }
  function removeRoom(index: number) {
    setRooms(r => r.filter((_, i) => i !== index))
  }
  function updateAdults(index: number, increment: boolean) {
    setRooms(r => r.map((room, i) => i !== index ? room : {
      ...room, adults: increment ? Math.min(4, room.adults + 1) : Math.max(1, room.adults - 1),
    }))
  }
  function updateChildren(index: number, increment: boolean) {
    setRooms(r => r.map((room, i) => {
      if (i !== index) return room
      const next = increment ? Math.min(2, room.children + 1) : Math.max(0, room.children - 1)
      const ages = next > room.children ? [...room.childrenAges, 5] : room.childrenAges.slice(0, next)
      return { ...room, children: next, childrenAges: ages }
    }))
  }
  function updateChildAge(roomIndex: number, ageIndex: number, age: number) {
    setRooms(r => r.map((room, i) => {
      if (i !== roomIndex) return room
      const ages = [...room.childrenAges]
      ages[ageIndex] = age
      return { ...room, childrenAges: ages }
    }))
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (locked) { setLocked(false); return }
    if (!checkIn || !checkOut) return
    const params = new URLSearchParams()
    params.set('check_in',  dayjs(checkIn).format('YYYY-MM-DD'))
    params.set('check_out', dayjs(checkOut).format('YYYY-MM-DD'))
    params.set('rooms', JSON.stringify(rooms.map(r => ({
      adults: r.adults,
      children: r.children,
      children_ages: r.childrenAges,
    }))))
    router.push(`/hoteles?${params.toString()}`)
    setLocked(true)
  }

  const totalGuests = rooms.reduce((acc, r) => acc + r.adults + r.children, 0)
  const guestLabel  = `${rooms.length} hab. · ${totalGuests} huésped${totalGuests !== 1 ? 'es' : ''}`

  const sharedProps = {
    checkIn, checkOut, locked, guestLabel,
    showOccupancy, rooms,
    onCheckInChange: (date: Date) => handleCheckInChange(date, checkOutRef),
    onCheckOutChange: (date: Date) => setCheckOut(date),
    onToggleOccupancy: () => setShowOccupancy(o => !o),
    onAddRoom: addRoom,
    onRemoveRoom: removeRoom,
    onUpdateAdults: updateAdults,
    onUpdateChildren: updateChildren,
    onUpdateChildAge: updateChildAge,
    onCloseOccupancy: () => setShowOccupancy(false),
    onSubmit: handleSearch,
  }

  return (
    <>
      {/* Hero inline form */}
      <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-4">
        <FormFields
          {...sharedProps}
          checkOutRef={checkOutRef}
          occupancyRef={occupancyRef}
        />
      </div>

      {/* Sentinel — when this goes out of view, fixed bar appears */}
      <div ref={sentinelRef} className="h-px" />

      {/* Fixed bar */}
      {showFixed && (
        <div className="fixed top-24 left-0 right-0 z-40 bg-white shadow-lg border-b border-gray-200 transition-all">
          <FormFields
            {...sharedProps}
            checkOutRef={checkOutRefFixed}
            occupancyRef={occupancyRefFixed}
            onCheckInChange={(date: Date) => handleCheckInChange(date, checkOutRefFixed)}
            compact
          />
        </div>
      )}
    </>
  )
}

export default function SearchFormHoteles() {
  return (
    <Suspense fallback={null}>
      <SearchFormInner />
    </Suspense>
  )
}
