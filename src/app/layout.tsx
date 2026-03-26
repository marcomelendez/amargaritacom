import type { Metadata } from 'next'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import MobileWhatsAppButton from '@/components/MobileWhatsAppButton'
import MobileScrollNav from '@/components/MobileScrollNav'

export const metadata: Metadata = {
  title: {
    default: 'Amargarita.com — Hoteles Todo Incluido en Margarita, Coche y Cubagua',
    template: '%s | Amargarita.com',
  },
  description:
    'Descubrí los mejores hoteles todo incluido, paquetes turísticos y excursiones en Isla Margarita, Coche y Cubagua. La mejor experiencia del Caribe venezolano.',
  keywords: ['Isla Margarita', 'hoteles Margarita', 'paquetes turísticos', 'Coche', 'Cubagua', 'Venezuela', 'todo incluido'],
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://www.amargarita.com',
    siteName: 'Amargarita.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="pb-16 md:pb-0">{children}</main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <WhatsAppButton />
        <MobileWhatsAppButton />
        <MobileScrollNav />
      </body>
    </html>
  )
}
