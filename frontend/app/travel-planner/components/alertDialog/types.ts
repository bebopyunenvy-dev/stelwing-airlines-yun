// 使用 alert dialog 元件時一定要有的 props
export type AlertState = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
};

// 使用 showAlert 要傳入設定內容時的型別
export type AlertOptions = {
  title: string;
  description?: string;
  confirmText: string;
  onConfirm?: () => void;
};
