'use client';

import {
  Car,
  Clock,
  Coffee,
  Heart,
  MapPin,
  Package,
  Star,
  Truck,
  Utensils,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AmenityKey, amenityLabels } from '../interfaces/constants';

interface HotelResultCardProps {
  hotel: {
    id: number;
    name: string;
    engName?: string;
    location: string;
    distance?: string;
    rating: number;
    price: number;
    image?: string;
    amenities?: AmenityKey[];
    busFree?: boolean;
  };
  onBookClick: () => void;
  isBooking?: boolean;
}

export default function HotelResultCard({
  hotel,
  onBookClick,
  isBooking = false,
}: HotelResultCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(hotel.id));
  }, [hotel.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = isFavorite
      ? favorites.filter((id: number) => id !== hotel.id)
      : [...favorites, hotel.id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const iconsMap: Record<AmenityKey, React.ReactNode> = {
    wifi: <Wifi size={14} />,
    parking: <Car size={14} />,
    cafe: <Coffee size={14} />,
    restaurant: <Utensils size={14} />,
    frontDesk24h: <Clock size={14} />,
    luggageStorage: <Package size={14} />,
    shuttleService: <Truck size={14} />,
  };

  return (
    /* 金框緊貼修正：使用 border-[#DCBB87] 並確保 rounded 一致 */
    <div className="flex flex-col md:flex-row w-full items-stretch rounded shadow-sm overflow-hidden ">
      {/* 圖片區域：高度會隨右側內容自動撐滿 */}
      <div
        className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 cursor-pointer"
        onClick={() => hotel.image && setIsImageModalOpen(true)}
      >
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            無圖片
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs text-white font-semibold">
          <Star size={12} className="text-[#DCBB87] fill-[#DCBB87]" />
          {hotel.rating.toFixed(1)}
        </div>
      </div>

      {/* 內容區域 */}
      <div className="flex flex-col flex-1 p-5 relative min-w-0 bg-white">
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-gray-100 flex items-center justify-center shadow-sm z-10"
        >
          <Heart
            size={16}
            fill={isFavorite ? '#DCBB87' : 'none'}
            stroke={isFavorite ? '#DCBB87' : '#999999'}
          />
        </button>

        <div className="pr-8">
          <h3 className="text-gray-900 font-bold text-lg leading-tight">
            {hotel.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{hotel.engName} | Hotel</p>
        </div>

        <div className="flex flex-wrap items-center text-gray-500 text-[11px] gap-2 mt-3">
          <div className="flex items-center gap-1">
            <MapPin size={12} /> {hotel.location}
          </div>
          {hotel.busFree && (
            <span className="bg-[#DCBB87] text-white px-2 py-0.5 rounded font-bold text-[9px]">
              免費接駁
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {hotel.amenities?.map(
            (key) =>
              iconsMap[key] && (
                <div
                  key={key}
                  className="bg-gray-50 border border-gray-100 p-1.5 text-gray-600"
                >
                  {iconsMap[key]}
                </div>
              )
          )}
        </div>

        <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50 md:border-none">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              ${hotel.price.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 uppercase">/night</span>
          </div>
          <button
            onClick={onBookClick}
            disabled={isBooking}
            className="rounded-lg px-8 py-2 text-sm font-bold bg-[#1E2A33] text-[#DCBB87] border border-[#DCBB87] hover:bg-[#2c3e4a] transition-all"
          >
            {isBooking ? '...' : '預訂'}
          </button>
        </div>
      </div>

      {/* 圖片預覽彈窗 */}
      {isImageModalOpen && hotel.image && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex justify-center items-center backdrop-blur-sm p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={hotel.image}
              alt="preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
