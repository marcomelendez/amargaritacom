import React from 'react';
import Link from 'next/link';
import ImageCarousel from './ImageCarousel';
import type { Excursion } from '@/types';
import { resolveMediaUrl } from '@/config/env';

interface ExcursionCardProps {
  excursion: Excursion;
}

const ExcursionCard: React.FC<ExcursionCardProps> = ({ excursion }) => {
  const galleryUrls = excursion.gallery?.map((m) => m.url).filter(Boolean) ?? [];
  const validImages = galleryUrls.length > 0 ? galleryUrls : (excursion.image_url ? [excursion.image_url] : []);
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop';
  const images = validImages.map(url => resolveMediaUrl(url) || PLACEHOLDER);
  if (images.length === 0) images.push(PLACEHOLDER);
  const destinationName = excursion.destination?.name ?? null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-64 overflow-hidden group/image-container">
        <ImageCarousel
          images={images}
          alt={excursion.name}
          href={`/excursiones/${excursion.slug}`}
        />
        {excursion.type && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1B3C73] shadow-sm z-20 pointer-events-none capitalize">
            {excursion.type}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-[#1B3C73] line-clamp-2 group-hover:text-[#FF6B00] transition-colors flex-1 mr-2">
            {excursion.name}
          </h3>
        </div>

        {destinationName && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <span className="mr-2">📍</span>
            <span>{destinationName}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
          {excursion.short_description ?? excursion.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">desde</span>
            <span className="text-2xl font-bold text-[#1B3C73]">${excursion.price}</span>
          </div>

          <Link
            href={`/excursiones/${excursion.slug}`}
            className="bg-[#FF6B00] hover:bg-[#e66000] text-white !text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg text-sm"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExcursionCard;
