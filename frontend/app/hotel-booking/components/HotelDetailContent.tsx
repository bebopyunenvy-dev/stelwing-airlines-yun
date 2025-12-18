'use client';

import {
  BusFront,
  Car,
  Clock,
  Coffee,
  Heart,
  Luggage,
  MapPin,
  Star,
  User,
  Utensils,
  Wifi,
} from 'lucide-react';
import * as React from 'react';
import { HotelDetailData } from '../interfaces/HotelDetailData';
import { AmenityKey } from '../interfaces/constants';

interface HotelDetailContentProps {
  hotel: HotelDetailData;
  formData: {
    name: string;
    phone: string;
    email: string;
    roomType: string;
    smokingPreference: string;
    nights: number;
    guests: number;
    rooms: number;
    price?: number;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
}

const amenityIcons: Record<AmenityKey, React.ReactNode> = {
  wifi: <Wifi size={16} className="text-gray-600" />,
  parking: <Car size={16} className="text-gray-600" />,
  cafe: <Coffee size={16} className="text-gray-600" />,
  restaurant: <Utensils size={16} className="text-gray-600" />,
  frontDesk24h: <Clock size={16} className="text-gray-600" />,
  luggageStorage: <Luggage size={16} className="text-gray-600" />,
  shuttleService: <BusFront size={16} className="text-gray-600" />,
};

export default function HotelDetailContent({
  hotel,
  formData,
  errors,
  onInputChange,
}: HotelDetailContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const starColor = 'text-[#DCBB87]';

    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={starColor}
            size={18}
            fill="currentColor"
          />
        ))}
        {hasHalfStar && (
          <Star
            key="half"
            className={starColor}
            size={18}
            fill="url(#halfGradient)"
          />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" size={18} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 lg:pr-8">
      {/* 標題與收藏 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {hotel.name}
          </h1>
          <p className="text-xl font-medium text-gray-500 mb-4">
            {hotel.engName}
          </p>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 bg-gray-50 shadow-3xl rounded-full hover:bg-gray-100 transition"
          aria-label="加入願望清單"
        >
          <Heart
            size={28}
            className={
              isFavorite ? 'text-[#DCBB87] fill-[#DCBB87]' : 'text-gray-400'
            }
          />
        </button>
      </div>

      {/* 評分與位置 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          {renderRating(hotel.rating)}
          <span className="text-lg font-semibold text-gray-700">
            {hotel.rating.toFixed(1)} ({hotel.reviewCount} 則評論)
          </span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <MapPin size={18} />
          <span className="text-md">{hotel.location}</span>
        </div>
      </div>

      {/* 登記者資料 */}
      <div className="space-y-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
            <User size={24} />
            主要登記者資料
          </h3>
          <div className="space-y-4 p-6 rounded-lg">
            {/* 姓名 */}
            <div>
              <label className="text-sm font-medium block mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="請輸入姓名"
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* 電話 */}
            <div>
              <label className="text-sm font-medium block mb-1">
                連絡電話 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="09xxxxxxxx"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium block mb-1">
                電子郵件 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* 特殊需求 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">特殊需求</h3>
          <p className="text-sm text-gray-600 mb-8">
            選擇您偏好的選項（視實際狀況安排）。
          </p>

          <div className="grid grid-cols-2 gap-12">
            {/* 吸煙偏好 */}
            <div>
              <label className="text-base font-semibold block mb-4">
                吸煙偏好（需視現場狀況安排）
              </label>
              <div className="space-y-3">
                {/* 禁煙 */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.smokingPreference === '禁煙房'
                        ? 'border-[#DCBB87]'
                        : 'border-gray-400'
                    }`}
                  >
                    {formData.smokingPreference === '禁煙房' && (
                      <span className="w-2 h-2 rounded-full bg-[#DCBB87]" />
                    )}
                  </span>
                  <span className="text-sm text-gray-700">禁煙房</span>
                  <input
                    type="radio"
                    name="smokingPreference"
                    value="禁煙房"
                    className="hidden"
                    checked={formData.smokingPreference === '禁煙房'}
                    onChange={(e) =>
                      onInputChange('smokingPreference', e.target.value)
                    }
                  />
                </label>

                {/* 吸煙 */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.smokingPreference === '吸煙房'
                        ? 'border-[#DCBB87]'
                        : 'border-gray-400'
                    }`}
                  >
                    {formData.smokingPreference === '吸煙房' && (
                      <span className="w-2 h-2 rounded-full bg-[#DCBB87]" />
                    )}
                  </span>
                  <span className="text-sm text-gray-700">吸煙房</span>
                  <input
                    type="radio"
                    name="smokingPreference"
                    value="吸煙房"
                    className="hidden"
                    checked={formData.smokingPreference === '吸煙房'}
                    onChange={(e) =>
                      onInputChange('smokingPreference', e.target.value)
                    }
                  />
                </label>
              </div>
            </div>

            {/* 床型需求 */}
            <div>
              <label className="text-base font-semibold block mb-4">
                床型需求（需視現場狀況安排）
              </label>
              <div className="space-y-3">
                {/* 大床房 */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.roomType === 'King Size Bed'
                        ? 'border-[#DCBB87]'
                        : 'border-gray-400'
                    }`}
                  >
                    {formData.roomType === 'King Size Bed' && (
                      <span className="w-2 h-2 rounded-full bg-[#DCBB87]" />
                    )}
                  </span>
                  <span className="text-sm text-gray-700">大床</span>
                  <input
                    type="radio"
                    name="roomType"
                    value="King Size Bed"
                    className="hidden"
                    checked={formData.roomType === 'King Size Bed'}
                    onChange={(e) => onInputChange('roomType', e.target.value)}
                  />
                </label>

                {/* 雙床房 */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.roomType === 'Twin Beds'
                        ? 'border-[#DCBB87]'
                        : 'border-gray-400'
                    }`}
                  >
                    {formData.roomType === 'Twin Beds' && (
                      <span className="w-2 h-2 rounded-full bg-[#DCBB87]" />
                    )}
                  </span>
                  <span className="text-sm text-gray-700">兩床</span>
                  <input
                    type="radio"
                    name="roomType"
                    value="Twin Beds"
                    className="hidden"
                    checked={formData.roomType === 'Twin Beds'}
                    onChange={(e) => onInputChange('roomType', e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 半星漸變色 */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="#DCBB87" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
