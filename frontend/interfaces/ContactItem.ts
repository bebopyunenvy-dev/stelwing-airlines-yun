export interface ContactItem {
  ab_id: number;
  name: string;
  email: string;
  mobile: string;
  birthday: string | null;
  address: string;
  created_at: Date;
}

export interface ContactAddItem {
  name: string;
  email: string;
  mobile: string;
  birthday: string;
  address: string;
}

export interface ContactEditItem {
  ab_id: number;
  name: string;
  email: string;
  mobile: string;
  birthday: string;
  address: string;
  created_at: string;
}

