import type { MediaItem, Review } from './common';

export interface Destination {
    id: number;
    name: string;
    slug: string;
}

export interface Package {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    short_description: string | null;
    other_conditions: string | null;
    destination: Destination | null;
    price: number;
    duration_days: number;
    is_active: boolean;
    recommended: boolean;
    available_from: string | null;
    available_to: string | null;
    valid_until: string | null;
    image_url: string;
    image_thumb: string;
    gallery: MediaItem[];
    reviews: Review[];
}

export interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
    image?: string;
}

export interface Excursion {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    short_description: string | null;
    destination: Destination | null;
    type: string;
    price: number;
    is_active: boolean;
    available_from: string | null;
    available_to: string | null;
    image_url: string;
    image_thumb: string;
    gallery: MediaItem[];
    reviews: Review[];
}
