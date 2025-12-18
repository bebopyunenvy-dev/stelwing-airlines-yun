'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Locale, messages } from './locales';

type LanguageContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-TW');

  // 從 localStorage 還原使用者語言
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('stelwing-locale') as
      | Locale
      | null;
    if (saved === 'zh-TW' || saved === 'en') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((lang: Locale) => {
    setLocaleState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('stelwing-locale', lang);
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = messages[locale] || {};
      return dict[key] ?? key;
    },
    [locale],
  );

  const value: LanguageContextValue = {
    locale,
    t,
    setLocale,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
