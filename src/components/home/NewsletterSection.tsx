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
    <div className="py-14 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
        Ahorra tiempo y dinero!
      </h2>
      <p className="text-[#8BA4E6]/70 mb-8 text-base">
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
  )
}
