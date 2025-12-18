// app/ConditionalHeader.tsx
"use client";
// ⭐ (C) Create：這是一個 client component，
//    讓裡面的 Header 可以使用 useAuth() 等 React hooks，而不會報錯。

import { usePathname } from "next/navigation";
import Header from "./components/header";

export default function ConditionalHeader() {
  // ⭐ (R) Read：讀取目前所在路徑
  const pathname = usePathname();

  // ⭐ (U) Update（條件式更新 UI）：
  //    如果是免稅商店頁面，就「不顯示」 Header。
  //    這樣可以保留你們原本「Dutyfree 有自己 layout」的設定。
  if (pathname.startsWith("/dutyfree-shop")) {
    return null; // 不渲染任何東西
  }

  // ⭐ (D) Display：在其他頁面顯示共用 Header（含登入狀態、購物車等）
  return <Header />;
}
