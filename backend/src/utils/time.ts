import moment from 'moment-timezone'

/**
 * 將當地時間轉為 UTC（存入資料庫用）
 * @param localISO 當地時間字串，例如 "2025-10-30T10:00" 或 "2025-10-30 10:00"
 * @param zone 時區名稱，例如 "Asia/Taipei"
 * @returns UTC 時間（可直接存入 Prisma）
 */
export function toUtc(localISO: string, zone: string): Date {
  // Moment 能自動解析 ISO 或指定格式
  const m = moment.tz(localISO, zone)
  return m.utc().toDate()
}

/**
 * 將 UTC 時間轉為當地時間（顯示用）
 * @param utcDate 從資料庫撈出的 UTC Date 物件
 * @param zone 目標時區名稱
 * @param format 顯示格式（預設：'YYYY-MM-DD HH:mm'）
 * @returns 格式化後的當地時間字串
 */
export function toLocal(utcDate: Date, zone: string, format = 'YYYY-MM-DD HH:mm'): string {
  return moment(utcDate).tz(zone).format(format)
}

/**
 * 將 UTC Date 轉為 UTC ISO 字串（除錯或 API 用）
 */
export function toIsoUtc(date: Date): string {
  return moment(date).utc().toISOString()
}
