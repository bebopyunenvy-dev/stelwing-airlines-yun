'use client';

import {
  Car,
  Clock,
  Coffee,
  MapPin,
  Package,
  Star,
  Truck,
  Utensils,
  Wifi,
} from 'lucide-react';

import Image from 'next/image';

import { useRouter } from 'next/navigation'; // ⭐ 改這行

import { useState } from 'react';

import { AmenityKey, amenityLabels } from '../interfaces/constants';

import { HotelCardData } from '../interfaces/HotelCardData';

interface HotelCardProps {
  hotel: HotelCardData;

  showDetails?: boolean;
}

export default function HotelCard({
  hotel,

  showDetails = false,
}: HotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const router = useRouter(); // ✅ 現在不會報錯

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsFavorite(!isFavorite);
  };

  const goToDetail = () => {
    router.push(`/search?id=${hotel.id}`);
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
    <div
      onClick={goToDetail}
      className="relative flex-shrink-0 w-[200px] h-[384px] rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="absolute inset-0">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            圖片從後端載入
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-between p-4 z-10">
        <div className="flex justify-end">
          <div className="bg-black/70 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm backdrop-blur-sm shadow-lg">
            <Star size={14} color="#DCBB87" fill="#DCBB87" />

            <span className="font-semibold">{hotel.rating}</span>
          </div>
        </div>

        <div className="space-y-20">
          <h3 className="text-white font-bold text-lg drop-shadow-lg text-center h-25 leading-snug flex justify-center">
            {hotel.name}
          </h3>

          <div className="flex items-start gap-2 text-white text-sm mb-0">
            <MapPin size={16} className="mt-0.5 flex-shrink-0 drop-shadow-lg" />

            <div className="drop-shadow-lg">
              <div className="font-medium">{hotel.location}</div>

              {hotel.distance && (
                <div className="text-xs text-white/90 mt-0.5">
                  {hotel.distance}
                </div>
              )}
            </div>
          </div>

          {hotel.amenities && showDetails && (
            <div className="flex gap-2">
              {(Object.keys(hotel.amenities) as AmenityKey[]).map(
                (key) =>
                  hotel.amenities?.[key] && (
                    <div
                      key={key}
                      className="bg-[#F1F1F1] rounded-md p-1 flex items-center justify-center hover:bg-[#E0D7C1] transition-all duration-200"
                      style={{ width: 28, height: 28 }}
                      title={amenityLabels[key]}
                    >
                      {iconsMap[key]}
                    </div>
                  )
              )}
            </div>
          )}

          {showDetails && (
            <div className="flex items-end justify-between pt-2">
              <div>
                <div className="text-l font-bold text-white drop-shadow-lg">
                  TWD {hotel.price.toLocaleString()}
                </div>

                <div className="text-xs text-white/80 drop-shadow-lg">每晚</div>
              </div>

              <button
                className="bg-[#D4A574] hover:bg-[#C69563] text-white font-semibold px-4 py-1 rounded-lg text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
                onClick={(e) => e.stopPropagation()} // 阻止按鈕點擊觸發卡片跳轉
              >
                預訂
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
