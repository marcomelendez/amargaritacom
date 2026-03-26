import type { Metadata } from 'next'
import { Target, Eye, Users, MapPin, Phone, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé quiénes somos, nuestra misión y visión en Amargarita.com — La agencia de viajes líder en Isla Margarita.',
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#4a43c4] pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Quiénes somos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Amargarita.com
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Tu agencia de viajes de confianza en Isla Margarita, comprometida con ofrecerte
            la mejor experiencia turística del Caribe venezolano.
          </p>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#4a43c4] font-semibold text-sm mb-3">
                <Users className="w-4 h-4" />
                <span className="uppercase tracking-wide">Nuestra empresa</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Quiénes somos?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Amargarita.com es una agencia de viajes ubicada en Isla Margarita, con un equipo de
                asesores altamente calificado, comprometido con Venezuela y sus riquezas naturales.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestro principal objetivo es el bienestar y la comodidad de nuestros clientes,
                ofreciendo servicios personalizados en hoteles todo incluido, paquetes turísticos,
                paseos y excursiones por las islas de Margarita, Coche y Cubagua.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Hoteles Todo Incluido', color: 'bg-purple-50 border-purple-100' },
                { label: 'Solo Desayuno', color: 'bg-orange-50 border-orange-100' },
                { label: 'Solo Alojamiento', color: 'bg-blue-50 border-blue-100' },
                { label: 'Media Pensión', color: 'bg-green-50 border-green-100' },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  className={`${color} border rounded-2xl p-4 text-center text-sm font-medium text-gray-700`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Misión y Visión</h2>
            <p className="text-gray-500 mt-2">Los valores que guían cada servicio que ofrecemos</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Misión */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 rounded-full bg-[#4a43c4]/10 flex items-center justify-center mb-5 group-hover:bg-[#4a43c4] transition-colors">
                <Target className="w-6 h-6 text-[#4a43c4] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Alcanzar la excelencia ofreciendo servicios de calidad a precios competitivos,
                logrando la satisfacción de nuestros clientes a través de un servicio personalizado
                y comprometido con sus necesidades.
              </p>
            </div>
            {/* Visión */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors">
                <Eye className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser el líder corporativo de Venezuela en impulsar y promover el turismo nacional e
                internacional, posicionando a Isla Margarita como el principal destino turístico
                del Caribe venezolano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dónde estamos */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">¿Dónde estamos?</h2>
            <p className="text-gray-500 mt-2">Visitanos en nuestra oficina en Porlamar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#4a43c4]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">Dirección</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Av. Paseo Cultural Ramón Vásquez Brito,<br />
                  C.C. Boulevard, Piso 2 Local B-12,<br />
                  Porlamar, Isla de Margarita
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#4a43c4]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">Teléfonos</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  (0295) 416-7083<br />
                  (0295) 263-1741<br />
                  WhatsApp: +58 424 834-1521
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#4a43c4]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">Horario de atención</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lunes a Viernes:<br />
                  8:00 am — 5:00 pm<br />
                  Sábados: 9:00 am — 1:00 pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
