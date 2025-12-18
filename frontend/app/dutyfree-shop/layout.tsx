'use client';
import HeaderWithCart from '../HeaderWithCart'; // ✅ 改這裡！
import { DFStoreProvider } from './context/DFStoreContext';
import './style.css';

export default function DutyFreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DFStoreProvider>
      <div id="dutyfree-theme" className="relative">
        {/* ✅ DutyFree Header 改成帶購物車同步的版本 */}
        <HeaderWithCart />

        <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          {children}
        </main>
      </div>
    </DFStoreProvider>
  );
}
