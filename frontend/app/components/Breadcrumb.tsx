"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[#666666]">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#DCBB87] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1F2E3C]">{item.label}</span>
          )}

          {/* 中間箭頭（最後一個不顯示） */}
          {index < items.length - 1 && <ChevronRight size={16} />}
        </div>
      ))}
    </nav>
  );
}
