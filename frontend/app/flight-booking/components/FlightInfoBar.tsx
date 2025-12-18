'use client';

import { Armchair, Calendar, Edit3, FileText, Plane, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useBookingStore } from '../../../src/store/bookingStore';

type TripType = 'roundtrip' | 'oneway';
type CabinClass = 'Economy' | 'Business';

function toCJKCabin(c?: string | null) {
  return c === 'Business' ? '商務艙' : '經濟艙';
}
function fmtDate(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}/${day}`;
}

export default function FlightInfoBar({
  onShowDetails,
}: {
  onShowDetails?: () => void;
}) {
  const sp = useSearchParams();

  const tripType = (sp.get('tripType') as TripType) ?? 'roundtrip';
  const origin = sp.get('origin') ?? '台北(桃園)';
  const destination = sp.get('destination') ?? '東京成田';
  const departDate = sp.get('departDate');
  const returnDate = sp.get('returnDate');
  const passengers = Number(sp.get('passengers') ?? '1');

  const cabinFromUrl =
    (sp.get('cabin') as CabinClass | null) ??
    (sp.get('cabinClass') as CabinClass | null);

  const qs = sp.toString();

  const baseFare = useBookingStore((s) => s.price.baseFare);
  const extrasTotal = useBookingStore((s) => s.price.extrasTotal);
  const openDetails = useBookingStore((s) => s.openDetails);
  const displayTotal = (baseFare ?? 0) + (extrasTotal ?? 0);

  return (
    <div className="sw-section--light border-b border-[var(--sw-grey)] bg-white">
      <div className="h-[2px] w-full bg-[var(--sw-accent)]" />

      <div className="w-full px-32 h-12 flex items-center justify-between">
        {/* 左側資訊列 */}
        <div className="flex flex-wrap items-center gap-3 sw-p1 text-[var(--sw-primary)]">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            <span className="font-semibold">
              {origin} <span className="mx-1">→</span> {destination}
            </span>
            <span className="sw-p2 opacity-70">
              （{tripType === 'roundtrip' ? '來回' : '單程'}）
            </span>
          </div>

          <span className="hidden md:inline opacity-40">│</span>

          <div className="hidden md:flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="sw-p2 opacity-80">日期：</span>
            <span className="font-medium">
              {tripType === 'roundtrip'
                ? `${fmtDate(departDate)} - ${fmtDate(returnDate)}`
                : fmtDate(departDate)}
            </span>
          </div>

          <span className="hidden md:inline opacity-40">│</span>

          <div className="hidden md:flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="sw-p2 opacity-80">乘客：</span>
            <span className="font-medium">{passengers} 位 成人</span>
          </div>

          <span className="hidden md:inline opacity-40">│</span>

          <div className="hidden md:flex items-center gap-1">
            <Armchair className="w-4 h-4" />
            <span className="sw-p2 opacity-80">艙等：</span>
            <span className="font-medium">{toCJKCabin(cabinFromUrl)}</span>
            <Link
              href={`/?${qs}`}
              className="inline-flex items-center gap-1 text-[var(--sw-accent)] hover:opacity-80"
              aria-label="修改搜尋條件"
            >
              <Edit3 className="w-[14px] h-[14px]" />
            </Link>
          </div>
        </div>

        {/* 右側：查看明細｜金額 */}
        <div className="flex items-center gap-3 sw-p1 text-[var(--sw-primary)]">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openDetails();
            }}
            className="inline-flex items-center gap-1 hover:opacity-80"
          >
            <FileText className="w-4 h-4" />
            <span className="font-semibold">查看明細</span>
          </Link>

          <span className="opacity-40">│</span>

          <div className="sw-p1 opacity-80">
            TWD{' '}
            <span className="font-bold text-[var(--sw-primary)]">
              {Number(displayTotal || 0).toLocaleString('zh-TW')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
