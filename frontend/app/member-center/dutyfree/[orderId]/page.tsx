'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DFOrderDetailPage } from '../../../dutyfree-shop/components/DFOrderDetailPage';
import '../../../dutyfree-shop/style.css';
import { mockDutyFreeOrders } from '../mockOrders';

const normalizeStatus = (status?: string) => {
  if (!status) return 'success';
  const s = status.toLowerCase();
  if (['disabled', 'cancel', 'cancelled', 'canceled', 'fail'].includes(s))
    return 'cancelled';
  return status;
};

export default function DutyFreeOrderDetail() {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();
  const [pickupModalOpen, setPickupModalOpen] = useState(false);

  const order = useMemo(
    () =>
      mockDutyFreeOrders
        .map((o) => ({ ...o, status: normalizeStatus(o.status) }))
        .find((o) => o.id === orderId),
    [orderId]
  );

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg mb-4">找不到此訂單資料，可能已被刪除。</p>
        <button
          onClick={() => router.push('/member-center/dutyfree')}
          className="bg-[var(--df-accent-gold)] text-white px-6 py-2 rounded hover:opacity-90 transition"
        >
          返回免稅訂單
        </button>
      </div>
    );
  }

  return (
    <div id="dutyfree-theme" className="relative bg-gray-50 text-gray-900">
      <main className="min-h-screen flex flex-col">
        <DFOrderDetailPage
          order={order}
          cart={order.products}
          pickupModalOpen={pickupModalOpen}
          onNavigateHome={() => router.push('/dutyfree-shop')}
          onNavigateAccount={() => router.push('/member-center/dutyfree')}
          onOpenPickupModal={() => setPickupModalOpen(true)}
          onClosePickupModal={() => setPickupModalOpen(false)}
        />
      </main>
    </div>
  );
}
