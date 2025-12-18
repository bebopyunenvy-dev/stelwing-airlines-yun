// app/layout.tsx
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import 'styled-jsx/css';
import ClientProviders from './ClientProviders';
import Footer from './components/footer';

// ✅ (R) Read：讀取目前路徑決定要不要渲染 Header（免稅頁不顯示）
//    實作放在 ConditionalHeader 裡
import ConditionalHeader from './ConditionalHeader';

// ✅ (C) Create：建立全站共用的 AuthProvider（登入狀態）
//    讓 Header 可以用 useAuth() 讀到登入 / 登出狀態
import { AuthProvider } from '@/app/context/auth-context';
import { ToastProvider } from '@/app/context/toast-context';

export const metadata: Metadata = {
  title: '展翼航空 Stelwing',
  description: 'Stelwing Airlines Official Website',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        {/* 多語等 client 端 Provider 都放這裡 */}
        <ClientProviders>
          {/* ToastProvider 置於最外層，確保全站都能呼叫提示 */}
          <ToastProvider>
            {/*  (C) Create：在這裡包一層 AuthProvider */}
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                {/* Header 是否顯示 */}
                <ConditionalHeader />
                {/* 主要頁面內容 */}
                <main className="flex-1 flex flex-col">{children}</main>
              </div>
              {/* Footer 全站共用 */}
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
