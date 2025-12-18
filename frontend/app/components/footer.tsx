'use client';

import { useLanguage } from '@/src/i18n/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1F2E3C] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + 描述 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/">
              <Image
                src="/logo-white.svg"
                alt="Stelwing Logo"
                width={125}
                height={48}
                className="cursor-pointer"
              />
            </Link>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('footer.desc')}
          </p>
        </div>

        {/* 服務項目 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-[#D9B37B]">
            {t('footer.services')}
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/flight-booking" className="hover:text-white">
                {t('footer.service.flight')}
              </Link>
            </li>
            <li>
              <Link href="/hotel-booking" className="hover:text-white">
                {t('footer.service.hotel')}
              </Link>
            </li>
            <li>
              <Link href="/dutyfree-shop" className="hover:text-white">
                {t('footer.service.dutyfree')}
              </Link>
            </li>
            <li>
              <Link href="/travel-planner" className="hover:text-white">
                {t('footer.service.plan')}
              </Link>
            </li>
            <li>
              <Link href="/travel-community" className="hover:text-white">
                {t('footer.service.community')}
              </Link>
            </li>
          </ul>
        </div>

        {/* 聯絡資訊 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-[#D9B37B]">
            {t('footer.contact')}
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{t('footer.contact.address')}</li>
            <li>{t('footer.contact.phone')}</li>
            <li>{t('footer.contact.hours')}</li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
