import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contactate con nosotros para planificar tu viaje a Isla Margarita.',
}

export default function ContactoPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Contacto</h1>
        <p className="text-gray-500 mt-2">Próximamente...</p>
      </div>
    </div>
  )
}
