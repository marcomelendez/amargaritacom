const logos = [
  { name: 'Bancisco', display: 'Bancisco' },
  { name: 'BDV', display: 'BDV' },
  { name: 'PayPal', display: 'PayPal' },
  { name: 'Elle', display: '2Elle' },
  { name: 'Binance', display: '◆ Binance' },
]

export default function PaymentLogos() {
  return (
    <section className="py-6 px-4 bg-gray-50">
      <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide font-medium">
        Métodos de pago aceptados
      </p>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
        {logos.map(({ name, display }) => (
          <span
            key={name}
            className="text-sm font-semibold text-gray-400 select-none"
          >
            {display}
          </span>
        ))}
      </div>
    </section>
  )
}
