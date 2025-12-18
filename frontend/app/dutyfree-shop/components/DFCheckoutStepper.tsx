interface DFCheckoutStepperProps {
  currentStep: number;
}

export function DFCheckoutStepper({ currentStep }: DFCheckoutStepperProps) {
  const steps = [
    { id: 1, label: '購物車' },
    { id: 2, label: '確認資訊' },
    { id: 3, label: '訂單完成' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-center relative">
        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Left Line (except for first step) */}
              {index > 0 && (
                <div className={`flex-1 h-0.5 ${
                  currentStep > index ? 'bg-[var(--df-accent-gold)]' : 'bg-gray-300'
                }`} />
              )}
              
              {/* Circle */}
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  currentStep >= step.id 
                    ? 'bg-[var(--df-accent-gold)] text-white' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Right Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${
                  currentStep > step.id ? 'bg-[var(--df-accent-gold)]' : 'bg-gray-300'
                }`} />
              )}
            </div>
            
            {/* Label */}
            <span className={`mt-3 text-sm whitespace-nowrap ${
              currentStep >= step.id ? 'text-[var(--df-text-dark)]' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
