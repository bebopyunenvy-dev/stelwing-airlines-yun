'use client';

import { Clock3 } from 'lucide-react';

export type FlightItem = {
  originIata: string;
  destinationIata: string;
  flightId: any;
  flightNo: string;
  leg: {
    originCode: string;
    originName: string;
    depTime: string; // "09:00"
    destinationCode: string;
    destinationName: string;
    arrTime: string; // "12:30"
    duration?: string;
  };
  price: number;
  currency: string; // "TWD"
  cabin: string; // "經濟艙"
};

export default function FlightCard({
  data,
  dir, // 'outbound' | 'inbound'
  isSelected = false,
  isDisabled = false,
  onBook,
  onCancel,
}: {
  data: FlightItem;
  dir: 'outbound' | 'inbound';
  /** 是否為已選中的航班（由外部控制） */
  isSelected?: boolean;
  /** 已選了同方向的另一張票時，這張暫時不能點（由外部控制） */
  isDisabled?: boolean;
  /** 點「訂購」要做的事（通常進票價頁） */
  onBook: (f: FlightItem) => void;
  /** 已選狀態下點「取消」 */
  onCancel?: (f: FlightItem) => void;
}) {
  const { flightNo, leg, price, currency } = data;

  // 只有「不是已選中」且被鎖定時才視為不可互動
  const locked = !isSelected && isDisabled;

  return (
    <div
      className={[
        'rounded-2xl p-6 shadow-[var(--sw-shadow-1)]',
        'bg-[var(--sw-primary)] text-[var(--sw-white)]',
        locked ? 'opacity-60' : '',
      ].join(' ')}
      aria-disabled={locked ? true : undefined}
    >
      <div className="text-[12px] opacity-70 mb-2">{flightNo}</div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* 出發 */}
        <div>
          <div className="text-3xl font-extrabold leading-none">
            {leg.depTime}
          </div>
          <div className="text-[12px] mt-1 opacity-90">
            {leg.originCode} {leg.originName}
          </div>
        </div>

        {/* 直飛 / 時長 */}
        <div className="flex flex-col items-center">
          <span className="text-[12px] opacity-80">直飛</span>
          <Clock3 className="w-4 h-4 opacity-70 mt-1" />
          {leg.duration ? (
            <span className="text-[12px] opacity-80 mt-1">{leg.duration}</span>
          ) : null}
        </div>

        {/* 抵達 */}
        <div className="text-right">
          <div className="text-3xl font-extrabold leading-none">
            {leg.arrTime}
          </div>
          <div className="text-[12px] mt-1 opacity-90">
            {leg.destinationCode} {leg.destinationName}
          </div>
        </div>
      </div>

      {/* 價格 + 操作 */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <div className="mr-auto text-right">
          <div className="text-[12px] opacity-80">含稅自</div>
          <div className="text-xl font-extrabold">
            {currency} {price.toLocaleString('zh-TW')}
          </div>
        </div>

        {isSelected ? (
          <>
            <button
              type="button"
              className="cursor-default rounded-full bg-[color:var(--sw-accent)]/80 text-[var(--sw-black)] font-semibold px-4 py-2"
              aria-disabled
            >
              已選擇
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--sw-white)]/40 px-4 py-2 hover:bg-white/10"
              onClick={() => onCancel?.(data)}
            >
              取消
            </button>
          </>
        ) : locked ? (
          <button
            type="button"
            disabled
            aria-disabled
            className="rounded-full bg-[color:var(--sw-accent)]/40 text-[var(--sw-black)]/60 font-semibold px-5 py-2 cursor-not-allowed"
            title="請先取消已選航班"
          >
            已選擇其他航班
          </button>
        ) : (
          // 可訂購
          <button
            type="button"
            className="rounded-full bg-[color:var(--sw-accent)] text-[var(--sw-black)] font-semibold px-5 py-2 hover:opacity-90"
            onClick={() => onBook(data)}
          >
            訂購
          </button>
        )}
      </div>
    </div>
  );
}
