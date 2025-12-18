'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Map, MapPin, MoveRight, Pencil, Trash2, X } from 'lucide-react';
// @ts-expect-error 我不寫就跳錯我只好加啊氣死
import { DateTime } from 'luxon';
import { TripItem } from '../types';

export interface ViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // title: string;
  item: TripItem;
  // onConfirm: () => void;
}
// {  }: ComponentsTripItemCardProps

export default function ViewDialog({
  open,
  onOpenChange,
  // title,
  item,
}: ViewDialogProps) {
  // 計算日期及時間顯示
  const startDT = DateTime.fromISO(item.startTime, {
    zone: item.startTimezone,
  });
  const endDT = item.endTime
    ? DateTime.fromISO(item.endTime, {
        zone: item.endTimezone || item.startTimezone,
      })
    : null;

  const startStrDate = startDT.toFormat('M月 d日');
  const startStrTime = startDT.toFormat('a hh：mm');
  const endStrDate = endDT ? endDT.toFormat('M月 d日') : '';
  const endStrTime = endDT ? endDT.toFormat('a hh：mm') : '';

  // 計算時間長
  const start = DateTime.fromISO(item.startTime); // UTC
  const end = item.endTime ? DateTime.fromISO(item.endTime) : null;

  let durationStr = '';

  if (end) {
    const duration = end.diff(start, ['days', 'hours', 'minutes']);

    const d = duration.days;
    const h = duration.hours;
    const m = duration.minutes;

    if (d === 0 && h === 0 && m === 0) {
      durationStr = '';
    } else {
      const parts = [];
      if (d > 0) parts.push(`${d} 天`);
      if (h > 0) parts.push(`${h} 小時`);
      if (m > 0) parts.push(`${m} 分鐘`);
      durationStr = parts.join(' ');
    }
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-500" />
          <Dialog.Content
            className="fixed w-[90vw] max-w-[600px] max-h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pl-10 pr-7 py-6 rounded-lg shadow-lg flex flex-col z-550"
            style={{
              background: `linear-gradient(
                90deg,
                ${item.category?.bgColor || '#eeeeee'} 0%,
                ${item.category?.bgColor || '#eeeeee'} 4%,
                white 4%,
                white 100%
              )`,
            }}
          >
            {/* 分類及按鈕 */}
            <div className="flex justify-between items-center mb-2">
              {/* 左上角類別 */}
              <div
                className="px-3 py-1 rounded-lg"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: item.category?.bgColor || '#eeeeee', // 如果沒有分類就用灰色
                }}
              >
                {item.category?.name || '未指定類別'}
              </div>
              {/* 右上角的操作按鈕 */}
              <div className="flex gap-2">
                {/* 編輯 */}
                <button
                  type="button"
                  aria-label="開啟編輯行程視窗"
                  className=" text-gray-600 hover:text-black"
                  // onClick={() => setIsOpenCloseComfirm(true)}
                >
                  <Pencil />
                </button>
                {/* 刪除 */}
                <button
                  type="button"
                  aria-label="刪除行程"
                  className=" text-gray-600 hover:text-black"
                  // onClick={() => setIsOpenCloseComfirm(true)}
                >
                  <Trash2 />
                </button>
                {/* 關閉 */}
                <button
                  type="button"
                  aria-label="關閉行程彈出視窗"
                  className=" text-gray-600 hover:text-black"
                  onClick={() => onOpenChange(false)}
                >
                  <X />
                  {/* <Trash2 /> */}
                </button>
              </div>
            </div>
            {/* 行程標題 */}
            <Dialog.Title className="sw-h5 mb-3">{item.title}</Dialog.Title>
            {/* 時間 */}
            <div className="border-b border-black pb-4 mb-4 flex items-center">
              {/* 開始時間 */}
              <div className="flex flex-col">
                <div>{startStrDate}</div>
                {!item.allDay ? (
                  <div className="text-[18px] font-bold">{startStrTime}</div>
                ) : (
                  <div className="text-[18px] font-bold">整日</div>
                )}
                {/* 全日事件不顯示時間 */}
                <div className="text-[#8b929a] text-xs">
                  {item.startTimezone}
                </div>
              </div>

              {/* 結束時間 */}
              {item.endTime && (
                <>
                  <div className="mx-8 flex flex-col items-center">
                    <MoveRight />
                    {/* 時長 */}
                    <div>{durationStr}</div>
                  </div>
                  <div className="flex flex-col text-right">
                    <div>{endStrDate}</div>
                    {!item.allDay ? (
                      <div className="text-[18px] font-bold">{endStrTime}</div>
                    ) : (
                      <div className="text-[18px] font-bold">整日</div>
                    )}
                    {/* 全日事件不顯示時間 */}
                    <div className="text-[#8b929a] text-xs">
                      {item.endTimezone}
                    </div>
                  </div>
                </>
              )}
            </div>

            <section className="flex-1 overflow-y-auto pr-3">
              {/* 頂層操作 */}
              {/* 內容 */}
              <div className="flex-1">
                <div>
                  {/* 備註 */}
                  <div className="py-4 border-b border-black">
                    {item.note ? (
                      <div className="whitespace-pre-wrap">{item.note}</div>
                    ) : (
                      <span className="text-(--sw-grey)">
                        尚未輸入備註或筆記
                      </span>
                    )}
                  </div>
                  {/* 地址 */}
                  <div className="py-4 flex flex-col gap-2 border-b border-black">
                    <div className="flex gap-4">
                      <MapPin />
                      {item.locationTextchar ? (
                        <div>{item.locationTextchar}</div>
                      ) : (
                        <span className="text-(--sw-grey)">
                          尚未輸入純文字地址
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Map />
                      {item.locationUrl ? (
                        <a
                          href={item.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.locationUrl}
                        </a>
                      ) : (
                        <span className="text-(--sw-grey)">
                          尚未輸入 Google Map 地址連結
                        </span>
                      )}
                    </div>
                  </div>
                  {/* 卡片資料 */}
                  {/* <div className="py-4 flex flex-col gap-2"> */}
                  {/* 單張卡片 */}
                  {/* <div className="flex h-25 gap-2 p-3 shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-lg"> */}
                  {/* 左邊圖片 */}
                  {/* <div className="aspect-square bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src="https://upssmile.com/wp-content/uploads/2023/11/20231111-IMG_2970-2.jpg"
                          alt="og"
                          className="w-full h-full object-cover object-center"
                        />
                      </div> */}
                  {/* 右邊文字 */}
                  {/* <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div className="truncate">
                          繼Blue Bottle
                          Coffee藍瓶咖啡後，加州人氣咖啡廳來東京新宿展店，新宿神等級好喝拿鐵與單品咖啡，曾被GQ評為「世界咖啡館BEST
                          10」，咖啡豆是從加州本店產地直送高品質新鮮咖啡豆，可享這咖啡多好喝，新宿咖啡廳收口袋。
                        </div>
                        <p className="flex-1 overflow-hidden sw-p2">
                          東京咖啡廳推薦，新宿咖啡廳必喝，VERVE COFFEE
                          ROASTERS新宿位於JR新宿車站新南口旁，新宿NEWoMan百貨2樓南口位置，來自美國加州人氣咖啡廳VERVE
                          CAFE日本開分店，曾被GQ評為「世界咖啡館BEST
                          10」，列為日本Blue Bottle
                          Coffee勁敵，從早上7點營業到晚上10點，東京自
                        </p>
                      </div>
                    </div> */}
                  {/* 單張卡片 */}
                  {/* <div className="flex h-25 gap-2 p-3 shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-lg"> */}
                  {/* 左邊圖片 */}
                  {/* <div className="aspect-square bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src="https://resize-image.vocus.cc/resize?norotation=true&quality=80&url=https%3A%2F%2Fimages.vocus.cc%2Fef0070fe-468d-4f00-9a23-806d635c3a14.jpg&width=1200&sign=Ua3x-tNJsLLRRdzR_1DkopGmcV6dbdJi8Op2_4t-1lw"
                          alt="og"
                          className="w-full h-full object-cover object-center"
                        />
                      </div> */}
                  {/* 右邊文字 */}
                  {/* <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div className="truncate">
                          東京鎌倉的加州風味VERVE COFFEE
                          ROASTERS｜寵物友善咖啡廳
                        </div>
                        <p className="flex-1 overflow-hidden sw-p2">
                          美國加州衝浪天堂Santa Cruz發跡的《VERVE COFFEE
                          ROASTERS》進駐東京、鎌倉，充滿加州風格的咖啡廳。這家咖啡廳最大特色就是允許毛小孩進入，非常難得。推薦給大家的VERVE
                          COFFEE的咖啡菜單。
                        </p>
                      </div> */}
                  {/* </div> */}
                  {/* </div> */}
                </div>
              </div>

              {/* <div className="mt-6 flex justify-end">
              <button className="sw-btn sw-btn--gold-square">確定</button>
            </div> */}
            </section>

            {/* <div className="mt-6 flex justify-end">
              <button className="sw-btn sw-btn--gold-square">確定</button>
            </div> */}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
