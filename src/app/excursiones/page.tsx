import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Excursiones y Actividades',
  description: 'Descubrí las mejores excursiones y actividades en Isla Margarita.',
}

export default function ExcursionesPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Excursiones y Actividades</h1>
        <p className="text-gray-500 mt-2">Próximamente...</p>
      </div>
    </div>
  )
}
