'use client';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { DFQuantitySelector } from '../../components/DFQuantitySelector';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Button } from '../../components/ui/button';
import { useDFStore } from '../../context/DFStoreContext';

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams(); // 從網址抓 id
  const { products, addToCart, isLoggedIn, setCheckoutItem } = useDFStore(); // ✅ 新增 isLoggedIn / setCheckoutItem
  const product = products.find((p) => p.id === id);
  const handleNavigateDutyFree = () =>
    router.push('/dutyfree-shop#dutyfree-products');

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-gray-600">
        <p>找不到此商品。</p>
        <Button
          onClick={() => router.push('/dutyfree-shop')}
          className="mt-4 bg-[var(--df-accent-gold)] text-white"
        >
          回到商品列表
        </Button>
      </div>
    );
  }

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
            onClick={() => router.push('/dutyfree-shop')}
            className="hover:text-[var(--df-accent-gold)]"
          >
            首頁
          </button>
          {' > '}
          <button
            onClick={handleNavigateDutyFree}
            className="hover:text-[var(--df-accent-gold)]"
          >
            免稅商品
          </button>
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

              {/* Left Arrow */}
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) =>
                      (prev - 1 + productImages.length) % productImages.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[var(--df-accent-gold)] text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--df-accent-gold)]/90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev + 1) % productImages.length
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--df-accent-gold)] text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--df-accent-gold)]/90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-sm">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {productImages.map((img, i) => (
                <div
                  key={i}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    currentImageIndex === i
                      ? 'border-[var(--df-accent-gold)]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentImageIndex(i)}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 mb-4 text-sm md:text-base">
              商品編號：{product.id}
            </p>

            <p className="text-[var(--df-accent-gold)] font-bold text-2xl mb-6">
              TWD {product.price.toLocaleString()}
            </p>

            {/* 數量 */}
            <div className="mb-6">
              <DFQuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            {/* 按鈕 */}
            <div className="space-y-3">
              <Button
                onClick={() => addToCart(product, quantity)}
                variant="outline"
                className="w-full h-12 border-[var(--df-accent-gold)] text-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)] hover:text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                加入購物車
              </Button>

              <Button
                onClick={() => {
                  setCheckoutItem(product); // ✅ 暫存要結帳的商品
                  addToCart(product, quantity); // ✅ 加入購物車
                  if (!isLoggedIn) {
                    router.push('/dutyfree-shop/login'); // ❌ 未登入 → 登入頁
                  } else {
                    router.push('/dutyfree-shop/cart'); // ✅ 已登入 → 購物車頁
                  }
                }}
                className="w-full bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white h-12"
              >
                立即結帳
              </Button>
            </div>

            {/* 商品介紹 */}
            <div className="mt-8 pt-6 border-t">
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
