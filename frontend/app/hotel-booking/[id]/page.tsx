'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { HotelBookingStepper } from '../components/HotelBookingStepper';
import HotelDetailBookingCard from '../components/HotelDetailBookingCard';
import HotelDetailContent from '../components/HotelDetailContent';
import { HotelDetailData } from '../interfaces/HotelDetailData';
import { convertHotelToDetailData } from '../interfaces/hotelUtils';
import { allMockHotels } from '../interfaces/mockHotels';
import { calculateNights, formatDateLocal } from '../utils/dateUtils';

const fetchHotelData = (id: string): HotelDetailData | null => {
  const hotel = allMockHotels.find((h) => h.id === parseInt(id));
  return hotel ? convertHotelToDetailData(hotel) : null;
};

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  const hotel = fetchHotelData(hotelId);

  const [formData, setFormData] = React.useState({
    checkIn: '',
    checkOut: '',
    nights: 0,
    guests: 2,
    rooms: 1,
    name: '',
    phone: '',
    email: '',
    roomType: '',
    smokingPreference: '禁菸房',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const savedSearch = JSON.parse(
      localStorage.getItem('booking_search') || '{}'
    );

    const today = formatDateLocal(new Date());
    const threeDaysLater = formatDateLocal(
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );

    const checkIn = savedSearch.checkin || today;
    const checkOut = savedSearch.checkout || threeDaysLater;

    setFormData({
      checkIn,
      checkOut,
      nights: calculateNights(checkIn, checkOut),
      guests: savedSearch.guests || 2,
      rooms: savedSearch.rooms || 1,
      name: '',
      phone: '',
      email: '',
      roomType: 'King Size Bed',
      smokingPreference: '禁菸房',
    });

    setIsReady(true);
  }, []);

  if (!hotel)
    return <div className="text-center text-white p-10">飯店不存在</div>;

  if (!isReady)
    return <div className="text-center text-white p-10">載入中...</div>;

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };

    if (field === 'checkIn' || field === 'checkOut') {
      const checkIn = field === 'checkIn' ? value : formData.checkIn;
      const checkOut = field === 'checkOut' ? value : formData.checkOut;

      if (new Date(checkOut) < new Date(checkIn)) {
        newFormData.checkOut = checkIn;
      }

      newFormData.nights = calculateNights(checkIn, newFormData.checkOut);
    }

    setFormData(newFormData);

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '請輸入姓名';
    if (!formData.phone.trim()) newErrors.phone = '請輸入電話';
    else if (!/^09\d{8}$/.test(formData.phone.replace(/-/g, '')))
      newErrors.phone = '請輸入有效的手機號碼 (09xxxxxxxx)';
    if (!formData.email.trim()) newErrors.email = '請輸入電子郵件';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = '請輸入有效的電子郵件';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // ✅ 修正：儲存完整的表單資料，包含 roomType 和 smokingPreference
    localStorage.setItem(
      'booking_final',
      JSON.stringify({
        ...formData, // 包含所有表單欄位
        hotelId: hotel.id,
        hotelName: hotel.name,
        price: hotel.price,
        image: hotel.images?.[0],
      })
    );

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/hotel-booking/${hotel.id}/payment`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[url('/images/hotel/bg2.jpeg')] bg-cover bg-center sm:bg-top bg-no-repeat bg-black/70 bg-blend-darken pb-10">
      <div className="flex flex-col w-full min-h-screen px-4 md:px-8 pt-6">
        <nav className="text-sm text-gray-300 mb-6 max-w-6xl mx-auto w-full">
          <Link
            href="/"
            className="hover:underline hover:text-white transition"
          >
            首頁
          </Link>{' '}
          &gt;{' '}
          <Link
            href="/hotel-booking/search"
            className="hover:underline hover:text-white transition"
          >
            飯店列表
          </Link>{' '}
          &gt; <span className="text-white font-medium">{hotel.name}</span>
        </nav>

        <HotelBookingStepper currentStep={1} />

        <div className="w-full max-w-6xl mx-auto bg-white backdrop-blur-sm rounded-lg shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 mt-6">
          <HotelDetailContent
            hotel={hotel}
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <HotelDetailBookingCard
            hotel={hotel}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="text-start mt-4">
          <button
            onClick={() => router.back()}
            className="border-2 border-[#DCBB87] hover:bg-[#DCBB87] text-white font-semibold px-8 py-1 rounded-full transition-all hover:shadow-lg active:scale-95"
          >
            上一步
          </button>
        </div>
      </div>
    </div>
  );
}
