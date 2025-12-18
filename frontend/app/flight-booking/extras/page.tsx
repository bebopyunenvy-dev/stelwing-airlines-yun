'use client';

import {
  BaggageClaim,
  Check,
  ChevronRight,
  Luggage,
  Plus,
  Search,
  User2,
  Utensils,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useBookingStore } from '../../../src/store/bookingStore';
import { FareDetailsFromStore } from '../components/FareDetailsModal';
import StepActions from '../components/StepActions';

/* ====================== Types ====================== */
type BaggageOption = {
  baggageId: number;
  weightKg: number;
  price: number; // TWD
  currency?: string;
};

type MealOption = {
  imageUrl: string;
  mealId: number;
  mealCode: string;
  mealName: string;
  price: number; // TWD
  currency?: string;
};

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

type PassengerFormStore = {
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

// 固定顯示順序：跟資料庫一樣
const MEAL_ORDER = ['VGML', 'AVML', 'GFML', 'KSML', 'HNML', 'CHML'];

// 每個 meal_code 對應的圖片路徑（public/images + meal_image_path）
const MEAL_IMAGE_MAP: Record<string, string> = {
  VGML: '/images/meals/meal_vgml.png',
  AVML: '/images/meals/meal_avml.png',
  GFML: '/images/meals/meal_gfml.png',
  KSML: '/images/meals/meal_ksml.png',
  HNML: '/images/meals/meal_hnml.png',
  CHML: '/images/meals/meal_chml.png',
};

/* =================== Utils =================== */
const fmtMoney = (n: number, currency = 'TWD') =>
  `${currency} ${Number(n || 0).toLocaleString('zh-TW', {
    maximumFractionDigits: 0,
  })}`;

/* =================== Tokens 快捷色票 =================== */
const GOLD = 'var(--sw-accent)';
const NAVY = 'var(--sw-primary)';
const WHITE = 'var(--sw-white)';

/* ===== 小元件：去/回程切換（改成金色樣式＋固定高度） ===== */
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
          // ★ 固定高度 h-16 (64px)，金色樣式
          'w-full h-20 rounded-xl border px-3 py-2 text-left transition',
          active
            ? `bg-[color:var(--sw-accent)] text-[color:var(--sw-primary)] border-[color:var(--sw-accent)] shadow`
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

/* ===== 小元件：行李膠囊（加上行李 icon 與更接近金色選中樣式） ===== */
function BagPill({
  option,
  selected,
  onClick,
}: {
  option: BaggageOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition',
        selected
          ? `bg-[color:${WHITE}] text-[color:${NAVY}] border-[color:${WHITE}] shadow`
          : 'bg-white/10 text-white/95 border-white/20 hover:bg-white/20',
      ].join(' ')}
    >
      <Luggage className="h-4 w-4 opacity-90" />
      <span className="mr-1">{option.weightKg} 公斤</span>
      <span className="opacity-90">{fmtMoney(option.price)}</span>
    </button>
  );
}

