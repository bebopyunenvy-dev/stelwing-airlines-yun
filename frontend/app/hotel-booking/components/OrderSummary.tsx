'use client';

import { Calendar, Moon, Users } from 'lucide-react';
import Image from 'next/image';
import { HotelDetailData } from '../interfaces/HotelDetailData';

interface OrderSummaryProps {
  hotel: HotelDetailData;
  formData: {
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
  };
  totalPrice: number;
}

export default function OrderSummary({
  hotel,
  formData,
  totalPrice,
}: OrderSummaryProps) {
  return (
    <aside className="bg-white rounded-lg shadow-md p-8 w-full lg:w-1/3 border border-gray-200 h-fit">
      {/* 飯店圖片 */}
      <Image
        src={hotel.images?.[0] || '/images/hotel/default.jpeg'}
        alt={hotel.name}
        width={400}
        height={160}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      <h3 className="text-xl font-bold text-gray-800 mb-4">訂單摘要</h3>
      <div className="space-y-3 text-gray-700 text-sm">
        <div className="flex justify-between">
          <span>飯店名稱</span>
          <span className="font-medium">{hotel.name}</span>
        </div>
        <div className="flex justify-between">
          <span>床型需求</span>
          <span>{hotel.roomType}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            入住
          </span>
          <span>{formData.checkIn}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            退房
          </span>
          <span>{formData.checkOut}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <Moon size={14} />
            住宿晚數
          </span>
          <span>{formData.nights} 晚</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <Users size={14} />
            人數
          </span>
          <span>{formData.guests} 人</span>
        </div>

        <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between text-lg font-bold text-gray-900">
          <span>總金額</span>
          <span>${totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}
