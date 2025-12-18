'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DFCheckoutStepper } from '../components/DFCheckoutStepper';
import { DFQuantitySelector } from '../components/DFQuantitySelector';
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
import { useDFStore } from '../context/DFStoreContext';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    clearPromoCode,
    discount,
    promoCode,
    isLoggedIn, // ✅ 取出登入狀態
    setCheckoutItem, // ✅ 新增：清除單品結帳殘留
  } = useDFStore();

  const [code, setCode] = useState('');
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // ✅ 小計與總金額
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);
  const hasDiscount = discount > 0 && !!promoCode;

  const handleOpenDelete = (id: string) => setDeleteItemId(id);
  const handleConfirmDelete = () => {
    if (!deleteItemId) return;
    removeFromCart(deleteItemId);
    setDeleteItemId(null);
  };

  // ✅ 套用折扣碼
  const handleApplyCode = () => {
    const formatted = code.trim().toLowerCase();
    if (!formatted) return;
    applyPromoCode(formatted);
    setCode('');
  };

  // ✅ 點擊前往結帳（加上清空 checkoutItem）
  const handleCheckout = () => {
    // 清除「立即購買」的單品資料，確保進入 checkout 是整車結帳
    setCheckoutItem(null);

    if (!isLoggedIn) {
      router.push('/dutyfree-shop/login');
    } else {
      router.push('/dutyfree-shop/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
        <h1 className="text-2xl font-semibold mb-6">購物車</h1>

        <DFCheckoutStepper currentStep={1} />

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-600">
            <p>購物車目前是空的。</p>
            <Button
              onClick={() => router.push('/dutyfree-shop')}
              className="mt-4 bg-[var(--df-accent-gold)] text-white"
            >
              返回商品列表
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 左側：商品列表 */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 md:p-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between border-b py-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.sub}
                      </p>
                      <p className="text-[var(--df-accent-gold)] font-semibold mt-1">
                        TWD {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* 數量與刪除 */}
                  <div className="flex items-center gap-3">
                    <DFQuantitySelector
                      value={item.quantity}
                      onChange={(qty) => updateCartQuantity(item.id, qty)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDelete(item.id)}
                      className="text-red-500 border-red-300 hover:bg-red-50"
                    >
                      移除
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 右側：結帳資訊 */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">訂單摘要</h2>

              <div className="flex justify-between text-sm text-gray-600">
                <span>小計</span>
                <span>TWD {subtotal.toLocaleString()}</span>
              </div>

              {hasDiscount && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>折扣（{promoCode.toUpperCase()}）</span>
                  <div className="flex items-center gap-2">
                    <span>- TWD {discount.toLocaleString()}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearPromoCode}
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                    >
                      移除
                    </Button>
                  </div>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>總金額</span>
                <span>TWD {total.toLocaleString()}</span>
              </div>

              {/* 折扣碼輸入 */}
              <div className="mt-4">
                <label className="block text-sm mb-2 text-gray-700">
                  折扣碼
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="輸入折扣碼"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--df-accent-gold)]"
                  />
                  <Button
                    onClick={handleApplyCode}
                    className="bg-[var(--df-accent-gold)] text-white hover:bg-[var(--df-accent-gold)]/90"
                  >
                    套用
                  </Button>
                </div>
                {hasDiscount && (
                  <p className="text-xs text-green-600 mt-1">
                    已套用折扣碼 <strong>{promoCode.toUpperCase()}</strong>
                  </p>
                )}
              </div>

              {/* 前往結帳 */}
              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-[var(--df-accent-gold)] text-white hover:bg-[var(--df-accent-gold)]/90"
              >
                前往結帳
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteItemId !== null}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              確定要從購物車移除此商品嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteItemId(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-[var(--df-state-error)] hover:bg-[var(--df-state-error)]/90"
            >
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
