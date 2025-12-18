import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface DFHeaderProps {
  cartItemCount?: number;
  cartItems?: CartItem[];
  onCartClick?: () => void;
  onCheckoutClick?: () => void;
  onMemberClick?: () => void;
  onRemoveItem?: (id: string) => void;
}

export function DFHeader({
  cartItemCount = 0,
  cartItems = [],
  onCartClick,
  onCheckoutClick,
  onMemberClick,
  onRemoveItem,
}: DFHeaderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const categories = [
    {
      name: '訂購概要',
      subcategories: ['如何訂購', '付款方式', '配送說明'],
    },
    {
      name: '行程規劃',
      subcategories: ['航班資訊', '機場指南', '旅遊建議'],
    },
    {
      name: '住宿預訂',
    },
    {
      name: '免稅商品',
      subcategories: ['香水彩妝', '保養品', '精品配件', '酒類煙草'],
    },
    {
      name: '旅遊分享',
      subcategories: ['旅遊心得', '景點推薦', '美食指南'],
    },
  ];

  return (
    <header className="bg-[var(--df-primary-dark)] text-[var(--df-text-light)] sticky top-0 z-50">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="var(--df-accent-gold)"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="var(--df-accent-gold)"
                    strokeWidth="2"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="var(--df-accent-gold)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-wide">
                STELWING
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center gap-1 py-6 transition-colors hover:text-[var(--df-accent-gold)]">
                    {category.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${activeCategory === category.name ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Flyout Menu */}
                  {activeCategory === category.name && (
                    <div className="absolute top-full left-0 min-w-[200px] bg-[var(--df-surface-alt)] text-[var(--df-text-dark)] shadow-lg py-2 rounded-md">
                      {category.subcategories?.map((sub) => (
                        <a
                          key={sub}
                          href="#"
                          className="block px-4 py-2 hover:bg-[var(--df-accent-gold)] hover:text-white transition-colors"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search - Hidden on header, will show in category section */}

            {/* Cart with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="relative p-2 hover:text-[var(--df-accent-gold)] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--df-state-error)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {cartDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-[var(--df-text-dark)] rounded-lg shadow-xl border border-gray-200 z-50">
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
                              <p className="text-sm font-medium text-[var(--df-accent-gold)]">
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
                      <div className="p-4 space-y-2">
                        <Button
                          onClick={() => {
                            setCartDropdownOpen(false);
                            onCheckoutClick?.();
                          }}
                          className="w-full bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white"
                        >
                          結帳
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Member Center */}
            <Button
              onClick={onMemberClick}
              className="hidden lg:flex items-center gap-2 bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white rounded-full px-4 py-2"
            >
              <User className="w-4 h-4" />
              會員中心
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
              <Search className="w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋商品..."
                className="bg-transparent border-none outline-none flex-1 placeholder:text-white/60"
              />
            </div>
            {categories.map((category) => (
              <div key={category.name} className="py-2">
                <div className="font-medium mb-2">{category.name}</div>
                {category.subcategories?.map((sub) => (
                  <Link
                    key={sub}
                    href="#"
                    className="block px-4 py-2 hover:bg-[var(--df-accent-gold)] hover:text-white transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            ))}
            <Button
              onClick={onMemberClick}
              className="w-full mt-4 bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white"
            >
              <User className="w-4 h-4 mr-2" />
              會員中心
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
