// app/travel-community/page.tsx
'use client';

import Breadcrumb from '@/app/components/Breadcrumb';
import { apiFetch } from '@/app/travel-community/utils/apiFetch';
import { useEffect, useMemo, useState } from 'react';
import FilterSidebar from './components/FilterSidebar';
import FloatingWriteButton from './components/FloatingWriteButton';
import Masonry from './components/Masonry';
import PageTabs from './components/PageTabs';
import type { Post } from './data/posts';
import {
  defaultFilterState,
  FilterState,
  PostType,
  countryOptions,
} from './data/posts';

const filterByTimeRange = (
  createdAt: string,
  range: FilterState['timeRange']
) => {
  if (range === 'all') return true;
  const target = new Date(createdAt);
  const now = new Date();

  if (range === 'year') {
    return target.getFullYear() === now.getFullYear();
  }

  const diffMs = now.getTime() - target.getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  const diffDays = diffMs / dayInMs;

  if (range === '7d') return diffDays <= 7;
  if (range === '30d') return diffDays <= 30;
  return true;
};

const filterByMileage = (miles: number, tier: FilterState['mileageTier']) => {
  if (tier === 'all') return true;
  return miles >= Number(tier);
};

export default function TravelCommunityPage() {
  const [activeTab, setActiveTab] = useState<PostType>('全部');
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(defaultFilterState);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularTags, setPopularTags] = useState<string[]>([]);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3007/api';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = (await apiFetch(
          'http://localhost:3007/api/travel-community'
        )) as Post[];
        setPosts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message ?? '無法取得旅遊分享');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_BASE]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = (await apiFetch(
          'http://localhost:3007/api/travel-community/tags/top'
        )) as { name: string; count: number }[];
        setPopularTags(
          Array.isArray(data) ? data.map((item) => item.name) : []
        );
      } catch (err) {
        console.error('熱門標籤載入失敗', err);
      }
    };
    fetchTags();
  }, [API_BASE]);

  const handleFilterChange = (update: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setApplyMessage('已套用最新篩選條件');
    setTimeout(() => setApplyMessage(null), 2200);
  };

  const visiblePosts = useMemo(() => {
    const keywordLower = keyword.trim().toLowerCase();
    const selectedCountryLabel =
      countryOptions.find((opt) => opt.value === country)?.label ?? '';

    return posts
      .filter((post) => {
        if (activeTab !== '全部' && post.type !== activeTab) return false;
        if (
          country &&
          post.country !== country &&
          post.country !== selectedCountryLabel
        )
          return false;

        if (keywordLower) {
          const haystack = (
            post.title +
            ' ' +
            post.summary +
            ' ' +
            post.location +
            ' ' +
            post.tags.join(' ')
          ).toLowerCase();

          if (!haystack.includes(keywordLower)) return false;
        }

        if (!filterByTimeRange(post.createdAt, appliedFilters.timeRange))
          return false;

        if (!filterByMileage(post.miles, appliedFilters.mileageTier))
          return false;

        if (
          appliedFilters.selectedTags.length > 0 &&
          !appliedFilters.selectedTags.some((tag) => post.tags.includes(tag))
        )
          return false;

        if (
          appliedFilters.selectedCategories.length > 0 &&
          !appliedFilters.selectedCategories.some((c) =>
            post.categories.includes(c)
          )
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        switch (appliedFilters.sort) {
          case 'popular':
            return b.likes - a.likes;
          case 'miles':
            return b.miles - a.miles;
          case 'shares':
            return b.shares - a.shares;
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
  }, [
    activeTab,
    country,
    keyword,
    appliedFilters,
    JSON.stringify(posts), // ⭐ 保證重新運算
  ]);

  return (
    <main className="relative flex flex-col gap-6 lg:h-screen lg:overflow-hidden">
      <div className="space-y-6 lg:flex-none lg:pr-4">
        <Breadcrumb
          items={[{ label: '首頁', href: '/' }, { label: '旅遊分享' }]}
        />

        <PageTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          keyword={keyword}
          onKeywordChange={setKeyword}
          country={country}
          onCountryChange={setCountry}
          onSearchSubmit={handleApplyFilters}
        />

        {applyMessage && (
          <div className="rounded-full bg-[var(--sw-primary)]/5 text-[var(--sw-primary)] text-sm px-4 py-2 inline-flex items-center">
            {applyMessage}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* 內容區：左側可獨立滾動的篩選 + 右側瀑布流 */}
      <div className="flex flex-col gap-6 lg:flex-1 lg:flex-row lg:items-start lg:overflow-hidden">
        {/* 左側 */}
        <aside className="w-full lg:w-[32%] lg:h-full">
          <div className="lg:h-full lg:rounded-[24px] lg:bg-white/10">
            <div className="lg:h-full lg:overflow-y-auto lg:pr-4">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onApply={handleApplyFilters}
                appliedMessage={applyMessage}
                popularTags={popularTags}
              />
            </div>
          </div>
        </aside>

        {/* 右側 */}
        <section className="w-full lg:w-[68%] space-y-4 min-w-0 lg:h-full lg:overflow-y-auto lg:pr-1">
          <div className="flex items-center justify-between text-sm text-[#1F2E3C]/60">
            <span>
              共 {visiblePosts.length} 則{activeTab === '全部' ? '' : activeTab}
              分享
            </span>
            {keyword && (
              <button
                className="text-[var(--sw-primary)] underline"
                onClick={() => setKeyword('')}
              >
                清除關鍵字
              </button>
            )}
          </div>

          {visiblePosts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[rgba(31,46,60,0.2)] p-10 text-center text-[#1F2E3C]/60">
              目前沒有符合條件的分享，換個條件試試吧！
            </div>
          ) : (
            <Masonry posts={visiblePosts} />
          )}
        </section>
      </div>

      {loading && (
        <div className="text-center text-sm text-gray-400">載入中...</div>
      )}

      <FloatingWriteButton />
    </main>
  );
}
