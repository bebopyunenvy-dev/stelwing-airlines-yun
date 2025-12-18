'use client';

import { ArrowLeft, Loader2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

/* ========== Types ========== */

type BookingDetail = {
  tripType: 'OB' | 'IB';
  flight: {
    flightId: number | string; // 這裡我放寬成 number | string，方便 runtime 轉型
    flightDate: string;
    originIata: string;
    destinationIata: string;
    depTimeUtc: string;
    arrTimeUtc: string;
  };
};

type Booking = {
  pnr: string;
  currency: string;
  details: BookingDetail[];
};

type FlightItem = {
  flightId: number;
  flightNo: string;
  flightDate: string; // YYYY-MM-DD
  originIata: string;
  destinationIata: string;
  depTimeUtc: string;
  arrTimeUtc: string;
  price: number;
};

/* ========== Utils ========== */

function formatTimeHM(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString('zh-TW', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(n: number, currency = 'TWD') {
  return `${currency} ${Number(n || 0).toLocaleString('zh-TW', {
    maximumFractionDigits: 0,
  })}`;
}

function getPeriodLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const h = d.getHours();
  if (h < 12) return '上午';
  if (h < 18) return '下午';
  return '晚上';
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const wk = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return `${mm}/${dd} 週${wk}`;
}

/* ========== 改票專用卡片 ========== */

type ChangeFlightCardProps = {
  flight: FlightItem;
  currency: string;
  isSelected: boolean;
  isOriginal: boolean;
  isDisabled: boolean; // 受「已選購」狀態影響而鎖定
  onSelect: () => void;
  onCancel: () => void;
};

function ChangeFlightCard({
  flight,
  currency,
  isSelected,
  isOriginal,
  isDisabled,
  onSelect,
  onCancel,
}: ChangeFlightCardProps) {
  const depTime = formatTimeHM(flight.depTimeUtc);
  const arrTime = formatTimeHM(flight.arrTimeUtc);
  const period = getPeriodLabel(flight.depTimeUtc);

  // 只要是原始航班，或被鎖且不是已選中，就不能操作
  const reallyDisabled = isOriginal || (isDisabled && !isSelected);

  const containerBase =
    'w-full rounded-3xl border px-6 py-5 shadow-sm transition bg-[color:var(--sw-primary)] text-white';

  const stateStyle = reallyDisabled
    ? 'border-white/10 opacity-60 cursor-not-allowed'
    : isSelected
      ? 'border-[color:var(--sw-accent)] ring-2 ring-[color:var(--sw-accent)]/60 cursor-pointer'
      : 'border-transparent hover:border-[color:var(--sw-accent)]/60 cursor-pointer';

  const handleClick = () => {
    if (reallyDisabled) return;
    if (isSelected) onCancel();
    else onSelect();
  };

  return (
    <div className={`${containerBase} ${stateStyle}`} onClick={handleClick}>
      {/* 上排：航班編號 + 時段 + 路線 */}
      <div className="mb-3 flex items-center justify-between text-xs tracking-wide">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
            {flight.flightNo}
          </span>
          <span className="text-white/80">{period}</span>
        </div>
        <span className="text-white/70 text-[11px]">
          {flight.originIata} → {flight.destinationIata}
        </span>
      </div>

      {/* 中間：左右兩排 出發 / 抵達 */}
      <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between">
        {/* 出發 */}
        <div className="flex-1">
          <div className="mb-1 text-[11px] text-white/70">出發</div>
          <div className="text-lg font-semibold leading-tight">{depTime}</div>
          <div className="mt-1 text-xs text-white/80">{flight.originIata}</div>
        </div>

        {/* 中間：直飛標示 */}
        <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:px-4">
          <span className="mb-1 h-[1px] w-14 bg-white/40" />
          <span className="text-[11px] text-white/80">直飛</span>
          <span className="mt-1 h-[1px] w-14 bg-white/40" />
        </div>

        {/* 抵達 */}
        <div className="flex-1 text-right md:text-left">
          <div className="mb-1 text-[11px] text-white/70">抵達</div>
          <div className="text-lg font-semibold leading-tight">{arrTime}</div>
          <div className="mt-1 text-xs text-white/80">
            {flight.destinationIata}
          </div>
        </div>

        {/* 右側：金額 + 狀態按鈕 */}
        <div className="mt-4 flex flex-col items-end justify-between md:mt-0 md:w-40">
          <div className="text-[11px] text-white/60">全票</div>
          <div className="text-base font-semibold">
            {formatMoney(flight.price, currency)}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            {isOriginal ? (
              <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white">
                目前航班
              </span>
            ) : isSelected ? (
              <>
                <span className="inline-flex items-center rounded-full bg-[color:var(--sw-accent)] px-4 py-1.5 text-xs font-semibold text-[color:var(--sw-primary)]">
                  已選購
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  className="inline-flex items-center rounded-full border border-[color:var(--sw-accent)] bg-transparent px-4 py-1.5 text-xs font-semibold text-[color:var(--sw-accent)] hover:bg-[color:var(--sw-accent)]/10"
                >
                  取消
                </button>
              </>
            ) : reallyDisabled ? (
              <span className="inline-flex items-center rounded-full bg-[color:var(--sw-accent)]/40 px-4 py-1.5 text-xs font-semibold text-[color:var(--sw-primary)]/60">
                訂購
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="inline-flex items-center rounded-full bg-[color:var(--sw-accent)] px-4 py-1.5 text-xs font-semibold text-[color:var(--sw-primary)] hover:bg-[#e3c28f]"
              >
                訂購
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== 主頁面 ========== */

export default function ChangeFlightPage() {
  const router = useRouter();
  const params = useParams<{ pnr: string; trip: string }>();

  const pnr = params.pnr;
  // 統一轉成 OB / IB，大寫避免未來 route 寫 ob / ib 也能吃
  const trip = (params.trip || 'OB').toUpperCase() as 'OB' | 'IB';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [selected, setSelected] = useState<FlightItem | null>(null);

  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 這張訂單中，當前 trip (OB/IB) 的「原本航班」全部鎖起來
  const originalFlightIds = useMemo(() => {
    if (!booking) return new Set<number>();

    const ids = booking.details
      .filter((d) => d.tripType === trip) // 只看這一段（去程 / 回程）
      .map((d) => Number(d.flight.flightId)); // 一律轉成 number

    return new Set(ids);
  }, [booking, trip]);

  /* Step 1：載入訂單 */
  useEffect(() => {
    (async () => {
      try {
        setLoadingBooking(true);
        setError(null);

        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('stelwing_token')
            : null;

        if (!token) {
          router.push('/member-center/login');
          return;
        }

        const res = await fetch(
          `http://localhost:3007/api/flight-booking/bookings/${pnr}`,
          {
            cache: 'no-store',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || '訂單載入失敗');
        }

        setBooking(json.data as Booking);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || '訂單載入失敗');
      } finally {
        setLoadingBooking(false);
      }
    })();
  }, [pnr, router]);

  /* Step 2：載入全部航班 → 篩同航線 */
  useEffect(() => {
    if (!booking) return;

    const seg = booking.details.find((d) => d.tripType === trip);
    if (!seg) {
      setError('找不到對應的航段，無法改票');
      return;
    }

    (async () => {
      try {
        setLoadingFlights(true);
        setError(null);

        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('stelwing_token')
            : null;

        const res = await fetch('http://localhost:3007/api/flight', {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        const raw = await res.json();

        const all: FlightItem[] = (raw || []).map((f: any) => ({
          flightId: Number(f.flightId), // 一律轉 number
          flightNo: f.flightNumber,
          flightDate:
            typeof f.flightDate === 'string'
              ? f.flightDate.slice(0, 10)
              : new Date(f.flightDate).toISOString().slice(0, 10),
          originIata: f.originIata,
          destinationIata: f.destinationIata,
          depTimeUtc:
            typeof f.depTimeUtc === 'string'
              ? f.depTimeUtc
              : new Date(f.depTimeUtc).toISOString(),
          arrTimeUtc:
            typeof f.arrTimeUtc === 'string'
              ? f.arrTimeUtc
              : new Date(f.arrTimeUtc).toISOString(),
          price: (f as any).price ?? 0,
        }));

        // 只挑與原航段「同一條航線」的航班
        const sameRoute = all.filter(
          (f) =>
            f.originIata === seg.flight.originIata &&
            f.destinationIata === seg.flight.destinationIata
        );

        setFlights(sameRoute);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || '載入航班失敗');
      } finally {
        setLoadingFlights(false);
      }
    })();
  }, [booking, trip]);

  /* Step 3：送出改票 */
  const handleConfirm = async () => {
    if (!selected) {
      alert('請先選擇新的航班');
      return;
    }

    try {
      setSubmitting(true);
      const body =
        trip === 'OB'
          ? { outboundFlightId: selected.flightId }
          : { inboundFlightId: selected.flightId };

      const token = localStorage.getItem('stelwing_token');

      const res = await fetch(
        `http://localhost:3007/api/flight-booking/bookings/${pnr}/change`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || '改票失敗');
      }

      setShowSuccessModal(true);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || '改票失敗');
    } finally {
      setSubmitting(false);
    }
  };

  /* 按日期分組航班 */
  const groupedByDate = useMemo(() => {
    const groups: Record<string, FlightItem[]> = {};
    for (const f of flights) {
      (groups[f.flightDate] ??= []).push(f);
    }
    const sortedKeys = Object.keys(groups).sort();
    return { groups, sortedKeys };
  }, [flights]);

  /* ========== UI ========== */

  const seg = booking?.details.find((d) => d.tripType === trip);
  const currency = booking?.currency || 'TWD';
  const originalDep = seg ? formatTimeHM(seg.flight.depTimeUtc) : '';
  const originalArr = seg ? formatTimeHM(seg.flight.arrTimeUtc) : '';
  const hasSelected = !!selected;

  if (loadingBooking) {
    return (
      <div className="flex w-full items-center justify-center py-10 text-[#666]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        訂單載入中…
      </div>
    );
  }

  if (!booking || !seg) {
    return (
      <div className="w-full py-10 text-center text-[#666]">
        <div className="mb-4 text-lg font-semibold text-[color:var(--sw-primary)]">
          找不到可改票的航段
        </div>
        <div className="mb-6 text-sm">{error || '請返回上一頁重新操作。'}</div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center rounded-full border border-[color:var(--sw-primary)] px-4 py-2 text-sm font-semibold text-[color:var(--sw-primary)]"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回電子機票
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 主要內容：寬度跟上方 tab 對齊 */}
      <div className="mx-auto w-full space-y-6 py-6">
        {/* 上方標題列 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/member-center/flight')}
            className="inline-flex items-center text-sm text-[color:var(--sw-primary)] hover:text-[color:var(--sw-accent)]"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回電子機票
          </button>

          <div className="text-right text-sm">
            <div className="mb-1 text-xs text-[#888]">正在改票</div>
            <div className="font-semibold text-[color:var(--sw-primary)]">
              {trip === 'OB' ? '去程' : '回程'}｜{seg.flight.originIata} →{' '}
              {seg.flight.destinationIata}
            </div>
            <div className="mt-1 text-xs text-[#666]">
              原航班：{formatDateLabel(seg.flight.flightDate)}　{originalDep} →{' '}
              {originalArr}
            </div>
          </div>
        </div>

        {/* 航班列表 */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[color:var(--sw-primary)]">
            請選擇新的航班
          </h2>

          {loadingFlights && (
            <div className="flex items-center py-6 text-sm text-[#666]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              載入可更換航班中…
            </div>
          )}

          {!loadingFlights && flights.length === 0 && (
            <div className="py-6 text-sm text-[#666]">
              目前沒有可更換的航班，請稍後再試或聯繫客服。
            </div>
          )}

          {/* 依日期分區 + 每區兩欄卡片 */}
          <div className="space-y-6">
            {groupedByDate.sortedKeys.map((dateKey) => (
              <div key={dateKey} className="space-y-3">
                {/* 日期標題列 */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E3E3E3]" />
                  <div className="text-xs font-semibold text-[color:var(--sw-primary)]">
                    {formatDateLabel(dateKey)}
                  </div>
                  <div className="h-px flex-1 bg-[#E3E3E3]" />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {groupedByDate.groups[dateKey].map((f) => {
                    const isSelected = selected?.flightId === f.flightId;

                    // 用 originalFlightIds 判斷「這張訂單原本就有的機票」
                    const isOriginal = originalFlightIds.has(
                      Number(f.flightId)
                    );

                    // 原本訂單裡的航班一律鎖住，
                    // 另外保留「已選一航班時，其他不能再選」的規則
                    const isDisabled =
                      isOriginal || (hasSelected && !isSelected);

                    return (
                      <ChangeFlightCard
                        key={f.flightId}
                        flight={f}
                        currency={currency}
                        isSelected={isSelected}
                        isOriginal={isOriginal}
                        isDisabled={isDisabled}
                        onSelect={() => setSelected(f)}
                        onCancel={() => setSelected(null)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 底部確認改票按鈕：金色 */}
        <div className="sticky bottom-0 bg-[#F7F7F7]/80 pt-3 pb-4 backdrop-blur">
          <button
            type="button"
            disabled={!selected || submitting}
            onClick={handleConfirm}
            className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--sw-accent)] px-4 py-3 text-sm font-semibold text-[color:var(--sw-primary)] disabled:opacity-60 hover:bg-[#e3c28f]"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                改票中…
              </>
            ) : selected ? (
              '確認改票'
            ) : (
              '請先選擇新的航班'
            )}
          </button>
        </div>
      </div>

      {/* 改票成功 modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="relative w-[90%] max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                router.push(`/member-center/flight/${pnr}`);
              }}
              className="absolute right-4 top-4 text-[#999] hover:text-[#666]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 text-sm font-semibold text-[color:var(--sw-accent)]">
              改票完成
            </div>
            <div className="mb-4 text-lg font-semibold text-[color:var(--sw-primary)]">
              您的{trip === 'OB' ? '去程' : '回程'}航班已更新
            </div>
            <div className="mb-6 text-sm text-[#555]">
              最新航班資訊已同步至電子機票頁面，您可以在「機票訂單 &gt;
              電子機票」中查看完整細節。
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                router.push(`/member-center/flight/${pnr}`);
              }}
              className="w-full rounded-full bg-[color:var(--sw-primary)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              返回電子機票
            </button>
          </div>
        </div>
      )}
    </>
  );
}
