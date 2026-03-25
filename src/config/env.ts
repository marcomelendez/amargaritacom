export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api',
  mediaUrl: process.env.NEXT_PUBLIC_MEDIA_URL ?? 'http://127.0.0.1:8000',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  reservationsEmail: process.env.RESERVATIONS_EMAIL ?? 'reservas@amargarita.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '584124841521',
  isProd: process.env.NODE_ENV === 'production',
}

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.svg'
  if (path.startsWith('http')) return path
  return `${env.mediaUrl}/${path.replace(/^\//, '')}`
}
