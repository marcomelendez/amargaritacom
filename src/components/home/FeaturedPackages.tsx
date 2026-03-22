'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Plane, Hotel, Car } from 'lucide-react'
import { packageService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import type { Package } from '@/types'

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

  return (
    /* Full-bleed section — NO max-width container, violet/purple gradient */
    <section className="w-full bg-gradient-to-r from-[#7854F6] via-[#7854F6] to-[#8166F1]">
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
  )
}
