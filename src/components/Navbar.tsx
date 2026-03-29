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
  const hideMobileHeader = ['/hoteles', '/paquetes', '/excursiones', '/ofertas'].some(p => pathname.startsWith(p))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="md:fixed md:top-0 md:left-0 md:right-0 md:z-50 w-full">

      {/* MOBILE HEADER - oculto en páginas de listado */}
      <div className={hideMobileHeader ? 'hidden' : 'md:hidden'}>
        {/* Top bar: Hola */}
        <div className="flex items-center px-4 pt-7 pb-2 bg-white">
          <span className="font-bold text-gray-800 text-base">👋 ¡Hola!</span>
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
        {(() => {
          const mobileCategories = [
            { icon: Building2, label: 'Hoteles', href: '/hoteles' },
            { icon: Luggage,   label: 'Paquetes', href: '/paquetes' },
            { icon: Compass,   label: 'Paseos',   href: '/excursiones' },
            { icon: Tag,       label: 'Ofertas',  href: '/ofertas' },
          ]
          return (
            <div className="flex items-stretch gap-2 px-3 pt-3 pb-3 bg-white">
              {mobileCategories.map(({ icon: Icon, label, href }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`flex-1 flex flex-col items-center justify-center rounded-xl py-3 px-1 gap-1 ${
                      isActive
                        ? 'bg-gradient-to-b from-[#FE6604] to-[#F59C0B]'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-[#FE6604]'}`} />
                    <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </Link>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Top bar — desktop version */}
      <div className="hidden md:block bg-[#4a43c4] text-white text-xs py-2 px-4">
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
          <Link href="/" className="hidden md:flex items-center">
            <span className="text-[1.65rem] font-bold tracking-tight text-[#FE6404]">
              amargarita.com
            </span>
          </Link>

          {/* Desktop nav items — gray pill/chip background */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { href: '/hoteles',     label: 'Hoteles en Margarita', icon: Building2 },
              { href: '/paquetes',    label: 'Paquetes',             icon: Luggage   },
              { href: '/excursiones', label: 'Explora Actividades',  icon: Compass   },
              { href: '/ofertas',     label: 'Ofertas',              icon: Tag       },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  pathname.startsWith(href)
                    ? 'text-[#4a43c4] bg-[#8BA4E6]/20'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
