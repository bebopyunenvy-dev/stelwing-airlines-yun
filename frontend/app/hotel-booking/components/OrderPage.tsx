'use client';

import { Calendar, Moon, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { mockHotelDetailData } from '../interfaces/HotelDetailData';

interface OrderPageProps {
  pageTitle: string;
  buttonText: string;
  onSubmit: (formData: FormDataType) => void;
}

export interface FormDataType {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  paymentMethod: 'creditCard' | 'linePay';
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

export interface DetailType {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  rooms: number;
  name: string;
  phone: string;
  email: string;
  roomType: string;
  smokingPreference: string;
  hotelId: number;
  hotelName: string;
  price: number;
  image: string;
}

export default function OrderPage({
  pageTitle,
  buttonText,
  onSubmit,
}: OrderPageProps) {
  const hotel = mockHotelDetailData;

  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'linePay'>(
    'creditCard'
  );

  const [formData, setFormData] = useState<FormDataType>({
    checkIn: '2025-11-20',
    checkOut: '2025-11-22',
    nights: 2,
    guests: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [detail, setDetail] = useState<DetailType>({
    checkIn: '2025-11-19',
    checkOut: '2025-11-22',
    nights: 3,
    guests: 2,
    rooms: 1,
    name: '',
    phone: '0980123123',
    email: 'yun@gmail.com',
    roomType: 'King Size Bed',
    smokingPreference: '禁煙房',
    hotelId: 1,
    hotelName: '東京成田機場旅館',
    price: 3500,
    image: '/images/hotel/room1.jpeg',
  });

  // ✅ 新增：錯誤狀態管理
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});

  const totalPrice = detail.price * detail.rooms * detail.nights;

  // ✅ 載入 booking_final 資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('booking_final');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDetail(parsed);
      }
    }
  }, []);

  // ✅ 載入暫存的付款表單資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPayment = localStorage.getItem('payment_form');
      if (savedPayment) {
        try {
          const parsed = JSON.parse(savedPayment);
          setFormData((prev) => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse payment form:', error);
        }
      }
    }
  }, []);

  // ✅ 自動暫存表單資料（當任何欄位改變時）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 只在有資料時才儲存
      const hasData =
        formData.firstName ||
        formData.lastName ||
        formData.email ||
        formData.phone ||
        formData.cardNumber ||
        formData.expiry ||
        formData.cvc;
      if (hasData) {
        localStorage.setItem('payment_form', JSON.stringify(formData));
      }
    }
  }, [formData]);

  // ✅ Email 驗證函數
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return '請輸入電子郵件';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return '請輸入有效的電子郵件格式（例：example@email.com）';
    }
    return '';
  };

  // ✅ 手機號碼驗證
  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return '請輸入手機號碼';
    }
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      return '請輸入有效的手機號碼（09xxxxxxxx）';
    }
    return '';
  };

  // ✅ 信用卡號驗證
  const validateCardNumber = (cardNumber: string): string => {
    if (!cardNumber.trim()) {
      return '請輸入信用卡號';
    }
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleaned)) {
      return '請輸入 16 位數字的信用卡號';
    }
    return '';
  };

  // ✅ 有效期限驗證
  const validateExpiry = (expiry: string): string => {
    if (!expiry.trim()) {
      return '請輸入有效期限';
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return '格式：MM/YY';
    }
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) {
      return '月份必須在 01-12 之間';
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return '信用卡已過期';
    }
    return '';
  };

  // ✅ CVC 驗證
  const validateCVC = (cvc: string): string => {
    if (!cvc.trim()) {
      return '請輸入 CVC';
    }
    if (!/^\d{3}$/.test(cvc)) {
      return '請輸入 3 位數字';
    }
    return '';
  };

  // ✅ 處理輸入變化
  const handleInputChange = (field: keyof FormDataType, value: string) => {
    let formattedValue = value;

    // 特殊格式處理
    if (field === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      formattedValue = cleaned
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (field === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      } else {
        formattedValue = cleaned;
      }
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (field === 'phone') {
      formattedValue = value.replace(/[^\d-]/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [field]: formattedValue });

    // 即時驗證（當欄位被 touched 時）
    if (touched[field]) {
      validateField(field, formattedValue);
    }
  };

  // ✅ 驗證單一欄位
  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'cardNumber':
        if (paymentMethod === 'creditCard') {
          error = validateCardNumber(value);
        }
        break;
      case 'expiry':
        if (paymentMethod === 'creditCard') {
          error = validateExpiry(value);
        }
        break;
      case 'cvc':
        if (paymentMethod === 'creditCard') {
          error = validateCVC(value);
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ✅ 處理欄位失焦
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, (formData as any)[field] || '');
  };

  // ✅ 處理表單提交
  const handleFormSubmit = () => {
    console.log('Submitting form with data:');

    // 標記所有欄位為 touched
    const fieldsToValidate = ['email', 'phone'];
    if (paymentMethod === 'creditCard') {
      fieldsToValidate.push('cardNumber', 'expiry', 'cvc');
    }

    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const value = (formData as any)[field] || '';
      const error = (() => {
        switch (field) {
          case 'email':
            return validateEmail(value);
          case 'phone':
            return validatePhone(value);
          case 'cardNumber':
            return validateCardNumber(value);
          case 'expiry':
            return validateExpiry(value);
          case 'cvc':
            return validateCVC(value);
          default:
            return '';
        }
      })();
      if (error) {
        newErrors[field] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    // 如果有錯誤，不提交
    if (Object.keys(newErrors).length > 0) {
      // 滾動到第一個錯誤欄位
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('Form has errors, not submitting:', newErrors);

      // return;
    }

    // ✅ 提交成功後清除暫存
    if (typeof window !== 'undefined') {
      localStorage.removeItem('payment_form');
    }
    console.log('Submitting form with data2:');
    onSubmit({ ...formData, paymentMethod });
  };

  return (
    <div className="min-h-screen py-12 px-6 flex flex-col lg:flex-row justify-center gap-10">
      <style jsx>{`
        .custom-radio {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          cursor: pointer;
        }
        .custom-radio:checked {
          border-color: #dcbb87;
        }
        .custom-radio:checked::after {
          content: '';
          width: 10px;
          height: 10px;
          background-color: #dcbb87;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>

      {/* 左邊 - 表單 */}
      <div className="bg-white rounded-lg shadow-md p-8 lg:w-2/3 w-full border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {pageTitle}
        </h2>

        {pageTitle === '付款資訊' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              付款方式
            </h3>

            <div className="space-y-4">
              {/* 1. 信用卡付款 */}
              <label className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer transition-all hover:shadow-md has-[:checked]:border-[#1F2E3C]">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => setPaymentMethod('creditCard')}
                    className="custom-radio"
                  />
                  <span className="text-lg font-medium text-gray-800">
                    信用卡付款
                  </span>
                </div>
                <div className="text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-credit-card"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
              </label>

              {/* 2. LinePay */}
              <div>
                <label className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer transition-all hover:shadow-md has-[:checked]:border-gray-600">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="linePay"
                      checked={paymentMethod === 'linePay'}
                      onChange={() => setPaymentMethod('linePay')}
                      className="custom-radio"
                    />
                    <span className="text-lg font-medium text-gray-800">
                      LinePay
                    </span>
                  </div>
                  <div className="text-gray-600 font-bold text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-circle"
                    >
                      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                    </svg>
                  </div>
                </label>

                {paymentMethod === 'linePay' && (
                  <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      掃描 QR Code 完成付款
                    </h4>
                    <div className="flex justify-center mb-4">
                      <Image
                        src="/images/dutyfree/qrcode.png"
                        alt="LinePay QR Code"
                        width={192}
                        height={192}
                        className="border-2 border-gray-300 rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      請使用 LINE App 掃描此 QR Code
                    </p>
                    <p className="text-xs text-gray-500">
                      總金額:{' '}
                      <span className="font-bold text-gray-800">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ✅ 聯絡資訊區塊（只在信用卡付款時顯示） */}
        {paymentMethod === 'creditCard' && (
          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-700">聯絡資訊</h3>

            {/* 姓名（並排） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  姓
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  placeholder="王"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  名
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  placeholder="小明"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                電子郵件 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="example@email.com"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none transition ${
                  errors.email && touched.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* 手機號碼 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                手機號碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="0912345678"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none transition ${
                  errors.phone && touched.phone
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        )}

        {pageTitle === '付款資訊' && paymentMethod === 'creditCard' && (
          <div className="space-y-4 mb-6 pt-6 border-t">
            <h3 className="text-xl font-semibold text-gray-700">信用卡資訊</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                信用卡號碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) =>
                  handleInputChange('cardNumber', e.target.value)
                }
                onBlur={() => handleBlur('cardNumber')}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none transition ${
                  errors.cardNumber && touched.cardNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && touched.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  有效日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  onBlur={() => handleBlur('expiry')}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none transition ${
                    errors.expiry && touched.expiry
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.expiry && touched.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  CVC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  onBlur={() => handleBlur('cvc')}
                  placeholder="123"
                  maxLength={3}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DCBB87] focus:outline-none transition ${
                    errors.cvc && touched.cvc
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.cvc && touched.cvc && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleFormSubmit}
          className="w-full mt-8 py-3 bg-[#1F2E3C] text-white font-bold text-lg rounded-lg hover:bg-[#2d3d4c] transition active:scale-95"
        >
          {buttonText}
        </button>
      </div>

      {/* 右邊 - 訂單摘要 */}
      <aside className="bg-white rounded-lg shadow-md p-8 w-full lg:w-1/3 border border-gray-200 h-fit">
        <Image
          src={detail.image || '/images/hotel/default.jpeg'}
          alt={detail.name}
          width={400}
          height={160}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800 mb-4">訂單摘要</h3>
        <div className="space-y-3 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span>飯店名稱</span>
            <span className="font-medium">{detail.hotelName}</span>
          </div>
          <div className="flex justify-between">
            <span>床型需求</span>
            <span>{detail.roomType}</span>
          </div>
          <div className="flex justify-between">
            <span>吸煙偏好</span>
            <span>{detail.smokingPreference}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              入住
            </span>
            <span>{detail.checkIn}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              退房
            </span>
            <span>{detail.checkOut}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Moon size={14} />
              住宿晚數
            </span>
            <span>{detail.nights} 晚</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Users size={14} />
              人數
            </span>
            <span>{detail.guests} 人</span>
          </div>
          <div className="flex justify-between">
            <span>房間數</span>
            <span>{detail.rooms} 間</span>
          </div>
          <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between text-lg font-bold text-gray-900">
            <span>總金額</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
