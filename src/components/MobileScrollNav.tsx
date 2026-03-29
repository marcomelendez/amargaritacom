'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Luggage, Compass, Tag } from 'lucide-react'

const categories = [
  { icon: Building2, label: 'Hoteles', href: '/hoteles' },
  { icon: Luggage,   label: 'Paquetes', href: '/paquetes' },
  { icon: Compass,   label: 'Paseos',   href: '/excursiones' },
  { icon: Tag,       label: 'Ofertas',  href: '/ofertas' },
]

export default function MobileScrollNav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) return
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  // En home: aparece al scrollear. En el resto: siempre visible.
  if (isHome && !scrolled) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-stretch gap-2 px-3 py-2">
        {categories.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center rounded-xl py-2 px-1 gap-0.5 ${
                isActive ? 'bg-gradient-to-b from-[#FE6604] to-[#F59C0B]' : 'bg-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#4a43c5]'}`} />
              <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-[#4a43c5]'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
