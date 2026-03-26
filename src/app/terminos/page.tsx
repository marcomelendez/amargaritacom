import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Leé los términos y condiciones de uso de los servicios de Amargarita.com — VT A Margarita, C.A.',
}

const SECTIONS = [
  {
    title: 'Identificación de la empresa',
    content: `Los términos "nosotros", "la empresa", "Agencia" y "Amargarita.com" hacen referencia a VT A Margarita, C.A., RIF Nº J-40233467-2, domiciliada en Av. Paseo Cultural Ramón Vásquez Brito, C.C. Boulevard, Piso 2 Local B-12, Porlamar, Isla de Margarita. El término "El Cliente" se refiere a los usuarios del sitio web o contratantes de los servicios.`,
  },
  {
    title: 'Marco legal',
    content: `Estos términos y condiciones se rigen conforme a la legislación venezolana vigente, incluyendo la Constitución de la República Bolivariana de Venezuela y la Ley de Turismo (Gaceta Oficial Nº 5.889, del 31 de julio de 2008).`,
  },
  {
    title: 'Precios y ofertas',
    content: `Las tarifas y ofertas publicadas en nuestro sitio web son actualizadas periódicamente y podrían sufrir modificaciones sin previo aviso. Sin embargo, los servicios ya contratados y confirmados mantienen el precio acordado al momento de la reserva.`,
  },
  {
    title: 'Reservaciones',
    content: `Los únicos medios para reservar y contratar con Amargarita.com serán, de forma escrita, a través de nuestro sitio web, chat incluido en dicha página o correo electrónico de la empresa, o de forma telefónica a través de nuestros números oficiales. Para confirmar toda reserva es requisito indispensable el pago total del servicio contratado, sin excepciones.`,
  },
  {
    title: 'Cancelaciones o modificaciones',
    content: `En caso de cancelaciones por desistimiento o cambio de decisión de "El Cliente", las condiciones son determinadas por los proveedores finales (hoteles, aerolíneas, operadores de excursiones, etc.) quienes establecen sus propias políticas de penalización.\n\nEl cargo por servicio cobrado por Amargarita.com no está sujeto a reintegro, dado que este monto representa los servicios de intermediación ya prestados por la agencia.`,
  },
  {
    title: 'Aceptación de términos',
    content: `La aceptación de estos términos y condiciones se produce mediante cualquiera de los siguientes actos: el pago parcial o total del servicio, la aceptación expresa de la factura o cotización emitida, o el uso efectivo de cualquiera de los servicios contratados.`,
  },
  {
    title: 'Responsabilidad de la empresa',
    content: `Amargarita.com actúa únicamente como intermediario entre "El Cliente" y los proveedores de servicios turísticos (hoteles, aerolíneas, operadores de transporte, etc.). En tal carácter, la empresa declina toda responsabilidad por cualquier daño, herida, accidente, pérdida, robo, retraso o irregularidades que pudieran ocurrir durante la ejecución de los servicios contratados, incluyendo casos de fuerza mayor o hechos fortuitos ajenos a nuestra gestión.`,
  },
  {
    title: 'Contacto',
    content: `Para consultas sobre estos términos o cualquier aspecto de nuestros servicios, puede comunicarse con nosotros en:\n\nTeléfono: +58 295 416-7083\nEmail: info@amargarita.com\nHorario: Lunes a Viernes, 8:00 am — 5:00 pm`,
  },
]

export default function TerminosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#4a43c4] pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 left-1/3 w-80 h-80 rounded-full bg-white" />
          <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-white" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto">
            Acuerdos entre &quot;El Cliente&quot; y Amargarita.com — VT A Margarita, C.A.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          {/* Intro card */}
          <div className="bg-[#4a43c4]/5 border border-[#4a43c4]/20 rounded-2xl p-6 mb-10 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#4a43c4]/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#4a43c4]" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Al contratar cualquiera de nuestros servicios, usted acepta los siguientes términos y
              condiciones en su totalidad. Le recomendamos leerlos detenidamente antes de realizar
              cualquier reserva.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {SECTIONS.map((section, i) => (
              <div
                key={section.title}
                className="bg-white rounded-2xl border border-gray-100 p-7"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-[#4a43c4] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h2 className="text-base font-bold text-gray-800">{section.title}</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line pl-10">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs mt-10">
            © VT A Margarita, C.A. — Todos los derechos reservados.
          </p>
        </div>
      </section>
    </div>
  )
}
