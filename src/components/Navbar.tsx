'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Phone, Mail, Facebook, Instagram, Youtube, Building2, Luggage, Compass, Tag } from 'lucide-react'
import { env } from '@/config/env'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="md:fixed md:top-0 md:left-0 md:right-0 md:z-50 w-full">

      {/* MOBILE HEADER - md:hidden */}
      <div className="md:hidden">
        {/* Top bar: Hola + WhatsApp */}
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="font-bold text-gray-800 text-base">🍋 ¡Hola!</span>
          <a
            href={`https://wa.me/${env.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white text-xs font-bold px-3 py-2 rounded-xl flex flex-col items-center leading-tight"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="mb-0.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Reserve por</span>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Logo centered */}
        <div className="flex justify-center py-3 bg-white">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Amargarita.com"
              width={150}
              height={56}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Category buttons row */}
        <div className="flex items-stretch gap-2 px-3 pb-3 bg-white">
          {/* Hoteles - active/orange */}
          <Link href="/hoteles" className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#FE6604] to-[#F59C0B] rounded-xl py-3 px-1 gap-1">
            <Building2 className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-semibold">Hoteles</span>
          </Link>
          {/* Paquetes */}
          <Link href="/paquetes" className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-1 gap-1 shadow-sm">
            <Luggage className="w-6 h-6 text-[#FE6604]" />
            <span className="text-gray-700 text-xs font-semibold">Paquetes</span>
          </Link>
          {/* Paseos */}
          <Link href="/excursiones" className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-1 gap-1 shadow-sm">
            <Compass className="w-6 h-6 text-[#FE6604]" />
            <span className="text-gray-700 text-xs font-semibold">Paseos</span>
          </Link>
          {/* Ofertas */}
          <Link href="/ofertas" className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-1 gap-1 shadow-sm">
            <Tag className="w-6 h-6 text-[#FE6604]" />
            <span className="text-gray-700 text-xs font-semibold">Ofertas</span>
          </Link>
        </div>
      </div>

      {/* Top bar — desktop version */}
      <div className="hidden md:block bg-[#7854F6] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: social */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-white/90 mr-1">Seguinos y descubrí más:</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              <Facebook size={14} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              <Instagram size={14} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              <Youtube size={14} />
            </a>
          </div>

          {/* Center: email */}
          <div className="flex items-center">
            <a href="mailto:reservas@amargarita.com" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
              <Mail size={13} />
              <span>reservas@amargarita.com</span>
            </a>
          </div>

          {/* Right: phones */}
          <div className="flex items-center gap-4">
            <a href={`tel:+${env.whatsappNumber}`} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
              <Phone size={13} />
              <span>+58 424 8347321</span>
            </a>
            <span className="text-white/40">|</span>
            <a href="tel:+582952604093" className="flex items-center gap-1 hover:text-orange-400 transition-colors">
              <Phone size={13} />
              <span>+58 295 2604093</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav — white, sticky */}
      <nav className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-[1.65rem] font-bold tracking-tight text-[#FE6404]">
              amargarita.com
            </span>
          </Link>

          {/* Desktop nav items — gray pill/chip background */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { href: '/hoteles', label: 'Hoteles en Margarita' },
              { href: '/paquetes', label: 'Paquetes' },
              { href: '/excursiones', label: 'Explora Actividades' },
              { href: '/ofertas', label: 'Ofertas' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-[#7854F6] bg-[#8BA4E6]/20'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
