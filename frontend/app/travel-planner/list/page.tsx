'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import CreatePlanForm from '../components/createPlanForm';
import EditDialog from '../components/editDialog';
import TripCard from '../components/tripCard';
import type { Trip, TripForUI } from '../types';
import { apiFetch } from '../utils/apiFetch';
import { transformTripsForUI } from '../utils/tripUtils';

// export interface ListPageProps {}

export default function ListPage() {
  // const mockTrips = [
  //   {
  //     id: '1',
  //     userId: '1',
  //     title: '12 月東京旅：一般',
  //     destination: '日本：東京、輕井澤、富士山、鐮倉',
  //     startDate: '2025-12-11T16:00:00.000Z',
  //     startTimezone: 'Asia/Taipei',
  //     endDate: '2025-12-27T00:00:00.000Z',
  //     endTimezone: 'Asia/Taipei',
  //     note: '',
  //     coverImage: '',
  //     isDeleted: 0,
  //     createdAt: '2025-10-30T07:35:38.608Z',
  //     updatedAt: '2025-10-30T07:35:38.608Z',
  //   },
  //   {
  //     id: '2',
  //     userId: '1',
  //     title: '12 月東京旅：雨備',
  //     destination: '日本：東京、輕井澤、富士山、鐮倉',
  //     startDate: '2025-12-12T00:00:00.000Z',
  //     startTimezone: 'Asia/Taipei',
  //     endDate: '2025-12-27T00:00:00.000Z',
  //     endTimezone: 'Asia/Taipei',
  //     note: '雨天就去迪士尼',
  //     coverImage: '',
  //     isDeleted: 0,
  //     createdAt: '2025-10-30T07:35:38.608Z',
  //     updatedAt: '2025-10-30T07:35:38.608Z',
  //   },
  //   {
  //     id: '3',
  //     userId: '1',
  //     title: '加拿大躲熊熊',
  //     destination: '溫哥華',
  //     startDate: '2025-11-01T07:00:00.000Z',
  //     startTimezone: 'America/Vancouver',
  //     endDate: '2025-11-05T00:00:00.000Z',
  //     endTimezone: 'America/Vancouver',
  //     note: '此時此刻應該尚未開始',
  //     coverImage: '',
  //     isDeleted: 0,
  //     createdAt: '2025-10-30T07:35:38.608Z',
  //     updatedAt: '2025-10-30T07:35:38.608Z',
  //   },
  //   {
  //     id: '4',
  //     userId: '1',
  //     title: '10 月泰國清邁',
  //     destination: '清邁',
  //     startDate: '2025-10-03T00:00:00.000Z',
  //     startTimezone: 'Asia/Taipei',
  //     endDate: '2025-10-05T00:00:00.000Z',
  //     endTimezone: 'Asia/Taipei',
  //     note: '大阿啊啊啊啊象',
  //     coverImage: '',
  //     isDeleted: 0,
  //     createdAt: '2025-10-30T07:35:38.608Z',
  //     updatedAt: '2025-10-30T07:35:38.608Z',
  //   },
  //   {
  //     id: '5',
  //     userId: '1',
  //     title: '只有我想去尼泊爾',
  //     destination: 'Kathmandu、Pokhara、Chitwan',
  //     startDate: '2025-09-11T00:00:00.000Z',
  //     startTimezone: 'Asia/Taipei',
  //     endDate: '2025-09-21T00:00:00.000Z',
  //     endTimezone: 'Asia/Kathmandu',
  //     note: '尼泊爾的湖',
  //     coverImage: '',
  //     isDeleted: 0,
  //     createdAt: '2025-10-30T07:35:38.608Z',
  //     updatedAt: '2025-10-30T07:35:38.608Z',
  //   },
  // ];

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const tabs = ['全部', '待啟程', '進行中', '已結束'];
  const [activeTab, setActiveTab] = useState('全部');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState(null);
  const [isOpenCreatePlan, setIsOpenCreatePlan] = useState(false); //彈出視窗 UI 套件版
  const router = useRouter();

  // API：fetch 取得列表資料
  const fetchTrips = async () => {
    try {
      // 呼叫共用 apiFetch
      const data = await apiFetch<Trip[]>('http://localhost:3007/api/plans', {
        // const data = await apiFetch<Trip[]>(`${API_BASE}/plans`, {
        method: 'GET',
      });

      // apiFetch 成功回傳的就是後端 data 部分
      setTrips(data);
    } catch (err: any) {
      // apiFetch 拋出的錯誤會進 catch
      router.replace('/travel-planner/not-logged');
      // setError(err.message || '無法取得旅程資料');
    }
  };

  // data：首次 render 畫面 fetch 取資料
  useEffect(() => {
    fetchTrips();
  }, [API_BASE]);

  // data：根據後端 API 傳來的 Data，調整後的前端用 Data
  const tripsForUI: TripForUI[] = transformTripsForUI(trips);

  // data：Tab 分頁切換篩選出要列出的項目
  const filteredTrips =
    // 當 activeTab 為全部時，呈現所有 trips 資料，否則就使用 filter 語法，將 trips 資料留下 status 和 activeTab 相同的
    activeTab === '全部'
      ? tripsForUI
      : tripsForUI.filter((t) => t.status === activeTab);

  // 功能：新增旅程 form 成功新增後關閉彈出視窗
  const handleFormSuccess = (newTripId: string) => {
    // fetchTrips();
    setIsOpenCreatePlan(false);
    router.push(`/travel-planner/${newTripId}`);
  };

  // 功能：刪除旅程成功後更新列表
  const handleTripDeleted = (deletedId: string) => {
    // 此函式接受一個參數 deletedId，代表我在刪旅程時會提供一個 id
    // 然後要將旅程列表資料更新，用到 setTrip
    // setTrip 的新值是什麼，是當下 prev 值篩選過後的結果
    // 篩選的條件是，列表裡的 trip.id 要不為 deletedId 才留下來
    setTrips((prev) => prev.filter((trip) => trip.id !== deletedId));
  };

  // return 畫面
  return (
    <>
      <div className="flex-1 flex flex-col items-center px-16 py-8 gap-6 w-full">
        <h5 className="sw-h5">旅程規劃</h5>
        <section
          className="flex-1 border border-solid border-black rounded-2xl
          w-full flex flex-col
          overflow-hidden"
        >
          {/* 搜尋及排序 */}
          <div className="px-10 py-4 flex justify-center">
            {/* 搜尋框 */}
            <div className="flex gap-2 items-center">
              <label htmlFor="search">搜尋標題或目的地</label>
              <div className="border border-(--sw-primary) flex items-center rounded-lg overflow-hidden">
                <input
                  id="search"
                  type="text"
                  className="h-full p-2 focus:outline-none focus:ring-0"
                />
                <button className="p-2 text-white bg-(--sw-primary)">
                  <Search />
                </button>
              </div>
            </div>
          </div>
          {/* 主內容 */}
          <div className="flex-1 flex p-10 bg-(--sw-primary)">
            <div className="flex-1 flex flex-col">
              {/* 新增行程按鈕 */}
              <div className="mb-6 flex gap-4">
                <button
                  className="sw-btn sw-btn--gold-square"
                  onClick={() => setIsOpenCreatePlan(true)}
                >
                  <h6>建立新旅程</h6>
                </button>
                {/* <button
                  className="text-white cursor-pointer border border-white px-5"
                  onClick={() => router.push('/travel-planner/example')}
                >
                  <h6>參考看看範例</h6>
                </button> */}
              </div>
              {/* 行程列表 */}
              <div className="flex-1 flex flex-col">
                {/* 分頁切換 */}
                <div className="text-(--sw-white) flex gap-2 items-center px-4 relative top-px">
                  <div className="sw-p1 mr-1">篩選旅程狀態</div>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`sw-p1 ${
                        // 當 activeTab 是現在要生成的這個 tab，就顯示 active 的 class，否則是一般的 class
                        activeTab === tab ? 'tab-border-active' : 'tab-border'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {/* 很多卡片 */}
                <div className="flex-1 p-4 flex flex-col gap-6 border border-solid border-(--sw-grey)">
                  {/* 單一卡片 */}
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((t) => (
                      // 關鍵：一定要給 key（即使不傳資料也要 key）
                      <TripCard
                        key={t.id}
                        trip={t}
                        onDeleteSuccess={handleTripDeleted}
                      />
                    ))
                  ) : (
                    <div className="text-(--sw-white)">尚無旅程規劃</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 彈出視窗：新增旅程 */}
        <EditDialog
          open={isOpenCreatePlan}
          onOpenChange={setIsOpenCreatePlan}
          title={'新增旅程'}
        >
          <CreatePlanForm onSuccess={handleFormSuccess} />
        </EditDialog>
      </div>
    </>
  );
}
