'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutForm } from './CheckoutForm'
import { OrderSummary } from './OrderSummary'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { CheckoutCustomer, CheckoutPayload } from '@/types/checkout'

interface Props {
  initialOrderParams: any
}

export function CheckoutPageClient({ initialOrderParams }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)
  const immediateBooking = initialOrderParams.pricingMode === 'instant'

  const handleSubmit = async (customer: CheckoutCustomer) => {
    setLoading(true)
    try {
      const payload: CheckoutPayload = {
        customer,
        order: {
          hotelSlug: initialOrderParams.hotelSlug,
          hotelName: initialOrderParams.hotelName,
          planId: Number(initialOrderParams.planId),
          planName: initialOrderParams.planName,
          checkIn: initialOrderParams.checkIn,
          checkOut: initialOrderParams.checkOut,
          price: Number(initialOrderParams.price),
          formattedPrice: initialOrderParams.formattedPrice
        }
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Error al procesar')
      
      const data = await res.json()
      setSuccessId(data.booking_id)
      
    } catch (error) {
      alert("Hubo un error procesando tu solicitud. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (successId) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-2xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">¡Reserva Solicitada!</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          {immediateBooking 
            ? "Tu solicitud ha sido recibida con éxito. Nuestro equipo te enviará los datos bancarios para concretar el pago a tu correo electrónico en un lapso no mayor a 24 horas."
            : "Hemos procesado tu intención de reserva. Por favor espera a que confirmemos la disponibilidad de los cupos antes de procesar el pago."}
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 inline-block min-w-[300px]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Localizador de Reserva</p>
          <p className="text-3xl font-black text-[#4a43c4] tracking-tight">{successId}</p>
        </div>
        <div>
          <button 
            onClick={() => router.push('/hoteles')}
            className="text-[#4a43c4] font-semibold hover:text-[#3d37a8] transition-colors"
          >
            ← Volver al catálogo de Hoteles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <CheckoutForm onSubmit={handleSubmit} isLoading={loading} immediateBooking={immediateBooking} />
      </div>
      <div className="lg:col-span-4">
        <OrderSummary orderUrlParams={initialOrderParams} />
        {loading && (
          <div className="mt-4 p-4 bg-white/60 backdrop-blur-md rounded-xl border border-[#4a43c4]/20 shadow-sm flex items-center justify-center gap-3 text-[#4a43c4] text-sm font-semibold">
            <Loader2 className="w-5 h-5 animate-spin" />
            Asegurando disponibilidad...
          </div>
        )}
      </div>
    </div>
  )
}
