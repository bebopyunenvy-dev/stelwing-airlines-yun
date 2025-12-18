'use client';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Category {
  name: string;
  subcategories: string[];
}

interface DFCategorySectionProps {
  onCategoryClick: (category: string, subcategory: string) => void;
}

export function DFCategorySection({ onCategoryClick }: DFCategorySectionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const categories: Category[] = [
    {
      name: '美妝保養',
      subcategories: ['彩妝', '臉部', '身體', '男仕'],
    },
    {
      name: '香氛花園',
      subcategories: ['女仕', '男仕', '禮盒套組'],
    },
    {
      name: '時尚精品',
      subcategories: ['飾品', '配件', '鞋包', '服飾'],
    },
    {
      name: '品味生活',
      subcategories: ['伴手禮', '典藏茗酒', '居家樂活'],
    },
  ];

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="grid grid-cols-2 md:flex gap-0.5 w-full">
      {categories.map((category) => (
        <div key={category.name} className="relative md:flex-1">
          <button
            onClick={() => toggleCategory(category.name)}
            className={`w-full px-4 md:px-6 py-4 border transition-all flex items-center justify-center relative ${
              openCategory === category.name
                ? 'bg-white border-[var(--df-accent-gold)] text-[var(--df-accent-gold)]'
                : 'bg-[var(--df-accent-gold)] border-[var(--df-accent-gold)] text-white hover:bg-white hover:text-[var(--df-accent-gold)]'
            }`}
          >
            <span className="font-medium text-sm md:text-[18px]">
              {category.name}
            </span>
            {openCategory === category.name ? (
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 transition-transform absolute right-3 md:right-6" />
            ) : (
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform absolute right-3 md:right-6" />
            )}
          </button>

          {/* Subcategories Dropdown */}
          {openCategory === category.name && (
            <div className="absolute top-full left-0 mt-2 min-w-full bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    onCategoryClick(category.name, sub);
                    setOpenCategory(null);
                  }}
                  className="w-full px-4 md:px-6 py-3 text-left text-[var(--df-text-dark)] hover:bg-[var(--df-accent-gold)] hover:text-white transition-colors text-sm md:text-base"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
