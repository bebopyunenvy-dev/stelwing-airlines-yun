import { HotelDetailData } from './HotelDetailData';
import { Hotel } from './mockHotels';

/**
 * 將 Hotel (列表頁資料) 轉換為 HotelDetailData (詳情頁資料)
 */
export const convertHotelToDetailData = (hotel: Hotel): HotelDetailData => {
  return {
    id: hotel.id,
    name: hotel.name,
    engName: hotel.engName || hotel.name,
    rating: hotel.rating,
    price: hotel.price,
    location: hotel.location,
    roomType: hotel.roomType || '經典商務房',
    busFree: hotel.busFree ?? false,
    images: [hotel.image, hotel.image], // 可依需求擴充多張圖
    reviewCount: 0, // 模擬資料
    description: '此飯店為模擬詳情，提供自動轉換示範。',
    address: hotel.location,
    contact: '',
    email: '',
    amenityKeys: hotel.amenities,
  };
};
