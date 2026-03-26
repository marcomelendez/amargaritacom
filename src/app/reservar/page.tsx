import { CheckoutPageClient } from './_components/CheckoutPageClient'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ReservarPage({ searchParams }: Props) {
  // Awaiting searchParams para Next.js 15+
  const resolvedParams = await searchParams;
  
  const orderParams = {
    hotelSlug: String(resolvedParams.hotel_slug || ''),
    hotelName: String(resolvedParams.hotel_name || ''),
    checkIn: String(resolvedParams.check_in || ''),
    checkOut: String(resolvedParams.check_out || ''),
    planId: String(resolvedParams.plan_id || ''),
    planName: String(resolvedParams.plan_name || ''),
    price: String(resolvedParams.price || ''),
    formattedPrice: String(resolvedParams.formatted_price || ''),
    pricingMode: String(resolvedParams.pricing_mode || '')
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Completar Reserva</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Estás a un paso de confirmar tu estadía en Isla de Margarita.</p>
        </div>
        
        <CheckoutPageClient initialOrderParams={orderParams} />
      </div>
    </div>
  )
}
