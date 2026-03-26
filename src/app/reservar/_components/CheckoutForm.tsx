'use client'

import { useState } from 'react'
import type { CheckoutCustomer } from '@/types/checkout'

interface Props {
  onSubmit: (data: CheckoutCustomer) => void;
  isLoading: boolean;
  immediateBooking: boolean;
}

export function CheckoutForm({ onSubmit, isLoading, immediateBooking }: Props) {
  const [formData, setFormData] = useState<CheckoutCustomer>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    notes: '',
    paymentMethod: immediateBooking ? 'transfer' : 'pending'
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Datos del Titular */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">1. Datos del Titular</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nombre *</label>
            <input 
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/20 focus:border-[#4a43c4] transition-all"
              placeholder="Ej. Juan"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Apellido *</label>
            <input 
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/20 focus:border-[#4a43c4] transition-all"
              placeholder="Ej. Pérez"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Correo Electrónico *</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/20 focus:border-[#4a43c4] transition-all"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Teléfono de Contacto *</label>
            <input 
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/20 focus:border-[#4a43c4] transition-all"
              placeholder="+58 ..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">País de Residencia *</label>
            <input 
              required
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/20 focus:border-[#4a43c4] transition-all"
              placeholder="Ej. Venezuela"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Solicitudes Especiales (Opcional)</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a43c4]/20 focus:border-[#4a43c4] transition-all resize-none"
              placeholder="Llegada temprana, cuna, alergias..."
            />
          </div>
        </div>
      </div>

      {/* Método de Pago */}
      {immediateBooking && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">2. Método de Pago</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${formData.paymentMethod === 'transfer' ? 'border-[#FE6604] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="transfer"
                checked={formData.paymentMethod === 'transfer'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'transfer' ? 'border-[#FE6604]' : 'border-gray-300'}`}>
                  {formData.paymentMethod === 'transfer' && <div className="w-2 h-2 rounded-full bg-[#FE6604]" />}
                </div>
                <span className="font-bold text-gray-800 text-sm">Depósito o Transferencia</span>
              </div>
              <p className="text-xs text-gray-500 pl-7">Transferencia bancaria directa a nuestras cuentas. Te daremos los datos al finalizar.</p>
            </label>

            <label className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${formData.paymentMethod === 'mobile_payment' ? 'border-[#FE6604] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="mobile_payment"
                checked={formData.paymentMethod === 'mobile_payment'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'mobile_payment' ? 'border-[#FE6604]' : 'border-gray-300'}`}>
                  {formData.paymentMethod === 'mobile_payment' && <div className="w-2 h-2 rounded-full bg-[#FE6604]" />}
                </div>
                <span className="font-bold text-gray-800 text-sm">Pago Móvil</span>
              </div>
              <p className="text-xs text-gray-500 pl-7">Rápido y automático. Aplican tasas del BCV en caso de moneda local.</p>
            </label>
          </div>
        </div>
      )}

      {/* Términos y Condiciones */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1 w-4 h-4 text-[#4a43c4] rounded border-gray-300 focus:ring-[#4a43c4]"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <div>
            <span className="text-sm font-semibold text-gray-800 block mb-1">Acepto los términos y condiciones *</span>
            <span className="text-xs text-gray-500 block">Debes aceptar nuestras políticas de reserva y cancelación para procesar la transacción. La confirmación final está sujeta a disponibilidad de camas confirmada por el hotel.</span>
          </div>
        </label>
      </div>
    </form>
  )
}
