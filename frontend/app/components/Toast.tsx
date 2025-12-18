"use client";

import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "info" | "warning";

interface ToastProps {
  isOpen: boolean;
  title: string;
  message?: string;
  type?: ToastType;
  onClose?: () => void;
}

const iconConfig = {
  success: { Icon: CheckCircle2, color: "#1F2E3C" },
  info: { Icon: Info, color: "#1F2E3C" },
  warning: { Icon: AlertTriangle, color: "#B45309" },
};

export default function Toast({
  isOpen,
  title,
  message,
  type = "success",
  onClose,
}: ToastProps) {
  const { Icon, color } = iconConfig[type];

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1200] flex items-start justify-center sm:items-center transition-all duration-300 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`relative mt-20 sm:mt-0 min-w-[260px] max-w-[340px] rounded-2xl border border-[#DCBB87] bg-white px-8 py-6 text-center shadow-2xl ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="mb-3 flex justify-center">
          <Icon size={40} strokeWidth={1.6} style={{ color }} />
        </div>
        <div className="text-lg font-semibold text-[#1F2E3C]">{title}</div>
        {message && (
          <p className="mt-1 text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
            {message}
          </p>
        )}

        <button
          type="button"
          aria-label="關閉提醒"
          onClick={onClose}
          className="pointer-events-auto absolute top-3 right-3 text-[#999] hover:text-[#1F2E3C] transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
