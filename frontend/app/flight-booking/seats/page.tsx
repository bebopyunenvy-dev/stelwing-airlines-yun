'use client';

import clsx from 'clsx';
import { ChevronRight, User2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useBookingStore } from '../../../src/store/bookingStore';
import { FareDetailsFromStore } from '../components/FareDetailsModal';
import StepActions from '../components/StepActions';

/* ====================== Types ====================== */
type FareStore = {
  flightId?: number;
  flightNo?: string;
  finalFare?: number;
  currency?: string;
  cabin?: string;
  leg?: {
    originCode: string;
    destinationCode: string;
    depTime?: string;
    arrTime?: string;
  };
};

type Cabin = 'J' | 'Y';
type Seat = {
  id: string;
  row: number;
  col: 'A' | 'B' | 'C' | 'D';
  cabin: Cabin;
  isBlocked?: boolean;
  isOccupied?: boolean;
  seatFee?: number | null;
};

/** 旅客資料存在 sessionStorage 的型別（從 passenger page 存進來的） */
type PassengerFormStorage = {
  pax?: {
    gender?: 'M' | 'F';
    firstName?: string;
    lastName?: string;
    birthday?: string;
    nationality?: string;
    passportNo?: string;
    passportExpiry?: string;
  };
  contact?: {
    firstName?: string;
    lastName?: string;
    phoneCountry?: string;
    phone?: string;
    email?: string;
  };
};

const COLS: Seat['col'][] = ['A', 'B', 'C', 'D'];

const GOLD = 'var(--sw-accent)';
const NAVY = 'var(--sw-primary)';
const WHITE = 'var(--sw-white)';

/* =================== Utils =================== */
function parseSeatNumber(seatNumber: string): {
  row: number;
  col: Seat['col'];
} {
  const m = String(seatNumber)
    .toUpperCase()
    .match(/^(\d+)([A-D])$/);
  if (!m) return { row: 0, col: 'A' };
  return { row: Number(m[1]), col: m[2] as Seat['col'] };
}

/* fallback：沒有 API 時用 4×15 = 60 座，1–5 J 鎖，6–15 Y 可選 */
function makeFallbackSeats(): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= 15; row++) {
    const cabin: Cabin = row <= 5 ? 'J' : 'Y';
    for (const c of COLS) {
      seats.push({
        id: `${row}${c}`,
        row,
        col: c,
        cabin,
        isBlocked: cabin === 'J',
      });
    }
  }
  return seats;
}

/* 從後端拿座位資訊 */
async function fetchSeats(
  flightId?: number | string | null
): Promise<Seat[] | null> {
  if (!flightId && flightId !== 0) return null;
  try {
    const r = await fetch(
      `http://localhost:3007/api/flight-booking/seat-options?flightId=${flightId}`,
      { cache: 'no-store' }
    );
    if (!r.ok) throw new Error('seat API not ok');
    const json = await r.json();
    const list: any[] = json?.data ?? json ?? [];

    const mapped: Seat[] = list.map((s) => {
      const { row, col } = parseSeatNumber(s.seatNumber);
      const cabin: Cabin = s.cabinClass?.toUpperCase?.() === 'J' ? 'J' : 'Y';
      const isAvailable: boolean = !!s.isAvailable;

      return {
        id: String(s.seatId),
        row,
        col,
        cabin,
        seatFee:
          typeof s.seatFee === 'number'
            ? s.seatFee
            : s.seatFee
              ? Number(s.seatFee)
              : null,
        isBlocked: cabin === 'J' || !isAvailable, // 商務艙暫不開放 + 不可選位
        isOccupied: !isAvailable,
      };
    });

    if (!mapped.length) return null;
    return mapped;
  } catch (e) {
    console.error('載入座位失敗：', e);
    return null;
  }
}

