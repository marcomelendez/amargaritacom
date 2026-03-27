import React from 'react';
import Link from 'next/link';
import ImageCarousel from './ImageCarousel';
import type { Package } from '@/types';
import { resolveMediaUrl } from '@/config/env';

interface PackageCardProps {
  pkg: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const galleryUrls = pkg.gallery?.map((m) => m.url).filter(Boolean) ?? [];
  const validImages = galleryUrls.length > 0 ? galleryUrls : (pkg.image_url ? [pkg.image_url] : []);
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop';
  const images = validImages.map(url => resolveMediaUrl(url) || PLACEHOLDER);
  if (images.length === 0) images.push(PLACEHOLDER);
  const destinationName = pkg.destination?.name ?? null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden group/image-container">
        <ImageCarousel
          images={images}
          alt={pkg.name}
          href={`/paquetes/${pkg.slug}`}
        />
        {pkg.duration_days && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20 pointer-events-none">
            {pkg.duration_days} {pkg.duration_days === 1 ? 'día' : 'días'}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/paquetes/${pkg.slug}`} className="hover:underline decoration-[#FF6B00] flex-1 mr-2">
            <h3 className="text-xl font-bold text-[#1B3C73] group-hover:text-[#FF6B00] transition-colors">{pkg.name}</h3>
          </Link>
        </div>

        {destinationName && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <span className="mr-1">📍</span>
            <span>{destinationName}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {pkg.short_description ?? pkg.description}
        </p>

        <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Desde</span>
            <span className="text-2xl font-bold text-[#1B3C73]">${pkg.price}</span>
          </div>

          <Link
            href={`/paquetes/${pkg.slug}`}
            className="bg-[#FF6B00] hover:bg-[#e66000] text-white !text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg text-sm"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
