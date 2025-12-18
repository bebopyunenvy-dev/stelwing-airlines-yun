import type { Trip, TripForUI } from '../types';
// @ts-expect-error 我不寫就跳錯我只好加啊氣死
import { DateTime } from 'luxon';

// #region 關於 Luxon

// Luxon 的 DateTime 物件是「時間點 + 時區」的組合
// DateTime.fromISO(時間的 ISOstring, {zone: '時區'})：將 ISOSstring 轉成帶有時區資料的 DateTime 物件
// DateTime.setZone：把這個時間物件移去別的時區顯示，同一時間、不同時區顯示
// DateTime.toUTC：把這個時間物件轉成 UTC (+0) 時區會顯示的時間
// DateTime.toISO：把這個時間物件轉成帶有時區資訊的 ISO 字串
// DateTime.utc：建立一個 utc 的時間物件

// #endregion
// function：搭配時區轉換 UTC 時間呈現時間
function convertToTimezone(isoString: string, timezone: string): string {
  const utcDateTime = DateTime.fromISO(isoString, { zone: 'utc' });
  const localTime = utcDateTime.setZone(timezone);
  const formatLocalTime = localTime.toFormat('yyyy-MM-dd');

  return formatLocalTime;
}

// function：取得旅程狀態：待啟程、進行中、已結束
function calculateStatus(trip: any): string {
  const { startDate, startTimezone, endDate, endTimezone } = trip;

  const nowLocal = DateTime.local(); // 你的現在時間（台灣）

  // 將 now 換成旅程開始時區
  const nowAtStartTZ = nowLocal.setZone(startTimezone).startOf('day');
  const startAtTZ = DateTime.fromISO(startDate)
    .setZone(startTimezone)
    .startOf('day');

  // 將 now 換成旅程結束時區
  const nowAtEndTZ = nowLocal.setZone(endTimezone).startOf('day');
  const endAtTZ = DateTime.fromISO(endDate).setZone(endTimezone).startOf('day');

  if (nowAtStartTZ < startAtTZ) {
    return '待啟程';
  } else if (nowAtEndTZ <= endAtTZ) {
    return '進行中';
  } else {
    return '已結束';
  }
}

// 將原始 API 旅程資料轉成 UI 用資料
export function transformTripForUI(trip: Trip): TripForUI {
  return {
    ...trip,
    status: calculateStatus(trip),
    displayStartDate: convertToTimezone(trip.startDate, trip.startTimezone),
    displayEndDate: convertToTimezone(trip.endDate, trip.endTimezone),
  };
}

// 如果是陣列批量轉換
export function transformTripsForUI(trips: Trip[]): TripForUI[] {
  return trips.map(transformTripForUI);
}
