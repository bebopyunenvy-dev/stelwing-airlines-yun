export type AmenityKey =
  | 'wifi'
  | 'parking'
  | 'cafe'
  | 'restaurant'
  | 'frontDesk24h'
  | 'luggageStorage'
  | 'shuttleService';

export interface HotelCardData {
  id: number;
  name: string;
  engName?: string;
  rating: number;
  location: string;
  distance?: string;
  price: number;
  image?: string;

  // 🔽 地圖座標欄位
  lat?: number;
  lng?: number;

  // 搜尋頁額外欄位
  address?: string;
  roomType?: string;
  notes?: string;
  busFree?: boolean;

  // ✅ 改成更通用的定義，避免 AmenityKey 索引錯誤
  amenities?: Partial<Record<AmenityKey, boolean>>;
}
