'use client';

import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { DFCategorySection } from './DFCategorySection';
import { DFProductCard } from './DFProductCard';

// ============================
// 1️⃣ Hero 區域組件
// ============================

function Word() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-end justify-center min-h-px min-w-px pb-0 pt-[20px] px-0 relative self-stretch shrink-0 z-[2] mr-[-30px]"
      data-name="word"
    >
      <div
        className="flex h-[calc(1px*((var(--transform-inner-width)*0.19129090011119843)+(var(--transform-inner-height)*0.9815333485603333)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*0.19129090011119843)+(var(--transform-inner-width)*0.9815333485603333)))]"
        style={
          {
            '--transform-inner-width': '94.515625',
            '--transform-inner-height': '33.5',
          } as React.CSSProperties
        }
      >
        <div className="flex-none rotate-[348.972deg]">
          <p className="font-homemade leading-[normal] not-italic relative text-[24px] text-black text-nowrap text-right whitespace-pre">
            Stelwing
          </p>
        </div>
      </div>
      <p className="font-teko leading-[normal] not-italic relative shrink-0 text-[36px] text-black text-nowrap text-right whitespace-pre">
        Duty Free
      </p>
    </div>
  );
}

function WhitePic() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start mr-[-30px] pb-0 pt-[80px] px-0 relative shrink-0 w-[900px] z-[1]"
      data-name="whitePic"
    >
      <div className="h-[119px] relative shrink-0 w-full">
        <Image
          src="/images/dutyfree/mainWhite.jpg"
          alt="Login visual"
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
      </div>
    </div>
  );
}

function Top() {
  return (
    <div
      className="box-border content-stretch flex isolate items-start pl-0 pr-5 py-0 relative shrink-0 w-full pt-10"
      data-name="top"
    >
      <Word />
      <WhitePic />
    </div>
  );
}

function Pic() {
  return (
    <div
      className="content-stretch flex items-start relative shrink-0 w-full"
      data-name="pic"
    >
      <div
        className="basis-0 grow h-[450px] min-h-px min-w-px relative shrink-0"
        data-name="left"
      >
        <Image
          src="/images/dutyfree/mainLeft.jpg"
          alt="Duty free hero left"
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div
        className="basis-0 grow h-[450px] min-h-px min-w-px relative shrink-0"
        data-name="right"
      >
        <Image
          src="/images/dutyfree/mainRight.jpg"
          alt="Duty free hero right"
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}

// ============================
// 2️⃣ 主要商品區
// ============================

interface Product {
  id: string;
  name: string;
  sub: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  subcategory?: string;
}

interface DFHomePageProps {
  filteredProducts: Product[];
  selectedCategory: string;
  selectedSubcategory: string;
  searchOpen: boolean;
  searchQuery: string;
  activeSearchQuery: string;
  onCategoryClick: (category: string, subcategory: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSearchToggle: () => void;
  onSearchChange: (query: string) => void;
  onClearFilter: () => void;
}

export function DFHomePage({
  filteredProducts,
  selectedCategory,
  selectedSubcategory,
  searchOpen,
  searchQuery,
  activeSearchQuery,
  onCategoryClick,
  onProductClick,
  onAddToCart,
  onSearchToggle,
  onSearchChange,
  onClearFilter,
}: DFHomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 區（上方圖片 + 品牌文字） */}
      <div className="relative bg-white">
        <Top />
        <Pic />
      </div>

      {/* 分類與搜尋列 */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-8">
          {/* 分類 + 搜尋按鈕 */}
          <div className="flex flex-col md:flex-row gap-0.5">
            <div className="flex-1">
              <DFCategorySection onCategoryClick={onCategoryClick} />
            </div>

            <button
              onClick={onSearchToggle}
              className="p-4 bg-[var(--df-accent-gold)] text-white hover:bg-white hover:text-[var(--df-accent-gold)] transition-all w-full md:w-auto"
            >
              <Search className="w-5 h-5 mx-auto md:mx-0" />
            </button>
          </div>

          {/* 搜尋輸入框 */}
          {searchOpen && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2 bg-white border border-[var(--df-accent-gold)] px-4 py-3 w-full md:min-w-[400px] md:w-auto">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜尋商品..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="flex-1 border-none outline-none bg-transparent"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onSearchToggle();
                    onSearchChange('');
                  }}
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* 篩選條件顯示 */}
          {(selectedCategory || activeSearchQuery) && (
            <div className="mt-4 text-center text-sm md:text-base">
              <span className="text-gray-600">
                {activeSearchQuery
                  ? `搜尋: "${activeSearchQuery}"`
                  : `${selectedCategory} > ${selectedSubcategory}`}
              </span>
              <button
                onClick={onClearFilter}
                className="ml-2 text-[var(--df-accent-gold)] hover:underline"
              >
                清除篩選
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 商品卡區 */}
      <div
        id="dutyfree-products"
        className="mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <DFProductCard
              key={product.id}
              {...product}
              onClick={() => onProductClick(product)}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            沒有找到符合的商品
          </div>
        )}
      </div>
    </div>
  );
}
