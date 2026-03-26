import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contactate con Amargarita.com para planificar tu viaje a Isla Margarita. Oficina en Porlamar, atención de lunes a viernes.',
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children
}
