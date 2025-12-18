'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FareDetailsFromStore } from '../components/FareDetailsModal';
import FareBundleCard, { FareBundle } from './components/FareBundleCard';

function buildBundles(currency = 'TWD'): FareBundle[] {
  return [
    {
      id: 'value',
      name: '超值',
      price: 3232,
      currency,
      features: [
        { key: 'hand', label: '手提行李', included: true },
        { key: 'checked', label: '托運行李', included: true },
        { key: 'seat', label: '座位選擇', included: true },
        { key: 'meal', label: '組合餐點', included: false },
        { key: 'refund', label: '退票費用', included: false, note: 'TWD 1000' },
      ],
    },
    {
      id: 'basic',
      name: '基本',
      price: 4100,
      currency,
      features: [
        { key: 'hand', label: '手提行李', included: true },
        { key: 'checked', label: '托運行李', included: true },
        { key: 'seat', label: '座位選擇', included: true },
        { key: 'meal', label: '組合餐點', included: true },
        { key: 'refund', label: '退票費用', included: false, note: '—' },
      ],
    },
    {
      id: 'luxury',
      name: '豪華',
      price: 4500,
      currency,
      features: [
        { key: 'hand', label: '手提行李', included: true },
        { key: 'checked', label: '托運行李', included: true },
        { key: 'seat', label: '座位選擇', included: true },
        { key: 'meal', label: '組合餐點', included: true },
        { key: 'refund', label: '退票費用', included: false, note: '—' },
      ],
    },
  ];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('zh-Hant', { maximumFractionDigits: 0 }).format(n);

export default function FarePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const dir = (sp.get('dir') as 'outbound' | 'inbound') ?? 'outbound';
  const flightNo = sp.get('flightNo') ?? '';
  const flightIdParam = sp.get('flightId'); // ← 從 Query 帶進來
  const flightId = flightIdParam ? Number(flightIdParam) : undefined;
  const currency = sp.get('currency') ?? 'TWD';

  const bundles = useMemo(() => buildBundles(currency), [currency]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FareBundle | null>(null);

  const handleSelect = (b: FareBundle) => {
    setSelected(b);
    setOpen(true);
  };

  const handleBack = () => {
    setOpen(false);
    router.back();
  };

  // 確認票價 → 寫入 sessionStorage（一定包含 flightId，如果 query 有帶）
  const handleConfirm = () => {
    if (!selected) return;
    const key = dir === 'outbound' ? 'fare_outbound' : 'fare_inbound';

    const payload: any = {
      finalFare: selected.price,
      flightNo,
      currency,
      cabin: '經濟艙',
    };

    // 有帶就一起存；沒有也沒關係，列表頁會自動補上
    if (typeof flightId === 'number' && !Number.isNaN(flightId)) {
      payload.flightId = flightId;
    }

    sessionStorage.setItem(key, JSON.stringify(payload));
    router.back(); // 回航班列表（或改成直接跳 passenger 頁也可）
  };

  return (
    <div>
      <main className="mx-auto w-full px-4 py-8">
        <h2 className="text-xl font-extrabold mb-6">
          {dir === 'inbound' ? '回程 票價組合' : '去程 票價組合'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((b) => (
            <FareBundleCard
              key={b.id}
              bundle={b}
              onSelect={() => handleSelect(b)}
            />
          ))}
        </div>
        {/* 掛 store 版本的彈窗（跨頁可用） */}
        <FareDetailsFromStore />
      </main>

      {open && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-[101] w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold mb-3">確認票價組合</h3>
            <div className="mb-4 rounded-xl bg-[var(--sw-primary)] text-[var(--sw-white)] p-4">
              <div className="text-sm opacity-80 mb-1">
                {dir === 'inbound' ? '回程' : '去程'}：{flightNo}
              </div>
              <div className="text-xl font-extrabold">{selected.name}</div>
              <div className="mt-1 text-sm opacity-90">
                價格：{currency} {fmt(selected.price)}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="sw-btn sw-btn--grey-primary"
                onClick={handleBack}
              >
                返回上一頁
              </button>
              <button
                className="sw-btn sw-btn--gold-primary"
                onClick={handleConfirm}
              >
                確認此票種
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
