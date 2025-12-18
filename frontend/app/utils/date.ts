/** 以指定時區回傳 YYYY-MM-DD（用 en-CA） */
export function ymdInTZ(d = new Date(), tz = 'Asia/Taipei') {
  return d.toLocaleDateString('en-CA', { timeZone: tz });
}

/** 回傳在指定時區下，+N 天後的 YYYY-MM-DD */
export function addDaysYMD(baseYmd: string, days: number, tz = 'Asia/Taipei') {
  const [y, m, d] = baseYmd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return ymdInTZ(dt, tz);
}
