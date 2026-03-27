'use client'

import { useState } from 'react'
import { Calendar, Users, ChevronRight, X, CheckCircle2, Loader2, Info } from 'lucide-react'

interface Props {
  title: string
  price: number
  type: 'paquete' | 'excursion'
  itemId: number
  slug: string
}

export default function CatalogReservationWidget({ title, price, type, itemId, slug }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)

  // Form state
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const totalPax = adults + children
  const totalPrice = price * totalPax

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate backend delay (Server Action mock via Timeout)
    setTimeout(() => {
      const locator = `AMRG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setSuccessId(locator)
      setLoading(false)
    }, 1500)
  }

  return (
    <>
      {/* ── Tarjeta Lateral de Cotización Estática ── */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 sticky top-28">
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Precio base</p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-[#1B3C73]">${price.toFixed(2)}</span>
            <span className="text-gray-500 text-sm mb-1 line-through">${(price * 1.15).toFixed(2)}</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
            <CheckCircle2 size={14} /> Impuestos incluidos
          </p>
        </div>

        <div className="space-y-4 mb-6">
           <div className="bg-gray-50 p-3 rounded-xl flex items-start gap-3 border border-gray-100">
             <Info className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
             <p className="text-xs text-gray-600 leading-relaxed">
               Este {type} funciona bajo modalidad de <strong className="text-gray-800">reserva asistida</strong>. Envía tu solicitud y un experto de Amargarita te contactará para confirmar fechas y métodos de pago.
             </p>
           </div>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#F59C0B] hover:from-[#e66000] hover:to-[#d98a00] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <span>Solicitar Reserva</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ── Modal / Overlay de Pre-Reserva ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative overflow-y-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-[#1B3C73] p-5 text-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-lg leading-tight truncate px-2">{title}</h3>
                <span className="text-white/70 text-xs px-2 uppercase tracking-widest">{type}</span>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {successId ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud Recibida!</h2>
                  <p className="text-gray-600 mb-6">Hemos congelado tu cupo de forma temporal.</p>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 mx-auto w-max">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Localizador</p>
                    <p className="text-xl font-black text-[#FF6B00]">{successId}</p>
                  </div>

                  <p className="text-sm text-gray-500 w-4/5 mx-auto leading-relaxed">
                    Te enviamos un email a <strong>{email}</strong> con las instrucciones de pago. También te contactaremos vía WhatsApp pronto.
                  </p>

                  <button 
                    onClick={() => { setShowModal(false); setSuccessId(null) }}
                    className="mt-8 bg-[#1B3C73] hover:bg-[#142d57] text-white px-8 py-3 rounded-xl font-bold transition-colors"
                  >
                    Volver al catálogo
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 drop-shadow-sm">Fecha Tentativa</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 focus:ring-2 focus:ring-[#FF6B00]/30 outline-none text-sm text-gray-700 font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 drop-shadow-sm">Pasajeros</label>
                      <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-11">
                        <Users className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
                        <div className="pl-9 pr-2 flex items-center gap-2 w-full">
                          <input type="number" min="1" max="20" required value={adults} onChange={e => setAdults(Number(e.target.value))}
                            className="w-8 bg-transparent text-center font-bold text-sm outline-none" placeholder="Ad" title="Adultos" />
                          <span className="text-gray-300">|</span>
                          <input type="number" min="0" max="10" value={children} onChange={e => setChildren(Number(e.target.value))}
                            className="w-8 bg-transparent text-center font-bold text-sm outline-none" placeholder="Ni" title="Niños" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1 drop-shadow-sm">Nombre Completo</label>
                     <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Carlos Pérez"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#FF6B00]/30 outline-none text-sm font-medium" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1 drop-shadow-sm">Correo Electrónico</label>
                     <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#FF6B00]/30 outline-none text-sm font-medium" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1 drop-shadow-sm">Teléfono (WhatsApp)</label>
                     <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+58 424 000 0000"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#FF6B00]/30 outline-none text-sm font-medium" />
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-6 flex items-end justify-between">
                     <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Estimado</p>
                       <p className="text-2xl font-black text-[#1B3C73]">${totalPrice.toFixed(2)}</p>
                     </div>
                     <button type="submit" disabled={loading}
                       className="bg-[#1B3C73] hover:bg-[#142d57] text-white font-bold py-3.5 px-8 rounded-xl transition-colors min-w-[140px] flex justify-center"
                     >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar'}
                     </button>
                  </div>
                </form>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}
