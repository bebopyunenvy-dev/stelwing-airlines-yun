// HotelResultCard.tsx
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
import { useRouter } from 'next/navigation';
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
    roomType?: string;
    notes?: string;
  };
  onBookClick: () => void;
  isBooking?: boolean;
}

export default function HotelResultCard({
  hotel,
  onBookClick,
  isBooking = false,
}: HotelResultCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const favorites: number[] = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    setIsFavorite(favorites.includes(hotel.id));
  }, [hotel.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites: number[] = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    const updated = isFavorite
      ? favorites.filter((id) => id !== hotel.id)
      : [...favorites, hotel.id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const iconsMap: Record<AmenityKey, React.ReactNode> = {
    wifi: <Wifi size={16} />,
    parking: <Car size={16} />,
    cafe: <Coffee size={16} />,
    restaurant: <Utensils size={16} />,
    frontDesk24h: <Clock size={16} />,
    luggageStorage: <Package size={16} />,
    shuttleService: <Truck size={16} />,
  };

  return (
    <div className="flex w-full max-w-4xl items-center px-4 bg-white transition rounded">
      <div
        className="relative w-50 h-40 flex-shrink-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (hotel.image) setIsImageModalOpen(true);
        }}
      >
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover object-center rounded-lg"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                '/images/hotel/fallback.jpeg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
            無圖片
          </div>
        )}

        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center gap-1 text-xs text-white">
          <Star size={12} color="#DCBB87" fill="#DCBB87" />
          {hotel.rating.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 gap-2 relative">
        {/* ❤️ 收藏按鈕（未收藏：金色外框 / 已收藏：金色實心） */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white border border-gray-300 flex justify-center items-center transition"
        >
          <Heart
            size={16}
            fill={isFavorite ? '#DCBB87' : 'none'}
            stroke={isFavorite ? '#DCBB87' : '#999999'}
          />
        </button>

        <h3 className="text-gray-900 font-semibold text-lg">{hotel.name}</h3>
        {hotel.engName && (
          <p className="text-sm text-gray-600">{hotel.engName}</p>
        )}

        <div className="flex items-center text-gray-500 text-xs gap-1 mt-1">
          <MapPin size={12} /> {hotel.location}
          {hotel.distance && <span>・{hotel.distance}</span>}
          {hotel.busFree && (
            <span className="ml-2 px-2 py-0.5 rounded-lg bg-[#DCBB87] text-black font-semibold text-xs">
              免費接駁
            </span>
          )}
        </div>

        {hotel.notes && (
          <p className="text-gray-700 text-sm mt-1">{hotel.notes}</p>
        )}

        {hotel.amenities && (
          <div className="flex gap-2 mt-1">
            {hotel.amenities.map(
              (key) =>
                iconsMap[key] && (
                  <div
                    key={key}
                    className="bg-[#F1F1F1] rounded-lg p-1 flex items-center justify-center hover:bg-[#E0D7C1] transition-all duration-200"
                    style={{ width: 28, height: 28 }}
                    title={amenityLabels[key]}
                  >
                    {iconsMap[key]}
                  </div>
                )
            )}
          </div>
        )}

        <div className="flex justify-end items-center gap-3 mt-auto">
          <div className="text-lg font-bold text-gray-900">
            ${hotel.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mb-0.5">/night</div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookClick();
            }}
            disabled={isBooking}
            className={`px-4 py-1 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer ${
              isBooking
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-[#1E2A33] text-[#DCBB87] hover:bg-[#303D49] border-2 border-[#DCBB87]'
            }`}
          >
            {isBooking ? '處理中...' : '預訂'}
          </button>
        </div>
      </div>

      {isImageModalOpen && hotel.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] p-4">
            <Image
              src={hotel.image}
              alt={hotel.name + ' - 放大預覽'}
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-5 right-6 text-white text-xl p-2 rounded-full bg-black/50 hover:bg-black/80 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
