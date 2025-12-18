'use client';
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DFCheckoutStepper } from '../components/DFCheckoutStepper';
import { DFOrderSummary } from '../components/DFOrderSummary';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useDFStore } from '../context/DFStoreContext';

// ===============================
// 型別定義
// ===============================
interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const LinePayQRCode = () => (
  <div className="rounded-xl border border-dashed border-[var(--df-accent-gold)] bg-white p-6 text-center shadow-sm">
    <p className="mb-4 text-sm text-gray-600">
      請使用 LinePay 掃描下方 QR Code 完成付款
    </p>
    <div className="mx-auto h-40 w-40 rounded-lg border-4 border-gray-900 bg-white shadow-inner">
      <div
        className="h-full w-full rounded-md"
        style={{
          backgroundImage: "url('/images/dutyfree/qrcode.png')",
          backgroundSize: 'cover',
        }}
      />
    </div>
  </div>
);

// ===============================
// 主頁面
// ===============================
export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutItem, cart, setCheckoutItem, discount, promoCode } =
    useDFStore();

  // ✅ 表單狀態
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [checkoutErrors, setCheckoutErrors] = useState<
    Record<keyof CheckoutForm, string>
  >({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'linepay'>(
    'card'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ 自動防呆：若購物車多於 1 件商品，代表不是立即購買 → 清空 checkoutItem
  useEffect(() => {
    if (cart.length > 1 && checkoutItem) {
      setCheckoutItem(null);
    }
  }, [cart.length, checkoutItem, setCheckoutItem]);

  // ✅ 若沒有任何商品（購物車與單品皆空）
  const noItems = !checkoutItem && cart.length === 0;
  if (noItems) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>目前沒有選擇商品。</p>
        <Button
          onClick={() => router.push('/dutyfree-shop')}
          className="mt-4 bg-[var(--df-accent-gold)] text-white"
        >
          回到商品列表
        </Button>
      </div>
    );
  }

  // ✅ 若有 checkoutItem，顯示單品結帳；否則顯示購物車內容
  const cartItems = checkoutItem
    ? [
        {
          id: checkoutItem.id,
          name: checkoutItem.name,
          description: checkoutItem.description,
          price: checkoutItem.price,
          image: checkoutItem.images?.[0] || checkoutItem.image,
          quantity: 1,
        },
      ]
    : cart;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const appliedDiscount =
    !checkoutItem && discount > 0 ? Math.min(discount, subtotal) : 0;
  const appliedPromoCode = !checkoutItem && discount > 0 ? promoCode : '';

  // ===============================
  // 表單處理
  // ===============================
  const onFormChange = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm((prev) => ({ ...prev, [field]: value }));
  };

  const onClearError = (field: keyof CheckoutForm) => {
    setCheckoutErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ===============================
  // 提交邏輯
  // ===============================
  const onSubmit = () => {
    const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!checkoutForm.firstName) newErrors.firstName = '請輸入姓氏';
    if (!checkoutForm.lastName) newErrors.lastName = '請輸入名字';
    if (!checkoutForm.phone) newErrors.phone = '請輸入電話';
    if (!checkoutForm.email) newErrors.email = '請輸入 Email';
    if (paymentMethod === 'card') {
      if (!checkoutForm.cardNumber) newErrors.cardNumber = '請輸入信用卡號';
      if (!checkoutForm.expiry) newErrors.expiry = '請輸入有效日期';
      if (!checkoutForm.cvc) newErrors.cvc = '請輸入安全碼';
    }

    if (Object.keys(newErrors).length > 0) {
      setCheckoutErrors(newErrors as Record<keyof CheckoutForm, string>);
      return;
    }

    setShowSuccess(true);
  };

  const onNavigateCart = () => {
    router.push('/dutyfree-shop/cart');
  };

  // ===============================
  // 畫面輸出
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 lg:px-16 max-w-7xl">
        <DFCheckoutStepper currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* 左側：表單區 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 聯絡資訊 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">聯絡資訊</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                    姓
                  </Label>
                  <Input
                    placeholder="First name"
                    value={checkoutForm.firstName}
                    onChange={(e) => {
                      onFormChange('firstName', e.target.value);
                      onClearError('firstName');
                    }}
                    className={checkoutErrors.firstName ? 'border-red-500' : ''}
                  />
                  {checkoutErrors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {checkoutErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                    名
                  </Label>
                  <Input
                    placeholder="Last name"
                    value={checkoutForm.lastName}
                    onChange={(e) => {
                      onFormChange('lastName', e.target.value);
                      onClearError('lastName');
                    }}
                    className={checkoutErrors.lastName ? 'border-red-500' : ''}
                  />
                  {checkoutErrors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {checkoutErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                  聯絡電話
                </Label>
                <Input
                  placeholder="09xxxxxxxx"
                  value={checkoutForm.phone}
                  onChange={(e) => {
                    onFormChange('phone', e.target.value);
                    onClearError('phone');
                  }}
                  className={checkoutErrors.phone ? 'border-red-500' : ''}
                />
                {checkoutErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {checkoutErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                  EMAIL
                </Label>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={checkoutForm.email}
                  onChange={(e) => {
                    onFormChange('email', e.target.value);
                    onClearError('email');
                  }}
                  className={checkoutErrors.email ? 'border-red-500' : ''}
                />
                {checkoutErrors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {checkoutErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* 付款方式 */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">付款方式</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  setPaymentMethod(value as 'card' | 'linepay');
                  if (value === 'linepay') {
                    setCheckoutErrors((prev) => ({
                      ...prev,
                      cardNumber: '',
                      expiry: '',
                      cvc: '',
                    }));
                  }
                }}
              >
                <div className="mb-4 flex items-center space-x-3 rounded-lg border p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <CreditCard className="w-5 h-5" />
                    信用卡付款
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-4">
                  <RadioGroupItem value="linepay" id="linepay" />
                  <Label htmlFor="linepay" className="cursor-pointer flex-1">
                    LinePay
                  </Label>
                </div>
              </RadioGroup>

              {/* 信用卡資料 */}
              {paymentMethod === 'card' ? (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                      信用卡號
                    </Label>
                    <Input
                      placeholder="1234 1234 1234 1234"
                      value={checkoutForm.cardNumber}
                      onChange={(e) => {
                        onFormChange('cardNumber', e.target.value);
                        onClearError('cardNumber');
                      }}
                      className={
                        checkoutErrors.cardNumber ? 'border-red-500' : ''
                      }
                    />
                    {checkoutErrors.cardNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {checkoutErrors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                        有效日期
                      </Label>
                      <Input
                        placeholder="MM/YY"
                        value={checkoutForm.expiry}
                        onChange={(e) => {
                          onFormChange('expiry', e.target.value);
                          onClearError('expiry');
                        }}
                        className={
                          checkoutErrors.expiry ? 'border-red-500' : ''
                        }
                      />
                      {checkoutErrors.expiry && (
                        <p className="text-sm text-red-500 mt-1">
                          {checkoutErrors.expiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block mb-2 text-sm font-semibold text-[var(--df-text-dark)]">
                        CVC
                      </Label>
                      <Input
                        placeholder="CVC code"
                        value={checkoutForm.cvc}
                        onChange={(e) => {
                          onFormChange('cvc', e.target.value);
                          onClearError('cvc');
                        }}
                        className={checkoutErrors.cvc ? 'border-red-500' : ''}
                      />
                      {checkoutErrors.cvc && (
                        <p className="text-sm text-red-500 mt-1">
                          {checkoutErrors.cvc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <LinePayQRCode />
                </div>
              )}
            </div>

            {/* 按鈕區 */}
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

          {/* 右側：訂單摘要 */}
          <div>
            <DFOrderSummary
              items={cartItems}
              subtotal={subtotal}
              discount={appliedDiscount}
              promoCode={appliedPromoCode || undefined}
              sticky
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md bg-white text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-[var(--df-primary-dark)]">
              結帳成功
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              感謝您的購買！訂單已建立，請至會員中心查看詳情。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-center">
            <AlertDialogAction
              className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 px-6"
              onClick={() => router.push('/dutyfree-shop/complete')}
            >
              查看訂單資訊
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
