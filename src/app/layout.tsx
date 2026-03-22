import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

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
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
