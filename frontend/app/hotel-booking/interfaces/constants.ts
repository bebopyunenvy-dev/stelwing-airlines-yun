// constants.ts
export type AmenityKey =
  | 'wifi'
  | 'parking'
  | 'cafe'
  | 'restaurant'
  | 'frontDesk24h'
  | 'luggageStorage'
  | 'shuttleService';

export const amenityLabels: Record<AmenityKey, string> = {
  wifi: 'Wi-Fi',
  parking: '停車場',
  cafe: '咖啡廳',
  restaurant: '餐廳',
  frontDesk24h: '24小時櫃檯',
  luggageStorage: '行李寄放',
  shuttleService: '接駁服務',
};

// 飯店價格上下限
export const MIN_PRICE = 3000;
export const PRICE_STEP = 1000;
export const MAX_PRICE = 30000;
