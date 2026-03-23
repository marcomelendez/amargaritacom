'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingCart, Plane, Hotel, Car, Users } from 'lucide-react'
import { packageService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import type { Package } from '@/types'

const placeholderPackages = [
  {
    name: 'MARGARITA 360°',
    badge: '5 días / 4 noches',
    adults: 2,
    details: ['✈️ Boletos aéreos Caracas-Porlamar', '🏝️ Full Day Isla de Cubagua + 2 noches Isla de Coche'],
    price: 670,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
  },
  {
    name: 'COCHE & CUBAGUA',
    badge: '3 días / 2 noches',
    adults: 2,
    details: ['🚢 Traslado en lancha', '🏨 Hotel 4 estrellas incluido'],
    price: 390,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  },
  {
    name: 'MARGARITA PREMIUM',
    badge: '7 días / 6 noches',
    adults: 2,
    details: ['✈️ Vuelos incluidos', '🌟 Hotel 5 estrellas todo incluido'],
    price: 1200,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  },
]

const PLACEHOLDER_PACKAGES: Package[] = [
  {
    id: 1, slug: 'costa-caribe', name: 'Costa Caribe', description: null, short_description: null,
    other_conditions: null, destination: { id: 1, name: 'Isla Margarita', slug: 'isla-margarita' },
    price: 350, duration_days: 3, is_active: true, recommended: true,
    available_from: null, available_to: null, valid_until: null,
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    image_thumb: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&q=60',
    gallery: [], reviews: [],
  },
  {
    id: 2, slug: 'margarita-y-coche', name: 'Margarita y Coche', description: null, short_description: null,
    other_conditions: null, destination: { id: 1, name: 'Isla Margarita', slug: 'isla-margarita' },
    price: 453, duration_days: 5, is_active: true, recommended: true,
    available_from: null, available_to: null, valid_until: null,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    image_thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60',
    gallery: [], reviews: [],
  },
  {
    id: 3, slug: 'paquete-3-islas', name: 'Paquete 3 Islas Margarita, Coche y Cubagua', description: null, short_description: null,
    other_conditions: null, destination: { id: 1, name: 'Isla Margarita', slug: 'isla-margarita' },
    price: 585, duration_days: 7, is_active: true, recommended: true,
    available_from: null, available_to: null, valid_until: null,
    image_url: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80',
    image_thumb: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=200&q=60',
    gallery: [], reviews: [],
  },
]

// Per-package metadata for the icons row
const PACKAGE_META: Record<number, { hotels: string; hasVuelo: boolean; hasTraslado: boolean }> = {
  1: { hotels: '2 HOTELES', hasVuelo: true, hasTraslado: true },
  2: { hotels: '2 HOTELES', hasVuelo: true, hasTraslado: true },
  3: { hotels: 'HOTEL', hasVuelo: true, hasTraslado: true },
}

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<Package[]>(PLACEHOLDER_PACKAGES)

  useEffect(() => {
    packageService.getFeatured().then((data) => {
      if (data && data.length > 0) setPackages(data.slice(0, 3))
    })
  }, [])

  // ── Mobile carousel state ──────────────────────────────
  const [currentPkg, setCurrentPkg] = useState(0)
  const [isHoveredPkg, setIsHoveredPkg] = useState(false)
  const pkgTrackRef = useRef<HTMLDivElement>(null)

  const maxPkgIndex = placeholderPackages.length - 1

  const prevPkg = () => setCurrentPkg(c => Math.max(0, c - 1))
  const nextPkg = () => setCurrentPkg(c => Math.min(maxPkgIndex, c + 1))

  useEffect(() => {
    if (!pkgTrackRef.current) return
    const cardWidth = pkgTrackRef.current.offsetWidth
    pkgTrackRef.current.style.transform = `translateX(-${currentPkg * cardWidth}px)`
  }, [currentPkg])

  useEffect(() => {
    if (isHoveredPkg) return
    const timer = setInterval(() => {
      setCurrentPkg(c => c >= maxPkgIndex ? 0 : c + 1)
    }, 4000)
    return () => clearInterval(timer)
  }, [isHoveredPkg, maxPkgIndex])

  return (
    <>
    {/* ── MOBILE VERSION ─────────────────────────────────── */}
    <section className="md:hidden py-6 px-4 bg-white">
      <h2 className="text-lg font-bold text-gray-800 text-center mb-4">
        Los Mejores Paquetes Turísticos Para Isla Margarita
      </h2>

      {/* Package carousel */}
      <div
        className="relative mb-4"
        onMouseEnter={() => setIsHoveredPkg(true)}
        onMouseLeave={() => setIsHoveredPkg(false)}
        onTouchStart={() => setIsHoveredPkg(true)}
        onTouchEnd={() => setIsHoveredPkg(false)}
      >
        {/* Track wrapper */}
        <div className="overflow-hidden rounded-2xl">
          <div
            ref={pkgTrackRef}
            className="flex transition-transform duration-300 ease-in-out"
          >
            {placeholderPackages.map((pkg, i) => (
              <div key={i} className="flex-shrink-0 w-full">
                {/* Card */}
                <div className="rounded-2xl shadow-md overflow-hidden">
                  {/* Image with badge */}
                  <div className="relative">
                    <Image src={pkg.image} alt={pkg.name} width={600} height={340} className="w-full aspect-video object-cover" unoptimized />
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FE6604] to-[#F59C0B] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {pkg.badge}
                    </span>
                  </div>
                  {/* Card body */}
                  <div className="bg-white p-4">
                    <p className="font-bold text-base text-gray-900">{pkg.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Users className="w-4 h-4" /> {pkg.adults} Adultos
                    </p>
                    <ul className="mt-2 space-y-1">
                      {pkg.details.map((d, j) => (
                        <li key={j} className="text-xs text-gray-500">{d}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#FE6604] text-sm font-medium cursor-pointer">Ver detalles</span>
                      <span className="font-semibold text-sm text-gray-800">Total 2 Adultos ${pkg.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left arrow */}
        <button
          onClick={prevPkg}
          disabled={currentPkg === 0}
          className="absolute left-2 top-[40%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1.5 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        {/* Right arrow */}
        <button
          onClick={nextPkg}
          disabled={currentPkg === maxPkgIndex}
          className="absolute right-2 top-[40%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1.5 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3 mb-4">
        {placeholderPackages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPkg(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentPkg ? 'bg-[#7854F6]' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* CTA button */}
      <Link
        href="/paquetes"
        className="block w-full text-center bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] text-white font-semibold py-3 rounded-full text-sm shadow"
      >
        Ver todos los paquetes
      </Link>
    </section>

    {/* ── DESKTOP VERSION ─────────────────────────────────── */}
    {/* Full-bleed section — NO max-width container, violet/purple gradient */}
    <section className="hidden md:block w-full bg-gradient-to-r from-[#7854F6] via-[#7854F6] to-[#8166F1]">
      <div className="flex flex-col md:flex-row min-h-[420px]">

        {/* LEFT PANEL — ~30% width, dark purple */}
        <div className="relative md:w-[30%] bg-[#4a43c4] rounded-l-none md:rounded-l-3xl flex flex-col justify-center px-8 py-10 md:py-12 overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <Image src="/m-logo.png" alt="" width={320} height={320} className="opacity-[0.06] w-4/5 h-auto object-contain" unoptimized />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
            Los Mejores Paquetes Turísticos Para Isla Margarita
          </h2>
          <p className="text-[#8BA4E6] text-sm leading-relaxed mb-7">
            Descubrí increíbles paquetes de viaje a Margarita con los mejores precios, que incluyen boletos aéreos, traslados y actividades
          </p>
          <Link
            href="/paquetes"
            className="inline-block bg-[#FE6404] hover:bg-[#FB9141] text-white font-semibold px-6 py-3 rounded-full text-center transition-all hover:scale-105 shadow-md w-fit"
          >
            Ver Todos
          </Link>
        </div>

        {/* RIGHT — 3 package cards filling remaining width */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3">
          {packages.map((pkg) => {
            const meta = PACKAGE_META[pkg.id] ?? { hotels: 'HOTEL', hasVuelo: true, hasTraslado: true }
            return (
              <Link
                key={pkg.id}
                href={`/paquetes/${pkg.slug}`}
                className="group relative overflow-hidden block"
              >
                {/* Full-height photo */}
                <div className="relative h-64 sm:h-full min-h-[320px]">
                  <Image
                    src={resolveMediaUrl(pkg.image_url)}
                    alt={pkg.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'
                    }}
                  />
                  {/* Dark gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Card bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-sm leading-tight mb-2">{pkg.name}</h3>

                    {/* Icons row */}
                    <div className="flex items-center gap-3 text-xs text-white/75 mb-3 flex-wrap">
                      <span className="flex items-center gap-1 uppercase">
                        <Hotel size={11} /> {meta.hotels}
                      </span>
                      {meta.hasVuelo && (
                        <span className="flex items-center gap-1 uppercase">
                          <Plane size={11} /> VUELO
                        </span>
                      )}
                      {meta.hasTraslado && (
                        <span className="flex items-center gap-1 uppercase">
                          <Car size={11} /> TRASLADO
                        </span>
                      )}
                    </div>

                    {/* Price area */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-white/60 block">desde</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] bg-clip-text text-transparent leading-none">${pkg.price}</span>
                        <span className="text-xs text-white/60 block mt-0.5">por persona</span>
                      </div>
                      <button
                        className="p-2 bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] hover:opacity-90 rounded-full transition-colors shadow"
                        aria-label="Reservar"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
    </>
  )
}
