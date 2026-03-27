import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import NewsletterSection from '@/components/home/NewsletterSection'

const productLinks = [
  { href: '/hoteles', label: 'Hoteles en Margarita' },
  { href: '/hoteles?tipo=todo-incluido', label: 'Hoteles Todo Incluido en Margarita' },
  { href: '/hoteles?tipo=desayuno', label: 'Hoteles Desayuno en Margarita' },
  { href: '/excursiones', label: 'Fullday a Los Frailes' },
  { href: '/excursiones', label: 'Fullday a Isla de Cubagua' },
  { href: '/paquetes?tipo=residentes', label: 'Paquetes para residentes' },
  { href: '/excursiones', label: 'Ofertas en vuelos para residentes' },
  { href: '/paquetes', label: 'Tour Margariteño' },
  { href: '/excursiones', label: 'Vuelo en Parapente en Rumpiar' },
  { href: '/excursiones', label: 'Actividades en Isla Margarita' },
  { href: '/hoteles', label: 'Alquiler de apartamentos Isla Margarita' },
]

const amargaritaLinks = [
  { href: '/nosotros', label: 'Quiénes somos' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Política de privacidad' },
  { href: '/excursiones', label: 'Viaje en grupo y ahorrá más' },
  { href: '/excursiones', label: 'Viajes para empresas' },
  { href: '/excursiones', label: 'Grupos y conferencias' },
  { href: '/hoteles', label: 'Casate en Margarita' },
  { href: '/hoteles', label: 'Reserva tu coche en Margarita' },
  { href: '/excursiones', label: 'Premios para concursos y empresas' },
  { href: '/hoteles', label: 'Glamping en Margarita y Coche' },
  { href: '/hoteles', label: 'Hoteles en Margarita y Coche' },
]

const allBottomLinks = [...productLinks, ...amargaritaLinks]

export default function Footer() {
  return (
    <footer>
      {/* TOP FOOTER — purple bg + illustration */}
      <div
        className="relative text-black bg-[#697EB0]"
        style={{ backgroundImage: "url('/footer-bg-img.png')", backgroundSize: 'cover', backgroundPosition: 'center bottom' }}
      >
        <div className="absolute inset-0 bg-[#697EB0]/30" />
        <div className="relative max-w-7xl mx-auto px-4">
          <NewsletterSection />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1: logo + description + social icons */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-[#FE6404]">amargarita.com</span>
            </div>
            <p className="text-black/80 text-sm leading-relaxed mb-5">
              Tu guía de viaje para descubrir lo mejor de Isla Margarita, Coche y Cubagua. Hoteles, paquetes y excursiones al mejor precio.
            </p>
            <div className="flex items-center gap-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#7854F6]/25 rounded-full hover:bg-[#8166F1] transition-colors">
                <Facebook size={15} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#7854F6]/25 rounded-full hover:bg-[#8166F1] transition-colors">
                <Instagram size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#7854F6]/25 rounded-full hover:bg-[#8166F1] transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#7854F6]/25 rounded-full hover:bg-[#8166F1] transition-colors">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Productos y servicios */}
          <div>
            <h3 className="font-semibold text-black text-sm uppercase tracking-wide mb-4">Productos y servicios</h3>
            <ul className="space-y-2">
              {productLinks.slice(0, 8).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-black/80 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Amargarita.com — address + contact */}
          <div>
            <h3 className="font-semibold text-black text-sm uppercase tracking-wide mb-4">Amargarita.com</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-black/80">
                <MapPin size={14} className="mt-0.5 shrink-0 text-black/60" />
                <span>CC. Centro Comercial, Local 5, Porlamar, Isla Margarita</span>
              </div>
              <a href="mailto:reservas@amargarita.com" className="flex items-center gap-2 text-sm text-black/80 hover:text-white transition-colors">
                <Mail size={14} className="shrink-0 text-black/60" />
                <span>reservas@amargarita.com</span>
              </a>
              <a href="tel:+584248347321" className="flex items-center gap-2 text-sm text-black/80 hover:text-white transition-colors">
                <Phone size={14} className="shrink-0 text-black/60" />
                <span>+58 424 8347321</span>
              </a>
              <a href="tel:+582952604093" className="flex items-center gap-2 text-sm text-black/80 hover:text-white transition-colors">
                <Phone size={14} className="shrink-0 text-black/60" />
                <span>+58 295 2604093</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* END TOP FOOTER */}

      {/* BOTTOM FOOTER — dark purple */}
      <div className="bg-[#12103A] text-[#8C7DEB]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 3-column grid of small links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-xs mb-5">
            {allBottomLinks.map((link, i) => (
              <Link key={`${link.label}-${i}`} href={link.href} className="hover:text-white transition-colors truncate">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-[#7854F6]/30 pt-4 text-center text-xs text-[#8166F1]">
            Copyright 2021 © © A Margarita C.A.
          </div>
        </div>
      </div>
    </footer>
  )
}
