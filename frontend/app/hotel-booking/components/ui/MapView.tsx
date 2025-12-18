'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { HotelCardData } from '../../interfaces/HotelCardData';

// === 修復 Leaflet 圖示（只執行一次）===
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MapViewProps {
  hotels: HotelCardData[];
}

// === 自動縮放地圖到所有標記 ===
function MapAutoFit({ hotels }: { hotels: HotelCardData[] }) {
  const map = useMap();

  useEffect(() => {
    const validHotels = hotels.filter(
      (h): h is HotelCardData & { lat: number; lng: number } =>
        Boolean(h.lat && h.lng)
    );

    if (validHotels.length === 0) return;

    const bounds = L.latLngBounds(validHotels.map((h) => [h.lat, h.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }, [hotels, map]);

  return null;
}

// === 主元件 ===
export default function MapView({ hotels }: MapViewProps) {
  const defaultCenter: [number, number] = [35.7648, 140.3855];

  // 過濾有座標的飯店
  const validHotels = hotels.filter(
    (h): h is HotelCardData & { lat: number; lng: number } =>
      Boolean(h.lat && h.lng)
  );

  // SSR 安全
  if (typeof window === 'undefined') {
    return (
      <div className="h-[600px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
        <p className="text-gray-600">載入地圖中...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full rounded-xl shadow-lg"
      style={{ border: '1px solid #e5e7eb' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapAutoFit hotels={validHotels} />

      {validHotels.map((hotel) => (
        <Marker
          key={hotel.id}
          position={[hotel.lat, hotel.lng]}
          eventHandlers={{
            click: () => {
              // 可選：點擊跳轉詳細頁
              // const params = new URLSearchParams(window.location.search);
              // window.location.href = `/hotel/${hotel.id}?${params.toString()}`;
            },
          }}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[180px]">
              <h3 className="font-bold text-sm text-gray-800 truncate">
                {hotel.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{hotel.location}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500">Star</span>
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div>
              <p className="text-sm font-bold text-blue-600 mt-1">
                ¥ {hotel.price.toLocaleString()}{' '}
                <span className="text-xs font-normal text-gray-500">/晚</span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
