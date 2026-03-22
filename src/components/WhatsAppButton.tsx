'use client'

import { env } from '@/config/env'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const href = `https://wa.me/${env.whatsappNumber}?text=Hola! Me interesa información sobre hoteles y paquetes en Isla Margarita`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3.5 shadow-lg flex items-center gap-2 transition-all hover:scale-105 group"
      aria-label="WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
      <span className="hidden group-hover:inline text-sm font-medium pr-1">¿Necesitás ayuda?</span>
    </a>
  )
}
