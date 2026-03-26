'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react'

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    asunto: '',
    comentario: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Simulate send
    await new Promise(r => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
    setForm({ nombre: '', apellido: '', email: '', telefono: '', asunto: '', comentario: '' })
  }

  const ASUNTOS = [
    'Reserva de hotel',
    'Paquetes turísticos',
    'Paseos y excursiones',
    'Información general',
    'Cancelaciones y modificaciones',
    'Otro',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#4a43c4] pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white" />
          <div className="absolute -bottom-10 left-20 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Estamos para ayudarte
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contacto</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Escribinos o llamanos, con gusto te asesoramos para que tu viaje sea perfecto.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Info column */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Oficina Porlamar</h2>
                <p className="text-gray-500 text-sm">VT A Margarita, C.A. — RIF J-40233467-2</p>
              </div>

              {[
                {
                  icon: MapPin,
                  label: 'Dirección',
                  content: 'Av. Paseo Cultural Ramón Vásquez Brito, C.C. Boulevard, Planta Alta Local B-12, Porlamar, Estado Nueva Esparta',
                },
                {
                  icon: Phone,
                  label: 'Teléfonos',
                  content: '(0295) 416-7083 / 263-1741',
                },
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  content: '+58 424 834-1521',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  content: 'info@amargarita.com',
                },
                {
                  icon: Clock,
                  label: 'Horario',
                  content: 'Lun–Vie: 8:00 am – 5:00 pm\nSáb: 9:00 am – 1:00 pm',
                },
              ].map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#4a43c4]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{content}</p>
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/584248341521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Escribinos por WhatsApp
              </a>
            </div>

            {/* Form column */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Envianos un mensaje</h2>
                <p className="text-gray-500 text-sm mb-6">Te respondemos a la brevedad posible.</p>

                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">¡Mensaje enviado!</h3>
                    <p className="text-gray-500 text-sm mb-6">Nos pondremos en contacto a la brevedad.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="text-sm text-[#4a43c4] font-medium hover:underline"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Nombre <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Apellido <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="apellido"
                          value={form.apellido}
                          onChange={handleChange}
                          required
                          placeholder="Tu apellido"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="tu@email.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Teléfono
                        </label>
                        <input
                          name="telefono"
                          type="tel"
                          value={form.telefono}
                          onChange={handleChange}
                          placeholder="+58 000 000 0000"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Asunto <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="asunto"
                        value={form.asunto}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition bg-white"
                      >
                        <option value="">Seleccioná un asunto</option>
                        {ASUNTOS.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Comentario <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="comentario"
                        value={form.comentario}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Contanos en qué podemos ayudarte..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/30 focus:border-[#4a43c4] transition resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 bg-[#4a43c4] hover:bg-[#3d37a8] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      {sending ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
