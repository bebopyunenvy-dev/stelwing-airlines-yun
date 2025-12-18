'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTripContext } from '../../../src/context/TripContext';
import TripCardSortSample from '../components/tripCardShortSample';
import { timezones } from '../src/data/timezone';
import { Trip, TripItem } from '../types';
import { apiFetch } from '../utils/apiFetch';
// import { toOffsetISO } from '../utils/timezone';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import ChangeCoverButton from '../components/ChangeCoverButton';
import CreatePlanItemForm from '../components/createPlanItemForm';
import EditDialog from '../components/editDialog';
import TripItemCardDialog from '../components/tripItemCard';
import { transformTripForUI } from '../utils/tripUtils';
// @ts-expect-error 我不寫就跳錯我只好加啊氣死
import { DateTime } from 'luxon';

// export interface TripDetailPageProps {}
// {  }: TripDetailPageProps

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tripId } = params;
  const { currentTrip, setCurrentTrip } = useTripContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpenItemCard, setIsOpenItemCard] = useState(false);
  const [items, setItems] = useState<TripItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState('local');
  const [isOpenCreateItem, setIsOpenCreateItem] = useState(false);
  const [isOpenChangeCover, setIsOpenChangeCover] = useState(false);
  const initialDate = useMemo(() => computeInitialDate(items), [items]);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedItem, setSelectedItem] = useState<TripItem | null>(null);

  // Data：撈旅程資料，用前一頁傳來的 context，沒有就重撈，每隔五分鐘也再撈一次
  useEffect(() => {
    if (!tripId) return;

    let ignore = false;

    async function fetchTrip(showLoading = false) {
      try {
        if (showLoading) setLoading(true);

        const data = await apiFetch<Trip>(
          `http://localhost:3007/api/plans/${tripId}`,
          {
            method: 'GET',
          }
        );

        if (!ignore) {
          setCurrentTrip(transformTripForUI(data));
        }
      } catch (err: any) {
        if (!ignore) setError(err.message);
      } finally {
        if (showLoading && !ignore) setLoading(false);
      }
    }

    // 首次進頁面才會 loading（且只會 loading 一次）
    if (!currentTrip) {
      fetchTrip(true); // 首次要 loading
    } else {
      fetchTrip(false); // 如果有 cache 就立刻用舊資料，不 loading → 不閃
    }

    // 背景更新永遠不 loading → 不會閃
    const intervalId = setInterval(
      () => {
        fetchTrip(false);
      },
      5 * 60 * 1000
    );

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, [tripId]);

  // API：fetch 行程資料
  const fetchItems = useCallback(async (): Promise<TripItem[]> => {
    if (!tripId) return [];

    try {
      setItemsLoading(true);
      const data = await apiFetch<TripItem[]>(
        `http://localhost:3007/api/plans/${tripId}/items`,
        {
          method: 'GET',
        }
      );
      setItems(data);
      return data; // ← 回傳最新資料
    } catch (err: any) {
      setItemsError(err.message);
      return [];
    } finally {
      setItemsLoading(false);
    }
  }, [tripId]);

  // Data：撈行程資料
  useEffect(() => {
    fetchItems(); // ⬅️ 詳細頁只要撈一次
  }, [fetchItems]);

  // 功能：設定行事曆第一時間顯示日期
  function computeInitialDate(items: TripItem[]): Date {
    // 1. 取出所有 startTime / endTime，過濾掉 null
    const timestamps = items
      .flatMap((i) => [i.startTime, i.endTime])
      .filter((t): t is string => t !== null) // 型別收窄為 string
      .map((t) => {
        const d = new Date(t);
        return Number.isNaN(d.getTime()) ? null : d.getTime();
      })
      .filter((ts): ts is number => ts !== null); // 過濾掉無效時間

    // 2. 沒有任何日期：回傳今天（或你想要的 fallback）
    if (timestamps.length === 0) {
      return new Date(); // fallback
    }

    // 3. 取得最早 & 最晚 timestamp（用 Math.min/Math.max 要傳 number）
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);

    const earliestDate = new Date(minTs);
    const latestDate = new Date(maxTs);
    const today = new Date();

    // 4. 判斷今天是否在範圍內（包含邊界）
    const isTodayInside =
      today.getTime() >= earliestDate.getTime() &&
      today.getTime() <= latestDate.getTime();

    // console.log(earliestDate);
    // console.log(latestDate);
    // console.log(today);
    // console.log(isTodayInside);

    return isTodayInside ? today : earliestDate;
  }

  // 功能：設定行事曆第一時間顯示日期，並且在資料一進來時啟動
  useEffect(() => {
    if (items.length === 0) return;

    const api = calendarRef.current?.getApi();
    if (api) {
      const date = computeInitialDate(items);
      api.gotoDate(date);
    }
  }, [items]);

  // Data：FullCalendar 顯示用資料
  const calendarEvents = items.map((item) => {
    // allDay = true → 取 startTime 轉指定時區後，只保留日期
    const start = item.allDay
      ? DateTime.fromISO(item.startTime, {
          zone: item.startTimezone,
        }).toISODate() // YYYY-MM-DD
      : item.startTime; // allDay = false → 直接用 UTC 時間

    // allDay = true → 取 endTime 轉指定時區後，只保留日期，若 endTime 為 null 可留 undefined
    const end =
      item.allDay && item.endTime
        ? DateTime.fromISO(item.endTime, { zone: item.endTimezone }).toISODate()
        : (item.endTime ?? undefined);

    return {
      id: String(item.id),
      title: item.title,
      start,
      end,
      allDay: item.allDay,
      backgroundColor: item.category?.bgColor || '#eeeeee',
      textColor: item.category?.textColor || '#000000',
      borderColor: item.category?.bgColor || '#eeeeee',
    };
  });

  // console.log(calendarEvents);
  // console.log('Calendar timezone:', selectedTimezone);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-40 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  // loading 結束了但沒資料，才顯示錯誤
  if (!currentTrip) {
    return <p>旅程資料不存在，請回到列表頁</p>;
  }

  // 功能：新增旅程 form 成功新增後關閉彈出視窗
  const handleFormSuccess = async () => {
    // 1. 拿到最新的 items
    const data = await fetchItems(); // fetchItems 回傳最新資料

    // 2. 計算新的 initialDate
    const newInitialDate = computeInitialDate(data);

    // 3. FullCalendar 跳轉到新日期
    const api = calendarRef.current?.getApi();
    if (api) {
      api.gotoDate(newInitialDate);
    }

    // 4. 關閉彈窗
    setIsOpenCreateItem(false);
  };

  // 資料好了才渲染真的卡片
  return (
    <>
      <main className="flex-1 flex px-16 py-8 w-full">
        <section
          className="flex-1 min-h-full border border-solid border-black rounded-2xl
          w-full flex 
          overflow-hidden"
        >
          {/* 左邊功能 */}
          <div className="flex-1 px-6 py-4 bg-(--sw-primary) flex flex-col gap-4">
            {/* 旅程資訊卡片 */}
            <TripCardSortSample trip={currentTrip} />
            {/* 主要按鈕 */}
            <div className="button-group flex gap-2">
              <div className="flex-1">
                <button
                  className="sw-btn h-full w-full sw-btn--gold-square"
                  onClick={() => setIsOpenCreateItem(true)}
                >
                  + 新增每日行程
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <button
                  className="sw-btn text-white"
                  onClick={() => setIsOpenChangeCover(true)}
                >
                  更換封面圖片
                </button>
                <button className="sw-btn text-white">修改旅程資訊</button>
              </div>
            </div>
            {/* 收合頁面 */}
            <div className="flex-1 flex flex-col gap-2">
              {/* 收合卡片 1 */}
              <div>
                {/* 標題 */}
                <div className="text-white flex justify-between border-b border-white py-2">
                  <div>備註</div>
                </div>
                {/* 內容 */}
                <div className=" text-white rounded-lg py-4 mt-2 whitespace-pre-wrap">
                  {currentTrip.note ? currentTrip.note : '尚未輸入備註'}
                </div>
              </div>
            </div>
            {/* 匯出按鈕 */}
            {/* <div>
              <button className="sw-btn text-white w-full">
                匯出旅程及行程 PDF 檔
              </button>
            </div> */}
            <div className=" text-white">
              行程建立完是什麼樣子？{' '}
              <a
                href="/travel-planner/example"
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                參考看看
              </a>
            </div>
          </div>
          {/* 右邊日曆 */}
          <div className="flex-2 px-6 py-4">
            {/* 工具列 */}
            <div className="flex items-center gap-2 mb-3">
              <label htmlFor="timezone">切換所在時區顯示</label>
              <select
                name="timezone"
                id="timezone"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="sw-l-select "
              >
                <option value="local">預設瀏覽器時區 ⭣</option>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.city} {tz.code} - {tz.country}
                  </option>
                ))}
              </select>
            </div>
            {/* 日曆區 */}
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                momentTimezonePlugin,
              ]}
              // plugins={[dayGridPlugin, timeGridPlugin, listPlugin, luxonPlugin]}
              initialView="dayGridMonth"
              initialDate={initialDate}
              selectable={true}
              selectMirror={true}
              unselectAuto={true}
              height="100%"
              expandRows={false}
              stickyHeaderDates={true}
              headerToolbar={{
                start: 'title',
                center: 'prev,next today',
                end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              buttonText={{
                today: '今天',
                month: '月曆',
                week: '週曆',
                day: '日曆',
                list: '列表',
              }}
              // timeZone="America/New_York"
              timeZone={selectedTimezone}
              events={calendarEvents}
              // eventColor="#DCBB87"
              eventClick={(info) => {
                info.jsEvent.preventDefault();

                // 假設 event.id 就是 TripItem 的 id
                const item = items.find((i) => i.id === info.event.id);
                if (item) {
                  setSelectedItem(item);
                  setIsOpenItemCard(true);
                  // console.log(item);
                }
              }}
            />
          </div>
        </section>
      </main>
      {/* 彈出視窗：新增行程 */}
      <EditDialog
        open={isOpenCreateItem}
        onOpenChange={setIsOpenCreateItem}
        title={'新增行程'}
      >
        <CreatePlanItemForm
          tripId={currentTrip.id}
          onSuccess={handleFormSuccess}
        />
      </EditDialog>
      {/* 彈出視窗：更新旅程封面 */}
      <EditDialog
        open={isOpenChangeCover}
        onOpenChange={setIsOpenChangeCover}
        title={'更換圖片'}
      >
        <ChangeCoverButton
          tripId={currentTrip!.id}
          onUpdated={(newCoverUrl) => {
            setCurrentTrip((prev) => ({ ...prev!, coverImage: newCoverUrl }));
            setIsOpenChangeCover(false);
          }}
        />
      </EditDialog>
      {selectedItem && (
        <TripItemCardDialog
          open={isOpenItemCard}
          onOpenChange={setIsOpenItemCard}
          item={selectedItem}
        ></TripItemCardDialog>
      )}
    </>
  );
}
