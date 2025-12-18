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

// function：將標準一致 +0 的 UTC 時間，搭配 IANA 時區，顯示在該時區，應該呈現的時間，並且只留日期
export function convertToTimezone(isoString: string, timezone: string): string {
  const utcDateTime = DateTime.fromISO(isoString, { zone: 'utc' });
  const localTime = utcDateTime.setZone(timezone);
  const formatLocalTime = localTime.toFormat('yyyy-MM-dd');

  return formatLocalTime;
}

export function convertToUTC(isoString: string, originalZone: string): string {
  return DateTime.fromISO(isoString, { zone: originalZone }).toUTC().toISO();
}

export function toOffsetISO(utcString: string, timezone: string) {
  return DateTime.fromISO(utcString, { zone: 'utc' }) // 先讀成 UTC
    .setZone(timezone) // 轉成指定時區
    .toISO(); // 輸出 +08:00 版本
}
