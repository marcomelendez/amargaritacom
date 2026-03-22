import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ofertas Especiales',
  description: 'Las mejores ofertas en hoteles y paquetes para Isla Margarita.',
}

export default function OfertasPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Ofertas Especiales</h1>
        <p className="text-gray-500 mt-2">Próximamente...</p>
      </div>
    </div>
  )
}
