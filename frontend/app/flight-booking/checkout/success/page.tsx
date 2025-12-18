'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#182233] rounded-2xl px-10 py-8 max-w-md w-full text-center shadow-xl text-white">
        <h1 className="text-2xl font-semibold mb-4">付款完成</h1>
        <p className="text-sm text-gray-200 mb-8 leading-relaxed">
          感謝您的訂購，綠界金流已完成付款流程。
          <br />
          您可以前往「電子機票」查看詳細航班與座位資訊。
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/member-center/flight"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-[#d9b37b] text-[#111827]"
          >
            前往機票訂單中心查看
          </Link>

          {/* 原本的：回到首頁 */}
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium border border-gray-500 text-gray-100 hover:bg-gray-700/40 transition"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </main>
  );
}
