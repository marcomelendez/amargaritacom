'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Heart, ChevronLeft, ChevronRight, PawPrint } from 'lucide-react'
import { hotelService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import type { Hotel } from '@/types'

const PLACEHOLDER_HOTELS: Hotel[] = [
  { id: 1, slug: 'hotel-palm-beach', name: 'Hotel Palm Beach', category: 'Todo Incluido', description: '', direction: 'Playa Moreno, Isla Margarita', rating: 4, stars: 5, cover_photo: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
  { id: 2, slug: 'tibisay-hotel-boutique', name: 'Tibisay Hotel Boutique', category: 'Desayuno', description: '', direction: 'Porlamar, Isla Margarita', rating: 4, stars: 4, cover_photo: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
  { id: 3, slug: 'sun-sal-ecoland', name: 'Sun Sal Ecoland', category: 'Todo Incluido', description: '', direction: 'Atarrayas, Isla Margarita', rating: 5, stars: 4, cover_photo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'} />
      ))}
    </div>
  )
}

export default function FeaturedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>(PLACEHOLDER_HOTELS)

  useEffect(() => {
    hotelService.getFeatured().then((data) => {
      if (data && data.length > 0) setHotels(data.slice(0, 3))
    })
  }, [])

  return (
    <>
    {/* ── MOBILE VERSION ─────────────────────────────────── */}
    <section className="md:hidden bg-white">
      {/* Heading */}
      <div className="py-4 px-4">
        <h2 className="text-lg font-bold text-gray-800 leading-snug">
          <span className="text-gray-800">TOP DE </span>
          <span className="text-[#7854F6]">HOTELES DESTACADOS</span>
          <span className="text-gray-800"> EN LA ISLA DE MARGARITA</span>
        </h2>
      </div>

      {/* Hotel card */}
      <div className="mx-4 mb-6">
        <div className="relative rounded-xl overflow-hidden">
          <div className="relative aspect-video w-full">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"
              alt="Margarita Village"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Top-left badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] text-white text-xs font-bold px-3 py-1 rounded-full">
              TODO INCLUIDO
            </span>
          </div>

          {/* Top-right heart */}
          <button className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <Heart className="w-5 h-5 text-white" />
          </button>

          {/* Bottom center: Detalles button */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <Link
              href="/hoteles"
              className="bg-[#7854F6] text-white text-sm font-semibold px-5 py-1.5 rounded-full"
            >
              Detalles
            </Link>
          </div>

          {/* Left arrow */}
          <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Right arrow */}
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Card info below image */}
        <div className="pt-3 pb-4">
          <h3 className="font-bold text-gray-900 text-base uppercase mb-1">
            MARGARITA VILLAGE
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 3 ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-gray-300'}`}
              />
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Porlamar Calle Miragua</span>
          </div>

          {/* Pets */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <PawPrint className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Se permiten mascotas</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#FE6604]">$50</span>
            <span className="text-xs text-gray-500 ml-1">Por noche/ per persona</span>
          </div>
        </div>
      </div>
    </section>

    {/* ── DESKTOP VERSION ─────────────────────────────────── */}
    <section className="hidden md:block py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Intro paragraph */}
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-3xl">
          En esta sección se encuentran los hoteles destacados en cuanta a ubicación, servicios y popularidad
          categorizados por nuestros{' '}
          <strong className="text-[#7854F6]">#ViajerosAMargarita</strong>. Opciones populares entre viajeros como tú
        </p>

        {/* 3 hotel cards — no rounded container, just stacked content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            const image = resolveMediaUrl(hotel.cover_photo ?? hotel.main_photo_lg)
            return (
              <div key={hotel.id} className="group">
                {/* Image on top — rounded corners */}
                <div className="relative h-52 w-full rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'
                    }}
                  />
                </div>

                {/* Content below image — no card container */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-gray-800 leading-tight text-base">{hotel.name}</h3>
                  <Link
                    href={`/hoteles/${hotel.slug}`}
                    className="shrink-0 bg-[#4a43c4] text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#7854F6] transition-colors"
                  >
                    Detalles
                  </Link>
                </div>

                {hotel.direction && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                    <MapPin size={12} className="text-gray-400 shrink-0" />
                    <span>{hotel.direction}</span>
                  </div>
                )}

                <StarRating count={hotel.stars} />
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/hoteles"
            className="inline-flex items-center gap-2 text-[#7854F6] font-semibold hover:underline"
          >
            Ver todos los hoteles →
          </Link>
        </div>
      </div>
    </section>
    </>
  )
}
