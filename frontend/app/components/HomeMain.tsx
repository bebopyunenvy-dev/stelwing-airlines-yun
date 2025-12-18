'use client';

import { useLanguage } from '@/src/i18n/LanguageContext';
import { ChevronLeft, ChevronRight, Pause, Play, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 免稅商品（商品名稱就保持各自語言）
const dutyfree = [
  {
    id: 1,
    brand: 'Estee Lauder',
    nameZh: '雅詩蘭黛特潤導入全方位修護露100ML',
    nameEn: 'Advanced Night Repair Serum 100ml',
    img: '/images/dutyfree/brown.png',
  },
  {
    id: 2,
    brand: 'Ray-Ban',
    nameZh: 'Ray-Ban 經典飛行員墨鏡',
    nameEn: 'Ray-Ban Classic Aviator Sunglasses',
    img: '/images/dutyfree/sunglasses.png',
  },
  {
    id: 3,
    brand: 'Prada',
    nameZh: 'Prada 漁夫帽尼龍系列',
    nameEn: 'Prada Nylon Bucket Hat',
    img: '/images/dutyfree/p1.png',
  },
  {
    id: 4,
    brand: 'Laura Mercier',
    nameZh: 'Laura Mercier 柔光透明香氛',
    nameEn: 'Laura Mercier Soft Glow Fragrance',
    img: '/images/dutyfree/aromatherapy.png',
  },
  {
    id: 5,
    brand: 'Giorgio Armani',
    nameZh: 'Giorgio Armani 光韻持久粉底液',
    nameEn: 'Giorgio Armani Luminous Longwear Foundation',
    img: '/images/dutyfree/essence.png',
  },
  {
    id: 6,
    brand: 'YSL',
    nameZh: 'YSL 奢華緞面唇膏',
    nameEn: 'YSL Rouge Pur Couture Lipstick',
    img: '/images/dutyfree/mainRight.jpg',
  },
];

// 旅遊文章輪播資料（中 / 英 兩組）
const travelArticlesZh = [
  {
    id: 1,
    title: '轉機也能小旅行：半日城市散步提案',
    description:
      '利用轉機空檔，快速走進城市生活。從車站周邊商圈、隱藏咖啡店，到必拍地標，一篇幫你排好輕鬆散步路線。',
    href: '#',
    image: '/images/travel1.jpg',
  },
  {
    id: 2,
    title: '三天兩夜城市快閃：新手自由行行程範例',
    description:
      '想要第一次自己規劃行程又不想踩雷？透過實際範例拆解交通、住宿與景點順序，讓短天數旅行也能玩得很充實。',
    href: '#',
    image: '/images/travel2.jpg',
  },
  {
    id: 3,
    title: '一個人的旅行：適合獨旅的城市與玩法',
    description:
      '從安全友善、交通便利到拍照好看，精選適合獨旅的城市，搭配晚間散步與早晨咖啡路線，陪你安心完成第一趟獨自出發。',
    href: '#',
    image: '/images/travel3.jpg',
  },
];

const travelArticlesEn = [
  {
    id: 1,
    title: 'Turn Layovers into Mini Trips',
    description:
      'Make the most of your layover with a half-day city walk — from train-station districts and hidden cafés to must-see landmarks planned in one route.',
    href: '#',
    image: '/images/travel1.jpg',
  },
  {
    id: 2,
    title: '3 Days in the City: First-Timer Itinerary',
    description:
      'Nervous about planning your first trip? This sample itinerary breaks down transport, hotels, and sightseeing order so short trips still feel complete.',
    href: '#',
    image: '/images/travel2.jpg',
  },
  {
    id: 3,
    title: 'Traveling Solo: Cities Made for You',
    description:
      'From safety and convenience to beautiful photo spots, these cities are perfect for solo travelers, with gentle morning coffee walks and night strolls.',
    href: '#',
    image: '/images/travel3.jpg',
  },
];

export default function HomeMain() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t, locale } = useLanguage();
  const router = useRouter();

  const articles = locale === 'en' ? travelArticlesEn : travelArticlesZh;
  const totalSlides = articles.length;

  // 自動輪播
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const activeArticle = articles[currentSlide];

  return (
    <div className="w-full">
      {/* 住宿預訂 */}
      <section className="max-w-[1440px] mx-auto px-6 py-12 md:py-16">
        <h2 className="text-center text-xl font-semibold text-[#1F2E3C]">
          {t('home.hotels.title')}
        </h2>
        {/* 副標題 */}
        <p className="mt-3 text-center text-sm md:text-base text-[#4B5563]">
          {t('home.hotels.subtitle')}
        </p>

        {/* 三欄比例：左2 / 中3 / 右2；固定列高 330px */}
        <div className="mt-10 grid gap-8 grid-cols-1 md:[grid-template-columns:2fr_3fr_2fr] md:auto-rows-[330px]">
          {/* A：左上 */}
          <article
            className="group cursor-pointer md:col-start-1 md:col-end-2 md:row-start-1"
            onClick={() => router.push('/hotel-booking')}
          >
            <div className="h-full rounded-[14px] border-2 border-[#D9B37B] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
              {/* ✅ 手機版用固定比例顯示圖片 */}
              <div className="relative w-full aspect-[4/3] md:flex-1 md:aspect-auto">
                <Image
                  src="/images/hotel/room3.jpeg"
                  alt="Hotel A"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-[#1F2E3C]">
                  {t('hotel.name.a')}
                </p>
                <div className="flex items-center gap-1 text-[#D9B37B]">
                  <Star size={18} className="fill-current" />
                  <span className="text-sm text-[#8A8F98]">4.8</span>
                </div>
              </div>
            </div>
          </article>

          {/* C：中間大卡（跨兩列） */}
          <article
            className="cursor-pointer md:col-start-2 md:col-end-3 md:row-start-1 md:row-span-2"
            onClick={() => router.push('/hotel-booking')}
          >
            <div className="h-full rounded-[14px] border-2 border-[#D9B37B] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/3] md:flex-1 md:aspect-auto">
                <Image
                  src="/images/hotel/room2.jpeg"
                  alt="Hotel C"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-lg md:text-xl font-semibold text-[#1F2E3C]">
                  {t('hotel.name.b')}
                </p>
                <div className="flex items-center gap-1 text-[#D9B37B]">
                  <Star size={18} className="fill-current" />
                  <span className="text-sm text-[#8A8F98]">4.8</span>
                </div>
              </div>
            </div>
          </article>

          {/* D：右上 */}
          <article
            className="group cursor-pointer md:col-start-3 md:col-end-4 md:row-start-1"
            onClick={() => router.push('/hotel-booking')}
          >
            <div className="h-full rounded-[14px] border-2 border-[#D9B37B] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/3] md:flex-1 md:aspect-auto">
                <Image
                  src="/images/hotel/food1.jpeg"
                  alt="Hotel D"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-[#1F2E3C]">
                  {t('hotel.name.e')}
                </p>
                <div className="flex items-center gap-1 text-[#D9B37B]">
                  <Star size={18} className="fill-current" />
                  <span className="text-sm text-[#8A8F98]">4.8</span>
                </div>
              </div>
            </div>
          </article>

          {/* B：左下 */}
          <article
            className="group cursor-pointer md:col-start-1 md:col-end-2 md:row-start-2"
            onClick={() => router.push('/hotel-booking')}
          >
            <div className="h-full rounded-[14px] border-2 border-[#D9B37B] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/3] md:flex-1 md:aspect-auto">
                <Image
                  src="/images/hotel/room4.jpeg"
                  alt="Hotel B"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-[#1F2E3C]">
                  {t('hotel.name.c')}
                </p>
                <div className="flex items-center gap-1 text-[#D9B37B]">
                  <Star size={18} className="fill-current" />
                  <span className="text-sm text-[#8A8F98]">4.8</span>
                </div>
              </div>
            </div>
          </article>

          {/* E：右下 */}
          <article
            className="group cursor-pointer md:col-start-3 md:col-end-4 md:row-start-2"
            onClick={() => router.push('/hotel-booking')}
          >
            <div className="h-full rounded-[14px] border-2 border-[#D9B37B] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/3] md:flex-1 md:aspect-auto">
                <Image
                  src="/images/hotel/food3.jpeg"
                  alt="Hotel E"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-[#1F2E3C]">
                  {t('hotel.name.d')}
                </p>
                <div className="flex items-center gap-1 text-[#D9B37B]">
                  <Star size={18} className="fill-current" />
                  <span className="text-sm text-[#8A8F98]">4.8</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 免稅商品 */}
      <section className="bg-[#233544] text-white py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-center text-lg md:text-xl font-semibold">
            {t('home.dutyfree.title')}
          </h2>
          {/* 副標題 */}
          <p className="mt-3 text-center text-sm md:text-base text-white/80">
            {t('home.dutyfree.subtitle')}
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {dutyfree.map((p) => (
              <article
                key={p.id}
                onClick={() => router.push('/dutyfree-shop')}
                className="cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                {/* 圖片 */}
                <div className="relative aspect-[16/10]">
                  <Image
                    src={p.img}
                    alt={locale === 'en' ? p.nameEn : p.nameZh}
                    fill
                    sizes="(min-width:1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>

                {/* 下方說明區：白色背景 */}
                <div className="p-4 md:p-5 bg-white">
                  {/* 品牌名稱：金色 sw-accent */}
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--sw-accent)' }}
                  >
                    {p.brand}
                  </p>

                  {/* 商品名稱：依語言切換 */}
                  <p className="mt-2 text-sm leading-relaxed text-[#1F2E3C]">
                    {locale === 'en' ? p.nameEn : p.nameZh}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 圖像型宣傳 Banner：旅遊文章輪播 */}
      <section className="relative">
        {/* 背景圖：全寬，維持比例避免手機消失 */}
        <div className="relative aspect-[4/3] md:aspect-[16/9] w-full">
          <Image
            src={activeArticle.image}
            alt={activeArticle.title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-all duration-700"
          />
        </div>

        {/* 版心 + 卡片定位：疊在圖片上 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto max-w-[1440px] h-full px-4 md:px-6 lg:px-10 flex items-start md:items-center">
            <div className="pointer-events-auto mt-10 md:mt-0">
              <div className="w-[280px] md:w-[360px] rounded-2xl bg-[#1F2E3C]/80 text-white p-5 md:p-6 shadow-lg">
                {/* 小標 */}
                <p className="text-xs tracking-[0.18em] uppercase text-[#D9B37B]">
                  {t('home.travelstories.tag')}
                </p>

                {/* 動態標題＋內容：與旅遊文章相關 */}
                <h3 className="mt-2 text-lg md:text-xl font-semibold">
                  {activeArticle.title}
                </h3>
                <p className="mt-3 text-sm text-white/85 leading-relaxed">
                  {activeArticle.description}
                </p>

                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#D9B37B] px-4 py-2 text-[#1F2E3C] text-sm font-semibold hover:brightness-95"
                  onClick={() => router.push('/travel-community')}
                >
                  {t('home.travelstories.read')}
                  <ChevronRight size={16} />
                </button>

                {/* 控制列：上一張／播放暫停／下一張＋頁面指示 */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    aria-label={t('home.travelstories.prev')}
                    onClick={handlePrev}
                    className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    aria-label={
                      isPlaying
                        ? t('home.travelstories.pause')
                        : t('home.travelstories.play')
                    }
                    onClick={handleTogglePlay}
                    className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    aria-label={t('home.travelstories.next')}
                    onClick={handleNext}
                    className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* 右側：頁碼＋小 dot 指示器 */}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-white/80">
                      {String(currentSlide + 1).padStart(2, '0')} /{' '}
                      {String(totalSlides).padStart(2, '0')}
                    </span>
                    <div className="flex gap-1">
                      {articles.map((article, idx) => (
                        <button
                          key={article.id}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`Slide ${idx + 1}`}
                          className={`h-1.5 w-4 rounded-full transition ${
                            idx === currentSlide
                              ? 'bg-[#D9B37B]'
                              : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
