'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import TripCardSortSample from '../components/tripCardShortSample';
import { timezones } from '../src/data/timezone';
import { TripItem } from '../types';
// import { toOffsetISO } from '../utils/timezone';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import TripItemCardDialog from '../components/tripItemCard';
// @ts-expect-error 我不寫就跳錯我只好加啊氣死
import { DateTime } from 'luxon';
import { transformTripForUI } from '../utils/tripUtils';

// export interface TripDetailPageProps {}
// {  }: TripDetailPageProps

export default function ExamplePage() {
  const params = useParams();
  const router = useRouter();
  const { tripId } = params;
  // const { currentTrip, setCurrentTrip } = useTripContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpenItemCard, setIsOpenItemCard] = useState(false);
  // const [items, setItems] = useState<TripItem[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState('local');
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedItem, setSelectedItem] = useState<TripItem | null>(null);

  const currentTrip = useMemo(() => {
    const raw = {
      id: '31',
      userId: '4',
      title: '1 月關東之旅',
      destination: '東京、輕井澤、鎌倉、富士山',
      startDate: '2026-01-05T16:00:00.000Z',
      startTimezone: 'Asia/Taipei',
      endDate: '2026-01-22T16:00:00.000Z',
      endTimezone: 'Asia/Taipei',
      note: '- 航班 SW331\r\n- 去程在第一航廈\r\n- 回程在 3 航廈',
      coverImage: '/planner/cover/1763609254083.jpg',
      isDeleted: 0,
      createdAt: '2025-11-20T03:27:01.437Z',
      updatedAt: '2025-11-20T03:27:34.096Z',
    };

    return transformTripForUI(raw);
  }, []);

  const items = useMemo(
    () => [
      {
        id: '42',
        planId: '31',
        title: '東京',
        allDay: true,
        startTime: '2026-01-16T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-22T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 6,
        isDeleted: 0,
        createdAt: '2025-11-20T05:10:50.429Z',
        updatedAt: '2025-11-20T05:10:50.429Z',
        category: {
          id: 6,
          name: '購物',
          bgColor: '#E3D5CA',
          textColor: '#000000',
        },
      },
      {
        id: '41',
        planId: '31',
        title: '富士山',
        allDay: true,
        startTime: '2026-01-13T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-17T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 7,
        isDeleted: 0,
        createdAt: '2025-11-20T05:07:12.445Z',
        updatedAt: '2025-11-20T05:07:12.445Z',
        category: {
          id: 7,
          name: '自然',
          bgColor: '#7A8C77',
          textColor: '#ffffff',
        },
      },
      {
        id: '40',
        planId: '31',
        title: '新宿',
        allDay: true,
        startTime: '2026-01-12T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-14T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 6,
        isDeleted: 0,
        createdAt: '2025-11-20T05:05:45.340Z',
        updatedAt: '2025-11-20T05:05:45.340Z',
        category: {
          id: 6,
          name: '購物',
          bgColor: '#E3D5CA',
          textColor: '#000000',
        },
      },
      {
        id: '44',
        planId: '31',
        title: '住宿：Via Inn',
        allDay: true,
        startTime: '2026-01-12T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-13T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 3,
        isDeleted: 0,
        createdAt: '2025-11-20T05:13:33.872Z',
        updatedAt: '2025-11-20T05:13:33.872Z',
        category: {
          id: 3,
          name: '住宿',
          bgColor: '#CFC9C2',
          textColor: '#000000',
        },
      },
      {
        id: '39',
        planId: '31',
        title: '鎌倉',
        allDay: true,
        startTime: '2026-01-10T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-13T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 5,
        isDeleted: 0,
        createdAt: '2025-11-20T05:04:34.476Z',
        updatedAt: '2025-11-20T05:04:34.476Z',
        category: {
          id: 5,
          name: '活動',
          bgColor: '#C97C5D',
          textColor: '#ffffff',
        },
      },
      {
        id: '43',
        planId: '31',
        title: '住宿：鎌倉 Plat',
        allDay: true,
        startTime: '2026-01-10T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-12T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 3,
        isDeleted: 0,
        createdAt: '2025-11-20T05:12:19.238Z',
        updatedAt: '2025-11-20T05:12:19.238Z',
        category: {
          id: 3,
          name: '住宿',
          bgColor: '#CFC9C2',
          textColor: '#000000',
        },
      },
      {
        id: '38',
        planId: '31',
        title: '川越',
        allDay: true,
        startTime: '2026-01-09T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-11T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 8,
        isDeleted: 0,
        createdAt: '2025-11-20T05:03:16.548Z',
        updatedAt: '2025-11-20T05:03:16.548Z',
        category: {
          id: 8,
          name: '文化',
          bgColor: '#8B6F5A',
          textColor: '#ffffff',
        },
      },
      {
        id: '52',
        planId: '31',
        title: 'Sajiro Cafe 尼泊爾餐廳',
        allDay: false,
        startTime: '2026-01-08T02:50:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-08T05:15:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 2,
        isDeleted: 0,
        createdAt: '2025-11-20T05:33:44.403Z',
        updatedAt: '2025-11-20T05:33:44.403Z',
        category: {
          id: 2,
          name: '餐廳',
          bgColor: '#D7B894',
          textColor: '#000000',
        },
      },
      {
        id: '51',
        planId: '31',
        title: '雲場池',
        allDay: false,
        startTime: '2026-01-08T01:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-08T02:05:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 7,
        isDeleted: 0,
        createdAt: '2025-11-20T05:32:10.711Z',
        updatedAt: '2025-11-20T05:32:10.711Z',
        category: {
          id: 7,
          name: '自然',
          bgColor: '#7A8C77',
          textColor: '#ffffff',
        },
      },
      {
        id: '37',
        planId: '31',
        title: '住宿：輕井澤 APA',
        allDay: true,
        startTime: '2026-01-07T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-09T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 3,
        isDeleted: 0,
        createdAt: '2025-11-20T05:02:01.131Z',
        updatedAt: '2025-11-20T05:02:01.131Z',
        category: {
          id: 3,
          name: '住宿',
          bgColor: '#CFC9C2',
          textColor: '#000000',
        },
      },
      {
        id: '50',
        planId: '31',
        title: '佐久屋本店',
        allDay: false,
        startTime: '2026-01-07T08:25:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-07T09:40:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 2,
        isDeleted: 0,
        createdAt: '2025-11-20T05:30:09.744Z',
        updatedAt: '2025-11-20T05:30:09.744Z',
        category: {
          id: 2,
          name: '餐廳',
          bgColor: '#D7B894',
          textColor: '#000000',
        },
      },
      {
        id: '49',
        planId: '31',
        title: '王子 Outlet',
        allDay: false,
        startTime: '2026-01-07T04:20:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-07T07:35:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 6,
        isDeleted: 0,
        createdAt: '2025-11-20T05:28:01.067Z',
        updatedAt: '2025-11-20T05:28:01.067Z',
        category: {
          id: 6,
          name: '購物',
          bgColor: '#E3D5CA',
          textColor: '#000000',
        },
      },
      {
        id: '46',
        planId: '31',
        title: '東京 > 輕井澤 HAKUTAKA 557',
        allDay: false,
        startTime: '2026-01-07T00:32:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-07T01:32:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 4,
        isDeleted: 0,
        createdAt: '2025-11-20T05:20:30.085Z',
        updatedAt: '2025-11-20T05:20:30.085Z',
        category: {
          id: 4,
          name: '交通',
          bgColor: '#A2A98F',
          textColor: '#000000',
        },
      },
      {
        id: '36',
        planId: '31',
        title: '輕井澤',
        allDay: true,
        startTime: '2026-01-06T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-10T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 7,
        isDeleted: 0,
        createdAt: '2025-11-20T05:00:59.806Z',
        updatedAt: '2025-11-20T05:00:59.806Z',
        category: {
          id: 7,
          name: '自然',
          bgColor: '#7A8C77',
          textColor: '#ffffff',
        },
      },
      {
        id: '34',
        planId: '31',
        title: '住宿：輕井澤音羽之森',
        allDay: true,
        startTime: '2026-01-06T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-07T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 3,
        isDeleted: 0,
        createdAt: '2025-11-20T04:58:21.281Z',
        updatedAt: '2025-11-20T04:58:21.281Z',
        category: {
          id: 3,
          name: '住宿',
          bgColor: '#CFC9C2',
          textColor: '#000000',
        },
      },
      {
        id: '48',
        planId: '31',
        title: '午餐：炸豬排吉',
        allDay: false,
        startTime: '2026-01-06T02:15:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-06T05:20:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 2,
        isDeleted: 0,
        createdAt: '2025-11-20T05:25:12.422Z',
        updatedAt: '2025-11-20T05:25:12.422Z',
        category: {
          id: 2,
          name: '餐廳',
          bgColor: '#D7B894',
          textColor: '#000000',
        },
      },
      {
        id: '47',
        planId: '31',
        title: '皇居外苑',
        allDay: false,
        startTime: '2026-01-05T23:30:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-06T02:15:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 5,
        isDeleted: 0,
        createdAt: '2025-11-20T05:23:15.153Z',
        updatedAt: '2025-11-20T05:23:15.153Z',
        category: {
          id: 5,
          name: '活動',
          bgColor: '#C97C5D',
          textColor: '#ffffff',
        },
      },
      {
        id: '45',
        planId: '31',
        title: '空港 > 東京',
        allDay: false,
        startTime: '2026-01-05T21:30:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: null,
        endTimezone: '',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 4,
        isDeleted: 0,
        createdAt: '2025-11-20T05:15:50.445Z',
        updatedAt: '2025-11-20T05:15:50.445Z',
        category: {
          id: 4,
          name: '交通',
          bgColor: '#A2A98F',
          textColor: '#000000',
        },
      },
      {
        id: '32',
        planId: '31',
        title: '飛機',
        allDay: false,
        startTime: '2026-01-05T16:10:00.000Z',
        startTimezone: 'Asia/Taipei',
        endTime: '2026-01-05T19:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 1,
        isDeleted: 0,
        createdAt: '2025-11-20T04:45:55.031Z',
        updatedAt: '2025-11-20T04:45:55.031Z',
        category: {
          id: 1,
          name: '航班',
          bgColor: '#1f2e3c',
          textColor: '#ffffff',
        },
      },
      {
        id: '33',
        planId: '31',
        title: '住宿：銀座 APA',
        allDay: true,
        startTime: '2026-01-05T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-06T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 3,
        isDeleted: 0,
        createdAt: '2025-11-20T04:49:23.664Z',
        updatedAt: '2025-11-20T04:49:23.664Z',
        category: {
          id: 3,
          name: '住宿',
          bgColor: '#CFC9C2',
          textColor: '#000000',
        },
      },
      {
        id: '35',
        planId: '31',
        title: '東京',
        allDay: true,
        startTime: '2026-01-05T15:00:00.000Z',
        startTimezone: 'Asia/Tokyo',
        endTime: '2026-01-06T15:00:00.000Z',
        endTimezone: 'Asia/Tokyo',
        note: '',
        locationTextchar: '',
        locationUrl: '',
        typeId: 6,
        isDeleted: 0,
        createdAt: '2025-11-20T04:59:49.613Z',
        updatedAt: '2025-11-20T04:59:49.613Z',
        category: {
          id: 6,
          name: '購物',
          bgColor: '#E3D5CA',
          textColor: '#000000',
        },
      },
      {
        id: '27',
        planId: '31',
        title: '報到',
        allDay: false,
        startTime: '2026-01-05T14:00:00.000Z',
        startTimezone: 'Asia/Taipei',
        endTime: null,
        endTimezone: '',
        note: '第一航廈',
        locationTextchar: '',
        locationUrl: '',
        typeId: 10,
        isDeleted: 0,
        createdAt: '2025-11-20T03:29:42.203Z',
        updatedAt: '2025-11-20T03:29:42.203Z',
        category: {
          id: 10,
          name: '其他',
          bgColor: '#B8B2A6',
          textColor: '#000000',
        },
      },
    ],
    []
  );

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
                <button className="sw-btn h-full w-full sw-btn--gold-square">
                  + 新增每日行程
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <button className="sw-btn text-white">更換封面圖片</button>
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
              initialDate="2026-01-05"
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
