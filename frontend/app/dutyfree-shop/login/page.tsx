'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DFLoginPage } from '../components/DFLoginPage';
import { useDFStore } from '../context/DFStoreContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export default function LoginPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useDFStore(); // ✅ 新增：從 Context 取出登入控制

  const [showSuccess, setShowSuccess] = useState(false);
  const redirectTimerRef = useRef<number | null>(null);

  const navigateNext = () => {
    router.push('/dutyfree-shop/cart');
  };

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <DFLoginPage
        onLoginSuccess={() => {
          setIsLoggedIn(true); // ✅ 設定登入狀態
          setShowSuccess(true);
          redirectTimerRef.current = window.setTimeout(navigateNext, 1200);
        }}
        onLoginFailed={() => {
          console.log('登入失敗，請檢查輸入');
        }}
        onRegisterClick={() => {
          router.push('/dutyfree-shop/register'); // ✅ 可導向註冊頁（若還沒做可以先保留）
        }}
      />

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md bg-white text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-[var(--df-primary-dark)]">
              登入成功
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              即將為您導向購物車，請稍候。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-center">
            <AlertDialogAction
              className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 px-6"
              onClick={navigateNext}
            >
              立即前往
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
