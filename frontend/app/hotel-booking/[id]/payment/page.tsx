'use client';

import { useRouter } from 'next/navigation';
import { HotelBookingStepper } from '../../components/HotelBookingStepper';
import OrderPage, { FormDataType } from '../../components/OrderPage';

export default function PaymentPage() {
  const router = useRouter();

  const handlePayment = (formData: FormDataType) => {
    if (typeof window === 'undefined') return;

    const savedBooking = localStorage.getItem('booking_final');
    if (!savedBooking) {
      alert('訂單資料遺失，請重新選擇房間');
      router.push('/hotel-booking');
      return;
    }

    const bookingData = JSON.parse(savedBooking);

    // 合併成完整訂單一完整訂單，成功頁直接讀這筆
    const completeOrder = {
      ...bookingData,
      payerInfo: {
        firstName: formData.firstName?.trim() || '',
        lastName: formData.lastName?.trim() || '',
        fullName:
          `${formData.lastName || ''}${formData.firstName || ''}`.trim(),
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
      },
      paymentMethod: formData.paymentMethod,
      cardLast4:
        formData.paymentMethod === 'creditCard' && formData.cardNumber
          ? formData.cardNumber.replace(/\s/g, '').slice(-4)
          : undefined,
      orderedAt: new Date().toISOString(),
    };

    // 存成新 key，成功頁專用
    localStorage.setItem('booking_complete', JSON.stringify(completeOrder));

    // 清除付款暫存
    localStorage.removeItem('payment_form');

    // 跳轉
    router.push(`/hotel-booking/${bookingData.hotelId}/payment/success`);
  };

  return (
    <div className="min-h-screen bg-[url('/images/hotel/bg2.jpeg')] bg-cover bg-center bg-no-repeat bg-black/50 bg-blend-darken flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-6xl">
        <HotelBookingStepper currentStep={2} />
      </div>

      <div className="w-full max-w-6xl mt-8">
        <OrderPage
          pageTitle="付款資訊"
          buttonText="確認付款"
          onSubmit={handlePayment}
        />
      </div>

      <div className="w-full max-w-6xl text-start mt-4">
        <button
          onClick={() => router.back()}
          className="border-2 border-[#DCBB87] hover:bg-[#DCBB87] text-white font-semibold px-8 py-2 rounded-full transition-all"
        >
          上一步
        </button>
      </div>
    </div>
  );
}
