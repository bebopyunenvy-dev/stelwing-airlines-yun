'use client';

import 'leaflet/dist/leaflet.css';
import {
  Car,
  Clock,
  Coffee,
  Package,
  Truck,
  Utensils,
  Wifi,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import {
  AmenityKey,
  MAX_PRICE,
  MIN_PRICE,
  PRICE_STEP,
  amenityLabels,
} from '../interfaces/constants';

// 動態載入 react-leaflet，避免 SSR 問題
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

interface FilterSidebarProps {
  priceMin: number;
  onPriceMinChange: (value: number) => void;
  priceMax: number;
  onPriceMaxChange: (value: number) => void;
  selectedRatings: number[];
  onSelectedRatingsChange: (ratings: number[]) => void;
  selectedAmenities: AmenityKey[];
  onSelectedAmenitiesChange: (amenities: AmenityKey[]) => void;
  onClearAll: () => void;
  isMobileOpen: boolean;
  onClose: () => void;
}

const amenityIconMap: Record<AmenityKey, React.ReactNode> = {
  wifi: <Wifi size={16} />,
  parking: <Car size={16} />,
  cafe: <Coffee size={16} />,
  restaurant: <Utensils size={16} />,
  shuttleService: <Truck size={16} />,
  frontDesk24h: <Clock size={16} />,
  luggageStorage: <Package size={16} />,
};

const amenityList: {
  key: AmenityKey;
  label: string;
  icon: React.ReactNode;
}[] = Object.entries(amenityLabels).map(([key, label]) => ({
  key: key as AmenityKey,
  label: label,
  icon: amenityIconMap[key as AmenityKey],
}));

// 五個飯店資料，position 明確指定 [lat, lng] 型別
const hotels: { name: string; position: [number, number] }[] = [
  { name: 'Toyoko Inn Narita Airport', position: [35.7816224, 140.3839713] },
  { name: 'Hotel Nikko Narita', position: [35.7842417, 140.3799583] },
  { name: 'Premier Narita', position: [35.7842634, 140.3515176] },
  { name: 'Grand Hotel Narita', position: [35.7972366, 140.391444] },
  { name: 'Narita Tobu Hotel', position: [35.7799868, 140.380852] },
];

export default function FilterSidebar({
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  selectedRatings,
  onSelectedRatingsChange,
  selectedAmenities,
  onSelectedAmenitiesChange,
  onClearAll,
  isMobileOpen,
  onClose,
}: FilterSidebarProps) {
  const [isClient, setIsClient] = useState(false);
  const ratings = [4.5, 4, 3.5, 3] as const;

  // 確保只在 client 端渲染地圖
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 修復 Leaflet 圖標問題
  useEffect(() => {
    if (isClient) {
      import('leaflet').then((L) => {
        delete (L as any).Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      });
    }
  }, [isClient]);

  const toggleRating = (rate: number) => {
    const updated = selectedRatings.includes(rate)
      ? selectedRatings.filter((r) => r !== rate)
      : [...selectedRatings, rate];
    onSelectedRatingsChange(updated);
  };

  const clearAll = () => {
    onClearAll();
  };

  const minPercent = ((priceMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent = ((priceMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 w-70 space-y-9 z-50 
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:h-full lg:overflow-y-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* 地圖區域 */}
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full h-64 relative">
          {isClient ? (
            <MapContainer
              center={[35.784, 140.38]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {hotels.map((hotel, idx) => (
                <Marker key={idx} position={hotel.position}>
                  <Popup>{hotel.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              載入地圖中...
            </div>
          )}
        </div>

        {/* 篩選內容 */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-7 h-190 w-full space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">篩選條件</h3>
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              清除全部
            </button>
          </div>

          {/* 價格滑桿 */}
          <div>
            <h4 className="font-semibold mb-10 text-gray-700">
              價格範圍（每晚）
            </h4>
            <div className="relative h-10 flex items-center">
              <div className="absolute w-full h-5 bg-black rounded-full py" />
              <div
                className="absolute h-1 bg-black rounded"
                style={{
                  left: `${Math.min(minPercent, maxPercent)}%`,
                  right: `${100 - Math.max(minPercent, maxPercent)}%`,
                }}
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={priceMin}
                onChange={(e) => onPriceMinChange(Number(e.target.value))}
                className="absolute w-full h-6 bg-transparent appearance-none z-20 pointer-events-auto cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:rounded-lg [&::-moz-range-thumb]:border-0"
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={priceMax}
                onChange={(e) => onPriceMaxChange(Number(e.target.value))}
                className="absolute w-full h-6 bg-transparent appearance-none z-10 pointer-events-auto cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
              />

              <div className="absolute top-0 w-full h-0 pointer-events-none">
                <div
                  className="absolute bg-[#DCBB87] text-white text-xs px-2 py-1 rounded-lg"
                  style={{ left: `${minPercent}%`, bottom: '100%' }}
                >
                  TWD {priceMin.toLocaleString()}
                </div>
                <div
                  className="absolute bg-[#DCBB87] text-white text-xs px-4 py-1 rounded-lg -translate-x-3/3 whitespace-nowrap"
                  style={{ left: `${maxPercent}%`, bottom: '100%' }}
                >
                  TWD {priceMax.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 評分 */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">最低評分</h4>
            <ul className="space-y-1 text-gray-700 text-sm">
              {ratings.map((r) => (
                <li key={r}>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(r)}
                      onChange={() => toggleRating(r)}
                      className="w-4 h-4 text-[#DCBB87] rounded-lg focus:ring-[#DCBB87]"
                    />
                    {r}星以上
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* 設施 */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">設施</h4>
            <ul className="space-y-1 text-gray-700 text-sm">
              {amenityList.map(({ key, label, icon }) => (
                <li key={key}>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(key)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedAmenities, key]
                          : selectedAmenities.filter((a) => a !== key);
                        onSelectedAmenitiesChange(updated);
                      }}
                      className="w-4 h-4 text-[#DCBB87] rounded focus:ring-[#DCBB87]"
                    />
                    <span className="flex items-center gap-1">
                      {icon} {label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden w-full py-3 bg-[#DCBB87] rounded-lg font-semibold text-white hover:bg-[#C49D67] transition"
        >
          關閉篩選
        </button>
      </div>
    </>
  );
}
