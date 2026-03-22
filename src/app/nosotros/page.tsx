import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé quiénes somos y nuestra misión en Amargarita.com.',
}

export default function NosotrosPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Nosotros</h1>
        <p className="text-gray-500 mt-2">Próximamente...</p>
      </div>
    </div>
  )
}
