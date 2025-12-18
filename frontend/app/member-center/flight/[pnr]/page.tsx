'use client';

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  PenSquare,
  Trash,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ========== Types ========== */
type BookingDetail = {
  detailId: number | string;
  tripType: 'OB' | 'IB';
  seat?: { seatNumber: string | null } | null;
  baggage?: { weightKg: number | null; price?: number | null } | null;
  meal?: { mealName: string | null; price?: number | null } | null;
  flight: {
    flightNumber: string;
    flightDate: string;
    originIata: string;
    destinationIata: string;
    depTimeUtc: string;
    arrTimeUtc: string;
  };
};

type Booking = {
  bookingId: number;
  pnr: string;
  currency: string;
  totalAmount: number;
  paymentMethod: string | null;
  paymentStatus: string | null;
  createdAt: string;
  details: BookingDetail[];
};

/* ========== Utils ========== */
const fmtMoney = (n: number, currency = 'TWD') =>
  `${currency} ${Number(n || 0).toLocaleString('zh-TW', {
    maximumFractionDigits: 0,
  })}`;

function formatDateMD(dateStr?: string | null): string {
  if (!dateStr) return '--';

  const pure = dateStr.includes('T') ? dateStr.slice(0, 10) : dateStr;
  const [y, m, d] = pure.split('-').map((v) => Number(v));

  if (!y || !m || !d) return pure;

  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  return `${String(d).padStart(2, '0')} ${months[m - 1] ?? ''}`;
}

