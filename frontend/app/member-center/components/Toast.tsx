"use client";

import { useEffect, useState } from "react";

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 淡入
    setShow(true);

    // 0.8 秒後自動關閉
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 200); // 等淡出結束再真正移除
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed top-6 right-6 z-[9999]
        bg-[#DCBB87] text-[#1F2E3C]
        px-4 py-2 rounded-lg shadow-lg
        transition-all duration-200
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      {message}
    </div>
  );
}
