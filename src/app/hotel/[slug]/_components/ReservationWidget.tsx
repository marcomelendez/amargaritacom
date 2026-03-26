'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Tag, Check, AlertCircle, MessageCircle } from 'lucide-react'
import { hotelService } from '@/services'
import type { Hotel, Combination } from '@/types'

interface Props {
  hotel: Hotel
  searchParams: Record<string, string>
}

export default function ReservationWidget({ hotel, searchParams }: Props) {
  const { check_in, check_out, rooms } = searchParams
  const hasSearch = !!(check_in && check_out && rooms)

  const [combinations, setCombinations] = useState<Combination[]>([])
  const [loading, setLoading] = useState(hasSearch)
  const [searched, setSearched] = useState(false)
  const [pricingMode, setPricingMode] = useState<string>('request')

  useEffect(() => {
    if (!hasSearch) return
    let cancelled = false
    setLoading(true)

    const roomsParsed = (() => {
      try { return JSON.parse(rooms) } catch { return [{ adults: 2, children: 0 }] }
    })()

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
  }, [check_in, check_out, rooms, hotel.slug, hasSearch])

  /* ── No search yet: show plans + CTA ──────────────────────────────── */
  if (!hasSearch) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-1">Planes disponibles</h3>
        <p className="text-xs text-gray-500 mb-4">
          Buscá disponibilidad para ver precios en tiempo real
        </p>

        {hotel.plans && hotel.plans.length > 0 ? (
          <div className="space-y-2 mb-5">
            {hotel.plans.map(plan => (
              <div
                key={plan.plan_id}
                className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5"
              >
                <Tag className="w-3.5 h-3.5 text-[#4a43c4] shrink-0" />
                {plan.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-5">
            Consultanos para ver disponibilidad y precios
          </p>
        )}

        <Link
          href="/hoteles"
          className="block text-center w-full bg-[#4a43c4] hover:bg-[#3d37a8] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Buscar disponibilidad
        </Link>
      </div>
    )
  }

  /* ── Loading ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin text-[#4a43c4]" />
          Consultando disponibilidad...
        </div>
      </div>
    )
  }

  /* ── No availability ───────────────────────────────────────────────── */
  if (searched && combinations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Sin disponibilidad</p>
            <p className="text-xs text-gray-400 mt-0.5">
              No hay cupos para las fechas seleccionadas.
            </p>
          </div>
        </div>
        <Link
          href="/hoteles"
          className="block text-center w-full border border-[#4a43c4] text-[#4a43c4] hover:bg-[#4a43c4] hover:text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          Cambiar fechas
        </Link>
      </div>
    )
  }

  /* ── Combinations found ─────────────────────────────────────────────── */
  const cheapest = combinations[0]
  if (!cheapest) return null

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      {/* Price hero */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Tarifa desde</p>
        <p className="text-3xl font-black text-[#4a43c4] leading-none mt-1">
          {cheapest.formatted_price}
        </p>
        {pricingMode === 'instant' ? (
          <p className="text-[11px] text-green-600 font-semibold mt-1.5">✓ Confirmación inmediata</p>
        ) : (
          <p className="text-[11px] text-orange-500 font-semibold mt-1.5">A confirmar disponibilidad</p>
        )}
      </div>

      {/* Date range summary */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center text-sm border border-gray-100">
        <div>
          <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Desde</span>
          <span className="font-semibold text-gray-700">{formatDate(check_in)}</span>
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <div className="text-right">
          <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Hasta</span>
          <span className="font-semibold text-gray-700">{formatDate(check_out)}</span>
        </div>
      </div>

      {/* Plan list */}
      <div className="space-y-2">
        {combinations.map(c => (
          <div
            key={c.plan_id}
            className="flex flex-col gap-3 bg-gray-50 rounded-xl px-4 py-4 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2 min-w-0 pr-3">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-gray-700 leading-tight">{c.plan_name ?? 'Estándar'}</span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-red-400 line-through mb-0.5">
                  $ {(c.total_price * 1.15).toFixed(2)}
                </p>
                <span className="text-lg font-black text-[#4a43c4] leading-none">{c.formatted_price}</span>
              </div>
            </div>
            <Link
              href={`/reservar?hotel_slug=${encodeURIComponent(hotel.slug)}&hotel_name=${encodeURIComponent(hotel.name)}&plan_id=${c.plan_id}&plan_name=${encodeURIComponent(c.plan_name ?? 'Estándar')}&check_in=${check_in}&check_out=${check_out}&price=${c.total_price}&formatted_price=${encodeURIComponent(c.formatted_price)}&pricing_mode=${pricingMode}`}
              className="w-full bg-[#FE6604] hover:bg-[#e55a00] text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-sm shadow-orange-200 hover:-translate-y-0.5 transform block text-center mt-1"
            >
              Reservar
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
