'use server'

import { transporter } from '@/lib/mailer'
import { generateReservationEmail, ReservationData } from '@/emails/ReservationTemplate'

export async function submitCatalogReservation(data: {
  title: string
  type: string
  price: number
  date: string
  adults: number
  children: number
  name: string
  email: string
  phone: string
}) {
  try {
    const locator = `AMRG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    const reservationData: ReservationData = {
      ...data,
      locator,
      totalPrice: data.price * (data.adults + data.children),
    }

    const htmlContent = generateReservationEmail(reservationData)

    // Enviar correo al cliente
    await transporter.sendMail({
      from: '"Amargarita Reservas" <reservas@amargarita.com>',
      to: data.email,
      subject: `Solicitud de Reserva Recibida: ${data.title} [${locator}]`,
      html: htmlContent,
    })

    /* 
      // Opcionalmente, enviar un correo al equipo de ventas:
      await transporter.sendMail({
        from: '"Sistema Amargarita" <system@amargarita.com>',
        to: 'ventas@amargarita.com',
        subject: `NUEVA SOLICITUD - ${locator}`,
        html: `<p>Nueva solicitud de ${data.name} (${data.phone}) para ${data.title} el ${data.date}.</p>`,
      })
    */

    return {
      success: true,
      locator,
      message: 'Reserva registrada exitosamente'
    }
  } catch (error) {
    console.error('Error enviando email:', error)
    return {
      success: false,
      message: 'Hubo un error al procesar la reserva. Intente nuevamente.'
    }
  }
}
