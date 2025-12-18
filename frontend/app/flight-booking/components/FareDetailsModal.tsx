'use client';

import { useBookingStore } from '@/src/store/bookingStore';
import { X } from 'lucide-react';
import { useEffect } from 'react';

/* =======================
 * Types
 * ======================= */
export type Segment = {
  title: '去程' | '回程';
  flightNo: string;
  originCode: string;
  originName: string;
  depTime: string; // 已格式化 e.g. "08:35"
  destinationCode: string;
  destinationName: string;
  arrTime: string; // 已格式化
  cabin?: string; // 經濟艙…
  fare: number; // 小計
  currency?: string; // TWD
};

type Props = {
  open: boolean;
  onClose: () => void;
  outbound?: Segment | null;
  inbound?: Segment | null;
  total: number;
  currency?: string;
};

/* =======================
 * Modal 本體（純展示）
 * ======================= */
export function FareDetailsModal({
  open,
  onClose,
  outbound,
  inbound,
  total,
  currency = 'TWD',
}: Props) {
  // ESC 關閉
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* 卡片 */}
      <div className="relative z-10 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-[color:var(--sw-grey)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--sw-grey)]/50">
          <h3 className="text-base md:text-lg font-bold text-[color:var(--sw-primary)]">
            查看明細
          </h3>
          <button
            className="sw-btn sw-btn--outline rounded-full px-3 py-1"
            onClick={onClose}
            aria-label="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* 去程 */}
          {outbound && <DetailRow seg={outbound} />}

          {/* 回程 */}
          {inbound && <DetailRow seg={inbound} />}

          {/* 總計 */}
          <div className="flex items-center justify-between border-t border-[color:var(--sw-grey)]/60 pt-4">
            <div className="text-[color:var(--sw-primary)] font-semibold">
              應付總額
            </div>
            <div className="text-xl font-extrabold text-[color:var(--sw-primary)]">
              {currency} {total.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 pt-2 flex justify-end">
          <button
            className="sw-btn sw-btn--gold-primary rounded-full"
            onClick={onClose}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
 * 從 store 綁定的容器（掛在 layout）
 * ======================= */
export function FareDetailsFromStore() {
  const open = useBookingStore((s) => s.detailsOpen);
  const onClose = useBookingStore((s) => s.closeDetails);
  const outbound = useBookingStore((s) => s.outbound);
  const inbound = useBookingStore((s) => s.inbound);
  const currency = useBookingStore((s) => s.currency);
  const baseFare = useBookingStore((s) => s.price.baseFare);
  const extrasTotal = useBookingStore((s) => s.price.extrasTotal);

  const total = (baseFare ?? 0) + (extrasTotal ?? 0);

  return (
    <FareDetailsModal
      open={open}
      onClose={onClose}
      outbound={outbound ?? undefined}
      inbound={inbound ?? undefined}
      total={total}
      currency={currency ?? 'TWD'}
    />
  );
}

/* =======================
 * 子項目：單段明細
 * ======================= */
function DetailRow({ seg }: { seg: Segment }) {
  return (
    <div className="rounded-xl border border-[color:var(--sw-grey)]/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">
          {seg.title}・{seg.flightNo}・{seg.cabin ?? '經濟艙'}
        </div>
        <div className="text-sm font-bold">TWD {seg.fare.toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-[#F7F7F7] p-3">
          <div className="font-medium">
            {seg.originCode} {seg.originName}
          </div>
          <div className="opacity-70">出發 {seg.depTime}</div>
        </div>
        <div className="rounded-lg bg-[#F7F7F7] p-3">
          <div className="font-medium">
            {seg.destinationCode} {seg.destinationName}
          </div>
          <div className="opacity-70">抵達 {seg.arrTime}</div>
        </div>
      </div>
    </div>
  );
}
