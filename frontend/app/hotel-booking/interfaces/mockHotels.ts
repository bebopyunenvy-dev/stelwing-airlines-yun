// mockHotels.ts
import { AmenityKey } from './constants';

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
}

export const allMockHotels: Hotel[] = [
  {
    id: 1,
    name: '東京成田機場旅館',
    engName: 'Toyoko Inn Narita Airport | Hotel',
    location: '第二航廈・機場內',
    rating: 3.4,
    price: 3500,
    image: '/images/hotel/room1.jpeg',
    amenities: [
      'wifi',
      'parking',
      'cafe',
      'restaurant',
      'frontDesk24h',
      'luggageStorage',
    ],
    busFree: true,
    roomType: 'King Size Bed',
  },
  {
    id: 2,
    name: '成田日航酒店',
    engName: 'Hotel Nikko Narita',
    location: '距離機場約 0.3公里',
    rating: 4.9,
    price: 5500,
    image: '/images/hotel/room2.jpeg',
    amenities: [
      'wifi',
      'parking',
      'cafe',
      'restaurant',
      'frontDesk24h',
      'luggageStorage',
      'shuttleService',
    ],
    busFree: true,
    roomType: 'King Size Bed',
  },
  {
    id: 3,
    name: '普雷米爾飯店',
    engName: 'Premier Narita |',
    location: '距離機場約 0.2公里',
    rating: 4.7,
    price: 10000,
    image: '/images/hotel/room3.jpeg',
    amenities: [
      'wifi',
      'parking',
      'cafe',
      'restaurant',
      'frontDesk24h',
      'luggageStorage',
      'shuttleService',
    ],
    busFree: true,
    roomType: 'King Size Bed',
  },
  {
    id: 4,
    name: 'Grand Hotel Narita',
    engName: 'Grand Hotel Narita',
    location: '距離機場約 0.2公里',
    rating: 4.8,
    price: 12000,
    image: '/images/hotel/room4.jpeg',
    amenities: [
      'wifi',
      'parking',
      'cafe',
      'restaurant',
      'frontDesk24h',
      'luggageStorage',
      'shuttleService',
    ],
    busFree: true,
    roomType: 'King Size Bed',
  },
  {
    id: 5,
    name: '成田東武酒店',
    engName: 'Narita Tobu Hotel',
    location: '距離機場約 0.3公里',
    rating: 4.7,
    price: 18000,
    image: '/images/hotel/room5.jpeg',
    amenities: [
      'wifi',
      'parking',
      'cafe',
      'restaurant',
      'frontDesk24h',
      'luggageStorage',
      'shuttleService',
    ],
    busFree: true,
    roomType: 'King Size Bed',
  },
];
