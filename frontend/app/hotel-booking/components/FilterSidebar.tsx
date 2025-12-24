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

const hotels: { name: string; position: [number, number] }[] = [
  { name: 'Toyoko Inn Narita Airport', position: [35.7816224, 140.3839713] },
  { name: 'Hotel Nikko Narita', position: [35.7842417, 140.3799583] },
  { name: 'Premier Narita', position: [35.7842634, 140.3515176] },
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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        className={`fixed lg:sticky lg:top-4 inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out bg-white lg:bg-transparent overflow-y-auto h-full lg:h-auto ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 lg:p-0 space-y-6">
          {/* 地圖區域 - 增加 key 確保地圖不報錯 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 h-64 relative overflow-hidden">
            {isClient && (
              <MapContainer
                key="hotel-map"
                center={[35.784, 140.38]}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {hotels.map((h, i) => (
                  <Marker key={i} position={h.position}>
                    <Popup>{h.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">篩選條件</h3>
              <button onClick={onClearAll} className="text-xs text-gray-400">
                清除全部
              </button>
            </div>

            {/* 價格滑桿修正版 */}
            <div className="pt-10">
              <h4 className="font-semibold mb-12 text-gray-700">
                價格範圍 (每晚)
              </h4>
              <div className="relative h-1 mx-2 bg-gray-200 rounded-full">
                <div
                  className="absolute h-full bg-black rounded-full"
                  style={{
                    left: `${minPercent}%`,
                    right: `${100 - maxPercent}%`,
                  }}
                />

                {/* 滑桿本體：圓圈改為金色 bg-[#DCBB87] */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={priceMin}
                  onChange={(e) =>
                    onPriceMinChange(
                      Math.min(Number(e.target.value), priceMax - PRICE_STEP)
                    )
                  }
                  className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-40
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:bg-[#DCBB87] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                />
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={priceMax}
                  onChange={(e) =>
                    onPriceMaxChange(
                      Math.max(Number(e.target.value), priceMin + PRICE_STEP)
                    )
                  }
                  className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-40
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:bg-[#DCBB87] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                />

                {/* 文字標籤：向上移動 mb-4 確保不擋住金色圓圈 */}
                <div className="absolute top-0 w-full pointer-events-none">
                  <div
                    className="absolute bottom-full mb-4 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${minPercent}%` }}
                  >
                    <span className="bg-[#DCBB87] text-white text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap shadow-sm">
                      ${priceMin.toLocaleString()}
                    </span>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#DCBB87]" />
                  </div>

                  <div
                    className="absolute bottom-full mb-4 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${maxPercent}%` }}
                  >
                    <span className="bg-[#DCBB87] text-white text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap shadow-sm">
                      ${priceMax.toLocaleString()}
                    </span>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#DCBB87]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 評分與設施 */}
            <div className="space-y-4 pt-4">
              <h4 className="font-semibold text-gray-700">最低評分</h4>
              <div className="grid gap-2">
                {[4.5, 4, 3.5, 3].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(r)}
                      onChange={() =>
                        onSelectedRatingsChange(
                          selectedRatings.includes(r)
                            ? selectedRatings.filter((x) => x !== r)
                            : [...selectedRatings, r]
                        )
                      }
                      className="w-4 h-4 accent-[#DCBB87]"
                    />
                    {r}星以上
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="font-semibold text-gray-700">設施</h4>
              <div className="grid gap-2">
                {Object.entries(amenityLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(key as AmenityKey)}
                      onChange={(e) =>
                        onSelectedAmenitiesChange(
                          e.target.checked
                            ? [...selectedAmenities, key as AmenityKey]
                            : selectedAmenities.filter((a) => a !== key)
                        )
                      }
                      className="w-4 h-4 accent-[#DCBB87]"
                    />
                    <span className="flex items-center gap-2">
                      {amenityIconMap[key as AmenityKey]} {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-full py-3 bg-[#DCBB87] rounded-lg font-bold text-white"
          >
            顯示結果
          </button>
        </div>
      </div>
    </>
  );
}
