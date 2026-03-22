'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[520px] mt-0 md:mt-[88px]">
      {/* Background image */}
      <Image
        src="/hero-bg-img.jpg"
        alt="Isla Margarita, Venezuela"
        fill
        className="object-cover object-center"
        priority
        unoptimized
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/65" />

      {/* "¿Necesitás ayuda?" button — absolute top-right INSIDE hero */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href="https://wa.me/584248347321"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105"
        >
          <MessageCircle size={16} />
          ¿Necesitás ayuda?
        </Link>
      </div>

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        {/* Logo */}
        <div className="mb-6">
          <Image src="/logo-white-center.png" alt="Amargarita.com" width={280} height={180} className="drop-shadow-2xl" unoptimized priority />
        </div>

        {/* H1 */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg max-w-3xl leading-tight">
          Hoteles Todo Incluido en Margarita, Coche y Cubagua
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/85 drop-shadow max-w-2xl">
          Con los mejores precios en hoteles y excursiones
        </p>
      </div>
    </section>
  )
}
