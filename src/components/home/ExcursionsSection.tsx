'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mountain, Sun, Landmark, Star } from 'lucide-react'
import { excursionService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import type { Excursion } from '@/types'

const CATEGORIES = [
  { label: 'Senderismo', icon: Mountain },
  { label: 'Full Day Playas', icon: Sun },
  { label: 'Historia y Data Local', icon: Landmark },
]

// 9 items: 3 columns × 3 rows
const PLACEHOLDER_EXCURSIONS: Excursion[] = [
  { id: 1,  slug: 'explora-pozas-san-juan-1',  name: 'Explora Las Pozas de San Juan', description: null, short_description: null, destination: null, type: 'senderismo', price: 15,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&q=60', gallery: [], reviews: [] },
  { id: 2,  slug: 'sunsol-festival-fullday-1', name: 'Sunsol Festival Full Day',       description: null, short_description: null, destination: null, type: 'fullday',    price: 60,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&q=60', gallery: [], reviews: [] },
  { id: 3,  slug: 'naturaleza-4x4-1',           name: 'Naturaleza 4x4 Fullday',        description: null, short_description: null, destination: null, type: 'aventura',   price: 60,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=150&q=60', gallery: [], reviews: [] },
  { id: 4,  slug: 'explora-pozas-san-juan-2',  name: 'Explora Las Pozas de San Juan', description: null, short_description: null, destination: null, type: 'senderismo', price: 15,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&q=60', gallery: [], reviews: [] },
  { id: 5,  slug: 'sunsol-festival-fullday-2', name: 'Sunsol Festival Full Day',       description: null, short_description: null, destination: null, type: 'fullday',    price: 60,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&q=60', gallery: [], reviews: [] },
  { id: 6,  slug: 'naturaleza-4x4-2',           name: 'Naturaleza 4x4 Fullday',        description: null, short_description: null, destination: null, type: 'aventura',   price: 60,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=150&q=60', gallery: [], reviews: [] },
  { id: 7,  slug: 'explora-pozas-san-juan-3',  name: 'Explora Las Pozas de San Juan', description: null, short_description: null, destination: null, type: 'senderismo', price: 15,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&q=60', gallery: [], reviews: [] },
  { id: 8,  slug: 'sunsol-festival-fullday-3', name: 'Sunsol Festival Full Day',       description: null, short_description: null, destination: null, type: 'fullday',    price: 60,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&q=60', gallery: [], reviews: [] },
  { id: 9,  slug: 'naturaleza-4x4-3',           name: 'Naturaleza 4x4 Fullday',        description: null, short_description: null, destination: null, type: 'aventura',   price: 60,  is_active: true, available_from: null, available_to: null, image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80', image_thumb: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=150&q=60', gallery: [], reviews: [] },
]

export default function ExcursionsSection() {
  const [excursions, setExcursions] = useState<Excursion[]>(PLACEHOLDER_EXCURSIONS)

  useEffect(() => {
    excursionService.getFeatured().then((data) => {
      if (data && data.length > 0) setExcursions(data.slice(0, 9))
    })
  }, [])

  return (
    <>
    {/* ── MOBILE VERSION ─────────────────────────────────── */}
    <section className="md:hidden py-6 px-4 bg-white">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
        Paseos y Excursiones
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Te llevamos a los lugares más hermosos para visitar en la Isla de Margarita y con ayuda de nuestros aliados tenemos para tí los mejores paseos y excursiones! Margarita es más que playa, sol y arena
      </p>

      {/* Circular card */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80"
            alt="Full Day I Love Cubagua"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <h3 className="font-bold text-base text-gray-900 text-center mt-4">
          Full Day I Love Cubagua
        </h3>

        {/* Stars row */}
        <div className="flex items-center justify-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-sm font-bold text-gray-700 ml-1">4.7</span>
          <span className="text-sm text-gray-500">· Excellent</span>
          <span className="text-sm text-gray-400 font-medium ml-1">Google</span>
        </div>
      </div>
    </section>

    {/* ── DESKTOP VERSION ─────────────────────────────────── */}
    <section className="hidden md:block py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Paseos y Excursiones</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-3xl">
          Te llevamos a los lugares más hermosos para visitar en la isla de Margarita y con ayuda de nuestros aliados tenemos para ti los mejores paseos y excursiones. Margarita es más que playa, sol y arena.
        </p>

        {/* Category icons — centered */}
        <div className="flex items-center justify-center gap-12 mb-10">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <button key={label} className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#4a43c4] transition-colors group">
              <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-[#8BA4E6]/10 flex items-center justify-center transition-colors shadow-sm">
                <Icon size={24} className="group-hover:text-[#4a43c4] transition-colors" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* 3-column grid, 3 rows = 9 items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {excursions.slice(0, 9).map((exc) => (
            <Link
              key={exc.id}
              href={`/excursiones/${exc.slug}`}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-colors group"
            >
              {/* Small square thumbnail */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={resolveMediaUrl(exc.image_thumb || exc.image_url)}
                  alt={exc.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&q=60'
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs text-gray-800 uppercase leading-tight line-clamp-2">
                  {exc.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  desde{' '}
                  <span className="text-emerald-600 font-bold text-sm">${exc.price}</span>{' '}
                  por persona
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom right link */}
        <div className="flex justify-end mt-6">
          <Link
            href="/excursiones"
            className="inline-flex items-center gap-1 text-[#4a43c4] text-sm font-semibold hover:underline"
          >
            Ver más actividades y que hacer en Isla Margarita →
          </Link>
        </div>
      </div>
    </section>
    </>
  )
}
