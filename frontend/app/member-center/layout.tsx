'use client';

import Breadcrumb from '@/app/components/Breadcrumb';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import MemberTabs from './components/MemberTabs';

// ⭐⭐⭐【新增 Import】把登入狀態帶進 Layout（讓登出立即跳轉）
import { useAuth } from '@/app/context/auth-context';

export default function MemberCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname(); // ⭐ 取得目前路徑

  // ⭐⭐⭐【新增】從全站 AuthProvider 抓 isLoggedIn 狀態
  const { isLoggedIn } = useAuth();

  // ============================================================
  // ⭐⭐⭐【修改】登入驗證 + 登出瞬間跳回登入頁
  // ============================================================
  useEffect(() => {
    // 1) ⭐ 登入 / 註冊頁不做驗證（避免跳轉循環）
    if (
      pathname === '/member-center/login' ||
      pathname === '/member-center/register'
    ) {
      setLoading(false);
      return;
    }

    // 2) ⭐ 如果是登出(isLoggedIn=false) → 強制跳登入 & refresh
    if (!isLoggedIn) {
      setLoading(false);
      router.refresh(); // ⭐ 立刻刷新頁面狀態（重要）
      router.replace('/member-center/login');
      return;
    }

    // 3) ⭐ 有 token → 確認是否有效
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      router.replace('/member-center/login');
      return;
    }

    // ⭐ 後端驗證 token
    fetch('http://localhost:3007/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          router.replace('/member-center/login');
        }
      })
      .catch(() => router.replace('/member-center/login'))
      .finally(() => setLoading(false));
  }, [pathname, isLoggedIn, router]); // ⭐ 新增 isLoggedIn 監聽

  // ============================================================
  // ⭐ Loading 畫面
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#666] text-lg">
        檢查登入中...
      </div>
    );
  }

  // ============================================================
  // ⭐⭐ 關鍵：登入 / 註冊頁完全不使用 layout UI
  // ============================================================
  if (
    pathname === '/member-center/login' ||
    pathname === '/member-center/register'
  ) {
    return <>{children}</>;
  }

  // ============================================================
  // ⭐ 以下是你的原版 UI，完全保留
  // ============================================================
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-[64px] py-10">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: '首頁', href: '/' }, { label: '會員中心' }]}
        />

        {/* Page Title */}
        <h1 className="text-[24px] text-[#1F2E3C] my-8">會員中心</h1>

        {/* Tabs */}
        <MemberTabs />

        {/* Content */}
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
