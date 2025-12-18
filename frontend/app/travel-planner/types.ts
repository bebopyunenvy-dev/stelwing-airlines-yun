// Plan 基本型別
export type Trip = {
  id: string;
  userId: string;
  title: string;
  destination: string | null;
  startDate: string;
  startTimezone: string;
  endDate: string;
  endTimezone: string;
  note: string | null;
  coverImage: string | null;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
};

export interface TripForUI extends Trip {
  status: string;
  displayStartDate: string;
  displayEndDate: string;
}

export type TripItem = {
  id: string;
  planId: string;
  title: string;
  allDay: boolean;
  startTime: string;
  startTimezone: string;
  endTime: string | null;
  endTimezone: string | null;
  note: string | null;
  locationTextchar: string | null;
  locationUrl: string | null;
  typeId: number | null;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    bgColor: string;
    textColor: string;
  } | null; // 可能為 null
};
