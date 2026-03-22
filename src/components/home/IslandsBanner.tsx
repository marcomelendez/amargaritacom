import Image from 'next/image'
import Link from 'next/link'

const ISLAND_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', alt: 'Playa Margarita', rotate: '-rotate-6', top: '0%', left: '0%' },
  { src: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', alt: 'Isla Coche', rotate: 'rotate-3', top: '12%', left: '20%' },
  { src: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80', alt: 'Cubagua', rotate: '-rotate-2', top: '24%', left: '38%' },
]

export default function IslandsBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-stretch gap-4">
          {/* Card */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* LEFT: photo collage on light purple bg */}
              <div className="relative bg-[#8BA4E6]/10 flex items-center justify-center p-10 min-h-72">
                <div className="relative w-full h-64">
                  {ISLAND_IMAGES.map((img, i) => (
                    <div
                      key={i}
                      className={`absolute ${img.rotate} rounded-xl overflow-hidden shadow-xl border-4 border-white`}
                      style={{
                        width: '60%',
                        height: '60%',
                        top: img.top,
                        left: img.left,
                        zIndex: i + 1,
                      }}
                    >
                      <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: text content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">
                  Margarita, Coche y Cubagua: Tres Islas, Un Solo Paraíso
                </h2>
                <p className="text-gray-500 mb-3 text-sm leading-relaxed">
                  ☀️ Playas turquesas, arenas blancas y la mejor vista del Caribe 🌅
                </p>
                <p className="text-gray-500 mb-3 text-sm leading-relaxed">
                  Descubrí la magia de nuestras islas y viví una experiencia inolvidable.
                </p>
                <p className="text-gray-400 text-xs mb-6">
                  ¡Tres islas, mil formas de disfrutar!
                </p>
                <div>
                  <Link
                    href="/paquetes?destino=3-islas"
                    className="inline-block bg-gradient-to-r from-[#FE6604] via-[#FB9141] to-[#F59C0B] hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-md text-sm"
                  >
                    Quiero mi experiencia 3 islas
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Dot carousel indicator — outside the card, right side */}
          <div className="flex flex-col items-center justify-center gap-2 pl-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7854F6]" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  )
}
