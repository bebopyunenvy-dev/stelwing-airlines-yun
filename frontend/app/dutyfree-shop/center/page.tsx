'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DFOrderDetailPage } from '../components/DFOrderDetailPage';
import type { Order, OrderProduct } from '../utils/storage';

export default function Page() {
  const router = useRouter();
  const [pickupModalOpen, setPickupModalOpen] = useState(false);

  const cart: OrderProduct[] = useMemo(
    () => [
      {
        id: '1',
        name: '香氛蠟燭禮盒',
        description: '經典花香調蠟燭 200g',
        price: 1280,
        image:
          'https://images.unsplash.com/photo-1688413580470-5eff69a96686?auto=format&fit=crop&q=80&w=987',
        quantity: 1,
        sub: '經典花香調蠟燭 200g',
      },
      {
        id: '2',
        name: 'Dior 香水',
        description: '迪奧淡香水 50ml',
        price: 2980,
        image:
          'https://images.unsplash.com/photo-1688413580470-5eff69a96686?auto=format&fit=crop&q=80&w=987',
        quantity: 1,
        sub: '迪奧淡香水 50ml',
      },
    ],
    []
  );

  const order: Order = useMemo(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      id: 'TEST001',
      date: '2025-10-30',
      status: 'success',
      total,
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
      paymentMethod: '信用卡',
      products: cart,
    };
  }, [cart]);

  return (
    <DFOrderDetailPage
      order={order}
      cart={cart}
      pickupModalOpen={pickupModalOpen}
      onNavigateHome={() => router.push('/dutyfree-shop')}
      onNavigateAccount={() => router.push('/dutyfree-shop/member')}
      onOpenPickupModal={() => setPickupModalOpen(true)}
      onClosePickupModal={() => setPickupModalOpen(false)}
    />
  );
}
