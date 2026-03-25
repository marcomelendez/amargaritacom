import { Map, Compass, BookOpen, Headphones, Building2, CreditCard } from 'lucide-react'

const FEATURES = [
  {
    icon: Map,
    title: 'Set Travel Plan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    icon: Compass,
    title: 'Explore Around',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    icon: BookOpen,
    title: 'Best Guide',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    icon: Building2,
    title: 'Luxury Hotel',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    icon: CreditCard,
    title: 'Easy Booking',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Centered header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Why choose us?</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          </p>
        </div>

        {/* 6 cards — 2 rows × 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-[#8BA4E6]/30 hover:shadow-lg transition-all group"
            >
              {/* Circular purple icon */}
              <div className="w-14 h-14 rounded-full bg-[#8BA4E6]/20 group-hover:bg-[#7854F6] flex items-center justify-center mb-4 transition-colors">
                <Icon size={24} className="text-[#4a43c4] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Bottom right chip */}
        <div className="flex justify-end mt-8">
          <button className="text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors font-medium">
            Herramientas Resuces
          </button>
        </div>
      </div>
    </section>
  )
}
