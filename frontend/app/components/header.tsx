'use client';

import clsx from 'clsx';
import {
  ChevronDown,
  Globe,
  Menu,
  Plane,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../dutyfree-shop/components/ui/button';

// 🔼 新增：多語 Context
import { useLanguage } from '@/src/i18n/LanguageContext';

// 🔼 已有：Auth / Toast
import { useAuth } from '@/app/context/auth-context';
import { useToast } from '@/app/context/toast-context';

// ======================
// 型別
// ======================
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface HeaderProps {
  cartItemCount?: number;
  cartItems?: CartItem[];
  onCheckoutClick?: () => void;
  onRemoveItem?: (id: string) => void;
}

export default function Header({
  cartItemCount = 0,
  cartItems = [],
  onCheckoutClick,
  onRemoveItem,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false); // 手機版選單
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // 🔼 新增：使用登入狀態
  // const { isLoggedIn, avatar, logout, member } = useAuth();
  const { isLoggedIn, logout, member } = useAuth();

  const avatarSrc = member?.avatar?.imagePath
    ? member.avatar.imagePath
    : '/avatars/default.png';

  const { showToast } = useToast();

  const pathname = usePathname();
  const router = useRouter();

  const isDutyfree = pathname.startsWith('/dutyfree-shop');

  // 🔤 多語：取得目前語言 + 翻譯函式
  const { locale, setLocale, t } = useLanguage();

  // 導覽列改用 key，文字由 t() 決定
  const navItems = [
    { key: 'nav.flight', href: '/flight-booking' },
    { key: 'nav.hotel', href: '/hotel-booking' },
    { key: 'nav.dutyfree', href: '/dutyfree-shop' },
    { key: 'nav.itinerary', href: '/travel-planner' },
    { key: 'nav.share', href: '/travel-community' },
    { key: 'nav.faq', href: '/hotel-booking/FAQ' },
  ];

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    showToast({
      title: '已成功登出',
      message: '期待再次與你同行。',
      type: 'success',
    });
    router.push('/member-center/login');
  };

  // 🔁 點一下語言按鈕，在中 / 英 之間切換
  const toggleLocale = () => {
    setLocale(locale === 'zh-TW' ? 'en' : 'zh-TW');
  };

  return (
    <header className="bg-[var(--sw-primary)] text-white sticky top-0 z-50">
      <div className="mx-auto w-full h-16 px-16 flex items-center justify-between gap-[48px]">
        {/* =============== 左側區 Logo + Nav =============== */}
        <div className="flex items-center gap-12">
          <Link href="/">
            <Image
              src="/logo-white.svg"
              alt="Stelwing Logo"
              width={125}
              height={48}
              className="cursor-pointer"
            />
          </Link>

          {/* 桌機導覽列 */}
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'inline-flex items-center h-10 leading-none text-white hover:text-(--sw-accent) transition',
                  pathname.startsWith(item.href) &&
                    'text-(--sw-accent) font-semibold'
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* =============== 右側功能區 =============== */}
        <div className="flex items-center gap-6">
          {/* ⭐ Duty-free 購物車 */}
          {isDutyfree && (
            <div className="relative">
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="relative p-2 hover:text-(--sw-accent) transition"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* 購物車下拉選單 */}
              {cartDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">購物車 ({cartItemCount})</h3>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      購物車是空的
                    </div>
                  ) : (
                    <>
                      <div className="max-h-96 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border-b hover:bg-gray-50 flex gap-3"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                x{item.quantity}
                              </p>
                              <p className="text-sm font-medium text-(--sw-accent)">
                                TWD{' '}
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            <button
                              onClick={() => onRemoveItem?.(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="p-4">
                        <Button
                          onClick={() => {
                            setCartDropdownOpen(false);
                            onCheckoutClick
                              ? onCheckoutClick()
                              : router.push('/dutyfree-shop/cart');
                          }}
                          className="w-full bg-(--sw-accent) hover:bg-(--sw-accent)/90 text-white"
                        >
                          結帳
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 🌐 語言切換下拉 */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="inline-flex items-center h-10 gap-2 text-white hover:text-(--sw-accent) transition"
            >
              <Globe className="w-4 h-4" />
              <span>{locale === 'zh-TW' ? '繁體中文' : 'English'}</span>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 transition-transform',
                  langOpen && 'rotate-180'
                )}
              />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-lg bg-white text-[color:var(--sw-primary)] shadow-lg border border-gray-200 z-50">
                <button
                  onClick={() => {
                    setLocale('zh-TW');
                    setLangOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm hover:bg-gray-100',
                    locale === 'zh-TW' && 'font-semibold'
                  )}
                >
                  繁體中文
                </button>
                <button
                  onClick={() => {
                    setLocale('en');
                    setLangOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm hover:bg-gray-100',
                    locale === 'en' && 'font-semibold'
                  )}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* ⭐⭐ 會員登入 / 頭像選單 */}
          {isLoggedIn ? (
            <>
              <div
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                // onMouseLeave={(e) => {
                //   const nextTarget = e.relatedTarget as Node | null;
                //   if (nextTarget && e.currentTarget.contains(nextTarget)) return;
                //   setProfileOpen(false);
                // }}
                onMouseLeave={(e) => {
                  const nextTarget = e.relatedTarget;

                  try {
                    if (
                      nextTarget &&
                      nextTarget instanceof Node &&
                      e.currentTarget.contains(nextTarget)
                    ) {
                      return;
                    }
                  } catch (_) {
                    // 如果 contains 出錯就忽略，直接關閉
                  }

                  setProfileOpen(false);
                }}
                onFocus={() => setProfileOpen(true)}
                onBlur={(e) => {
                  const nextTarget = e.relatedTarget as Node | null;
                  if (!nextTarget || !e.currentTarget.contains(nextTarget)) {
                    setProfileOpen(false);
                  }
                }}
              >
                <button
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#DCBB87] hover:opacity-90 transition"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="absolute left-0 right-0 top-full h-4" />

                <div
                  className="
                    absolute right-0 mt-2 w-48 
                    bg-white text-[#1F2E3C] rounded-lg shadow-lg border border-gray-200
                    transition-all duration-150
                  "
                  style={{
                    opacity: profileOpen ? 1 : 0,
                    pointerEvents: profileOpen ? 'auto' : 'none',
                    transform: profileOpen
                      ? 'translateY(0)'
                      : 'translateY(-4px)',
                  }}
                >
                  <div className="px-4 py-3 border-b border-[#D1D5DB]">
                    <div className="text-base font-semibold text-[#1F2E3C] truncate">
                      {member?.lastName || member?.firstName
                        ? `${member?.lastName ?? ''}${member?.firstName ?? ''}`.trim() ||
                          member?.username ||
                          '會員'
                        : '會員'}
                    </div>
                  </div>

                  <Link
                    href="/member-center"
                    className="block px-4 py-3 hover:bg-[#DCBB87]/20"
                  >
                    會員中心
                  </Link>

                  <Link
                    href="/member-center/flight"
                    className="block px-4 py-3 hover:bg-[#DCBB87]/20"
                  >
                    訂單總覽
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-[#DCBB87]/20 text-[#C5A872]"
                  >
                    登出
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/member-center/login"
                className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#DCBB87] hover:bg-[#BAA06D] text-[#1F2E3C] font-medium transition"
              >
                <Plane className="w-4 h-4" />
                {t('auth.login')}
              </Link>
            </>
          )}

          {/* 📱 手機版漢堡 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ================= 手機版選單 ================= */}
      {isOpen && (
        <div className="md:hidden py-4 absolute top-full left-0 w-full bg-[#1F2E3C] flex flex-col items-center z-40">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white hover:text-[#DCBB87] py-2"
              onClick={() => setIsOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}

          {!isLoggedIn ? (
            <Button
              onClick={() => router.push('/member-center/login')}
              className="w-[80%] mt-4 bg-[#DCBB87] hover:bg-[#C5A872] text-[#1F2E3C]"
            >
              <Plane className="w-4 h-4 mr-2" /> 登入
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              className="w-[80%] mt-4 bg-[#C5A872] hover:bg-[#C5A872] text-white"
            >
              登出
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
