'use client';

import { useState } from 'react';
import { timezones } from '../src/data/timezone';
// @ts-expect-error 我不寫就跳錯我只好加啊氣死
import { DateTime } from 'luxon';
import CategorySelect from '../components/CategorySelect';
import { Trip } from '../types';
import { apiFetch } from '../utils/apiFetch';
import AlertDialogBox from './alertDialog/alertDialogBox';
import { useAlertDialog } from './alertDialog/useAlertDialog';

// export interface CreatePlanFormProps {}
// {}: CreatePlanFormProps

export default function CreatePlanItemForm({
  tripId,
  onSuccess,
}: {
  tripId: string;
  onSuccess: (newTripId: string) => void;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const { alert, showAlert } = useAlertDialog();
  const [categoryId, setCategoryId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    // destination: '',
    allDay: false,
    startTime: '',
    startTimezone: '',
    endTime: '',
    endTimezone: '',
    note: '',
    locationTextchar: '',
    locationUrl: '',
  });

  // 功能：監看欄位變化
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 功能：結束日期不得早於開始日期
  const handleStartTimeChange = (newStartTime: string) => {
    setFormData((prev) => {
      const correctedEndTime =
        // 如果原本的結束日期已經設定、不是 undefined，而且早於開始日期，則把結束日期改為新的開始日期，如果等於或晚於開始日期就沒問題，使用原本的結束日期
        prev.endTime && prev.endTime < newStartTime
          ? newStartTime
          : prev.endTime;
      return { ...prev, startTime: newStartTime, endTime: correctedEndTime };
    });
  };

  // 功能：表單送出
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // e 是事件物件，這裡指表單的 submit 事件，參數 e 冒號後面都是型別定義，TS 就可以知道 e 有哪些屬性和方法可以使用，而這個 e 是 FormEvrnt 表單事件，事件綁掉的元素一定是 HTMLFormElement <form></form> 標籤元素
    e.preventDefault();

    try {
      // 資料整理：日期轉為帶有時區資料的時間物件格式
      // 取得帶時區的 DateTime
      let startDateTime = DateTime.fromISO(formData.startTime, {
        zone: formData.startTimezone,
      });
      let endDateTime = DateTime.fromISO(formData.endTime, {
        zone: formData.endTimezone,
      });

      if (formData.allDay) {
        // allDay = true → 起始日 00:00，結束日隔天 00:00（半開區間）
        startDateTime = startDateTime.startOf('day');
        endDateTime = endDateTime.plus({ days: 1 }).startOf('day');
      }

      const adjustedData = {
        ...formData,
        typeId: Number(categoryId),
        startTime: startDateTime.toUTC().toISO(),
        endTime: endDateTime.toUTC().toISO(),
      };

      console.log(JSON.stringify(adjustedData));

      const data = await apiFetch<Trip>(
        `http://localhost:3007/api/plans/${tripId}/items`,
        {
          // const data = await apiFetch(`${API_BASE}/plans`, {
          method: 'POST',
          body: JSON.stringify(adjustedData),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      showAlert({
        title: '新增成功',
        description: '點擊確認回到日曆',
        confirmText: '確認',
        onConfirm: () => onSuccess(data.id),
      });
    } catch (err: any) {
      showAlert({
        title: '新增失敗',
        description: err.message || '請稍後再試',
        confirmText: '確認',
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-3">
        {/* 旅程標題 */}
        <div className="sw-l-input">
          <label htmlFor="title">行程標題</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        {/* 分類 */}
        <div className="sw-l-input">
          <label>分類</label>
          <CategorySelect value={categoryId} onChange={setCategoryId} />
        </div>
        {/* allDay 勾選 */}
        <div className="mb-3">
          <input
            id="allDay"
            name="allDay"
            type="checkbox"
            checked={formData.allDay} // 綁定狀態
            onChange={(e) => {
              const checked = e.target.checked;

              setFormData((prev) => {
                // 先抓日期：如果有 startTime 就切日期，沒有就用今天
                const baseDate = prev.startTime
                  ? prev.startTime.split('T')[0]
                  : DateTime.now().toISODate();

                // allDay 時間邏輯
                const newStart = checked ? `${baseDate}T00:00` : prev.startTime;
                const newEnd = checked ? `${baseDate}T23:59` : prev.endTime;

                return {
                  ...prev,
                  allDay: checked,
                  startTime: newStart,
                  endTime: newEnd,
                };
              });
            }}
          />
          <label htmlFor="allDay" className="ml-2">
            建立整天的行程
          </label>
        </div>
        {/* 開始日期及時區 */}
        <div className="flex gap-4">
          <div className="flex-1 sw-l-input">
            <label htmlFor="startTime">開始時間</label>
            {formData.allDay ? (
              // 如果 allDay 為 true，顯示 date input
              <input
                id="startTime"
                name="startTime"
                type="date"
                value={formData.startTime.split('T')[0] || ''}
                onChange={(e) =>
                  handleStartTimeChange(e.target.value + 'T00:00')
                }
                required
              />
            ) : (
              // 如果 allDay 為 false，顯示 datetime input
              <input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                required
              />
            )}
          </div>
          <div className="flex-1 sw-l-input">
            <label htmlFor="startTimezone">開始時間時區</label>
            <select
              id="startTimezone"
              name="startTimezone"
              onChange={handleChange}
              required
            >
              <option value="">選擇時區 ⭣</option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.city} {tz.code} - {tz.country}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* 結束日期及時區 */}
        <div className="flex gap-4">
          <div className="flex-1 sw-l-input">
            <label htmlFor="endTime">結束時間 (選填)</label>
            {formData.allDay ? (
              // allDay 勾選 → 顯示 date input
              <input
                id="endTime"
                name="endTime"
                type="date"
                value={formData.endTime.split('T')[0] || ''}
                min={formData.startTime.split('T')[0] || undefined}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: e.target.value + 'T00:00',
                  }))
                }
              />
            ) : (
              // allDay 未勾 → 顯示 datetime-local input
              <input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                min={formData.startTime || undefined}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="flex-1 sw-l-input">
            <label htmlFor="endTimezone">結束時間時區</label>
            <select id="endTimezone" name="endTimezone" onChange={handleChange}>
              <option value="">選擇時區 ⭣</option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.city} {tz.code} - {tz.country}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* 備註 */}
        <div className="flex-1 sw-l-input">
          <label htmlFor="startDate">備註 (選填)</label>
          <textarea
            id="note"
            name="note"
            rows={3}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* 純文字地址 */}
        <div className="sw-l-input">
          <label htmlFor="locationTextchar">地址：純文字 (選填)</label>
          <input
            id="locationTextchar"
            name="locationTextchar"
            type="text"
            onChange={handleChange}
          />
        </div>
        {/* 連結地址 */}
        <div className="sw-l-input">
          <label htmlFor="locationUrl">地址：Google Map 連結 (選填)</label>
          <input
            id="locationUrl"
            name="locationUrl"
            type="text"
            onChange={handleChange}
          />
        </div>
        {/* 儲存按鈕 */}
        <div className="flex justify-end">
          <button type="submit" className="sw-btn sw-btn--gold-square">
            確認新增
          </button>
        </div>
      </form>
      {/* 彈出視窗 / 整包套件：刪除結果訊息 */}
      {alert.open && <AlertDialogBox alert={alert} />}
    </>
  );
}
