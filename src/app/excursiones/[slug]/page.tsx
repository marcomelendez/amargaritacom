import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ChevronLeft } from 'lucide-react'
import { excursionService } from '@/services'
import { resolveMediaUrl } from '@/config/env'
import CatalogReservationWidget from '@/components/catalog/CatalogReservationWidget'
import SearchFormHoteles from '@/components/SearchFormHoteles'

export default async function ExcursionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const exc = await excursionService.getBySlug(slug)
  if (!exc) notFound()

  /* ── Photos ──────────────────────────────────────────────────────────── */
  const photos: string[] = []
  const addPhoto = (raw: string | null | undefined) => {
    const url = resolveMediaUrl(raw)
    if (url && url !== '/placeholder.svg' && !photos.includes(url)) photos.push(url)
  }
  addPhoto(exc.image_url)
  exc.gallery?.forEach(g => addPhoto(g.url))
  
  const heroPhoto = photos[0] ?? '/placeholder.svg'
  const destinationName = exc.destination?.name ?? 'Isla de Margarita'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-[65vh] min-h-[440px] bg-[#1B3C73]">
        <Image src={heroPhoto} alt={exc.name} fill className="object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-0 left-0 right-0 pt-24 px-4">
          <div className="max-w-6xl mx-auto">
            <Link href="/excursiones" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <ChevronLeft className="w-4 h-4" />
              Volver a Excursiones
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            {exc.type && (
              <span className="inline-block bg-[#00A1FF] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {exc.type}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">{exc.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{destinationName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador Fijo */}
      <SearchFormHoteles mode="always-fixed" />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Left — content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <section className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-[#1B3C73] mb-4">Sobre esta actividad</h2>
              <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
                {exc.description || exc.short_description || 'No hay descripción detallada disponible.'}
              </p>
            </section>

          </div>

          {/* Right — Sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <CatalogReservationWidget 
               title={exc.name} 
               price={exc.price} 
               type="excursion" 
               itemId={exc.id} 
               slug={exc.slug} 
            />
          </div>

        </div>

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        {photos.length > 1 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-[#1B3C73] mb-6">Galería de fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.slice(0, 7).map((url, i) => (
                <div key={i} className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 md:row-span-2' : ''}`} style={{ minHeight: i === 0 ? 320 : 150 }}>
                  <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
