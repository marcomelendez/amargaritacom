import Image from 'next/image'

const destinations = [
  {
    label: 'Isla de Coche',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
  },
  {
    label: 'Isla de Cubagua',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  },
]

export default function MobileDestinations() {
  return (
    <section className="md:hidden py-6 px-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Destinos Populares Isla Margarita
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {destinations.map(({ label, src }) => (
          <div key={label}>
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden">
              <Image
                src={src}
                alt={label}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="text-sm text-center font-medium text-gray-700 mt-2">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
