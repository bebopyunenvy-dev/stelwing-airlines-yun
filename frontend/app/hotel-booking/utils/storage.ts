// utils/storage.ts
export const saveSearch = (data: { checkin?: string; checkout?: string }) =>
  localStorage.setItem('booking_search', JSON.stringify(data));

export const loadSearch = () => {
  try {
    return JSON.parse(localStorage.getItem('booking_search') || '{}');
  } catch {
    return {};
  }
};
