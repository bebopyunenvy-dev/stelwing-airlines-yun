'use client';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type FareCell = {
  iso: string; // 2025-12-04
  label: string; // 12/4 週四
  fare: number; // 7777
  currency?: string; // TWD
  isCheapest?: boolean; // 標記最便宜
};

interface FareDateStripProps {
  title?: string; // 「去程 台北(桃園) → 東京成田」之類
  items: FareCell[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

export default function FareDateStrip({
  title,
  items,
  selectedIndex,
  onSelect,
  onPrev,
  onNext,
  className,
}: FareDateStripProps) {
  return (
    <section className={clsx('space-y-3', className)}>
      {title && (
        <div className="text-lg font-extrabold text-[var(--sw-primary)]">
          {title}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="h-10 w-10 rounded-full border border-[var(--sw-grey)] hover:bg-neutral-50 flex items-center justify-center"
          aria-label="previous dates"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 overflow-x-auto">
          <div className="grid auto-cols-[160px] grid-flow-col gap-3 justify-center lg:justify-center">
            {items.map((d, i) => {
              const active = i === selectedIndex;
              return (
                <button
                  key={d.iso}
                  onClick={() => onSelect(i)}
                  className={clsx(
                    'rounded-xl border px-4 py-3 text-left transition',
                    active
                      ? 'bg-[var(--sw-accent)] text-[var(--sw-primary)]'
                      : 'bg-white text-[var(--sw-primary)] border-[var(--sw-grey)] hover:border-[var(--sw-primary)]'
                  )}
                >
                  <div className="text-sm opacity-80">{d.label}</div>
                  <div className="mt-1 font-extrabold">
                    {d.currency ?? 'TWD'} {d.fare.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onNext}
          className="h-10 w-10 rounded-full border border-[var(--sw-grey)] hover:bg-neutral-50 flex items-center justify-center"
          aria-label="next dates"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
