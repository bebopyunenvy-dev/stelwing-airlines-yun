'use client';

import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import OrderTable, { type Column } from '../components/OrderTable';
import StatusBadge from '../components/StatusBadge';

const mockHotelOrders = [
  {
    id: '1',
    orderId: '#0123_45678',
    hotel: '普雷米爾飯店',
    paymentMethod: 'Line Pay',
    status: 'success',
    createdAt: '2025-11-24\n',
  },
];

export default function HotelOrdersPage() {
  const [orders] = useState(mockHotelOrders);

  const columns: Column[] = [
    { key: 'id', title: 'ID', width: 60, align: 'center' },
    { key: 'orderId', title: '訂單編號', width: 140 },
    { key: 'hotel', title: '訂房資料', width: 420 },
    { key: 'paymentMethod', title: '付款方式', width: 100, align: 'center' },
    {
      key: 'status',
      title: '狀態',
      width: 120,
      align: 'center',
      render: (value?: string) => {
        const normalize = (
          v: string
        ): 'success' | 'disabled' | 'refunding' | 'refunded' => {
          if (!v) return 'success';
          const v2 = v.toLowerCase().trim();

          if (['success', 'done', 'completed', 'paid'].includes(v2))
            return 'success';
          if (
            [
              'disabled',
              'cancel',
              'cancelled',
              'canceled',
              'fail',
              'failed',
            ].includes(v2)
          )
            return 'disabled';
          if (
            [
              'refunding',
              'processing',
              'pending_refund',
              'on_refund',
              'processing_refund',
            ].includes(v2)
          )
            return 'refunding';
          if (
            [
              'refunded',
              'refund_done',
              'finish_refund',
              'refund_success',
            ].includes(v2)
          )
            return 'refunded';

          return 'success';
        };

        const map: Record<string, string> = {
          success: '已完成',
          disabled: '已取消',
          refunding: '退款中',
          refunded: '已退款',
        };

        const normalized = normalize(value ?? '');

        return <StatusBadge variant={normalized} label={map[normalized]} />;
      },
    },
    { key: 'createdAt', title: '成立日期', width: 180, align: 'center' },
    {
      key: 'edit',
      title: '編輯',
      width: 80,
      align: 'center',
      render: () => (
        <button
          className="text-[#1F2E3C] hover:text-[#DCBB87] text-lg transition-colors"
          title="編輯"
        >
          ✏️
        </button>
      ),
    },
    {
      key: 'delete',
      title: '刪除',
      width: 80,
      align: 'center',
      render: () => (
        <button
          className="text-[#1F2E3C] hover:text-red-400 text-lg transition-colors"
          title="刪除"
        >
          ❌
        </button>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-end mb-3 text-sm text-[#666666]">
        共 {orders.length} 筆訂單
      </div>

      {orders.length > 0 ? (
        <OrderTable columns={columns} data={orders} />
      ) : (
        <EmptyState message="尚無住宿訂單" />
      )}
    </div>
  );
}
