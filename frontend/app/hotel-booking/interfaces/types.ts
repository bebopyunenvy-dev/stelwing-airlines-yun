// app/hotel-booking/interfaces/types.ts

// 只放型別！不要放常量
export type AmenityKey =
  | 'wifi'
  | 'parking'
  | 'cafe'
  | 'restaurant'
  | 'frontDesk24h'
  | 'luggageStorage'
  | 'shuttleService';

export interface Hotel {
  id: number;
  name: string;
  engName?: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: AmenityKey[];
  busFree?: boolean;
  notes?: string;
  roomType?: string;
  distance?: string;
  address?: string;
}

export interface HotelCardData {
  id: number;
  name: string;
  engName?: string;
  rating: number;
  location: string;
  distance?: string;
  price: number;
  image?: string;
  lat?: number;
  lng?: number;
  address?: string;
  roomType?: string;
  notes?: string;
  busFree?: boolean;
  amenities?: Partial<Record<AmenityKey, boolean>>;
}

export interface HotelDetailData {
  id: number;
  name: string;
  engName?: string;
  rating: number;
  price: number;
  location: string;
  roomType: string;
  busFree: boolean;
  images: string[];
  reviewCount: number;
  description: string;
  address: string;
  contact: string;
  email: string;
  amenityKeys: AmenityKey[];
}
