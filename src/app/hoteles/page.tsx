import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hoteles en Margarita',
  description: 'Encontrá los mejores hoteles en Isla Margarita. Todo incluido, desayuno y más.',
}

export default function HotelesPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Hoteles en Margarita</h1>
        <p className="text-gray-500 mt-2">Próximamente...</p>
      </div>
    </div>
  )
}
