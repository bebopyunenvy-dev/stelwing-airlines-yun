'use client';

import { useLanguage } from '@/src/i18n/LanguageContext';
import Image from 'next/image';
import FlightSearchCard from './components/FlightSearchCard';
import HomeMain from './components/HomeMain';
import { apiFetch } from "@/app/travel-community/utils/apiFetch";


export default function AppPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="relative w-full bg-[#162532] text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_0%_0%,rgba(255,255,255,0.06),rgba(0,0,0,0))]" />

        <div className="relative w-full">
          <div className="mx-auto w-[1440px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 pt-8 md:pt-12 pb-20 md:pb-24">
              {/* 左：文字 */}
              <div>
                <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                  {t('hero.home.title')}
                </h1>
                <p className="mt-6 text-base md:text-lg text-white/80 max-w-xl">
                  {t('hero.home.subtitle')}
                </p>
              </div>

              {/* 右：飛機圖 */}
              <div className="relative flex justify-end items-start">
                <Image
                  src="/images/flight1.png"
                  alt="Stelwing private jet"
                  width={1600}
                  height={900}
                  priority
                  sizes="(min-width:1280px) 560px, (min-width:1024px) 520px, (min-width:768px) 460px, 320px"
                  className="
                    w-[320px]
                    sm:w-[380px]
                    md:w-[460px]
                    lg:w-[520px]
                    xl:w-[560px]
                    h-auto
                    object-contain
                    object-right
                    drop-shadow-[0_18px_28px_rgba(0,0,0,0.30)]
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 搜尋卡 */}
      <section className="relative z-20 -mt-[120px] w-full">
        <div className="mx-auto w-full max-w-[1440px] px-6 flex justify-center">
          <FlightSearchCard
            onSubmit={(values) => {
              console.log('search submit:', values);
            }}
            initialValues={{
              tripType: 'roundtrip',
              origin: 'TPE',
              destination: 'NRT',
              cabinClass: 'Business',
            }}
          />
        </div>
      </section>

      <section className="h-2" />
      <HomeMain />
    </main>
  );
}
