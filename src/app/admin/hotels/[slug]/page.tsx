'use client'

import { useEffect, useState, useCallback, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HotelContent } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HotelMeta {
  id: number
  slug: string
  name: string
  category: string | null
  stars: number
  cover_photo: string | null
}

type GalleryItem = { url: string; alt: string; order: number }
type FaqItem = { q: string; a: string }

interface FormState {
  short_description: string
  description: string
  highlights: string[]
  amenities_list: string[]
  check_in: string
  check_out: string
  gallery: GalleryItem[]
  faqs: FaqItem[]
  seo_title: string
  seo_meta_description: string
  seo_keywords: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AMENITIES = [
  { key: 'wifi', label: 'WiFi', icon: '🛜' },
  { key: 'pool', label: 'Piscina', icon: '🏊' },
  { key: 'restaurant', label: 'Restaurante', icon: '🍽️' },
  { key: 'gym', label: 'Gimnasio', icon: '💪' },
  { key: 'spa', label: 'Spa', icon: '🧖' },
  { key: 'beach_access', label: 'Acceso a playa', icon: '🏖️' },
  { key: 'parking', label: 'Estacionamiento', icon: '🅿️' },
  { key: 'ac', label: 'Aire acondicionado', icon: '❄️' },
  { key: 'bar', label: 'Bar', icon: '🍹' },
  { key: 'room_service', label: 'Room service', icon: '🛎️' },
  { key: 'kids_club', label: 'Club de niños', icon: '🧒' },
  { key: 'laundry', label: 'Lavandería', icon: '👕' },
]

const emptyForm = (): FormState => ({
  short_description: '',
  description: '',
  highlights: [],
  amenities_list: [],
  check_in: '',
  check_out: '',
  gallery: [],
  faqs: [],
  seo_title: '',
  seo_meta_description: '',
  seo_keywords: '',
})

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  )
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length
  const over = len > max
  return (
    <span className={`text-xs ${over ? 'text-red-500' : 'text-gray-400'}`}>
      {len}/{max}
    </span>
  )
}

const inputClass =
  'border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] outline-none w-full'

const textareaClass = `${inputClass} resize-none`

