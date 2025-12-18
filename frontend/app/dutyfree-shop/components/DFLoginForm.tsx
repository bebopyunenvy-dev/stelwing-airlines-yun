import { useState } from 'react';

export function LoginForm() {
  const [bookingCode, setBookingCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ bookingCode, lastName, firstName, agreedToTerms });
  };

  const handleJoinMember = () => {
    console.log('Join as member');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white">
      <div className="w-full max-w-md">
        <h1 className="mb-8 sm:mb-12">免稅商品請填寫取貨資訊</h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Booking Code Field */}
          <div>
            <label htmlFor="bookingCode" className="block mb-2 text-gray-700">
              訂位代號
            </label>
            <input
              id="bookingCode"
              type="text"
              placeholder="Enter your code"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label htmlFor="lastName" className="block mb-2 text-gray-700">
              姓
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
            />
          </div>

          {/* First Name Field */}
          <div>
            <label htmlFor="firstName" className="block mb-2 text-gray-700">
              名
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-[#D4B896] cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-tight cursor-pointer"
            >
              我已閱讀並同意隱私政策的隱私條款與使用者協議、確認欲取消
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#D4B896] hover:bg-[#C5A77E] text-white rounded-md transition-colors text-center"
          >
            確認
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Join Member Link */}
          <div className="text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={handleJoinMember}
            >
              <span>加入會員</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
