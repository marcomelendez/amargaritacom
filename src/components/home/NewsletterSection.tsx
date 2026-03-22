'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
    {/* ── MOBILE VERSION ─────────────────────────────────── */}
    <section className="hidden py-8 px-4">
      <div className="bg-[#7854F6] rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white text-center mb-2">
          Ahorra Tiempo y Dinero!
        </h2>
        <p className="text-sm text-white/80 text-center mb-4">
          Registrate para que te enviemos las mejores ofertas
        </p>

        <form onSubmit={handleSubmit} className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-1 bg-white rounded-l-full px-4 py-3 text-sm outline-none placeholder-gray-400 text-gray-700"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-gradient-to-r from-[#FE6604] to-[#F59C0B] text-white text-sm font-semibold px-5 py-3 rounded-r-full disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-white/90 text-sm text-center mt-3">¡Gracias! Te avisaremos cuando haya ofertas.</p>
        )}
        {status === 'error' && (
          <p className="text-red-300 text-sm text-center mt-3">Ocurrió un error. Intentá de nuevo.</p>
        )}

        <p className="text-xs text-white/60 text-center mt-3">
          **La información suministrada es confidencial y no es compartida con terceros.
        </p>
      </div>
    </section>

    {/* ── DESKTOP VERSION ─────────────────────────────────── */}
    <div className="hidden md:block py-14 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
        Ahorra tiempo y dinero!
      </h2>
      <p className="text-black/70 mb-8 text-base">
        Registrate para que conozcas las mejores ofertas
      </p>

      {status === 'success' ? (
        <div className="bg-white/10 text-white border border-white/20 rounded-2xl px-6 py-4 inline-block">
          ¡Gracias! Te avisaremos cuando haya ofertas especiales.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-1 px-5 py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm bg-white text-[#7854F6] placeholder:text-[#8C7DEB] shadow-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white hover:bg-[#8BA4E6]/10 text-[#7854F6] font-semibold px-7 py-3 rounded-full transition-all hover:scale-105 disabled:opacity-60 whitespace-nowrap shadow-md"
          >
            {status === 'loading' ? 'Enviando...' : 'Registrarme'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-300 text-sm mt-2">Ocurrió un error. Intentá de nuevo.</p>
      )}
    </div>
    </>
  )
}
