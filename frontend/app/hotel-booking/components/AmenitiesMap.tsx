// components/AmenitiesMap.tsx

import {
  Car,
  Clock,
  Coffee,
  Package,
  Truck,
  Utensils,
  Wifi,
} from 'lucide-react';
import React from 'react';
// 導入您的 AmenityKey
import { AmenityKey } from '../interfaces/constants';

/**
 * 設施圖標映射：將 AmenityKey 映射到 React 組件 (需要 JSX)
 */
export const amenityIconMap: Record<AmenityKey, React.ReactNode> = {
  wifi: <Wifi size={20} className="text-[#303D49]" />,
  parking: <Car size={20} className="text-[#303D49]" />,
  cafe: <Coffee size={20} className="text-[#303D49]" />,
  restaurant: <Utensils size={20} className="text-[#303D49]" />,
  shuttleService: <Truck size={20} className="text-[#303D49]" />,
  frontDesk24h: <Clock size={20} className="text-[#303D49]" />,
  luggageStorage: <Package size={20} className="text-[#303D49]" />,
};

// 您也可以導出一個獲取圖標的簡單函式
export function getAmenityIcon(key: AmenityKey): React.ReactNode {
  return amenityIconMap[key];
}