/* ===== 小元件：去/回程切換（沿用 extras 的金色卡片） ===== */
function LegSwitcher({
  outbound,
  inbound,
  value,
  onChange,
}: {
  outbound?: FareStore | null;
  inbound?: FareStore | null;
  value: 'ob' | 'ib';
  onChange: (v: 'ob' | 'ib') => void;
}) {
  const Btn = ({
    kind,
    leg,
    label,
  }: {
    kind: 'ob' | 'ib';
    leg?: FareStore | null;
    label: string;
  }) => {
    const active = value === kind;
    const disabled = !leg?.flightId;

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(kind)}
        className={[
          'w-full h-20 rounded-xl border px-3 py-2 text-left transition',
          active
            ? `bg-[color:${GOLD}] text-[color:${NAVY}] border-[color:${GOLD}] shadow`
            : `bg-transparent text-white/95 border-white/30 hover:bg-white/10`,
          disabled && 'opacity-40 cursor-not-allowed',
        ].join(' ')}
      >
        <div className="text-[11px] opacity-85">{label}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">
            {leg?.leg?.originCode || '--'}
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-sm font-semibold">
            {leg?.leg?.destinationCode || '--'}
          </span>
          {leg?.flightNo && (
            <span className="ml-auto text-xs opacity-75">{leg.flightNo}</span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="w-52 shrink-0 grid gap-3">
      <Btn kind="ob" leg={outbound} label="去程" />
      <Btn kind="ib" leg={inbound} label="回程" />
    </div>
  );
}

/* ===== 座位按鈕 ===== */
function SeatCell({
  seat,
  selected,
  onToggle,
}: {
  seat: Seat;
  selected: boolean;
  onToggle: (s: Seat) => void;
}) {
  const disabled = !!(seat.isBlocked || seat.isOccupied);
  return (
    <button
      type="button"
      aria-label={`Seat ${seat.row}${seat.col}`}
      disabled={disabled}
      onClick={() => onToggle(seat)}
      className={clsx(
        'w-10 h-10 rounded-2xl grid place-items-center text-[13px] font-medium',
        'border-2 border-[#1F2E3C]',
        seat.cabin === 'J' ? 'bg-[#EADCCB]' : 'bg-white',
        selected && '!bg-[#1F2E3C] !text-white',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
      title={
        disabled
          ? '不可選（已被佔用或目前僅開放經濟艙）'
          : `座位 ${seat.row}${seat.col}`
      }
    >
      {seat.col}
    </button>
  );
}

/* ====================== Page ====================== */
export default function SeatSelectionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [outbound, setOutbound] = useState<FareStore | null>(null);
  const [inbound, setInbound] = useState<FareStore | null>(null);
  // 從 store 取金額 / 已選座位 / setter
  const baseFare = useBookingStore((s) => s.baseFare);
  const extrasTotal = useBookingStore((s) => s.extrasTotal);
  const selectedSeatsStore = useBookingStore((s) => s.selectedSeats);
  const setSelectedSeats = useBookingStore((s) => s.setSelectedSeats);

  const [picked, setPicked] = useState<{ ob: string[]; ib: string[] }>(
    selectedSeatsStore || { ob: [], ib: [] }
  );

  const [seg, setSeg] = useState<'ob' | 'ib'>('ob');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  /* === 保留的 query string（跟 extras 一樣） === */
  const qsKeep = useMemo(() => {
    const keep = [
      'tripType',
      'origin',
      'destination',
      'departDate',
      'returnDate',
      'pax',
      'passengers',
      'cabin',
      'cabinClass',
    ];
    const out = new URLSearchParams();
    keep.forEach((k) => {
      const v = sp.get(k);
      if (v != null) out.set(k, v);
    });
    return out.toString();
  }, [sp]);

  const obIata = (sp.get('origin') || '').toUpperCase();
  const ibIata = (sp.get('destination') || '').toUpperCase();

  // 只在 client mount 完成後，才去讀 sessionStorage
  useEffect(() => {
    try {
      const s = sessionStorage.getItem('fare_outbound');
      setOutbound(s ? JSON.parse(s) : null);
    } catch {
      setOutbound(null);
    }

    try {
      const s = sessionStorage.getItem('fare_inbound');
      setInbound(s ? JSON.parse(s) : null);
    } catch {
      setInbound(null);
    }
  }, []);

  const obFixed: FareStore | null = useMemo(() => {
    if (!outbound) return null;
    const originCode = outbound.leg?.originCode || obIata || '--';
    const destinationCode = outbound.leg?.destinationCode || ibIata || '--';
    return outbound.leg
      ? outbound
      : {
          ...outbound,
          leg: { originCode, destinationCode },
        };
  }, [outbound, obIata, ibIata]);

  const ibFixed: FareStore | null = useMemo(() => {
    if (!inbound) return null;
    const originCode = inbound.leg?.originCode || ibIata || '--';
    const destinationCode = inbound.leg?.destinationCode || obIata || '--';
    return inbound.leg
      ? inbound
      : {
          ...inbound,
          leg: { originCode, destinationCode },
        };
  }, [inbound, obIata, ibIata]);

  const pax = useMemo(() => {
    const s = sp.get('pax');
    const n = s ? Number(s) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [sp]);

  /* === 依 seg & flightId 抓座位 === */
  const flightId = seg === 'ob' ? obFixed?.flightId : ibFixed?.flightId;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchSeats(flightId ?? null);
      setSeats(data ?? makeFallbackSeats());
      setLoading(false);
    })();
  }, [flightId, seg]);

  /* === 依 row 分組 === */
  const rows = useMemo(() => {
    const byRow: Record<number, Seat[]> = {};
    seats.forEach((s) => {
      (byRow[s.row] ||= []).push(s);
    });
    Object.values(byRow).forEach((arr) =>
      arr.sort((a, b) => COLS.indexOf(a.col) - COLS.indexOf(b.col))
    );
    return Object.keys(byRow)
      .map(Number)
      .sort((a, b) => a - b)
      .map((row) => ({ row, seats: byRow[row] }));
  }, [seats]);

  const selectedNow = picked[seg];

  const selectedLabels = useMemo(() => {
    return selectedNow.map((id) => {
      const seat = seats.find((s) => s.id === id);
      return seat ? `${seat.row}${seat.col}` : id;
    });
  }, [selectedNow, seats]);

  const toggleSeat = (seat: Seat) => {
    if (seat.isBlocked || seat.isOccupied) return;
    const id = seat.id;
    const exists = selectedNow.includes(id);
    let next = exists
      ? selectedNow.filter((x) => x !== id)
      : [...selectedNow, id];

    if (next.length > pax) next = next.slice(0, pax);

    setPicked((p) => ({ ...p, [seg]: next }));
  };

  const clearSeg = () => setPicked((p) => ({ ...p, [seg]: [] }));

  const allGood =
    picked.ob.length === pax &&
    (sp.get('tripType') === 'roundtrip'
      ? !ibFixed?.flightId || picked.ib.length === pax
      : true);

  const handlePrev = () => router.push(`/flight-booking/extras?${qsKeep}`);

  const handleNext = async () => {
    // 1) 寫回 store（之後 checkout 若要從 store 讀也有資料）
    try {
      setSelectedSeats('ob', picked.ob);
      setSelectedSeats('ib', picked.ib);
    } catch (e) {
      console.warn('寫入 bookingStore.selectedSeats 失敗：', e);
    }

    // 2) 從 sessionStorage 撈出 Passenger / Contact / Extras
    let passengerForm: PassengerFormStorage = {};
    let extrasOb: any = {};
    let extrasIb: any = {};

    try {
      const raw = sessionStorage.getItem('stelwing.passenger.form') || '{}';
      passengerForm = JSON.parse(raw) as PassengerFormStorage;
    } catch {
      passengerForm = {};
    }

    try {
      const rawOb = sessionStorage.getItem('extras_outbound') || '{}';
      extrasOb = JSON.parse(rawOb);
    } catch {
      extrasOb = {};
    }

    try {
      const rawIb = sessionStorage.getItem('extras_inbound') || '{}';
      extrasIb = JSON.parse(rawIb);
    } catch {
      extrasIb = {};
    }

    const paxForm = passengerForm.pax || {};
    const contact = passengerForm.contact || {};

    // 基本防呆：沒有旅客資料就不送
    if (!paxForm.firstName || !paxForm.lastName) {
      alert('找不到旅客資料，請回上一頁重新填寫。');
      router.push(`/flight-booking/passenger?${qsKeep}`);
      return;
    }

    if (!obFixed?.flightId) {
      alert('找不到去程航班資訊，請回上一頁重新選擇。');
      router.push(`/flight-booking`);
      return;
    }

    const cabinRaw =
      sp.get('cabinClass') || outbound?.cabin || inbound?.cabin || 'ECONOMY';
    const cabinClassFromQuery =
      cabinRaw === 'J' ? 'BUSINESS' : cabinRaw === 'Y' ? 'ECONOMY' : cabinRaw;

    const totalAmount = Number(baseFare || 0) + Number(extrasTotal || 0);
    const tripType = (sp.get('tripType') as 'oneway' | 'roundtrip') || 'oneway';
    const currency = outbound?.currency || inbound?.currency || 'TWD';

    // 把 picked.ob / picked.ib 轉成 [{ seatId: number }]
    const outboundSeats = picked.ob.map((id) => ({
      seatId: Number(id),
    }));
    const inboundSeats = picked.ib.map((id) => ({
      seatId: Number(id),
    }));

    const payload = {
      tripType,
      currency,
      cabinClass: cabinClassFromQuery,
      totalAmount,

      // 旅客基本資料（後端 Zod 會驗證）
      firstName: (paxForm.firstName || '').toUpperCase(),
      lastName: (paxForm.lastName || '').toUpperCase(),
      gender: paxForm.gender ?? null,
      birthday: paxForm.birthday || null,
      nationality: paxForm.nationality || '',
      passportNo: (paxForm.passportNo || '').toUpperCase(),
      passportExpiry: paxForm.passportExpiry || '',

      // 目前後端 schema 沒用到，但先帶著以後可以擴充
      passenger: paxForm,
      contact,

      outbound: {
        flightId: Number(obFixed.flightId),
        seats: outboundSeats,
        baggageId: extrasOb.baggageId ? Number(extrasOb.baggageId) : null,
        mealId: extrasOb.mealId ? Number(extrasOb.mealId) : null,
      },
      inbound:
        tripType === 'roundtrip' && ibFixed?.flightId && inboundSeats.length > 0
          ? {
              flightId: Number(ibFixed.flightId),
              seats: inboundSeats,
              baggageId: extrasIb.baggageId ? Number(extrasIb.baggageId) : null,
              mealId: extrasIb.mealId ? Number(extrasIb.mealId) : null,
            }
          : null,
    };

    console.log('booking payload = ', payload);

    try {
      sessionStorage.setItem('stelwing.checkout.data', JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    // 4) 先拿 token
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('stelwing_token')
        : null;

    if (!token) {
      alert('請先登入會員再建立訂單');
      router.push('/member-center/login');
      return;
    }

    // 5) 呼叫建立訂單 API（帶 Authorization）
    try {
      const res = await fetch(
        'http://localhost:3007/api/flight-booking/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (res.status === 401) {
        alert('登入逾時，請重新登入後再試一次');
        router.push('/member-center/login');
        return;
      }

      if (!res.ok || !json.success) {
        console.error('建立訂單失敗：', json);
        // 如果後端有回欄位錯誤，可以在這裡 console.log json.errors 看
        alert(json?.message || '建立訂單失敗，請稍後再試');
        return;
      }

      const pnr: string | undefined =
        json?.pnr || json?.data?.pnr || json?.booking?.pnr;

      if (!pnr) {
        console.error('後端回傳沒有 PNR', json);
        alert('建立訂單成功，但未取得 PNR，請聯繫管理員');
        router.push(`/flight-booking/checkout`);
        return;
      }

      try {
        sessionStorage.setItem('stelwing.lastPnr', pnr);
      } catch {
        /* ignore */
      }

      router.push(`/flight-booking/checkout?pnr=${encodeURIComponent(pnr)}`);
    } catch (e) {
      console.error('呼叫 /bookings 失敗：', e);
      alert('建立訂單時發生錯誤，請稍後再試');
    }
  };

  return (
    <div>
      <div className="mx-auto w-full px-4 md:px-6 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-[color:var(--sw-primary)] mb-2">
          艙等說明與座位選擇
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(400px,1fr)] gap-6">
          {/* 左：座位圖 */}
          <div className="bg白 rounded-2xl p-4 md:p-5 shadow-sm">
            {loading ? (
              <div className="h-[420px] grid place-items-center text-gray-500">
                座位載入中…
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[520px]">
                  {/* 機首方向提示 */}
                  <div className="w-full flex justify-end text-xs text-gray-500 mb-1 pr-1">
                    機首
                  </div>

                  {/* 欄標：A / B / (行號位置) / C / D */}
                  <div className="w-full flex items-end justify-between mb-2 px-1">
                    {['A', 'B', '', 'C', 'D'].map((lbl, idx) => (
                      <div
                        key={idx}
                        className="w-10 text-center text-sm font-semibold text-[#1F2E3C]"
                      >
                        {lbl}
                      </div>
                    ))}
                  </div>

                  {/* 每排：A B [行號] C D */}
                  {rows.map(({ row, seats: rowSeats }) => {
                    const isBusiness = row <= 5;

                    const seatA = rowSeats.find((s) => s.col === 'A')!;
                    const seatB = rowSeats.find((s) => s.col === 'B')!;
                    const seatC = rowSeats.find((s) => s.col === 'C')!;
                    const seatD = rowSeats.find((s) => s.col === 'D')!;

                    const idA = seatA.id;
                    const idB = seatB.id;
                    const idC = seatC.id;
                    const idD = seatD.id;

                    return (
                      <div
                        key={row}
                        className={clsx(
                          'rounded-2xl mb-2.5 px-3 py-2 border',
                          isBusiness
                            ? 'bg-[#EADCCB]/40 border-[#D8C1A3]'
                            : 'bg-gray-50 border-gray-200'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* A */}
                          <div className="w-10 flex justify-center">
                            <SeatCell
                              seat={seatA}
                              selected={selectedNow.includes(idA)}
                              onToggle={toggleSeat}
                            />
                          </div>

                          {/* B */}
                          <div className="w-10 flex justify-center">
                            <SeatCell
                              seat={seatB}
                              selected={selectedNow.includes(idB)}
                              onToggle={toggleSeat}
                            />
                          </div>

                          {/* 行號 */}
                          <div className="w-10 h-10 grid place-items-center text-[13px] font-semibold text-[#1F2E3C] select-none">
                            {row}
                          </div>

                          {/* C */}
                          <div className="w-10 flex justify-center">
                            <SeatCell
                              seat={seatC}
                              selected={selectedNow.includes(idC)}
                              onToggle={toggleSeat}
                            />
                          </div>

                          {/* D */}
                          <div className="w-10 flex justify-center">
                            <SeatCell
                              seat={seatD}
                              selected={selectedNow.includes(idD)}
                              onToggle={toggleSeat}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 傳說 */}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-2xl bg白 inline-block border border-[#1F2E3C]" />
                    可選（經濟艙）
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-2xl bg-[#1F2E3C] inline-block border border-[#1F2E3C]" />
                    已選
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-2xl bg-[#EADCCB] inline-block border border-[#1F2E3C] opacity-60" />
                    不可選（商務艙暫不開放或已被佔用）
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右：艙等說明 + 座位選擇卡 */}
          <aside className="space-y-4 lg:max-w-[440px] w-full">
            {/* 艙等說明 */}
            <section
              className="rounded-2xl border border-[color:var(--sw-grey)]/30
                          bg-[color:var(--sw-primary)] text-[color:var(--sw-white)]
                          p-5 shadow-sm"
            >
              <div className="text-base font-semibold mb-3">艙等說明</div>
              <div className="text-sm text-white/85 space-y-2 leading-6">
                <p>
                  <span className="font-semibold text-white">
                    商務艙（1–5 排）：
                  </span>{' '}
                  目前暫不開放選位，後續若開放，將可於此頁面選擇座位。
                </p>
                <p>
                  <span className="font-semibold text-white">
                    經濟艙（6–15 排）：
                  </span>{' '}
                  可依照乘客人數，自由選擇每段航程的座位。
                </p>
              </div>
            </section>

            {/* 座位選擇卡 */}
            <section
              className="rounded-2xl border border-[color:var(--sw-grey)]/30
                          bg-[color:var(--sw-primary)] text-[color:var(--sw-white)]
                          p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">座位選擇</div>
                  <div className="mt-1 text-sm text-white/80">
                    旅客 {pax} 位成人
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2 py-0.5 text-xs text-white/90">
                  <User2 className="h-3.5 w-3.5" />
                  <span>旅客 1</span>
                </div>
              </div>

              <div className="flex gap-5">
                {/* 左側：去/回程切換 */}
                <LegSwitcher
                  outbound={obFixed}
                  inbound={ibFixed}
                  value={seg}
                  onChange={setSeg}
                />

                {/* 右側：已選座位資訊 */}
                <div className="flex-1 text-sm">
                  <div className="mb-2 text-xs text白/75">
                    {seg === 'ob'
                      ? `去程 ${
                          obFixed?.leg?.originCode || '--'
                        } → ${obFixed?.leg?.destinationCode || '--'}`
                      : `回程 ${
                          ibFixed?.leg?.originCode || '--'
                        } → ${ibFixed?.leg?.destinationCode || '--'}`}
                  </div>

                  <div className="rounded-xl bg白/5 border border白/20 px-4 py-3">
                    <div className="text-xs text白/75">已選座位</div>
                    <div className="mt-1 text-sm font-semibold">
                      {selectedNow.length
                        ? selectedLabels.join(', ')
                        : '尚未選擇'}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text白/70">
                      <span>每段需選 {pax} 席</span>
                      <button
                        type="button"
                        className="underline underline-offset-2"
                        onClick={clearSeg}
                      >
                        清除本段座位
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 底部 StepActions */}
            <StepActions
              onPrev={handlePrev}
              onNext={handleNext}
              nextDisabled={!allGood}
              nextText="前往結帳"
            />
          </aside>
        </div>

        {/* 價格明細（沿用 Extras 的 modal） */}
        <FareDetailsFromStore />
      </div>
    </div>
  );
}
