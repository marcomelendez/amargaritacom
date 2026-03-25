'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Plane, Car } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: Package, label: 'Paquetes', href: '/paquetes' },
  { icon: Plane, label: 'Vuelos', href: '#' },
  { icon: Car, label: 'Alquiler', href: '#' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 py-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = href !== '#' && pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-0.5 ${isActive ? 'text-[#4a43c4]' : 'text-gray-400'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
