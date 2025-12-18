import { Hotel, HotelCardData } from '../interfaces/types';

/**
 * 將原始 Hotel 轉成首頁用的 HotelCardData
 */
export function transformHotelToCardData(hotel: Hotel): HotelCardData {
  return {
    id: hotel.id,
    name: hotel.engName || hotel.name, // 優先使用英文名稱
    engName: hotel.engName,
    location: hotel.location,
    rating: hotel.rating,
    price: hotel.price,
    image: hotel.image,
    distance: hotel.location, // 如果要顯示距離，可用 location 或自訂欄位
    amenities: {
      wifi: hotel.amenities?.includes('wifi'),
      parking: hotel.amenities?.includes('parking'),
      cafe: hotel.amenities?.includes('cafe'),
      restaurant: hotel.amenities?.includes('restaurant'),
      frontDesk24h: hotel.amenities?.includes('frontDesk24h'),
      luggageStorage: hotel.amenities?.includes('luggageStorage'),
      shuttleService: hotel.amenities?.includes('shuttleService'),
    },
    roomType: hotel.roomType,
    notes: hotel.notes,
    busFree: hotel.busFree,
  };
}
