import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Panel de Administración — amargarita.com',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#4a43c4] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">
              Panel de Administración
            </span>
            <span className="text-white/40">—</span>
            <span className="text-white/70 text-sm">amargarita.com</span>
          </div>
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Volver al sitio
          </Link>
        </div>
      </header>

      {/* Nav sub-bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-6">
          <Link
            href="/admin/hotels"
            className="text-sm font-medium text-[#4a43c4] hover:text-[#3730a3] transition-colors"
          >
            Hoteles
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