function formatTimeHM(iso?: string | null): string {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleTimeString('zh-TW', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getBoardingTime(depIso?: string | null): string {
  if (!depIso) return '--';
  const d = new Date(depIso);
  d.setMinutes(d.getMinutes() - 30);
  return d.toLocaleTimeString('zh-TW', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ========== Popup Modal ========== */
type ResultModalProps = {
  open: boolean;
  title: string;
  heading: string;
  description: string;
  buttonLabel: string;
  variant?: 'primary' | 'danger';
  onClose: () => void; // 按右上角 X
  onConfirm?: () => void; // 按底下大按鈕
};

function ResultModal({
  open,
  title,
  heading,
  description,
  buttonLabel,
  variant = 'primary',
  onClose,
  onConfirm,
}: ResultModalProps) {
  if (!open) return null;

  const baseBtn =
    'mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold transition';
  const btnClass =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[color:var(--sw-primary)] text-white hover:bg-[#122030]';

  const handleButtonClick = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[90%] max-w-md rounded-3xl bg-white px-8 py-7 shadow-xl">
        {/* 關閉 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[#999] hover:text-[#333]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 小標 */}
        <div className="text-xs font-semibold text-[color:var(--sw-accent,#D9B37B)]">
          {title}
        </div>

        {/* 大標 */}
        <div className="mt-2 text-lg font-semibold text-[#1F2E3C]">
          {heading}
        </div>

        {/* 說明 */}
        <div className="mt-3 text-sm leading-relaxed text-[#666]">
          {description}
        </div>

        {/* 按鈕 */}
        <button
          type="button"
          onClick={handleButtonClick}
          className={`${baseBtn} ${btnClass}`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

/* ========== BoardingPass（純 UI） ========== */
type BoardingPassProps = {
  title: string;
  directionLabel: string;
  detail: BookingDetail;
  currency: string;
  onChange: () => void;
};

function BoardingPassSection({
  title,
  directionLabel,
  detail,
  currency,
  onChange,
}: BoardingPassProps) {
  const f = detail.flight;
  const dateLabel = formatDateMD(f.flightDate);
  const boardingTime = getBoardingTime(f.depTimeUtc);
  const depTime = formatTimeHM(f.depTimeUtc);
  const arrTime = formatTimeHM(f.arrTimeUtc);

  const seatNo = detail.seat?.seatNumber || '--';
  const gate = detail.tripType === 'OB' ? 'A2' : 'B5';

  const baggageText = detail.baggage?.weightKg
    ? `托運行李 ${detail.baggage.weightKg}kg`
    : '無托運行李';

  const mealText = detail.meal?.mealName || '未選擇餐點';

  const baggagePrice = detail.baggage?.price || 0;
  const mealPrice = detail.meal?.price || 0;
  const legExtras = baggagePrice + mealPrice;

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-3 text-[color:var(--sw-primary)]">
        <ArrowRight className="h-4 w-4" />
        <span className="text-sm">{title}</span>
        <span className="text-sm font-semibold">{directionLabel}</span>
      </div>

      {/* Boarding Pass 卡片 */}
      <div className="overflow-hidden rounded-2xl border border-[#D9B37B]/70 bg-white shadow-sm">
        <div className="flex items-center justify-between bg-[color:var(--sw-primary)] px-6 py-3 text-white">
          <div className="text-lg font-semibold tracking-wide">STELWING</div>
          <div className="text-sm font-semibold tracking-[0.1em]">
            BOARDING PASS
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* 左半 */}
          <div className="flex-1 border-b border-dashed border-[#DADADA] px-6 py-5 md:border-b-0 md:border-r">
            <div className="mb-4 text-sm font-semibold text-[color:var(--sw-primary)]">
              CHECKIN
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-xs text-[#444] md:grid-cols-4">
              <InfoRow label="FLIGHT 航班" value={f.flightNumber} />
              <InfoRow label="DATE 日期" value={dateLabel} />
              <InfoRow label="BOARDING 登機時間" value={boardingTime} />
              <InfoRow label="GATE 登機門" value={gate} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-y-3 text-xs text-[#444] md:grid-cols-3">
              <InfoRow label="DEPARTURE 出發" value={depTime} />
              <InfoRow label="ARRIVAL 抵達" value={arrTime} />
              <InfoRow label="SEAT 座位" value={seatNo} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-dashed border-[#E5E5E5] pt-4 text-xs">
              <InfoRow label="FROM 從" value={f.originIata} />
              <InfoRow label="TO 到" value={f.destinationIata} />
            </div>
          </div>

          {/* 右半 */}
          <div className="flex-1 bg-[#F7F7F7] px-6 py-5">
            <div className="mb-4 text-sm font-semibold text-[color:var(--sw-primary)]">
              CHECKIN
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-xs text-[#444]">
              <InfoRow label="FLIGHT 航班" value={f.flightNumber} />
              <InfoRow label="SEAT 座位" value={seatNo} />
            </div>

            <div className="mt-4 border-t border-dashed border-[#E5E5E5] pt-4 text-xs">
              <div className="mb-1">
                <span className="mr-2 font-semibold">行李</span>
                <span>{baggageText}</span>
              </div>
              <div>
                <span className="mr-2 font-semibold">餐點</span>
                <span>{mealText}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#1F2E3C]">
              <span>本段加價項目</span>
              <span>{fmtMoney(legExtras, currency)}</span>
            </div>
          </div>
        </div>

        {/* 按鈕 */}
        <div className="mt-3 flex justify-end gap-3 p-4">
          <button
            onClick={onChange}
            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--sw-primary)] px-4 py-2 text-sm font-semibold text-[color:var(--sw-primary)] hover:bg-[color:var(--sw-primary)] hover:text-white"
          >
            <PenSquare className="h-4 w-4" /> 改票
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="uppercase text-[11px] opacity-70">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[#1F2E3C]">{value}</div>
    </div>
  );
}

/* ========== 主頁面 ========== */
type ModalMode = 'confirm-refund' | 'result';

type ModalConfig = {
  title: string;
  heading: string;
  description: string;
  buttonLabel: string;
  variant: 'primary' | 'danger';
  mode: ModalMode;
};

export default function FlightTicketPage() {
  const { pnr } = useParams<{ pnr: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 整張訂單退票的 loading
  const [refundLoading, setRefundLoading] = useState(false);

  // popup 狀態
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: '',
    heading: '',
    description: '',
    buttonLabel: '',
    variant: 'primary',
    mode: 'result',
  });

  /* 載入訂單資料 */
  useEffect(() => {
    if (!pnr) return;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('stelwing_token')
        : null;

    if (!token) {
      router.push('/member-center/login');
      return;
    }

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3007/api/flight-booking/bookings/${pnr}`,
          {
            cache: 'no-store',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          router.push('/member-center/login');
          return;
        }

        const json = await res.json();

        if (!json.success) throw new Error(json.message);

        setBooking(json.data);
      } catch (err: any) {
        setError(err?.message || '讀取失敗');
      } finally {
        setLoading(false);
      }
    })();
  }, [pnr, router]);

  /* 改票（仍然分去程/回程，先維持原生 confirm） */
  // const handleChangeTicket = async (trip: 'OB' | 'IB') => {
  //   const confirmMsg =
  //     trip === 'OB' ? '確定要進行去程改票？' : '確定要進行回程改票？';
  //   if (!window.confirm(confirmMsg)) return;

  //   try {
  //     setActionLoading(true);
  //     const fakeNewFlightId = trip === 'OB' ? 999 : 998;

  //     const res = await fetch(
  //       `http://localhost:3007/api/flight-booking/bookings/${pnr}/change`,
  //       {
  //         method: 'PATCH',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           outboundFlightId: trip === 'OB' ? fakeNewFlightId : undefined,
  //           inboundFlightId: trip === 'IB' ? fakeNewFlightId : undefined,
  //         }),
  //       }
  //     );

  //     const json = await res.json();
  //     if (!json.success) throw new Error(json.message);

  //     router.refresh();

  //     // 改票完成 popup（深色按鈕）
  //     setModalConfig({
  //       title: '改票完成',
  //       heading: trip === 'OB' ? '您的去程航班已更新' : '您的回程航班已更新',
  //       description:
  //         '最新航班資訊已同步至電子機票頁面，您可以在「機票訂單 > 電子機票」中查看完整細節。',
  //       buttonLabel: '返回機票訂單',
  //       variant: 'primary',
  //       mode: 'result',
  //     });
  //     setModalOpen(true);
  //   } catch (err: any) {
  //     setModalConfig({
  //       title: '改票失敗',
  //       heading: '改票未能順利完成',
  //       description: err?.message || '改票失敗，請稍後再試。',
  //       buttonLabel: '關閉',
  //       variant: 'danger',
  //       mode: 'result',
  //     });
  //     setModalOpen(true);
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  /* 真正執行退票的函式（打 API + 顯示結果 popup） */
  const doRefundBooking = async () => {
    if (!booking) return;

    try {
      setRefundLoading(true);

      const token = localStorage.getItem('stelwing_token');

      const res = await fetch(
        `http://localhost:3007/api/flight-booking/bookings/${booking.pnr}/refund`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error('退票失敗：', json);
        setModalConfig({
          title: '退票失敗',
          heading: '退票未能順利完成',
          description: json.message || '退票失敗，請稍後再試。',
          buttonLabel: '關閉',
          variant: 'danger',
          mode: 'result',
        });
        setModalOpen(true);
        return;
      }

      // 更新前端狀態為已退票
      setBooking((prev) =>
        prev
          ? {
              ...prev,
              paymentStatus: 'refunded',
            }
          : prev
      );

      // 退票完成 popup（紅色警示按鈕）
      setModalConfig({
        title: '退票完成',
        heading: '您的訂單已完成退票',
        description:
          '本筆訂單的去程與回程航班皆已取消，退款將依照原支付方式退回，實際入帳時間以銀行與發卡行作業為準。',
        buttonLabel: '返回機票訂單',
        variant: 'danger',
        mode: 'result',
      });
      setModalOpen(true);
    } catch (e) {
      console.error('退票請求錯誤：', e);
      setModalConfig({
        title: '退票失敗',
        heading: '退票未能順利完成',
        description: '退票失敗，請稍後再試。',
        buttonLabel: '關閉',
        variant: 'danger',
        mode: 'result',
      });
      setModalOpen(true);
    } finally {
      setRefundLoading(false);
    }
  };

  /* 退票：整張訂單一起退（只負責打開「確認退票」 popup） */
  const handleRefundBooking = () => {
    if (!booking) return;

    setModalConfig({
      title: '退票確認',
      heading: '確定要退掉這筆訂單的所有機票嗎？',
      description:
        '確定後，本筆訂單的去程與回程航班皆會一併取消，退款將依照原支付方式退回。',
      buttonLabel: '確認退票',
      variant: 'danger',
      mode: 'confirm-refund',
    });
    setModalOpen(true);
  };

  /* Loading / Error UI */
  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-10 text-[#666]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        票券載入中…
      </div>
    );
  }

  if (!booking || error) {
    return (
      <div className="py-10 text-center">
        <div className="mb-3 text-lg font-semibold text-[color:var(--sw-primary)]">
          電子機票載入失敗
        </div>
        <div className="mb-4 text-sm">{error}</div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center rounded-full border border-[color:var(--sw-primary)] px-4 py-2 text-sm text-[color:var(--sw-primary)]"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回
        </button>
      </div>
    );
  }

  const currency = booking.currency;
  const outbound = booking.details.find((d) => d.tripType === 'OB');
  const inbound = booking.details.find((d) => d.tripType === 'IB');

  /* 計算金額 */
  const isRoundTrip = Boolean(outbound && inbound);

  const basePerLeg = isRoundTrip
    ? Math.round((booking.totalAmount || 0) / 2)
    : booking.totalAmount || 0;

  const obExtras =
    (outbound?.baggage?.price || 0) + (outbound?.meal?.price || 0);
  const ibExtras = (inbound?.baggage?.price || 0) + (inbound?.meal?.price || 0);

  const obTotal = basePerLeg + obExtras;
  const ibTotal = isRoundTrip ? basePerLeg + ibExtras : 0;

  return (
    <>
      <div className="w-full space-y-6 py-6">
        {/* 返回 */}
        <div>
          <button
            onClick={() => router.push('/member-center/flight')}
            className="inline-flex items-center text-sm text-[color:var(--sw-primary)]"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回機票訂單
          </button>
        </div>

        {/* 去程 */}
        {outbound && (
          <>
            <BoardingPassSection
              title="去程"
              directionLabel={`${outbound.flight.originIata} → ${outbound.flight.destinationIata}`}
              detail={outbound}
              currency={currency}
              onChange={() =>
                router.push(`/member-center/flight/change/${pnr}/OB`)
              }
            />

            {/* 去程費用 */}
            <CostCard
              title="去程機票費用"
              currency={currency}
              base={basePerLeg}
              baggagePrice={outbound?.baggage?.price || 0}
              baggageText={
                outbound?.baggage?.weightKg
                  ? `托運行李 ${outbound.baggage.weightKg}kg`
                  : '無托運行李'
              }
              mealPrice={outbound?.meal?.price || 0}
              mealText={outbound?.meal?.mealName || '—'}
              total={obTotal}
            />
          </>
        )}

        {/* 回程 */}
        {inbound && (
          <>
            <BoardingPassSection
              title="回程"
              directionLabel={`${inbound.flight.originIata} → ${inbound.flight.destinationIata}`}
              detail={inbound}
              currency={currency}
              onChange={() =>
                router.push(`/member-center/flight/change/${pnr}/IB`)
              }
            />

            {/* 回程費用 */}
            <CostCard
              title="回程機票費用"
              currency={currency}
              base={basePerLeg}
              baggagePrice={inbound?.baggage?.price || 0}
              baggageText={
                inbound?.baggage?.weightKg
                  ? `托運行李 ${inbound.baggage.weightKg}kg`
                  : '無托運行李'
              }
              mealPrice={inbound?.meal?.price || 0}
              mealText={inbound?.meal?.mealName || '—'}
              total={ibTotal}
            />
          </>
        )}

        {/* 整趟總計 + 已退票標記 */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#E3E3E3] bg-white px-5 py-4 text-sm font-semibold text-[color:var(--sw-primary)] shadow-sm">
          <span>
            整趟機票總計
            {booking.paymentStatus === 'refunded' && (
              <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                已退票
              </span>
            )}
          </span>
          <span>
            {fmtMoney(booking.totalAmount || obTotal + ibTotal, currency)}
          </span>
        </div>

        {/* 退訂單按鈕（只在尚未退票時顯示） */}
        {booking.paymentStatus !== 'refunded' && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleRefundBooking}
              disabled={refundLoading}
              className={`
    inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold 
    border shadow-sm 
    ${
      refundLoading
        ? 'cursor-not-allowed bg-red-400 text-white border-red-400'
        : 'text-red-600 border-red-600 hover:bg-red-700 hover:text-white'
    }
  `}
            >
              {refundLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  退票處理中…
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  整張訂單退票
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 成功 / 確認 Popup */}
      <ResultModal
        open={modalOpen}
        title={modalConfig.title}
        heading={modalConfig.heading}
        description={modalConfig.description}
        buttonLabel={modalConfig.buttonLabel}
        variant={modalConfig.variant}
        onClose={() => setModalOpen(false)} // 按 X 只是關閉 popup
        onConfirm={async () => {
          // 1) 確認退票：按下「確認退票」→ 去真的執行退票
          if (modalConfig.mode === 'confirm-refund') {
            setModalOpen(false);
            await doRefundBooking();
            return;
          }

          // 2) 結果 popup
          //    - 退票完成：只關閉 popup，留在本頁
          //    - 改票完成：關閉後導回機票訂單列表
          setModalOpen(false);

          if (modalConfig.title === '改票完成') {
            router.push('/member-center/flight');
          }
        }}
      />
    </>
  );
}

/* ========== 費用卡片 Component ========== */
function CostCard({
  title,
  currency,
  base,
  baggageText,
  baggagePrice,
  mealText,
  mealPrice,
  total,
}: {
  title: string;
  currency: string;
  base: number;
  baggageText: string;
  baggagePrice: number;
  mealText: string;
  mealPrice: number;
  total: number;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-[#E3E3E3] bg-white p-5 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-[color:var(--sw-primary)]">
        {title}
      </div>

      <div className="space-y-1 text-sm text-[#555]">
        <div className="flex items-center justify-between">
          <span>票價 基本方案</span>
          <span>{fmtMoney(base, currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>行李 {baggageText}</span>
          <span>{fmtMoney(baggagePrice, currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>餐點 {mealText}</span>
          <span>{fmtMoney(mealPrice, currency)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#E5E5E5] pt-3 text-sm font-semibold text-[color:var(--sw-primary)]">
        <span>本段總計</span>
        <span>{fmtMoney(total, currency)}</span>
      </div>
    </div>
  );
}
