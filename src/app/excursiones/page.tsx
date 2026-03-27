"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ExcursionList from '@/components/ExcursionList';
import { excursionService } from '@/services/travelService';
import type { Excursion } from '@/types';

export default function ExcursionsPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    excursionService.getAll()
      .then((data) => {
        setExcursions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load excursions:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative h-[400px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 overflow-hidden bg-[#1B3C73]">
          <Image 
            src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1920&auto=format&fit=crop" 
            alt="Excursiones en Margarita" 
            fill
            className="object-cover opacity-70 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl px-4 pt-16">
          <span className="inline-flex items-center justify-center space-x-2 bg-[#FF6B00] px-4 py-1.5 rounded-full text-white font-bold text-sm mb-4 shadow-lg uppercase tracking-wider">
               ⚓ Aventura
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg">
            Excursiones en Margarita
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            Paseos en bote, safaris y experiencias inolvidables en la Perla del Caribe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold mb-8 border-b border-gray-200 pb-4 text-[#1B3C73]">
            Catálogo de <span className="text-[#FF6B00]">Paseos</span>
          </h2>

          <ExcursionList excursions={excursions} loading={loading} />

          {!loading && excursions.length === 0 && (
             <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                <p className="text-gray-500 text-lg">No encontramos excursiones disponibles por el momento.</p>
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
