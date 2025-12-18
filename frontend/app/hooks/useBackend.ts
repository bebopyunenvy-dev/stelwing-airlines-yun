"use client";

import { useAuth } from "@/app/context/auth-context";
import { useEffect } from "react";

// ⭐ 在需要串後端的頁面 import useBackend() 就能強制刷新登入狀態（更新 Header）
export function useBackend() {
  const { refresh } = useAuth();

  useEffect(() => {
    refresh(); // ⭐ 重新驗證 token → Header 會立刻改成登入狀態
  }, []);
}
