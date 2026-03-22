'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react'
import { env } from '@/config/env'

const navLinks = [
  { href: '/hoteles', label: 'Hoteles en Margarita' },
  { href: '/paquetes', label: 'Paquetes' },
  { href: '/excursiones', label: 'Explora Actividades' },
  { href: '/ofertas', label: 'Ofertas' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar — solid purple */}
      <div className="bg-[#7854F6] text-white text-xs py-2 px-4">
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
          <div className="hidden md:flex items-center">
            <a href="mailto:reservas@amargarita.com" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
              <Mail size={13} />
              <span>reservas@amargarita.com</span>
            </a>
          </div>

          {/* Right: phones */}
          <div className="hidden md:flex items-center gap-4">
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
            {navLinks.map((link) => (
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

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl ${
                  pathname.startsWith(link.href)
                    ? 'text-[#7854F6] bg-[#8BA4E6]/10'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <a href="mailto:reservas@amargarita.com" className="flex items-center gap-2 text-xs text-gray-500 px-4">
                <Mail size={12} /> reservas@amargarita.com
              </a>
              <a href="tel:+584248347321" className="flex items-center gap-2 text-xs text-gray-500 px-4">
                <Phone size={12} /> +58 424 8347321
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
