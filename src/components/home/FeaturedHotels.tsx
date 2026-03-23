'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Heart, ChevronLeft, ChevronRight, PawPrint } from 'lucide-react'
import { hotelService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import type { Hotel } from '@/types'

const PLACEHOLDER_HOTELS: Hotel[] = [
  { id: 1, slug: 'margarita-village', name: 'MARGARITA VILLAGE', category: 'Todo Incluido', description: '', direction: 'Porlamar Calle Miragua', rating: 4, stars: 3, cover_photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
  { id: 2, slug: 'hotel-hesperia', name: 'HOTEL HESPERIA', category: 'Todo Incluido', description: '', direction: 'Playa El Agua, Margarita', rating: 5, stars: 5, cover_photo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
  { id: 3, slug: 'costa-linda-beach', name: 'COSTA LINDA BEACH', category: 'Desayuno Incluido', description: '', direction: 'Av. Raúl Leoni, Porlamar', rating: 4, stars: 4, cover_photo: 'https://images.unsplash.com/photo-1551882547-ff40c4fe1fa7?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
  { id: 4, slug: 'laguna-mar-hotel', name: 'LAGUNA MAR HOTEL', category: 'Todo Incluido', description: '', direction: 'Playa Parguito, Margarita', rating: 4, stars: 4, cover_photo: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', main_photo_lg: null, main_photo_md: null, main_photo_sm: null, latlng: null },
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
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    hotelService.getFeatured().then((data) => {
      if (data && data.length > 0) setHotels(data)
    })
  }, [])

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const visibleCount = isMobile ? 1 : 3
  const maxIndex = Math.max(0, hotels.length - visibleCount)

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1))

  // Scroll track on index or visibleCount change
  useEffect(() => {
    if (!trackRef.current) return
    const cardWidth = trackRef.current.offsetWidth / visibleCount
    trackRef.current.style.transform = `translateX(-${current * (cardWidth + 16)}px)`
  }, [current, visibleCount])

  // Reset current when visibleCount changes to avoid out-of-bounds
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, hotels.length - visibleCount)))
  }, [visibleCount, hotels.length])

  // Auto-advance
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [isHovered, maxIndex])

  return (
    <section className="py-8 md:py-16 bg-white">
      {/* Section heading */}
      <div className="px-4 md:px-8 mb-6">
        <h2 className="font-bold text-lg md:text-2xl text-center mb-4">
          <span className="text-gray-800">TOP DE </span>
          <span className="text-[#7854F6]">HOTELES DESTACADOS</span>
          <span className="text-gray-800"> EN LA ISLA DE MARGARITA</span>
        </h2>
        <p className="hidden md:block text-gray-500 text-sm leading-relaxed max-w-3xl mx-auto text-center">
          En esta sección se encuentran los hoteles destacados en cuanta a ubicación, servicios y popularidad
          categorizados por nuestros{' '}
          <strong className="text-[#7854F6]">#ViajerosAMargarita</strong>. Opciones populares entre viajeros como tú
        </p>
      </div>

      {/* Carousel container */}
      <div
        className="relative px-8 md:px-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 disabled:opacity-30 transition-opacity"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Cards viewport */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 transition-transform duration-300 ease-in-out"
          >
            {hotels.map((hotel, i) => {
              const image = hotel.cover_photo
                ? (hotel.cover_photo.startsWith('http') ? hotel.cover_photo : resolveMediaUrl(hotel.cover_photo))
                : resolveMediaUrl(hotel.main_photo_lg)
              const badge = hotel.category ?? 'TODO INCLUIDO'
              const hasPets = (hotel as Hotel & { pets?: boolean }).pets ?? false

              return (
                <div
                  key={hotel.id ?? i}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-11px)]"
                >
                  {/* Image area */}
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    <Image
                      src={image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {badge}
                      </span>
                    </div>

                    {/* Heart */}
                    <button className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                      <Heart className="w-5 h-5 text-white" />
                    </button>

                    {/* Detalles button */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <Link
                        href={`/hoteles/${hotel.slug}`}
                        className="bg-[#7854F6] text-white text-sm font-semibold px-5 py-1.5 rounded-full whitespace-nowrap"
                      >
                        Detalles
                      </Link>
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="pt-3 pb-4">
                    <h3 className="font-bold text-gray-900 text-base uppercase mb-1">
                      {hotel.name}
                    </h3>

                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${idx < hotel.stars ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-gray-300'}`}
                        />
                      ))}
                    </div>

                    {hotel.direction && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{hotel.direction}</span>
                      </div>
                    )}

                    {hasPets && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <PawPrint className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Se permiten mascotas</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          disabled={current >= maxIndex}
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 disabled:opacity-30 transition-opacity"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {hotels.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i > maxIndex ? maxIndex : i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-[#7854F6]' : 'bg-gray-300'}`}
            aria-label={`Ir al hotel ${i + 1}`}
          />
        ))}
      </div>

      {/* Ver todos link */}
      <div className="text-center mt-8">
        <Link
          href="/hoteles"
          className="inline-flex items-center gap-2 text-[#7854F6] font-semibold hover:underline"
        >
          Ver todos los hoteles →
        </Link>
      </div>
    </section>
  )
}
