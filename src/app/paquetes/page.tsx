"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PackageList from "@/components/PackageList";
import { packageService } from '@/services/travelService';
import type { Package } from '@/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packageService.getAll()
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load packages:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a] font-sans">
      <main className="flex-grow pt-0 pb-12 w-full">
        <section id="hero" className="relative w-full h-[400px] flex flex-col justify-center items-center text-center mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[#1B3C73]">
             <Image 
               src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop" 
               alt="Paquetes en Margarita" 
               fill
               className="object-cover opacity-60 mix-blend-overlay"
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl px-4 pt-20">
            <span className="inline-flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-medium text-sm mb-4 border border-white/30">
                🌴 Todo Incluido
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-lg">
              Paquetes en Isla Margarita
            </h1>
            <p className="text-lg text-white/90 drop-shadow-md font-medium max-w-2xl mx-auto">
              Descubre las mejores ofertas con alojamiento, comidas y traslados garantizados en la Perla del Caribe.
            </p>
          </div>
        </section>

        <div className="px-4 md:px-8 max-w-7xl mx-auto w-full">
          <section id="packages" className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-200 pb-4 text-[#1B3C73]">
              Ofertas <span className="text-[#FF6B00]">Disponibles</span>
            </h2>
            
            <PackageList packages={packages} loading={loading} />

            {packages.length === 0 && !loading && (
               <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg">No encontramos paquetes disponibles por el momento.</p>
               </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
