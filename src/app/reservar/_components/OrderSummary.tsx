import { ShoppingCart, Calendar, MapPin, Tag } from 'lucide-react'

interface Props {
  orderUrlParams: {
    hotelSlug: string;
    hotelName?: string;
    checkIn: string;
    checkOut: string;
    planId: string;
    planName?: string;
    price: string;
    formattedPrice: string;
  }
}

export function OrderSummary({ orderUrlParams }: Props) {
  const { hotelName, checkIn, checkOut, formattedPrice, planName } = orderUrlParams;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-[#4a43c4]" />
        Resumen de Reserva
      </h3>

      <div className="space-y-4 mb-6 text-sm">
        <div className="flex gap-3 text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">{hotelName || 'Hotel Seleccionado'}</p>
          </div>
        </div>

        <div className="flex gap-3 text-gray-600">
          <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">{checkIn} → {checkOut}</p>
            <p className="text-xs text-gray-400">Fechas confirmadas</p>
          </div>
        </div>

        <div className="flex gap-3 text-gray-600">
          <Tag className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">{planName || 'Plan Estándar'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center text-sm font-semibold text-gray-500 mb-1">
          <span>Impuestos</span>
          <span>Incluidos</span>
        </div>
        <div className="flex justify-between items-end mt-2">
          <span className="font-bold text-gray-800">Total a pagar</span>
          <span className="text-2xl font-black text-[#4a43c4]">{formattedPrice || '$ 0.00'}</span>
        </div>
      </div>

      <button 
        type="submit" 
        form="checkout-form"
        className="w-full bg-[#FE6604] hover:bg-[#e55a00] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm shadow-orange-200"
      >
        Confirmar Reserva
      </button>
      <p className="text-center text-[11px] text-gray-400 mt-4">
        🔒 Tu información personal y de reserva está protegida y encriptada de forma segura
      </p>
    </div>
  )
}
