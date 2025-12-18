"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "@/app/components/Toast";

type ToastType = "success" | "info" | "warning";

interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

interface ToastState extends ToastOptions {
  isOpen: boolean;
  duration: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    duration: 2000,
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showToast = useCallback(
    ({ title, message = "", type = "success", duration = 2000 }: ToastOptions) => {
      setToast({
        isOpen: true,
        title,
        message,
        type,
        duration,
      });
    },
    []
  );

  useEffect(() => {
    if (!toast.isOpen) return;

    const timer = setTimeout(() => hideToast(), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.isOpen, toast.duration, hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        isOpen={toast.isOpen}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
