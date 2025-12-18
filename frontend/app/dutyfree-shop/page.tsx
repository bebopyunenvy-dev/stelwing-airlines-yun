'use client';

import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DFHomePage } from './components/DFHomePage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { useDFStore } from './context/DFStoreContext';

export default function DutyFreeShopPage() {
  const router = useRouter(); // ✅ 要放在 component 內！
  const { products, addToCart } = useDFStore();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce(
        (value: string) => setDebouncedQuery(value),
        300,
        { leading: false, trailing: true }
      ),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // 篩選邏輯
  const filteredProducts = products.filter((product) => {
    if (debouncedQuery) {
      return (
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    if (selectedCategory && selectedSubcategory) {
      return (
        product.category === selectedCategory &&
        product.subcategory === selectedSubcategory
      );
    }
    return true;
  });

  // ✅ 這裡定義事件處理器
  const handleProductClick = (product: any) => {
    router.push(`/dutyfree-shop/product/${product.id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value === '') {
      debouncedSearch.cancel();
      setDebouncedQuery('');
      return;
    }

    debouncedSearch(value);
  };

  const handleClearFilter = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchQuery('');
    debouncedSearch.cancel();
    setDebouncedQuery('');
  };

  return (
    <>
      <DFHomePage
        filteredProducts={filteredProducts}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        activeSearchQuery={debouncedQuery}
        onCategoryClick={(cat, sub) => {
          setSelectedCategory(cat);
          setSelectedSubcategory(sub);
        }}
        onProductClick={handleProductClick}
        onAddToCart={(product) => {
          addToCart(product, 1);
          setAddedProductName(product.name);
          setAddSuccessOpen(true);
        }}
        onSearchToggle={() => setSearchOpen(!searchOpen)}
        onSearchChange={handleSearchChange}
        onClearFilter={handleClearFilter}
      />

      <AlertDialog open={addSuccessOpen} onOpenChange={setAddSuccessOpen}>
        <AlertDialogContent className="max-w-md bg-white text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-[var(--df-primary-dark)]">
              已加入購物車
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              {addedProductName
                ? `${addedProductName} 已加入購物車。`
                : '商品已加入購物車。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-center">
            <AlertDialogAction
              className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 px-6"
              onClick={() => setAddSuccessOpen(false)}
            >
              繼續購物
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
