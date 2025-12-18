// utils/dateUtils.ts
export const formatDateLocal = (date: Date): string => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];
};

export const calculateNights = (
  checkIn: string | Date,
  checkOut: string | Date
): number => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  const inUTC = Date.UTC(
    inDate.getFullYear(),
    inDate.getMonth(),
    inDate.getDate()
  );
  const outUTC = Date.UTC(
    outDate.getFullYear(),
    outDate.getMonth(),
    outDate.getDate()
  );

  const diffDays = (outUTC - inUTC) / (1000 * 60 * 60 * 24);
  return diffDays > 0 ? diffDays : 1;
};
