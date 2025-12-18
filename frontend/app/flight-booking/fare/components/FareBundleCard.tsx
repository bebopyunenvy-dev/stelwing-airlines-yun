'use client';

import {
  Armchair,
  Backpack,
  CheckCircle2,
  CircleDollarSign,
  Package,
  Utensils,
  XCircle,
} from 'lucide-react';

export type FareFeature = {
  key: string;
  label: string;
  included: boolean;
  note?: string;
  icon?: React.ReactNode;
};

export type FareBundle = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  features: FareFeature[];
};

export default function FareBundleCard({
  bundle,
  onSelect,
  className = '',
}: {
  bundle: FareBundle;
  onSelect?: (bundle: FareBundle) => void;
  className?: string;
}) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('zh-Hant', { maximumFractionDigits: 0 }).format(n);

  return (
    <div
      className={`rounded-2xl p-6 md:p-7 bg-[var(--sw-primary)] text-[var(--sw-white)] shadow-[0_8px_24px_rgba(0,0,0,.12)] flex flex-col ${className}`}
    >
      {/* 方案名稱 */}
      <div className="text-lg font-extrabold tracking-wide mb-4">
        {bundle.name}
      </div>

      {/* 功能列表 */}
      <div className="space-y-4">
        {bundle.features.map((f) => (
          <div key={f.key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="opacity-90">
                {f.icon ??
                  (
                    {
                      hand: <Backpack size={18} />,
                      checked: <Package size={18} />,
                      seat: <Armchair size={18} />,
                      meal: <Utensils size={18} />,
                      refund: <CircleDollarSign size={18} />,
                    } as Record<string, React.ReactNode>
                  )[f.key] ?? <CheckCircle2 size={18} />}
              </span>
              <span className="text-sm md:text-base">{f.label}</span>
            </div>

            <div className="flex items-center gap-2">
              {f.included ? (
                <>
                  <CheckCircle2 className="shrink-0" />
                  <span className="text-sm md:text-base">內含</span>
                </>
              ) : f.note ? (
                <span className="text-sm md:text-base opacity-90">
                  {f.note}
                </span>
              ) : (
                <>
                  <XCircle className="shrink-0 opacity-80" />
                  <span className="text-sm md:text-base opacity-90">未含</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分隔線 */}
      <div className="my-6 border-t border-dashed border-white/20" />

      {/* 價格 + 行動按鈕（用你的 global.css 風格） */}
      <div className="mt-auto flex items-end justify-between">
        <div className="space-y-1">
          <div className="text-sm opacity-80">機票</div>
          <div className="text-xl md:text-2xl font-extrabold tracking-wide">
            {bundle.currency ?? 'TWD'}&nbsp;{fmt(bundle.price)}
          </div>
        </div>

        <button
          onClick={() => onSelect?.(bundle)}
          className="sw-btn sw-btn--gold-primary w-[96px] justify-center"
        >
          選擇
        </button>
      </div>
    </div>
  );
}
