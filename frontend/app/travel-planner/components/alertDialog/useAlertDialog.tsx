import { useCallback, useState } from 'react';
import { AlertOptions, AlertState } from './types';

// useAlertDialog 是一個自訂 Hook，集中管理 alert 通知訊息視窗的邏輯狀態，負責邏輯和資料
export function useAlertDialog() {
  // 設定 alert 通知訊息視窗的初始狀態，預設的空白內容
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    title: '',
    description: '',
    confirmText: '確認',
    onConfirm: () => {},
  });

  // 當我的程式下 showAlert()，顯示訊息彈出視窗
  const showAlert = useCallback(
    // 它會將 alert 視窗的狀態設定為：open true、標題內容用我們設定的、確認的操作使用
    ({ title, description, confirmText = '確認', onConfirm }: AlertOptions) => {
      setAlert({
        open: true,
        title,
        description: description ?? '',
        confirmText,
        onConfirm: () => {
          setAlert((prev) => ({ ...prev, open: false }));
          onConfirm?.();
        },
      });
    },
    []
  );

  // 當我的程式下 closeAlert()，關閉訊息視窗
  const closeAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  return { alert, showAlert, closeAlert };
}