/* ===== 小元件：餐點卡片（含圖片） ===== */
function MealCard({
  option,
  selected,
  onToggle,
  onPreview,
}: {
  option: MealOption & { imageUrl?: string };
  selected: boolean;
  onToggle: () => void;
  onPreview?: () => void;
}) {
  // 依照 mealCode 使用固定圖片，確保六張都不同
  const imgSrc =
    MEAL_IMAGE_MAP[option.mealCode] ||
    option.imageUrl ||
    '/images/meals/meal_vgml.png';

  return (
    <div
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition',
        selected
          ? 'ring-2 ring-[color:var(--sw-accent)]'
          : 'hover:-translate-y-1 hover:shadow-lg',
      ].join(' ')}
    >
      {/* 圖片區 */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-[#e7cfc4]">
        <Image
          src={imgSrc}
          alt={option.mealName}
          width={600}
          height={450}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      </div>

      {/* 右上角放大鏡按鈕 */}
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white shadow hover:bg-black/75 transition"
          aria-label="放大查看餐點圖片"
        >
          <Search className="h-4 w-4" />
        </button>
      )}

      {/* 下半部：名稱 + 價格 + 加入按鈕 */}
      <div className="mt-auto flex items-center justify-between gap-3 bg-white px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-[color:var(--sw-primary)]">
            {option.mealName}
          </div>
          <div className="mt-1 text-sm text-[color:var(--sw-primary)]/80">
            {fmtMoney(option.price)}
          </div>
        </div>

        {/* 右下角＋按鈕：統一 36x36 正圓 */}
        <button
          type="button"
          aria-label={selected ? '取消' : '加入'}
          onClick={onToggle}
          className={[
            'inline-flex w-9 h-9 items-center justify-center rounded-full border transition',
            selected
              ? 'border-[color:var(--sw-accent)] bg-[color:var(--sw-accent)] text-[color:var(--sw-primary)]'
              : 'border-[color:var(--sw-accent)] text-[color:var(--sw-accent)] hover:bg-[color:var(--sw-accent)]/10',
          ].join(' ')}
        >
          {selected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ====================== Page ====================== */
export default function ExtrasPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const setBaseFare = useBookingStore((s) => s.setBaseFare);
  const setExtrasTotal = useBookingStore((s) => s.setExtrasTotal);

  const [bags, setBags] = useState<BaggageOption[]>([]);
  const [meals, setMeals] = useState<MealOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [obBag, setObBag] = useState<number | null>(null);
  const [ibBag, setIbBag] = useState<number | null>(null);
  const [obMeal, setObMeal] = useState<number | null>(null);
  const [ibMeal, setIbMeal] = useState<number | null>(null);
  const [previewMeal, setPreviewMeal] = useState<
    (MealOption & { imageUrl?: string }) | null
  >(null);

  const [bagTab, setBagTab] = useState<'ob' | 'ib'>('ob');
  const [mealTab, setMealTab] = useState<'ob' | 'ib'>('ob');

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

  const outbound: FareStore | null = useMemo(() => {
    try {
      const s = sessionStorage.getItem('fare_outbound');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }, []);
  const inbound: FareStore | null = useMemo(() => {
    try {
      const s = sessionStorage.getItem('fare_inbound');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }, []);

  // === 新增：補上去回程航點資訊（若 sessionStorage 缺少 leg，使用網址備援） ===
  const obIata = (sp.get('origin') || '').toUpperCase();
  const ibIata = (sp.get('destination') || '').toUpperCase();

  const obFixed: FareStore | null = useMemo(() => {
    if (!outbound) return null;
    const originCode = outbound.leg?.originCode || obIata || '--';
    const destinationCode = outbound.leg?.destinationCode || ibIata || '--';
    return outbound.leg
      ? outbound
      : {
          ...outbound,
          leg: {
            originCode,
            destinationCode,
            // 不補 dep/arrTime，型別已改成可選
          },
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
          leg: {
            originCode,
            destinationCode,
            // 不補 dep/arrTime，型別已改成可選
          },
        };
  }, [inbound, obIata, ibIata]);

  const formStore: PassengerFormStore = useMemo(() => {
    try {
      const s = sessionStorage.getItem('stelwing.passenger.form');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  }, []);

  const currency =
    outbound?.currency || inbound?.currency || sp.get('currency') || 'TWD';

  useEffect(() => {
    (async () => {
      try {
        const [bRes, mRes] = await Promise.all([
          fetch('http://localhost:3007/api/flight-booking/baggage-options', {
            cache: 'no-store',
          }),
          fetch('http://localhost:3007/api/flight-booking/meal-options', {
            cache: 'no-store',
          }),
        ]);

        const bJson = await bRes.json();
        const mJson = await mRes.json();

        const bagsArr = Array.isArray(bJson?.data)
          ? bJson.data
          : Array.isArray(bJson)
            ? bJson
            : [];
        const mealsArr = Array.isArray(mJson?.data)
          ? mJson.data
          : Array.isArray(mJson)
            ? mJson
            : [];

        setBags(bagsArr);
        setMeals(mealsArr);
      } catch (e) {
        console.error('載入行李/餐點失敗：', e);
        setBags([]);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      const ob = sessionStorage.getItem('extras_outbound');
      if (ob) {
        const parsed = JSON.parse(ob);
        if (parsed?.baggageId) setObBag(parsed.baggageId);
        if (parsed?.mealId) setObMeal(parsed.mealId);
      }
      const ib = sessionStorage.getItem('extras_inbound');
      if (ib) {
        const parsed = JSON.parse(ib);
        if (parsed?.baggageId) setIbBag(parsed.baggageId);
        if (parsed?.mealId) setIbMeal(parsed.mealId);
      }
    } catch {}
  }, []);

  // ❶ 每次行李 / 餐點變動，就同步寫進 sessionStorage
  useEffect(() => {
    try {
      // 去程
      if (obBag || obMeal) {
        sessionStorage.setItem(
          'extras_outbound',
          JSON.stringify({
            baggageId: obBag,
            mealId: obMeal,
          })
        );
      } else {
        sessionStorage.removeItem('extras_outbound');
      }

      // 回程
      if (ibBag || ibMeal) {
        sessionStorage.setItem(
          'extras_inbound',
          JSON.stringify({
            baggageId: ibBag,
            mealId: ibMeal,
          })
        );
      } else {
        sessionStorage.removeItem('extras_inbound');
      }
    } catch (e) {
      console.error('寫入 extras sessionStorage 失敗：', e);
    }
  }, [obBag, obMeal, ibBag, ibMeal]);

  const obFare = Math.round(outbound?.finalFare || 0);
  const ibFare = Math.round(inbound?.finalFare || 0);
  useEffect(() => {
    setBaseFare(obFare + ibFare);
  }, [obFare, ibFare, setBaseFare]);

  // 取得行李價格（30 公斤一律 900）
  const priceOfBag = (id: number | null) => {
    if (!id) return 0;
    const opt = bags.find((b) => b.baggageId === id);
    if (!opt) return 0;
    return opt.weightKg === 30 ? 900 : opt.price || 0;
  };
  const priceOfMeal = (id: number | null) =>
    id ? meals.find((m) => m.mealId === id)?.price || 0 : 0;

  useEffect(() => {
    const extras =
      priceOfBag(obBag) +
      priceOfBag(ibBag) +
      priceOfMeal(obMeal) +
      priceOfMeal(ibMeal);
    setExtrasTotal(extras);
  }, [obBag, ibBag, obMeal, ibMeal, bags, meals, setExtrasTotal]);

  const obTotal = obFare + priceOfBag(obBag) + priceOfMeal(obMeal);
  const ibTotal = ibFare + priceOfBag(ibBag) + priceOfMeal(ibMeal);
  const grandTotal = obTotal + ibTotal;

  const canNext =
    !!outbound?.flightId &&
    (!!inbound?.flightId || sp.get('tripType') !== 'roundtrip');

  // 去程顯示用 fallback
  const obLegLabel = obFixed?.leg
    ? `${obFixed.leg.originCode} → ${obFixed.leg.destinationCode}`
    : `${obIata || '--'} → ${ibIata || '--'}`;
  // 回程顯示用 fallback
  const ibLegLabel = ibFixed?.leg
    ? `${ibFixed.leg.originCode} → ${ibFixed.leg.destinationCode}`
    : `${ibIata || '--'} → ${obIata || '--'}`;

  return (
    <div>
      <div className="mx-auto w-full px-4 md:px-6 py-6 md:py-8 sw-container">
        <h2 className="text-xl md:text-2xl font-bold text-[color:var(--sw-primary)] mb-2">
          行李與餐點
        </h2>

        {loading ? (
          <div className="rounded-xl bg-white p-6 text-[color:var(--sw-primary)]/70">
            選項載入中…
          </div>
        ) : (
          <>
            {/* ============ 托運行李 ============ */}
            <section className="mt-8 rounded-2xl border border-[color:var(--sw-grey)]/30 bg-[color:var(--sw-primary)] text-[color:var(--sw-white)] p-5 md:p-6 shadow-sm">
              {/* 標題 + 說明 */}
              <div className="mb-2 flex items-center gap-2">
                <BaggageClaim className="h-5 w-5 opacity-90" />
                <h3 className="text-base md:text-lg font-semibold">
                  托運行李選擇
                </h3>
              </div>
              <p className="mb-6 text-xs leading-relaxed text-white/80">
                提醒您，請確認英文姓名拼音需與護照相同，若需要改姓改名需支付額外費用。若您的名字組成只有姓氏或只有名字，請將姓氏或名字輸入在姓氏欄位，並且於名字欄位輸入FNU（FNU意為first
                name unknown）。
              </p>

              {/* 主列：垂直置中 */}
              <div className="flex items-center gap-6">
                {/* 左側：去/回程（金色卡片） */}
                <LegSwitcher
                  outbound={obFixed || outbound}
                  inbound={ibFixed || inbound}
                  value={bagTab}
                  onChange={setBagTab}
                />

                {/* 分隔線 */}
                <div className="hidden md:block w-px bg-white/20 rounded-full self-stretch" />

                {/* 中間：旅客資訊（垂直置中） */}
                <div className="w-36 shrink-0 grid place-items-center text-center">
                  <div className="flex flex-col items-center gap-2">
                    <User2 className="h-8 w-8 text-white/90" />
                    <div className="text-sm">
                      <div className="font-semibold">旅客 1</div>
                      <div className="opacity-80">成人</div>
                    </div>
                  </div>
                </div>

                {/* 分隔線 */}
                <div className="hidden md:block w-px bg-white/20 rounded-full self-stretch" />

                {/* 右側：行李選項（垂直置中） */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-10">
                    {bags.map((b) => {
                      // 30 公斤金額固定 900
                      const price = b.weightKg === 30 ? 900 : b.price || 0;

                      const selected =
                        bagTab === 'ob'
                          ? obBag === b.baggageId
                          : ibBag === b.baggageId;

                      const pick =
                        bagTab === 'ob'
                          ? () => setObBag(b.baggageId)
                          : () => setIbBag(b.baggageId);

                      const cancel =
                        bagTab === 'ob'
                          ? () => setObBag(null)
                          : () => setIbBag(null);

                      return (
                        <div
                          key={`bag-col-${bagTab}-${b.baggageId}`}
                          className="w-[150px] flex flex-col items-center text-center"
                        >
                          <Luggage className="h-7 w-7 mb-2 text-white/95" />
                          <div className="text-base leading-6 font-medium">
                            {b.weightKg}公斤
                          </div>
                          <div className="text-sm opacity-90">
                            {fmtMoney(price)}
                          </div>

                          {/* 動作：未選 → 金色主鈕；選取 → 已選擇 + 取消 */}
                          {!selected ? (
                            <button
                              type="button"
                              onClick={pick}
                              className="mt-3 rounded-full border px-4 py-1.5 text-sm font-semibold
                             bg-[color:var(--sw-accent)] text-[color:var(--sw-primary)] border-[color:var(--sw-accent)]
                             hover:brightness-[.98] transition"
                            >
                              {b.weightKg}公斤
                            </button>
                          ) : (
                            <div className="mt-3 flex items-center gap-3">
                              <span
                                className="rounded-full border px-4 py-1.5 text-sm font-semibold
                               bg-[color:var(--sw-accent)] text-[color:var(--sw-primary)] border-[color:var(--sw-accent)]"
                              >
                                已選擇
                              </span>
                              <button
                                type="button"
                                onClick={cancel}
                                className="rounded-full border px-4 py-1.5 text-sm font-semibold
                               bg-transparent text-white border-white/35 hover:bg-white/10 transition"
                              >
                                取消
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ============ 機上餐點 ============ */}
            <section className="mt-8 md:mt-12 rounded-2xl border border-[color:var(--sw-grey)]/30 bg-[color:var(--sw-primary)] text-[color:var(--sw-white)] p-5 md:p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 opacity-90" />
                <h3 className="text-base md:text-lg font-semibold">
                  機上餐點選擇
                </h3>
              </div>

              <div className="flex gap-6">
                {/* 左邊：旅客卡片 + LegSwitcher */}
                <div className="w-52 shrink-0 flex flex-col gap-4">
                  {/* 旅客卡片 */}
                  <div className="rounded-xl border-r-indigo-100 py-4 px-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <User2 className="h-8 w-8 text-white/90" />
                      <div className="text-sm">
                        <div className="font-semibold">旅客 1</div>
                        <div className="opacity-80">成人</div>
                      </div>
                    </div>
                  </div>

                  {/* 去回程切換 */}
                  <LegSwitcher
                    outbound={obFixed || outbound}
                    inbound={ibFixed || inbound}
                    value={mealTab}
                    onChange={setMealTab}
                  />
                </div>

                {/* 中間分隔線 */}
                <div className="hidden md:block w-px bg-white/20 rounded-full self-stretch" />

                {/* 右邊：餐點卡片 */}
                <div className="flex-1">
                  <div className="mb-3 text-xs opacity-80">
                    {mealTab === 'ob'
                      ? `去程 ${obLegLabel}`
                      : `回程 ${ibLegLabel}`}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[...meals]
                      // 1️⃣ 先用 meal_code 按 MEAL_ORDER 固定排序
                      .sort((a, b) => {
                        const ai = MEAL_ORDER.indexOf(a.mealCode);
                        const bi = MEAL_ORDER.indexOf(b.mealCode);
                        const aIdx = ai === -1 ? 999 : ai;
                        const bIdx = bi === -1 ? 999 : bi;
                        return aIdx - bIdx;
                      })
                      // 2️⃣ 每筆加上 imageUrl，對應資料庫的命名
                      .map((m) => {
                        const selected =
                          mealTab === 'ob'
                            ? obMeal === m.mealId
                            : ibMeal === m.mealId;

                        const onToggle =
                          mealTab === 'ob'
                            ? () =>
                                setObMeal((cur) =>
                                  cur === m.mealId ? null : m.mealId
                                )
                            : () =>
                                setIbMeal((cur) =>
                                  cur === m.mealId ? null : m.mealId
                                );

                        return (
                          <MealCard
                            key={`meal-${mealTab}-${m.mealId}`}
                            option={m}
                            selected={!!selected}
                            onToggle={onToggle}
                            onPreview={() => setPreviewMeal(m)} // ⬅ 點圖時要開 popup
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </section>

            <StepActions
              onPrev={() => router.push(`/flight-booking/passenger?${qsKeep}`)}
              onNext={() => router.push(`/flight-booking/seats?${qsKeep}`)}
              nextDisabled={!canNext}
            />

            <FareDetailsFromStore />
            {/* 圖片放大預覽 */}
            {previewMeal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
                <div className="relative w-[min(90vw,640px)] overflow-hidden rounded-2xl bg-white shadow-xl">
                  {/* 關閉按鈕 */}
                  <button
                    type="button"
                    onClick={() => setPreviewMeal(null)}
                    className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="關閉預覽"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* 大圖 */}
                  <div className="aspect-[4/3] w-full bg-[#e7cfc4]">
                    <Image
                      src={
                        MEAL_IMAGE_MAP[previewMeal.mealCode] ||
                        previewMeal.imageUrl ||
                        '/images/meals/meal_vgml.png'
                      }
                      alt={previewMeal.mealName}
                      width={900}
                      height={675}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* 文案區 */}
                  <div className="p-4 md:p-5">
                    <div className="text-base font-semibold text-[color:var(--sw-primary)]">
                      <span className="mr-1 font-semibold text-[color:var(--sw-accent)]">
                        Stelwing
                      </span>
                      {previewMeal.mealName}
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--sw-primary)]/80">
                      {fmtMoney(previewMeal.price)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
