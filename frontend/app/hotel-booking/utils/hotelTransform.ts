// utils/hotelTransform.ts
import {
  AmenityKey,
  Hotel,
  HotelCardData,
  HotelDetailData,
} from '../interfaces/types';

export const transformHotelToCardData = (hotel: Hotel): HotelCardData => ({
  id: hotel.id,
  name: hotel.engName || hotel.name,
  engName: hotel.engName,
  location: hotel.location,
  rating: hotel.rating,
  price: hotel.price,
  image: hotel.image,
  distance: hotel.distance,
  address: hotel.address,
  roomType: hotel.roomType,
  notes: hotel.notes,
  busFree: hotel.busFree,
  amenities: hotel.amenities.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    {} as Partial<Record<AmenityKey, boolean>>
  ),
});

export const convertHotelToDetailData = (hotel: Hotel): HotelDetailData => ({
  id: hotel.id,
  name: hotel.name,
  engName: hotel.engName || hotel.name,
  rating: hotel.rating,
  price: hotel.price,
  location: hotel.location,
  roomType: hotel.roomType || '標準房',
  busFree: hotel.busFree ?? false,
  images: [hotel.image, hotel.image],
  reviewCount: 128,
  description: '此飯店位於成田機場附近，提供免費接駁服務與舒適住宿體驗。',
  address: hotel.address || hotel.location,
  contact: '03-1234-5678',
  email: 'info@hotel.com',
  amenityKeys: hotel.amenities,
});
