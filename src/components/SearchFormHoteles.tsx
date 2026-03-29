'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import dayjs from 'dayjs'
import { Calendar, Users, Search, ChevronDown, Pencil } from 'lucide-react'
import { useSearchStore } from '@/store/useSearchStore'

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
  occupancyRef: React.RefObject<HTMLDivElement | null>
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
      ? 'max-w-7xl mx-auto px-4 py-4 lg:py-2 flex flex-col sm:flex-row gap-4 sm:gap-3 items-stretch sm:items-end'
      : 'flex flex-col sm:flex-row gap-4 sm:gap-3 items-stretch sm:items-end'
    }>

      {/* Entrada */}
      <div className="flex-1 min-w-0">
        {!compact && (
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Entrada
          </label>
        )}
        <div className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[46px] sm:h-[42px] transition overflow-hidden ${locked ? 'opacity-70 cursor-default' : 'focus-within:ring-2 focus-within:ring-[#4a43c4]/30 focus-within:border-[#4a43c4]'}`}>
          <Calendar className="w-4 h-4 text-[#4a43c4] shrink-0 mr-2" />
          <Flatpickr
            options={{ locale: Spanish, minDate: 'today', dateFormat: 'd/m/Y' }}
            value={checkIn ?? ''}
            onChange={([date]: Date[]) => onCheckInChange(date)}
            placeholder="Entrada"
            className="bg-transparent border-none text-sm font-medium text-gray-700 placeholder-gray-400 w-full outline-none cursor-pointer h-full"
            disabled={locked}
          />
        </div>
      </div>

      {/* Salida */}
      <div className="flex-1 min-w-0">
        {!compact && (
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Salida
          </label>
        )}
        <div className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-[46px] sm:h-[42px] transition overflow-hidden ${locked ? 'opacity-70 cursor-default' : 'focus-within:ring-2 focus-within:ring-[#4a43c4]/30 focus-within:border-[#4a43c4]'}`}>
          <Calendar className="w-4 h-4 text-[#4a43c4] shrink-0 mr-2" />
          <Flatpickr
            ref={checkOutRef}
            options={{ locale: Spanish, minDate: checkIn ?? 'today', dateFormat: 'd/m/Y' }}
            value={checkOut ?? ''}
            onChange={([date]: Date[]) => onCheckOutChange(date)}
            placeholder="Salida"
            className="bg-transparent border-none text-sm font-medium text-gray-700 placeholder-gray-400 w-full outline-none cursor-pointer h-full"
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
          className={`w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl h-[46px] sm:h-[42px] px-4 sm:px-3 text-sm font-medium text-gray-700 transition ${locked ? 'opacity-70 cursor-default' : 'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4]'}`}
        >
          <div className="flex items-center gap-2 flex-1">
            <Users className="w-4 h-4 text-[#4a43c4] shrink-0" />
            <span className="text-left">{guestLabel}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${showOccupancy ? 'rotate-180' : ''}`} />
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
          className="shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#4a43c4] border border-[#4a43c4]/30 font-bold h-[46px] sm:h-[42px] px-6 rounded-xl transition-all whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0"
        >
          <Pencil className="w-4 h-4" />
          Modificar
        </button>
      ) : (
        <button type="submit" disabled={!checkIn || !checkOut}
          className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FE6604] to-[#F59C0B] hover:from-[#e55a00] hover:to-[#d98a00] disabled:opacity-50 text-white font-bold h-[46px] sm:h-[42px] px-6 rounded-xl transition-all shadow-sm whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0"
        >
          <Search className="w-4 h-4 shrink-0" />
          Buscar
        </button>
      )}
    </form>
  )
}

function SearchFormInner({ mode = 'auto' }: { mode?: 'auto' | 'always-fixed' | 'listing' }) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const pathname     = usePathname()

  const [checkIn, setCheckIn]   = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, adults: 2, children: 0, childrenAges: [] },
  ])
  const [showOccupancy, setShowOccupancy]   = useState(false)
  const [locked, setLocked]                 = useState(false)
  const [showFixed, setShowFixed]           = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(false)

  // Two separate checkOut refs — one per form instance
  const checkOutRef      = useRef<any>(null)
  const checkOutRefFixed = useRef<any>(null)
  const occupancyRef      = useRef<HTMLDivElement>(null)
  const occupancyRefFixed = useRef<HTMLDivElement>(null)
  const sentinelRef       = useRef<HTMLDivElement>(null)

  const searchStore  = useSearchStore()
  const [hydrated, setHydrated] = useState(false)

  // Hydration safety
  useEffect(() => { setHydrated(true) }, [])

  // Restore from URL OR Store
  useEffect(() => {
    if (!hydrated) return

    const ciUrl = searchParams.get('check_in')
    const coUrl = searchParams.get('check_out')
    const rpUrl = searchParams.get('rooms')

    const ci = ciUrl || searchStore.checkIn
    const co = coUrl || searchStore.checkOut

    if (ci) setCheckIn(dayjs(ci, 'YYYY-MM-DD').toDate())
    if (co) setCheckOut(dayjs(co, 'YYYY-MM-DD').toDate())

    if (rpUrl) {
      try {
        const parsed: Array<{ adults?: number; children?: number; children_ages?: number[] }> = JSON.parse(rpUrl)
        setRooms(parsed.map((r, i) => ({
          id: i + 1,
          adults: r.adults ?? 2,
          children: r.children ?? (r.children_ages?.length ?? 0),
          childrenAges: r.children_ages ?? [],
        })))
      } catch { /* ignore */ }
    } else if (searchStore.rooms && searchStore.rooms.length > 0) {
      setRooms(searchStore.rooms.map((r, i) => ({ ...r, id: i + 1 })))
    }

    if (ci && co) setLocked(true)
  }, [searchParams, hydrated, searchStore.checkIn, searchStore.checkOut, searchStore.rooms])

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
    const ciStr = dayjs(checkIn).format('YYYY-MM-DD')
    const coStr = dayjs(checkOut).format('YYYY-MM-DD')
    const roomsData = rooms.map(r => ({
      adults: r.adults,
      children: r.children,
      childrenAges: r.childrenAges,
    }))
    
    // Save to global state
    searchStore.setSearch(ciStr, coStr, roomsData)

    const params = new URLSearchParams()
    params.set('check_in', ciStr)
    params.set('check_out', coStr)
    params.set('rooms', JSON.stringify(roomsData.map(r => ({
      adults: r.adults,
      children: r.children,
      children_ages: r.childrenAges,
    }))))
    if (pathname.startsWith('/hotel/')) {
      router.push(`${pathname}?${params.toString()}`)
    } else {
      router.push(`/hoteles?${params.toString()}`)
    }
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
      {/* ── Hero inline form (auto mode: all screens, listing mode: desktop only) ── */}
      {mode !== 'always-fixed' && (
        <div className={mode === 'listing' ? 'hidden md:block' : ''}>
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-4">
            <FormFields
              {...sharedProps}
              checkOutRef={checkOutRef}
              occupancyRef={occupancyRef}
            />
          </div>
        </div>
      )}

      {/* ── Sentinel (auto mode: all screens, listing mode: desktop only) ───────── */}
      {mode !== 'always-fixed' && (
        <div ref={sentinelRef} className={`h-px ${mode === 'listing' ? 'hidden md:block' : ''}`} />
      )}

      {/* ── Scroll-triggered fixed bar (auto + listing — desktop only for listing) ── */}
      {showFixed && mode !== 'always-fixed' && (
        <div className={`fixed top-[88px] lg:top-24 left-0 right-0 z-40 bg-white shadow-lg border-b border-gray-200 transition-all ${mode === 'listing' ? 'hidden md:block' : ''}`}>
          <FormFields
            {...sharedProps}
            checkOutRef={checkOutRefFixed}
            occupancyRef={occupancyRefFixed}
            onCheckInChange={(date: Date) => handleCheckInChange(date, checkOutRefFixed)}
            compact
          />
        </div>
      )}

      {/* ── Mobile search accordion (listing mode only, fixed at top) ─────────── */}
      {mode === 'listing' && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <button
            type="button"
            onClick={() => setMobileExpanded(o => !o)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#4a43c4]"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left text-sm font-semibold">
              {checkIn && checkOut
                ? `${dayjs(checkIn).format('DD/MM')} → ${dayjs(checkOut).format('DD/MM')} · ${guestLabel}`
                : 'Buscar hoteles'}
            </span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${mobileExpanded ? 'rotate-180' : ''}`} />
          </button>
          {mobileExpanded && (
            <div className="px-3 pb-4 border-t border-gray-100 bg-white shadow-lg">
              <FormFields
                {...sharedProps}
                checkOutRef={checkOutRefFixed}
                occupancyRef={occupancyRefFixed}
                onCheckInChange={(date: Date) => handleCheckInChange(date, checkOutRefFixed)}
                compact
              />
            </div>
          )}
        </div>
      )}

      {/* ── Always-fixed bar (hotel detail page) ─────────────────────────────── */}
      {mode === 'always-fixed' && (
        <div className="lg:fixed lg:top-[88px] xl:top-24 lg:left-0 lg:right-0 lg:w-full relative z-40 bg-white lg:shadow-lg lg:border-b lg:border-gray-200 transition-all">
          {/* Mobile toggle */}
          <div className="lg:hidden">
             <button
                type="button"
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 border-b border-gray-200 text-[#4a43c4] font-bold py-4 px-4 transition-colors relative z-10"
             >
                <Search className="w-4 h-4" />
                <span className="text-sm">Modificar búsqueda</span>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${mobileExpanded ? 'rotate-180' : ''}`} />
             </button>
          </div>
          {/* Accordion body */}
          <div className={`${mobileExpanded ? 'block' : 'hidden'} lg:block pb-5 lg:pb-0 bg-white shadow-sm lg:shadow-none border-b border-gray-100 lg:border-none`}>
             <div className="bg-white lg:bg-transparent lg:shadow-none p-2 lg:p-0 w-full">
               <FormFields
                  {...sharedProps}
                  checkOutRef={checkOutRefFixed}
                  occupancyRef={occupancyRefFixed}
                  onCheckInChange={(date: Date) => handleCheckInChange(date, checkOutRefFixed)}
                  compact
               />
             </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function SearchFormHoteles({ mode = 'auto' }: { mode?: 'auto' | 'always-fixed' | 'listing' }) {
  return (
    <Suspense fallback={null}>
      <SearchFormInner mode={mode} />
    </Suspense>
  )
}
