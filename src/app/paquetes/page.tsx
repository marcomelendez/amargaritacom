import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paquetes Turísticos',
  description: 'Los mejores paquetes turísticos para Isla Margarita, Coche y Cubagua.',
}

export default function PaquetesPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Paquetes Turísticos</h1>
        <p className="text-gray-500 mt-2">Próximamente...</p>
      </div>
    </div>
  )
}
