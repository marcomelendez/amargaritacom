'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, Luggage, Compass, Tag } from 'lucide-react'

const categories = [
  { icon: Building2, label: 'Hoteles', href: '/hoteles', active: true },
  { icon: Luggage, label: 'Paquetes', href: '/paquetes', active: false },
  { icon: Compass, label: 'Paseos', href: '/excursiones', active: false },
  { icon: Tag, label: 'Ofertas', href: '/ofertas', active: false },
]

export default function MobileScrollNav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-stretch gap-2 px-3 py-2">
        {categories.map(({ icon: Icon, label, href, active }) => (
          <Link
            key={label}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center rounded-xl py-2 px-1 gap-0.5 ${
              active
                ? 'bg-gradient-to-b from-[#FE6604] to-[#F59C0B]'
                : 'bg-white border border-gray-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#FE6604]'}`} />
            <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
