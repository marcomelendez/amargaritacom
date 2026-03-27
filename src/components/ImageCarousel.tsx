"use client"

import React, { useState } from "react";
import Link from "next/link";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  href: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt, href }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No images</span>
      </div>
    );
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (slideIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full h-full group/carousel">
      <Link href={href} className="block w-full h-full">
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/carousel:scale-105"
        />
      </Link>

      {images.length > 1 && (
        <>
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, slideIndex) => (
              <div
                key={slideIndex}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                  currentIndex === slideIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={(e) => goToSlide(slideIndex, e)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
