// app/travel-community/components/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  FilterState,
  mileageOptions,
  timeRangeOptions,
  categoryOptions,
} from "../data/posts";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (state: Partial<FilterState>) => void;
  onApply: () => void;
  appliedMessage?: string | null;
  popularTags: string[];
}

const SelectField = ({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const currentLabel =
    options.find((opt) => opt.value === value)?.label ?? options[0].label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-[10px] border border-[#1F2E3C]/15 bg-white px-4 text-left text-sm text-[#1F2E3C]"
      >
        {currentLabel}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-[12px] border border-[#E1E5EB] bg-white shadow-[0_10px_25px_rgba(8,15,40,0.08)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--sw-accent)]/15 ${
                opt.value === value ? "text-[var(--sw-primary)] font-semibold" : "text-[#1F2E3C]/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function FilterSidebar({
  filters,
  onChange,
  onApply,
  appliedMessage,
  popularTags,
}: FilterSidebarProps) {
  const toggleValue = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  return (
    <div className="rounded-[12px] border border-[rgba(45,64,87,0.1)] bg-white p-5 shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">排序方式</h3>
        <div className="space-y-2 text-sm text-[#1F2E3C]/80">
          {[
            { label: "最新", value: "newest" },
            { label: "最熱門", value: "popular" },
            { label: "最多哩程", value: "miles" },
            { label: "分享最多", value: "shares" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                checked={filters.sort === option.value}
                onChange={() => onChange({ sort: option.value as FilterState["sort"] })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="發佈時間">
        <SelectField
          options={timeRangeOptions}
          value={filters.timeRange}
          onChange={(value) => onChange({ timeRange: value as FilterState["timeRange"] })}
        />
      </Field>

      <Field label="獎勵哩程">
        <SelectField
          options={mileageOptions}
          value={filters.mileageTier}
          onChange={(value) => onChange({ mileageTier: value as FilterState["mileageTier"] })}
        />
      </Field>

      <Field label="熱門標籤">
        <TagGroup
          tags={popularTags}
          selected={filters.selectedTags}
          onToggle={(tag) =>
            onChange({ selectedTags: toggleValue(filters.selectedTags, tag) })
          }
        />
      </Field>

      <Field label="景點分類">
        <TagGroup
          tags={categoryOptions}
          selected={filters.selectedCategories}
          onToggle={(cat) =>
            onChange({
              selectedCategories: toggleValue(filters.selectedCategories, cat),
            })
          }
        />
      </Field>

      {appliedMessage && (
        <p className="text-xs text-[var(--sw-primary)]">{appliedMessage}</p>
      )}

      <button
        type="button"
        onClick={onApply}
        className="mt-1 h-11 rounded-full bg-[var(--sw-accent)] text-black text-sm font-normal tracking-[0.08em] shadow-[0_10px_25px_rgba(220,187,135,0.28)] hover:bg-[var(--sw-accent)]/90 transition"
      >
        套用篩選
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 w-full">
      <div className="text-sm font-semibold text-[#1F2E3C]/80">{label}</div>
      {children}
    </div>
  );
}

function TagGroup({
  tags,
  selected,
  onToggle,
}: {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => {
        const isActive = selected.includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => onToggle(t)}
            className={`rounded-full border px-3 h-8 text-sm transition ${
              isActive
                ? "bg-[var(--sw-accent)] text-black border-[var(--sw-accent)]"
                : "hover:border-[var(--sw-accent)]"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
