'use client';
import { ShoppingCart } from 'lucide-react';
import { MouseEvent } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DFProductCardProps {
  id: string;
  image?: string; // ✅ 改為可選
  images?: string[]; // ✅ 新增多圖支援
  name: string;
  sub: string;
  description: string;
  price: number;
  onClick?: () => void;
  onAddToCart?: () => void;
}

export function DFProductCard({
  id,
  image,
  images,
  name,
  sub,
  description,
  price,
  onClick,
  onAddToCart,
}: DFProductCardProps) {
  // ✅ 優先取多圖第一張，其次取單圖，最後用預設圖
  const displayImage = images?.[0] || image || '/images/dutyfree/mainLeft.jpg';
  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={displayImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 font-medium text-[var(--df-text-dark)] transition-colors group-hover:text-[var(--df-accent-gold)]">
          {name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500">{sub}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className="text-[var(--df-accent-gold)]"
            style={{
              fontSize: '1.75rem',
              lineHeight: '2.25rem',
              fontWeight: 'bold',
            }}
          >
            TWD {price.toLocaleString()}
          </span>
          {onAddToCart && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-full border border-[var(--df-accent-gold)] p-2 text-[var(--df-accent-gold)] transition-colors hover:bg-[var(--df-accent-gold)] hover:text-white"
              aria-label="加入購物車"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
