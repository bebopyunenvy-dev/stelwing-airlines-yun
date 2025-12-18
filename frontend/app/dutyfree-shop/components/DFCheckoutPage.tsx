import { DFCheckoutStepper } from '../components/DFCheckoutStepper';
import { DFOrderSummary } from '../components/DFOrderSummary';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { CreditCard } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface DFCheckoutPageProps {
  cart: CartItem[];
  subtotal: number;
  discount: number;
  checkoutForm: CheckoutForm;
  checkoutErrors: Record<string, string>;
  onFormChange: (field: keyof CheckoutForm, value: string) => void;
  onClearError: (field: keyof CheckoutForm) => void;
  onSubmit: () => void;
  onNavigateCart: () => void;
}

export function DFCheckoutPage({
  cart,
  subtotal,
  discount,
  checkoutForm,
  checkoutErrors,
  onFormChange,
  onClearError,
  onSubmit,
  onNavigateCart,
}: DFCheckoutPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 lg:px-16 max-w-7xl">
        <DFCheckoutStepper currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">聯絡資訊</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>姓</Label>
                  <Input 
                    placeholder="First name" 
                    value={checkoutForm.firstName}
                    onChange={(e) => {
                      onFormChange('firstName', e.target.value);
                      if (checkoutErrors.firstName) {
                        onClearError('firstName');
                      }
                    }}
                    className={checkoutErrors.firstName ? 'border-red-500' : ''}
                  />
                  {checkoutErrors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{checkoutErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label>名</Label>
                  <Input 
                    placeholder="Last name" 
                    value={checkoutForm.lastName}
                    onChange={(e) => {
                      onFormChange('lastName', e.target.value);
                      if (checkoutErrors.lastName) {
                        onClearError('lastName');
                      }
                    }}
                    className={checkoutErrors.lastName ? 'border-red-500' : ''}
                  />
                  {checkoutErrors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{checkoutErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <Label>聯絡電話</Label>
                <Input 
                  placeholder="09xxxxxxxx" 
                  value={checkoutForm.phone}
                  onChange={(e) => {
                    onFormChange('phone', e.target.value);
                    if (checkoutErrors.phone) {
                      onClearError('phone');
                    }
                  }}
                  className={checkoutErrors.phone ? 'border-red-500' : ''}
                />
                {checkoutErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">{checkoutErrors.phone}</p>
                )}
              </div>
              <div>
                <Label>EMAIL</Label>
                <Input 
                  type="email" 
                  placeholder="Your Email" 
                  value={checkoutForm.email}
                  onChange={(e) => {
                    onFormChange('email', e.target.value);
                    if (checkoutErrors.email) {
                      onClearError('email');
                    }
                  }}
                  className={checkoutErrors.email ? 'border-red-500' : ''}
                />
                {checkoutErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{checkoutErrors.email}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">付款方式</h2>
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-3 mb-4 p-4 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    信用卡付款
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="linepay" id="linepay" />
                  <Label htmlFor="linepay" className="cursor-pointer flex-1">
                    LinePay
                  </Label>
                </div>
              </RadioGroup>

              {/* Card Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <Label>信用卡號</Label>
                  <Input 
                    placeholder="1234 1234 1234 1234" 
                    value={checkoutForm.cardNumber}
                    onChange={(e) => {
                      onFormChange('cardNumber', e.target.value);
                      if (checkoutErrors.cardNumber) {
                        onClearError('cardNumber');
                      }
                    }}
                    className={checkoutErrors.cardNumber ? 'border-red-500' : ''}
                  />
                  {checkoutErrors.cardNumber && (
                    <p className="text-sm text-red-500 mt-1">{checkoutErrors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>有效日期</Label>
                    <Input 
                      placeholder="MM/YY" 
                      value={checkoutForm.expiry}
                      onChange={(e) => {
                        onFormChange('expiry', e.target.value);
                        if (checkoutErrors.expiry) {
                          onClearError('expiry');
                        }
                      }}
                      className={checkoutErrors.expiry ? 'border-red-500' : ''}
                    />
                    {checkoutErrors.expiry && (
                      <p className="text-sm text-red-500 mt-1">{checkoutErrors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input 
                      placeholder="CVC code" 
                      value={checkoutForm.cvc}
                      onChange={(e) => {
                        onFormChange('cvc', e.target.value);
                        if (checkoutErrors.cvc) {
                          onClearError('cvc');
                        }
                      }}
                      className={checkoutErrors.cvc ? 'border-red-500' : ''}
                    />
                    {checkoutErrors.cvc && (
                      <p className="text-sm text-red-500 mt-1">{checkoutErrors.cvc}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={onNavigateCart}
                className="flex-1"
              >
                上一步
              </Button>
              <Button 
                onClick={onSubmit}
                className="flex-1 bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white"
              >
                下一步
              </Button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <DFOrderSummary
              items={cart}
              subtotal={subtotal}
              discount={discount}
              sticky
            />
          </div>
        </div>
      </div>
    </div>
  );
}
