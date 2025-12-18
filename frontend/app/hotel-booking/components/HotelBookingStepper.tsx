'use client';

interface HotelBookingStepperProps {
  currentStep: number;
}

export function HotelBookingStepper({ currentStep }: HotelBookingStepperProps) {
  const steps = [
    { id: 1, label: '填寫住客資料' },
    { id: 2, label: '選擇付款方式' },
    { id: 3, label: '預訂已確認!' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-center relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {index > 0 && (
                <div
                  className={`flex-1 h-0.5 ${
                    currentStep > index ? 'bg-[#DCBB87]' : 'bg-gray-300'
                  }`}
                />
              )}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-5 ${
                  currentStep >= step.id
                    ? 'bg-white border-[#DCBB87]'
                    : 'bg-white border-gray-300'
                }`}
              >
                {/* 不顯示數字或勾勾 */}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    currentStep > step.id ? 'bg-[#DCBB87]' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-3 text-sm whitespace-nowrap ${
                currentStep >= step.id ? 'text-[#DCBB87]' : 'text-white'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
