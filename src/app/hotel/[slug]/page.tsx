import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Clock, ChevronLeft, Check, MessageCircle } from 'lucide-react'
import { hotelService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import ReservationWidget from './_components/ReservationWidget'
import FaqAccordion from './_components/FaqAccordion'
import RoomGrid from './_components/RoomGrid'
import SearchFormHoteles from '@/components/SearchFormHoteles'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string>>
}

const MARGARITA_ZONES = [
  'Porlamar', 'Pampatar', 'Juan Griego', 'La Asuncion', 'La Asunción',
  'Playa el Agua', 'Pedro Gonzalez', 'Pedro González',
  'Altagracia', 'Playa el Yaque', 'Isla de Coche',
  'El Agua', 'Manzanillo', 'Boca del Río', 'Boca del Rio',
  'El Tirano', 'Guacuco', 'Paraguachi',
]

function extractZone(direction: string): string | null {
  if (!direction) return null
  const lower = direction.toLowerCase()
  for (const zone of MARGARITA_ZONES) {
    if (lower.includes(zone.toLowerCase())) return zone
  }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const hotel = await hotelService.getBySlug(slug)
  if (!hotel) return { title: 'Hotel no encontrado' }
  return {
    title: hotel.seo?.title ?? `${hotel.name} — Amargarita`,
    description: hotel.seo?.meta_description ?? hotel.short_description ?? undefined,
  }
}

export default async function HotelDetailPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const hotel = await hotelService.getBySlug(slug)
  if (!hotel) notFound()

  /* ── Photos ──────────────────────────────────────────────────────────── */
  const photos: string[] = []
  const addPhoto = (raw: string | null | undefined) => {
    const url = resolveMediaUrl(raw)
    if (url && url !== '/placeholder.svg' && !photos.includes(url)) photos.push(url)
  }
  addPhoto(hotel.main_photo_lg ?? hotel.main_photo_md ?? hotel.cover_photo)
  hotel.images?.forEach(i => addPhoto(i.url))
  hotel.gallery?.forEach(g => addPhoto(g.url))

  const heroPhoto = photos[0] ?? '/placeholder.svg'

  /* ── Meta ─────────────────────────────────────────────────────────────── */
  const stars = Math.min(5, Math.max(0, hotel.stars ?? 0))
  const zone  = extractZone(hotel.direction) ?? hotel.direction
  const backHref = sp.check_in
    ? `/hoteles?check_in=${sp.check_in}&check_out=${sp.check_out}&rooms=${encodeURIComponent(sp.rooms ?? '')}`
    : '/hoteles'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-[65vh] min-h-[440px] bg-gray-900">
        <Image
          src={heroPhoto}
          alt={hotel.name}
          fill
          className="object-cover opacity-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back */}
        <div className="absolute top-0 left-0 right-0 pt-24 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al listado
            </Link>
          </div>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            {hotel.category && (
              <span className="inline-block bg-[#FE6604] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {hotel.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {stars > 0 && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
              {hotel.rating > 0 && (
                <span className="bg-[#4a43c4] text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow">
                  {hotel.rating.toFixed(1)}
                </span>
              )}
              <div className="flex items-center gap-1.5 text-white/90 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{zone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Buscador Fijo Superior ────────────────────────────────────────── */}
      <SearchFormHoteles mode="always-fixed" />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Left — content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {hotel.description && (
              <section className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Sobre el hotel</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {hotel.description}
                </p>
              </section>
            )}

            {/* Highlights */}
            {hotel.highlights && hotel.highlights.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Puntos destacados</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {hotel.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#4a43c4]" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Servicios e instalaciones</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                  {hotel.amenities.map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4a43c4] shrink-0" />
                      {a.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Grid Detallado de Habitaciones y Combinaciones */}
            <RoomGrid hotel={hotel} searchParams={sp} />

            {/* Check-in / Check-out */}
            {(hotel.check_in || hotel.check_out) && (
              <section className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Horarios</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {hotel.check_in && (
                    <div className="flex items-center gap-3 bg-[#4a43c4]/5 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-[#4a43c4]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Check-in
                        </p>
                        <p className="text-gray-800 font-bold text-xl">{hotel.check_in}</p>
                      </div>
                    </div>
                  )}
                  {hotel.check_out && (
                    <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-[#FE6604]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Check-out
                        </p>
                        <p className="text-gray-800 font-bold text-xl">{hotel.check_out}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* FAQs */}
            {hotel.faqs && hotel.faqs.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Preguntas frecuentes</h2>
                <FaqAccordion faqs={hotel.faqs} />
              </section>
            )}

          </div>

          {/* Right — Sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <ReservationWidget hotel={hotel} searchParams={sp} />

            <a
              href="https://wa.me/584248341521"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors text-sm shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Consultanos por WhatsApp
            </a>
          </div>

        </div>

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        {photos.length > 1 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Galería de fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.slice(0, 7).map((url, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden ${
                    i === 0 ? 'col-span-2 md:row-span-2' : ''
                  }`}
                  style={{ minHeight: i === 0 ? 280 : 130 }}
                >
                  <Image
                    src={url}
                    alt={`${hotel.name} — foto ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