function StarRow({ count }: { count: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(Math.max(0, Math.min(5, count)))}
      {'☆'.repeat(Math.max(0, 5 - Math.min(5, count)))}
    </span>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 ${
        type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      {message}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditHotelPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const [hotel, setHotel] = useState<HotelMeta | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/hotels/${slug}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Error al cargar hotel')
        const data = await res.json()

        setHotel({
          id: data.id,
          slug: data.slug,
          name: data.name,
          category: data.category ?? null,
          stars: data.stars ?? 0,
          cover_photo: data.cover_photo ?? null,
        })

        setForm({
          short_description: data.short_description ?? '',
          description: data.description ?? '',
          highlights: data.highlights ?? [],
          amenities_list: data.amenities_list ?? [],
          check_in: data.check_in ?? '',
          check_out: data.check_out ?? '',
          gallery: data.gallery ?? [],
          faqs: data.faqs ?? [],
          seo_title: data.seo?.title ?? '',
          seo_meta_description: data.seo?.meta_description ?? '',
          seo_keywords: (data.seo?.keywords ?? []).join(', '),
        })
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Error', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, showToast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: Partial<HotelContent> = {
        short_description: form.short_description || undefined,
        description: form.description || undefined,
        highlights: form.highlights.filter(Boolean),
        amenities_list: form.amenities_list,
        check_in: form.check_in || undefined,
        check_out: form.check_out || undefined,
        gallery: form.gallery.filter(g => g.url),
        faqs: form.faqs.filter(f => f.q || f.a),
        seo: {
          title: form.seo_title || undefined,
          meta_description: form.seo_meta_description || undefined,
          keywords: form.seo_keywords
            ? form.seo_keywords.split(',').map(k => k.trim()).filter(Boolean)
            : undefined,
        },
      }

      const res = await fetch(`/api/admin/hotels/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Error al guardar')
      }

      showToast('Contenido guardado correctamente', 'success')
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Highlights helpers
  const addHighlight = () => {
    if (form.highlights.length >= 6) return
    setForm(f => ({ ...f, highlights: [...f.highlights, ''] }))
  }
  const updateHighlight = (i: number, val: string) =>
    setForm(f => ({ ...f, highlights: f.highlights.map((h, idx) => idx === i ? val : h) }))
  const removeHighlight = (i: number) =>
    setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))

  // ── Amenity toggle
  const toggleAmenity = (key: string) =>
    setForm(f => ({
      ...f,
      amenities_list: f.amenities_list.includes(key)
        ? f.amenities_list.filter(a => a !== key)
        : [...f.amenities_list, key],
    }))

  // ── Gallery helpers
  const addGalleryItem = () => {
    if (form.gallery.length >= 20) return
    setForm(f => ({ ...f, gallery: [...f.gallery, { url: '', alt: '', order: f.gallery.length + 1 }] }))
  }
  const updateGallery = (i: number, field: keyof GalleryItem, val: string | number) =>
    setForm(f => ({ ...f, gallery: f.gallery.map((g, idx) => idx === i ? { ...g, [field]: val } : g) }))
  const removeGallery = (i: number) =>
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))

  // ── FAQ helpers
  const addFaq = () =>
    setForm(f => ({ ...f, faqs: [...f.faqs, { q: '', a: '' }] }))
  const updateFaq = (i: number, field: 'q' | 'a', val: string) =>
    setForm(f => ({ ...f, faqs: f.faqs.map((faq, idx) => idx === i ? { ...faq, [field]: val } : faq) }))
  const removeFaq = (i: number) =>
    setForm(f => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }))

  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4a43c4]/20 border-t-[#4a43c4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Back link */}
      <Link
        href="/admin/hotels"
        className="inline-flex items-center gap-1 text-sm text-[#4a43c4] hover:text-[#3730a3] mb-6 transition-colors"
      >
        ← Volver al listado
      </Link>

      {/* Hotel metadata (readonly) */}
      {hotel && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-6 flex items-center gap-4">
          {hotel.cover_photo ? (
            <Image
              src={hotel.cover_photo}
              alt={hotel.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              unoptimized
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 flex-shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{hotel.name}</h1>
              {hotel.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#FE6604] to-[#F59C0B]">
                  {hotel.category}
                </span>
              )}
            </div>
            <StarRow count={hotel.stars} />
            <p className="text-xs text-gray-400 mt-0.5">slug: {hotel.slug} · id: {hotel.id}</p>
          </div>
        </div>
      )}

      {/* Form sections */}
      <div className="flex flex-col gap-4">

        {/* Descripción */}
        <SectionCard title="Descripción">
          <div className="flex flex-col gap-4 pt-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Descripción corta</label>
                <CharCounter value={form.short_description} max={200} />
              </div>
              <textarea
                rows={3}
                value={form.short_description}
                onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))}
                placeholder="Breve descripción del hotel (máx. 200 caracteres)"
                className={textareaClass}
                maxLength={220}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Descripción completa</label>
              <textarea
                rows={8}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descripción detallada del hotel..."
                className={textareaClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* Highlights */}
        <SectionCard title="Highlights">
          <div className="flex flex-col gap-2 pt-4">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <input
                  type="text"
                  value={h}
                  onChange={e => updateHighlight(i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {form.highlights.length < 6 && (
              <button
                type="button"
                onClick={addHighlight}
                className="self-start mt-1 text-sm text-[#4a43c4] hover:text-[#3730a3] font-medium transition-colors"
              >
                + Agregar highlight
              </button>
            )}
            {form.highlights.length === 6 && (
              <p className="text-xs text-gray-400">Máximo 6 highlights</p>
            )}
          </div>
        </SectionCard>

        {/* Amenities */}
        <SectionCard title="Amenities">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4">
            {AMENITIES.map(a => {
              const checked = form.amenities_list.includes(a.key)
              return (
                <label
                  key={a.key}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors text-sm ${
                    checked
                      ? 'bg-[#4a43c4]/5 border-[#4a43c4]/30 text-[#4a43c4]'
                      : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAmenity(a.key)}
                    className="accent-[#4a43c4]"
                  />
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </label>
              )
            })}
          </div>
        </SectionCard>

        {/* Horarios */}
        <SectionCard title="Horarios de check-in / check-out">
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Check-in</label>
              <input
                type="text"
                value={form.check_in}
                onChange={e => setForm(f => ({ ...f, check_in: e.target.value }))}
                placeholder="15:00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Check-out</label>
              <input
                type="text"
                value={form.check_out}
                onChange={e => setForm(f => ({ ...f, check_out: e.target.value }))}
                placeholder="12:00"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* Galería */}
        <SectionCard title="Galería de imágenes">
          <div className="flex flex-col gap-2 pt-4">
            {form.gallery.map((g, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-5">#{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGallery(i)}
                    className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="url"
                    value={g.url}
                    onChange={e => updateGallery(i, 'url', e.target.value)}
                    placeholder="URL de la imagen"
                    className={`${inputClass} sm:col-span-2`}
                  />
                  <input
                    type="text"
                    value={g.alt}
                    onChange={e => updateGallery(i, 'alt', e.target.value)}
                    placeholder="Texto alternativo"
                    className={inputClass}
                  />
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <label className="text-xs text-gray-500">Orden:</label>
                    <input
                      type="number"
                      value={g.order}
                      onChange={e => updateGallery(i, 'order', parseInt(e.target.value) || 0)}
                      className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] outline-none"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            ))}
            {form.gallery.length < 20 && (
              <button
                type="button"
                onClick={addGalleryItem}
                className="self-start mt-1 text-sm text-[#4a43c4] hover:text-[#3730a3] font-medium transition-colors"
              >
                + Agregar imagen
              </button>
            )}
            {form.gallery.length === 20 && (
              <p className="text-xs text-gray-400">Máximo 20 imágenes</p>
            )}
          </div>
        </SectionCard>

        {/* FAQs */}
        <SectionCard title="Preguntas frecuentes (FAQs)">
          <div className="flex flex-col gap-3 pt-4">
            {form.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pregunta {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={faq.q}
                    onChange={e => updateFaq(i, 'q', e.target.value)}
                    placeholder="Pregunta"
                    className={inputClass}
                  />
                  <textarea
                    rows={3}
                    value={faq.a}
                    onChange={e => updateFaq(i, 'a', e.target.value)}
                    placeholder="Respuesta"
                    className={textareaClass}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="self-start text-sm text-[#4a43c4] hover:text-[#3730a3] font-medium transition-colors"
            >
              + Agregar pregunta
            </button>
          </div>
        </SectionCard>

        {/* SEO */}
        <SectionCard title="SEO">
          <div className="flex flex-col gap-4 pt-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Título SEO</label>
                <CharCounter value={form.seo_title} max={70} />
              </div>
              <input
                type="text"
                value={form.seo_title}
                onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                placeholder="Título optimizado para buscadores"
                className={inputClass}
                maxLength={80}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Meta descripción</label>
                <CharCounter value={form.seo_meta_description} max={160} />
              </div>
              <textarea
                rows={3}
                value={form.seo_meta_description}
                onChange={e => setForm(f => ({ ...f, seo_meta_description: e.target.value }))}
                placeholder="Descripción para buscadores (máx. 160 caracteres)"
                className={textareaClass}
                maxLength={180}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Keywords <span className="text-gray-400 font-normal">(separadas por coma)</span>
              </label>
              <input
                type="text"
                value={form.seo_keywords}
                onChange={e => setForm(f => ({ ...f, seo_keywords: e.target.value }))}
                placeholder="hotel, isla margarita, todo incluido"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
          <Link
            href="/admin/hotels"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4a43c4] hover:bg-[#3730a3] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {saving ? 'Guardando...' : 'Guardar contenido'}
          </button>
        </div>
      </div>
    </div>
  )
}
