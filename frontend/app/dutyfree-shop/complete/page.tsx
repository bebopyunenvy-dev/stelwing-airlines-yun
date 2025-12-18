'use client';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DFCheckoutStepper } from '../components/DFCheckoutStepper';
import { DFPickupModal } from '../components/DFPickupModal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { useDFStore } from '../context/DFStoreContext';
import { OrderProduct, ordersStorage, promoStorage } from '../utils/storage';

/**
 *  最終修正版：
 * 1. 訂單會正常寫入 localStorage
 * 2. 結帳完成後購物車清空（clearCart）
 * 3. Header 紅點即時歸 0
 */

export default function CompletePage() {
  const router = useRouter();
  const {
    cart,
    discount,
    discountPercent,
    clearCart, // ✅ 改這裡
    setCheckoutItem,
  } = useDFStore();

  const [cartSnapshot, setCartSnapshot] = useState<OrderProduct[]>([]);

  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const hasCapturedCart = useRef(false);

  //  初始化訂單編號
  useEffect(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    setOrderNumber(`DF${year}-${random}`);
  }, []);

  // 寫入訂單邏輯 + 清空購物車
  useEffect(() => {
    if (hasCapturedCart.current) return;
    if (!orderNumber || !cart || cart.length === 0) return;

    const snapshot: OrderProduct[] = cart.map((item) => ({
      id: item.id,
      name: item.name,
      sub: item.sub,
      description: item.description,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    setCartSnapshot(snapshot);
    hasCapturedCart.current = true;
  }, [orderNumber, cart]);

  useEffect(() => {
    if (!orderNumber || cartSnapshot.length === 0) return;

    const subtotal = cartSnapshot.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = discountPercent ? subtotal - discount : subtotal;

    const newOrder = {
      id: orderNumber,
      date: new Date().toLocaleDateString('zh-TW'),
      status: 'success',
      total,
      discount: discountPercent ? discount : 0,
      discountPercent: discountPercent || 0,
      promoCode: discountPercent ? promoStorage.load().promoCode || '' : '',
      items: cartSnapshot.length,
      paymentMethod: '信用卡付款',
      products: cartSnapshot,
    };

    const existingOrders = ordersStorage.load();
    const isDuplicate = existingOrders.some((o) => o.id === orderNumber);
    if (!isDuplicate) {
      ordersStorage.save([newOrder, ...existingOrders]);
      console.log(' 已儲存訂單：', newOrder);
    }

    const timer = setTimeout(() => {
      clearCart();
      setCheckoutItem(null);
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    orderNumber,
    cartSnapshot,
    discount,
    discountPercent,
    clearCart,
    setCheckoutItem,
  ]);

  // 載入中畫面
  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        正在建立訂單資訊...
      </div>
    );
  }

  // 完成畫面
  const subtotal = cartSnapshot.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = discountPercent ? subtotal - discount : subtotal;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 lg:px-16 max-w-4xl">
        <DFCheckoutStepper currentStep={3} />

        <div className="bg-white rounded-lg p-6 md:p-12 text-center">
          {/* 成功圖示 */}
          <div className="w-16 h-16 bg-[var(--df-state-success)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-semibold mb-4">訂單完成！</h1>
          <p className="text-gray-600 mb-2">感謝您的訂購</p>
          <p className="text-gray-600 mb-6">訂單號碼：{orderNumber}</p>

          {/* 訂購商品縮圖 */}
          {cartSnapshot.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">訂購商品</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {cartSnapshot.map((item) => (
                  <div
                    key={item.id}
                    className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 訂單金額 */}
          <div className="max-w-md mx-auto p-4 bg-[var(--df-surface-alt)] rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">訂單小計</span>
              <span>TWD {subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>折扣（{discountPercent}%）</span>
                <span>-TWD {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>訂單總額</span>
              <span>TWD {total.toLocaleString()}</span>
            </div>
          </div>

          {/* 按鈕 */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button onClick={() => setPickupModalOpen(true)} variant="outline">
              查看取貨資訊
            </Button>
            <Button
              onClick={() => router.push('/dutyfree-shop/member')}
              className="bg-[var(--df-accent-gold)] text-white hover:bg-[var(--df-accent-gold)]/90"
            >
              前往會員中心
            </Button>
          </div>
        </div>
      </div>

      {/* 彈窗 */}
      <DFPickupModal
        open={pickupModalOpen}
        onClose={() => setPickupModalOpen(false)}
      />
    </div>
  );
}
