export interface ReservationData {
  locator: string
  title: string
  type: string
  date: string
  adults: number
  children: number
  name: string
  email: string
  phone: string
  totalPrice: number
}

export function generateReservationEmail(data: ReservationData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pre-Reserva - Amargarita</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background-color: #1B3C73; padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
    .header p { margin: 10px 0 0 0; color: #8BA4E6; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #333333; margin-bottom: 20px; }
    .locator-box { background-color: #fff5ed; border: 1px solid #FFE4CC; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px; }
    .locator-box p { margin: 0 0 5px 0; font-size: 12px; color: #FF6B00; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
    .locator-box h2 { margin: 0; font-size: 28px; color: #FF6B00; letter-spacing: 2px; }
    .details { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .details th { text-align: left; padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 13px; font-weight: normal; width: 40%; }
    .details td { text-align: right; padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold; }
    .total-row th, .total-row td { border-bottom: none; padding-top: 20px; font-size: 18px; color: #1B3C73; }
    .instructions { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
    .instructions h3 { margin: 0 0 10px 0; font-size: 14px; color: #333333; }
    .instructions p { margin: 0 0 10px 0; font-size: 13px; color: #666666; line-height: 1.5; }
    .instructions p:last-child { margin-bottom: 0; }
    .footer { background-color: #f4f5f7; padding: 20px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>amargarita.com</h1>
      <p>Solicitud de Reserva</p>
    </div>
    <div class="content">
      <p class="greeting">¡Hola, <strong>${data.name}</strong>!</p>
      <p style="color: #666; font-size: 15px; line-height: 1.5; margin-bottom: 25px;">
        Hemos recibido tu solicitud de reserva exitosamente. A continuación, te compartimos los detalles de tu solicitud y el localizador asociado.
      </p>

      <div class="locator-box">
        <p>Localizador Temporal</p>
        <h2>${data.locator}</h2>
      </div>

      <table class="details">
        <tr>
          <th>Servicio Solicitado</th>
          <td>${data.title} (${data.type})</td>
        </tr>
        <tr>
          <th>Fecha Tentativa</th>
          <td>${data.date}</td>
        </tr>
        <tr>
          <th>Pasajeros</th>
          <td>${data.adults} Adulto(s)${data.children > 0 ? `, ${data.children} Niño(s)` : ''}</td>
        </tr>
        <tr>
          <th>A nombre de</th>
          <td>${data.name}</td>
        </tr>
        <tr>
          <th>Teléfono / WhatsApp</th>
          <td>${data.phone}</td>
        </tr>
        <tr class="total-row">
          <th>Total Estimado</th>
          <td>$${data.totalPrice.toFixed(2)} USD</td>
        </tr>
      </table>

      <div class="instructions">
        <h3>¿Qué sigue ahora?</h3>
        <p>1. Un experto de nuestro equipo revisará la disponibilidad de las fechas solicitadas.</p>
        <p>2. Te contactaremos vía WhatsApp o correo electrónico para confirmar el itinerario.</p>
        <p>3. Te enviaremos el link de pago seguro para hacer oficial tu reserva.</p>
      </div>
      
      <p style="text-align: center; color: #666; font-size: 13px;">
        Si tienes alguna duda urgente, puedes responder a este correo o escribirnos a nuestro WhatsApp.
      </p>
    </div>
    <div class="footer">
      <p>Amargarita.com - Todos los derechos reservados &copy; 2024</p>
      <p>CC. Centro Comercial, Local 5, Porlamar, Isla Margarita</p>
    </div>
  </div>
</body>
</html>
  `
}
