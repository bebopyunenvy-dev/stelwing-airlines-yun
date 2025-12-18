import { ShoppingCart, X } from 'lucide-react';
import { DFCheckoutStepper } from '../components/DFCheckoutStepper';
import { DFQuantitySelector } from '../components/DFQuantitySelector';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface DFCartPageProps {
  cart: CartItem[];
  promoCode: string;
  discount: number;
  discountPercent: number;
  deleteItemId: string | null;
  onNavigateHome: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
  onCheckout: () => void;
  onSetDeleteItemId: (id: string | null) => void;
}

export function DFCartPage({
  cart,
  promoCode,
  discount,
  discountPercent,
  deleteItemId,
  onNavigateHome,
  onUpdateQuantity,
  onRemoveItem,
  onPromoCodeChange,
  onApplyPromoCode,
  onCheckout,
  onSetDeleteItemId,
}: DFCartPageProps) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 lg:px-16 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <button
            onClick={onNavigateHome}
            className="hover:text-[var(--df-accent-gold)]"
          >
            首頁
          </button>
          {' > '}
          <span>購物車</span>
        </div>

        <h1
          style={{ fontSize: '1.5rem', lineHeight: '2rem', fontWeight: '600' }}
          className="mb-4 md:mb-8"
        >
          購物車
        </h1>

        {/* Checkout Stepper */}
        <DFCheckoutStepper currentStep={1} />

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-8 md:p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">您的購物車是空的</p>
            <Button
              onClick={onNavigateHome}
              className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white !text-white"
            >
              繼續購物
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-[var(--df-surface-alt)] border-b">
                  <div className="col-span-6">商品</div>
                  <div className="col-span-2 text-center">數量</div>
                  <div className="col-span-2 text-center">小計</div>
                  <div className="col-span-2 text-center">刪除</div>
                </div>

                {/* Cart Items */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 p-4 border-b items-center"
                  >
                    <div className="col-span-6 flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <DFQuantitySelector
                        value={item.quantity}
                        onChange={(qty) => onUpdateQuantity(item.id, qty)}
                      />
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => onSetDeleteItemId(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => onSetDeleteItemId(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors self-start"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <DFQuantitySelector
                        value={item.quantity}
                        onChange={(qty) => onUpdateQuantity(item.id, qty)}
                      />
                      <span className="font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Promo Code */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">使用折扣碼</h3>
                <p className="text-sm text-gray-500 mb-3">請輸入折扣碼</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon Code"
                    value={promoCode}
                    onChange={(e) => onPromoCodeChange(e.target.value)}
                  />
                  <Button
                    onClick={onApplyPromoCode}
                    className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white whitespace-nowrap"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>小計</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>折扣 ({discountPercent}%)</span>
                      <span className="text-[var(--df-state-success)]">
                        -${discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>總金額</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={onCheckout}
                  className="w-full bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white h-12"
                >
                  結帳
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteItemId !== null}
        onOpenChange={(open) => !open && onSetDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              確定要從購物車移除此商品嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onSetDeleteItemId(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={() => deleteItemId && onRemoveItem(deleteItemId)}
                className="w-full bg-[var(--df-state-error)] hover:bg-[var(--df-state-error)]/90 text-white rounded-md px-4 py-2 transition-colors"
              >
                刪除
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
