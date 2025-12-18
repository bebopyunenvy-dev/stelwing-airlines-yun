'use client';

import { Calendar, Moon, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HotelBookingStepper } from '../../../components/HotelBookingStepper';
import { allMockHotels } from '../../../interfaces/mockHotels';
import { convertHotelToDetailData } from '../../../interfaces/hotelUtils';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 優先讀取完整訂單
    const complete = localStorage.getItem('booking_complete');
    const fallback = localStorage.getItem('booking_final');

    const raw = complete
      ? JSON.parse(complete)
      : fallback
        ? JSON.parse(fallback)
        : {};
    setData(raw);
    setMounted(true);
  }, []);

  const hotel = allMockHotels.find((h: any) => h.id === data.hotelId);
  const hotelInfo = hotel ? convertHotelToDetailData(hotel) : null;

  const totalPrice =
    (hotelInfo?.price || data.price || 0) *
    (data.nights || 1) *
    (data.rooms || 1);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black/50 flex items-center justify-center text-white">
        載入中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/hotel/bg2.jpeg')] bg-cover bg-center bg-no-repeat bg-black/50 bg-blend-darken flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-6xl">
        <HotelBookingStepper currentStep={3} />
      </div>

      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-2xl text-center mt-10">
        <h2 className="text-4xl font-bold text-[#D4A574] mb-6">預訂成功！</h2>
        <p className="text-lg text-gray-700 mb-8">
          感謝您的預訂，訂單確認信已寄送至
          <span className="font-bold">
            {' '}
            {data.payerInfo?.email || '您的信箱'}
          </span>
        </p>

        <Image
          src={hotelInfo?.images?.[0] || '/images/hotel/default.jpeg'}
          alt={hotelInfo?.name || '飯店圖片'}
          width={600}
          height={300}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />

        <div className="text-left space-y-4 text-gray-800">
          <div className="flex justify-between">
            <span>飯店名稱</span>
            <span className="font-bold">
              {data.hotelName || hotelInfo?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span>房型／床型</span>
            <span>{data.roomType}</span>
          </div>
          <div className="flex justify-between">
            <span>吸煙偏好</span>
            <span>{data.smokingPreference}</span>
          </div>
          <div className="flex justify-between">
            <span>入住日期</span>
            <span>{data.checkIn}</span>
          </div>
          <div className="flex justify-between">
            <span>退房日期</span>
            <span>{data.checkOut}</span>
          </div>
          <div className="flex justify-between">
            <span>
              <Moon className="inline w-4" /> 住宿晚數
            </span>
            <span>{data.nights} 晚</span>
          </div>
          <div className="flex justify-between">
            <span>
              <Users className="inline w-4" /> 人數
            </span>
            <span>{data.guests} 人</span>
          </div>
          <div className="flex justify-between">
            <span>房間數</span>
            <span>{data.rooms} 間</span>
          </div>
          {data.payerInfo && (
            <>
              <div className="flex justify-between">
                <span>訂購人</span>
                <span className="font-bold">{data.payerInfo.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>聯絡信箱</span>
                <span>{data.payerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span>手機</span>
                <span>{data.payerInfo.phone}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span>付款方式</span>
            <span>
              {data.paymentMethod === 'creditCard'
                ? `信用卡 ···· ${data.cardLast4 || '****'}`
                : 'Line Pay'}
            </span>
          </div>

          <div className="border-t-2 border-gray-300 pt-6 mt-6">
            <div className="flex justify-between text-2xl font-bold text-gray-900">
              <span>總金額</span>
              <span className="text-[#D4A574]">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('booking_complete');
            localStorage.removeItem('booking_final');
            router.push('/hotel-booking');
          }}
          className="w-full mt-10 py-4 bg-[#1F2E3C] text-white text-lg font-bold rounded-xl hover:bg-[#2d3d4c] transition"
        >
          返回飯店列表
        </button>
      </div>
    </div>
  );
}
