import { NextResponse } from 'next/server'
import type { CheckoutPayload } from '@/types/checkout'

export async function POST(req: Request) {
  try {
    const data: CheckoutPayload = await req.json()
    
    // Aquí iría el guardado real en la base de datos y envío de correos.
    // Simulamos un retraso de red
    await new Promise(r => setTimeout(r, 1200))

    const randomSuffix = Math.floor(10000 + Math.random() * 90000)
    const bookingId = `AM-${randomSuffix}`

    return NextResponse.json({ 
      success: true, 
      booking_id: bookingId,
      message: 'Reserva registrada exitosamente'
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}
