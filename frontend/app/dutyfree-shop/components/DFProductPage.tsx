'use client';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { DFQuantitySelector } from '../components/DFQuantitySelector';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  subcategory?: string;
}

interface DFProductPageProps {
  product: Product;
  quantity: number;
  currentImageIndex: number;
  orderNumber: string;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onNavigateHome: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onSelectImage: (index: number) => void;
}

export function DFProductPage({
  product,
  quantity,
  currentImageIndex,
  orderNumber,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onNavigateHome,
  onNextImage,
  onPrevImage,
  onSelectImage,
}: DFProductPageProps) {
  // ✅ 多圖支援：若有 product.images，就用它；否則使用 image 或 fallback
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || '/images/dutyfree/mainLeft.jpg'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 md:mb-6">
          <button
            onClick={onNavigateHome}
            className="hover:text-[var(--df-accent-gold)]"
          >
            首頁
          </button>
          {' > '}
          <span>免稅商品</span>
          {' > '}
          <span className="hidden md:inline">{product.name}</span>
          <span className="md:hidden">...</span>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 bg-white rounded-lg p-4 md:p-8">
          {/* Left: Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative group">
              <ImageWithFallback
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Left Arrow Button */}
              {productImages.length > 1 && (
                <button
                  onClick={onPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-[var(--df-accent-gold)] text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--df-accent-gold)]/90"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Right Arrow Button */}
              {productImages.length > 1 && (
                <button
                  onClick={onNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--df-accent-gold)] text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--df-accent-gold)]/90"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail List */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {productImages.map((img, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      currentImageIndex === i
                        ? 'border-[var(--df-accent-gold)]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => onSelectImage(i)}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div>
            <h1
              style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                lineHeight: '1.5',
                fontWeight: '600',
              }}
              className="mb-2"
            >
              {product.name}
            </h1>
            <p className="text-gray-500 mb-4 text-sm md:text-base">
              產品編號： {orderNumber}
            </p>

            <div className="mb-6">
              <div
                className="text-[var(--df-accent-gold)]"
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
                  lineHeight: '1.5',
                  fontWeight: 'bold',
                }}
              >
                TWD {product.price.toLocaleString()}
              </div>
            </div>

            <div className="mb-6">
              <DFQuantitySelector
                value={quantity}
                onChange={onQuantityChange}
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={onAddToCart}
                variant="outline"
                className="w-full h-12 border-[var(--df-accent-gold)] text-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)] hover:text-white"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                加入購物車
              </Button>

              <Button
                onClick={onBuyNow}
                className="w-full bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white h-12"
              >
                立即結帳
              </Button>
            </div>

            {/* Product Description */}
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t">
              <h2 className="font-semibold mb-4">商品介紹</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.description}
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
