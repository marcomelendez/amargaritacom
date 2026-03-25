'use client'

import { useState } from 'react'
import { CalendarDays, Users, ChevronDown, Search } from 'lucide-react'

export default function MobileSearchForm() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [passengers, setPassengers] = useState('')

  return (
    <div className="md:hidden mx-4 -mt-4 mb-4">
      <div className="bg-white rounded-2xl shadow-md p-4">
        {/* Fecha Entrada */}
        <div className="flex items-center gap-3 border-b border-gray-200 py-3">
          <CalendarDays className="w-5 h-5 text-[#4a43c4] shrink-0" />
          <input
            type="text"
            placeholder="Fecha Entrada"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            onFocus={(e) => { e.target.type = 'date' }}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
            className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        {/* Fecha Salida */}
        <div className="flex items-center gap-3 border-b border-gray-200 py-3">
          <CalendarDays className="w-5 h-5 text-[#4a43c4] shrink-0" />
          <input
            type="text"
            placeholder="Fecha Salida"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            onFocus={(e) => { e.target.type = 'date' }}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
            className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        {/* Pasajeros */}
        <div className="flex items-center gap-3 border-b border-gray-200 py-3">
          <Users className="w-5 h-5 text-[#4a43c4] shrink-0" />
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full text-sm text-gray-700 outline-none bg-transparent appearance-none"
          >
            <option value="" disabled>Pasajeros</option>
            <option value="1">1 Pasajero</option>
            <option value="2">2 Pasajeros</option>
            <option value="3">3 Pasajeros</option>
            <option value="4">4 Pasajeros</option>
            <option value="5">5+ Pasajeros</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </div>

        {/* Submit button */}
        <button
          type="button"
          className="mt-4 w-full bg-gradient-to-r from-[#7854F6] to-[#4a43c4] text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <Search className="w-4 h-4" />
          Encuentra tu Hotel
        </button>
      </div>
    </div>
  )
}
