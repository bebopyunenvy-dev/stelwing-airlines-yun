'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import OrderTable, { type Column } from '../components/OrderTable';
import StatusBadge from '../components/StatusBadge';
import { mockDutyFreeOrders } from './mockOrders';

type DutyFreeStatus = 'success' | 'disabled' | 'refunding' | 'refunded';

const normalize = (v: string): DutyFreeStatus => {
  if (!v) return 'success';
  const x = v.toLowerCase().trim();
  if (['success', 'paid', 'done', 'completed'].includes(x)) return 'success';
  if (['refunding', 'processing'].includes(x)) return 'refunding';
  if (['refunded', 'finish_refund', 'refund_done'].includes(x))
    return 'refunded';
  if (['disabled', 'cancel', 'cancelled', 'canceled', 'fail'].includes(x))
    return 'disabled';
  return 'success';
};

const statusMap: Record<DutyFreeStatus, string> = {
  success: '已完成',
  refunding: '退款中',
  refunded: '已退款',
  disabled: '已取消',
};

export default function DutyFreePage() {
  const router = useRouter();
  const [orders] = useState(mockDutyFreeOrders);

  const columns: Column[] = [
    {
      key: 'index',
      title: '#',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    { key: 'id', title: '訂單編號', width: 160 },
    {
      key: 'product',
      title: '商品',
      width: 260,
      render: (_, row) => (
        <span
          className="block truncate max-w-[230px]"
          title={row.products?.[0]?.name}
        >
          {row.products?.[0]?.name}
        </span>
      ),
    },
    { key: 'paymentMethod', title: '付款方式', width: 140, align: 'center' },
    {
      key: 'status',
      title: '狀態',
      width: 140,
      align: 'center',
      render: (value?: string) => {
        const normalized = normalize(value ?? '');
        return (
          <StatusBadge variant={normalized} label={statusMap[normalized]} />
        );
      },
    },
    { key: 'date', title: '成立日期', width: 140, align: 'center' },
    {
      key: 'total',
      title: '金額',
      width: 140,
      align: 'right',
      render: (value?: number) => `TWD ${Number(value ?? 0).toLocaleString()}`,
    },
    {
      key: 'detail',
      title: '訂單詳情',
      width: 140,
      align: 'center',
      render: (_, row) => (
        <button
          className="text-[#DCBB87] hover:underline underline-offset-4 transition-colors"
          onClick={() => router.push(`/member-center/dutyfree/${row.id}`)}
        >
          前往查看
        </button>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-end mb-3 text-sm text-[#666]">
        共 {orders.length} 筆訂單
      </div>

      {orders.length > 0 ? (
        <OrderTable columns={columns} data={orders} />
      ) : (
        <EmptyState message="尚無免稅商品訂單" />
      )}
    </div>
  );
}
