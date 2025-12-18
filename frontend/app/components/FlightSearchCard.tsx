'use client';

import { useLanguage } from '@/src/i18n/LanguageContext';
import clsx from 'clsx';
import {
  Armchair,
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  Plane,
  Ticket,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { JSX } from 'react';
import { ymdInTZ } from '../utils/date';

const TZ = 'Asia/Taipei';
const TODAY_YMD = ymdInTZ(new Date(), TZ); // 目前沒用到，但先保留

export type TripType = 'roundtrip' | 'oneway';
export type CabinClass = 'Economy' | 'Business';

export interface FlightSearchValues {
  tripType: TripType;
  origin: string; // IATA
  destination: string; // IATA
  departDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: CabinClass;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3007/api';
const TODAY = new Date().toISOString().slice(0, 10);
type FlightSearchCardProps = {
  initialValues?: Partial<FlightSearchValues>;
  onSubmit?: (values: FlightSearchValues) => void;
};

/* ---------- UI wrappers ---------- */
const FieldShell = ({
  label,
  icon,
  children,
  showChevron = true,
}: {
  label: string;
  icon: JSX.Element;
  children: React.ReactNode;
  showChevron?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-[color:var(--sw-primary)]/70">{label}</span>
    <div className="relative h-12 flex items-center gap-2 rounded-[var(--sw-r-md)] bg-[color:var(--sw-white)] border border-[color:var(--sw-accent)] px-3">
      <span className="text-[color:var(--sw-primary)]">{icon}</span>
      <div className="flex-1">{children}</div>
      {showChevron && (
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--sw-primary)]" />
      )}
    </div>
  </div>
);

function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[min(680px,92vw)] rounded-[var(--sw-r-lg)] bg-white shadow-xl border border-[color:var(--sw-accent)]">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="sw-btn h-8 px-2 py-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------- AirportSearchPicker（打開就載全部 + 禁選同一機場） ---------- */
function AirportSearchPicker({
  onConfirm,
  onCancel,
  forbiddenIata,
}: {
  onConfirm: (pick: { iata: string; label: string }) => void;
  onCancel: () => void;
  forbiddenIata?: string;
}) {
  type AirportItem = {
    id: string | number;
    iata: string;
    name: string;
    city: string;
    countryCode: string;
  };

  const { t } = useLanguage();

  // UI 仍保留搜尋框（但不過濾資料）
  const [q, setQ] = React.useState('');
  const [list, setList] = React.useState<AirportItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  // 打開就抓全部機場
  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/flight-search/airports`, {
          cache: 'no-store',
        });
        const json = await res.json();
        setList(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error('airports load failed', e);
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4 text-[color:var(--sw-primary)]">
      {/* 搜尋框（純 UI、不觸發查詢） */}
      <div className="flex items-center border border-[color:var(--sw-accent)] rounded-[var(--sw-r-md)] px-3 py-2 focus-within:shadow-[0_0_0_2px_var(--sw-accent)] transition-shadow">
        <Plane className="w-4 h-4 text-[color:var(--sw-primary)]/70 mr-2" />
        <input
          autoFocus
          className="flex-1 bg-transparent outline-none text-[color:var(--sw-primary)] placeholder:text-[color:var(--sw-primary)]/50"
          placeholder={t('search.airport.placeholder')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* 清單 */}
      <div className="max-h-[48vh] overflow-auto space-y-2">
        {loading && (
          <div className="text-sm text-[color:var(--sw-primary)]/70 px-2">
            {t('search.airport.loading')}
          </div>
        )}

        {!loading && list.length === 0 && (
          <div className="text-sm text-[color:var(--sw-primary)]/70 px-2">
            {t('search.airport.empty')}
          </div>
        )}

        {list.map((a) => {
          const isDisabled = forbiddenIata && a.iata === forbiddenIata;

          return (
            <button
              key={`${a.id}-${a.iata}`}
              disabled={!!isDisabled}
              onClick={() => {
                if (isDisabled) return;
                onConfirm({ iata: a.iata, label: `${a.iata} — ${a.name}` });
              }}
              className={clsx(
                'w-full flex items-center justify-between px-4 py-3 border border-[color:var(--sw-grey)] rounded-[var(--sw-r-md)] hover:border-[color:var(--sw-accent)] hover:bg-[color:var(--sw-accent)]/10 transition',
                isDisabled &&
                  'opacity-40 cursor-not-allowed hover:border-[color:var(--sw-grey)] hover:bg-transparent'
              )}
            >
              <div className="font-semibold text-[color:var(--sw-primary)]">
                {a.iata} · {a.city}
              </div>
              <div className="text-sm text-[color:var(--sw-primary)]/70">
                {a.name}（{a.countryCode}）
              </div>
            </button>
          );
        })}
      </div>

      {/* 底部按鈕 */}
      <div className="flex justify-end pt-2">
        <button onClick={onCancel} className="sw-btn transition">
          {t('search.airport.cancel')}
        </button>
      </div>
    </div>
  );
}

/* ---------- 主元件 ---------- */
export default function FlightSearchCard({
  initialValues,
  onSubmit,
}: FlightSearchCardProps = {}) {
  const router = useRouter();
  const { t } = useLanguage();

  const [values, setValues] = React.useState<FlightSearchValues>({
    tripType: initialValues?.tripType ?? 'roundtrip',
    origin: initialValues?.origin ?? '',
    destination: initialValues?.destination ?? '',
    departDate: initialValues?.departDate ?? TODAY,
    returnDate: initialValues?.returnDate ?? TODAY,
    passengers: initialValues?.passengers ?? 1,
    cabinClass: initialValues?.cabinClass ?? 'Economy',
  });

  // 顯示用標籤（避免還要再查一次機場名稱）
  const [originLabel, setOriginLabel] = React.useState('');
  const [destLabel, setDestLabel] = React.useState('');

  // Modal
  const [openOriginPicker, setOpenOriginPicker] = React.useState(false);
  const [openDestPicker, setOpenDestPicker] = React.useState(false);

  // 日期 input
  const departRef = React.useRef<HTMLInputElement | null>(null);
  const returnRef = React.useRef<HTMLInputElement | null>(null);

  const canSubmit = React.useMemo(() => {
    const base =
      !!values.origin &&
      !!values.destination &&
      !!values.departDate &&
      values.passengers > 0;
    return values.tripType === 'roundtrip' ? base && !!values.returnDate : base;
  }, [values]);

  const handle = <K extends keyof FlightSearchValues>(
    key: K,
    value: FlightSearchValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const swapOD = () =>
    setValues((v) => {
      // 同步交換標籤
      setOriginLabel(destLabel);
      setDestLabel(originLabel);
      return { ...v, origin: v.destination, destination: v.origin };
    });

  const openPicker = (which: 'depart' | 'return') => {
    const el = which === 'depart' ? departRef.current : returnRef.current;
    el?.showPicker ? el.showPicker() : el?.focus();
  };

  const setTripType = (tt: TripType) => {
    setValues((prev) =>
      tt === 'oneway'
        ? { ...prev, tripType: tt, returnDate: undefined }
        : { ...prev, tripType: tt, returnDate: prev.returnDate ?? TODAY }
    );
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (onSubmit) {
      onSubmit(values);
      return;
    }

    const params = new URLSearchParams({
      tripType: values.tripType,
      origin: values.origin,
      destination: values.destination,
      departDate: values.departDate,
      ...(values.tripType === 'roundtrip' && values.returnDate
        ? { returnDate: values.returnDate }
        : {}),
      passengers: String(values.passengers),
      cabin: values.cabinClass,
    });

    // 🆕 把前一頁顯示用的 label 一起帶過去
    if (originLabel) params.set('originLabel', originLabel);
    if (destLabel) params.set('destLabel', destLabel);

    router.push(`/flight-booking?${params.toString()}`);
  };

  return (
    <>
      <div
        className={clsx(
          'w-full max-w-[1140px] overflow-hidden shadow-sm',
          'rounded-[var(--sw-r-md)] border border-[color:var(--sw-accent)] bg-[color:var(--sw-white)]'
        )}
      >
        {/* Tabs */}
        <div className="py-2 flex justify-center bg-[color:var(--sw-accent)]">
          <div className="inline-flex rounded-full bg-[color:var(--sw-primary)]/10 p-1">
            <button
              onClick={() => setTripType('roundtrip')}
              className={clsx(
                'px-4 sm:px-5 py-1.5 rounded-full text-sm font-medium transition',
                values.tripType === 'roundtrip'
                  ? 'bg-[color:var(--sw-white)] text-[color:var(--sw-primary)] shadow'
                  : 'text-[color:var(--sw-primary)]/80 hover:bg-[color:var(--sw-white)]/30'
              )}
            >
              {t('search.roundtrip')}
            </button>
            <button
              onClick={() => setTripType('oneway')}
              className={clsx(
                'px-4 sm:px-5 py-1.5 rounded-full text-sm font-medium transition',
                values.tripType === 'oneway'
                  ? 'bg-[color:var(--sw-white)] text-[color:var(--sw-primary)] shadow'
                  : 'text-[color:var(--sw-primary)]/80 hover:bg-[color:var(--sw-white)]/30'
              )}
            >
              {t('search.oneway')}
            </button>
          </div>
        </div>

        {/* 表單 */}
        <div className="px-4 md:px-6 pt-4 pb-5">
          {/* 第1排：起點 | 交換 | 到達 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            {/* 起點 */}
            <div className="md:col-span-5">
              <FieldShell
                label={t('search.origin.label')}
                icon={<Plane className="w-4 h-4" />}
              >
                <button
                  type="button"
                  onClick={() => setOpenOriginPicker(true)}
                  className="w-full text-left bg-transparent outline-none"
                >
                  {values.origin ? (
                    <span className="text-[color:var(--sw-primary)]">
                      {originLabel || values.origin}
                    </span>
                  ) : (
                    <span className="text-[color:var(--sw-primary)]/50">
                      {t('search.origin.placeholder')}
                    </span>
                  )}
                </button>
              </FieldShell>
            </div>

            {/* 交換按鈕 */}
            <div className="md:col-span-2 flex items-end md:items-center justify-center">
              <button
                type="button"
                onClick={swapOD}
                aria-label={t('search.swap')}
                className={clsx(
                  'h-12 w-12 rounded-full border border-[color:var(--sw-accent)]',
                  'bg-[color:var(--sw-white)] hover:bg-[color:var(--sw-accent)]/10',
                  'flex items-center justify-center transition'
                )}
                title={t('search.swap')}
              >
                <ArrowLeftRight className="w-5 h-5 text-[color:var(--sw-primary)]" />
              </button>
            </div>

            {/* 到達 */}
            <div className="md:col-span-5">
              <FieldShell
                label={t('search.destination.label')}
                icon={<Plane className="w-4 h-4" />}
              >
                <button
                  type="button"
                  onClick={() => setOpenDestPicker(true)}
                  className="w-full text-left bg-transparent outline-none"
                >
                  {values.destination ? (
                    <span className="text-[color:var(--sw-primary)]">
                      {destLabel || values.destination}
                    </span>
                  ) : (
                    <span className="text-[color:var(--sw-primary)]/50">
                      {t('search.destination.placeholder')}
                    </span>
                  )}
                </button>
              </FieldShell>
            </div>
          </div>

          {/* 第2排：日期 / 乘客 / 艙等 */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            <div className="md:col-span-6">
              <FieldShell
                label={t('search.date.label')}
                icon={<Calendar className="w-4 h-4" />}
                showChevron={false}
              >
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => openPicker('depart')}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs text-[color:var(--sw-primary)] font-medium">
                      {t('search.date.depart')}
                    </span>
                    <input
                      ref={departRef}
                      type="date"
                      className="bg-[color:var(--sw-white)] text-[color:var(--sw-primary)] outline-none"
                      value={values.departDate}
                      min={TODAY}
                      onChange={(e) => handle('departDate', e.target.value)}
                    />
                  </button>
                  <span className="text-[color:var(--sw-primary)]/40">—</span>
                  <button
                    onClick={() => openPicker('return')}
                    disabled={values.tripType === 'oneway'}
                    className="flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="text-xs text-[color:var(--sw-primary)] font-medium">
                      {t('search.date.return')}
                    </span>
                    <input
                      ref={returnRef}
                      type="date"
                      className="bg-transparent outline-none text-[color:var(--sw-primary)] font-semibold disabled:text-[color:var(--sw-primary)]/50"
                      value={values.returnDate ?? ''}
                      min={values.departDate || TODAY}
                      onChange={(e) => handle('returnDate', e.target.value)}
                      disabled={values.tripType === 'oneway'}
                    />
                  </button>
                </div>
              </FieldShell>
            </div>

            <div className="md:col-span-3">
              <FieldShell
                label={t('search.passenger')}
                icon={<User className="w-4 h-4" />}
              >
                <select
                  className="w-full bg-transparent outline-none text-[color:var(--sw-primary)] font-semibold"
                  value={values.passengers}
                  onChange={(e) => handle('passengers', Number(e.target.value))}
                >
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>

            <div className="md:col-span-3">
              <FieldShell
                label={t('search.cabin')}
                icon={<Armchair className="w-4 h-4" />}
              >
                <select
                  className="w-full bg-transparent outline-none text-[color:var(--sw-primary)] font-semibold"
                  value={values.cabinClass}
                  onChange={(e) =>
                    handle('cabinClass', e.target.value as CabinClass)
                  }
                >
                  <option value="Economy">{t('cabin.economy')}</option>
                  <option value="Business">{t('cabin.business')}</option>
                </select>
              </FieldShell>
            </div>
          </div>

          {/* 送出 */}
          <div className="w-full flex justify-center mt-6">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={clsx(
                'sw-btn sw-btn--gold-primary rounded-full',
                !canSubmit && 'opacity-60 cursor-not-allowed'
              )}
            >
              <Ticket className="w-4 h-4 text-[color:var(--sw-primary)] mr-2" />
              {t('search.submit')}
            </button>
          </div>
        </div>
      </div>

      {/* 起點 Modal */}
      <Modal
        open={openOriginPicker}
        onClose={() => setOpenOriginPicker(false)}
        title={t('search.airport.originTitle')}
      >
        <AirportSearchPicker
          forbiddenIata={values.destination} // 不能選現在目的地
          onCancel={() => setOpenOriginPicker(false)}
          onConfirm={({ iata, label }) => {
            setValues((v) => ({ ...v, origin: iata }));
            setOriginLabel(label);
            setOpenOriginPicker(false);
          }}
        />
      </Modal>

      {/* 到達 Modal */}
      <Modal
        open={openDestPicker}
        onClose={() => setOpenDestPicker(false)}
        title={t('search.airport.destTitle')}
      >
        <AirportSearchPicker
          forbiddenIata={values.origin} // 不能選現在出發地
          onCancel={() => setOpenDestPicker(false)}
          onConfirm={({ iata, label }) => {
            setValues((v) => ({ ...v, destination: iata }));
            setDestLabel(label);
            setOpenDestPicker(false);
          }}
        />
      </Modal>
    </>
  );
}
