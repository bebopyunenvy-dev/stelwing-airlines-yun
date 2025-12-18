'use client';

import { create } from 'zustand';

/* ===== 票價段資訊（給 FareDetailsFromStore 用） ===== */
export type FareSegment = {
  title: '去程' | '回程';
  flightNo: string;
  originCode: string;
  originName: string;
  depTime: string; // 已格式化 e.g. "08:35"
  destinationCode: string;
  destinationName: string;
  arrTime: string; // 已格式化
  cabin?: string; // 經濟艙 / 商務艙
  fare: number; // 小計（此段票價）
  currency?: string; // 預設 TWD
};

/* ===== 價格區塊 ===== */
type PriceState = {
  baseFare: number; // 機票合計（兩段加總）
  extrasTotal: number; // 加購合計（行李 / 餐點）
};

/* ===== Store 型別 ===== */
type BookingState = {
  /* ---- 金額 ---- */
  // 舊的 price 結構：給 FareDetailsFromStore 用
  price: PriceState;

  // 方便其他頁面直接抓
  baseFare: number;
  extrasTotal: number;

  /* ---- 明細彈窗 ---- */
  detailsOpen: boolean;
  outbound?: FareSegment | null;
  inbound?: FareSegment | null;
  currency: string;

  /* ---- 座位選擇 ---- */
  selectedSeats: {
    ob: string[]; // 去程 seatNumber 陣列，例如 ['6A']
    ib: string[]; // 回程 seatNumber 陣列
  };

  /* ---- actions ---- */
  openDetails: () => void;
  closeDetails: () => void;

  setBaseFare: (v: number) => void;
  setExtrasTotal: (v: number) => void;

  setOutbound: (seg: FareSegment | null) => void;
  setInbound: (seg: FareSegment | null) => void;
  setCurrency: (cur: string) => void;

  setSelectedSeats: (seg: 'ob' | 'ib', seats: string[]) => void;
};

/* ===== Store 實作 ===== */
export const useBookingStore = create<BookingState>((set) => ({
  // 初始金額
  price: {
    baseFare: 0,
    extrasTotal: 0,
  },
  baseFare: 0,
  extrasTotal: 0,

  // 明細 & 航段
  detailsOpen: false,
  outbound: null,
  inbound: null,
  currency: 'TWD',

  // 座位
  selectedSeats: {
    ob: [],
    ib: [],
  },

  /* ---- 明細彈窗 ---- */
  openDetails: () => set({ detailsOpen: true }),
  closeDetails: () => set({ detailsOpen: false }),

  /* ---- 金額 ---- */
  setBaseFare: (v) =>
    set((s) => ({
      baseFare: v,
      price: { ...s.price, baseFare: v },
    })),

  setExtrasTotal: (v) =>
    set((s) => ({
      extrasTotal: v,
      price: { ...s.price, extrasTotal: v },
    })),

  /* ---- 航段 ---- */
  setOutbound: (seg) => set({ outbound: seg }),
  setInbound: (seg) => set({ inbound: seg }),
  setCurrency: (cur) => set({ currency: cur }),

  /* ---- 座位 ---- */
  setSelectedSeats: (seg, seats) =>
    set((s) => ({
      selectedSeats: {
        ...s.selectedSeats,
        [seg]: seats,
      },
    })),
}));
