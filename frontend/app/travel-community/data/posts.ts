// app/travel-community/data/posts.ts

export type PostType = "全部" | "遊記" | "影片" | "隨手拍";

export interface Post {
  id: number;
  title: string;
  summary: string;
  author: string;
  nickname?: string | null;
  authorAvatar?: string;
  miles: number;
  type: "遊記" | "影片" | "隨手拍";
  cover: string;
  duration?: string;
  location: string;
  country: string;
  tags: string[];
  categories: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  mediaType: "image" | "video";
}

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "臺北市立動物園親子一日遊",
    summary: "從貓空纜車一路玩到熊貓館，分享親子動線與必拍景點。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 1500,
    type: "影片",
    cover: "/travel-community/490316eca0afb5d0e709aaa3731216313a473821.png",
    duration: "0:06",
    location: "臺北市立動物園",
    country: "TW",
    tags: ["親子", "捷運沿線", "動物園"],
    categories: ["動物園", "親子景點"],
    createdAt: "2025-11-03",
    likes: 128,
    comments: 24,
    shares: 12,
    mediaType: "video",
  },
  {
    id: 2,
    title: "京都清水寺黃昏巡禮",
    summary: "分享秋季紅葉期間的拍攝路線與附近甜品推薦。",
    author: "徠步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 2200,
    type: "遊記",
    cover: "/travel-community/a885306d896c3658dcd722f3cb4bf1de66900578.png",
    location: "日本京都",
    country: "JP",
    tags: ["紅葉", "歷史古蹟", "情侶"],
    categories: ["歷史古蹟"],
    createdAt: "2025-10-28",
    likes: 214,
    comments: 32,
    shares: 41,
    mediaType: "image",
  },
  {
    id: 3,
    title: "首爾弘大夜市快拍",
    summary: "沿著夜市邊走邊拍，記錄街頭藝人與小吃。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 900,
    type: "隨手拍",
    cover: "/travel-community/3bb90f73891e7f9796828144d84e6e144fa45f53.png",
    location: "韓國首爾",
    country: "KR",
    tags: ["夜市", "街拍"],
    categories: ["夜市", "市集"],
    createdAt: "2025-11-05",
    likes: 77,
    comments: 9,
    shares: 6,
    mediaType: "image",
  },
  {
    id: 4,
    title: "東京親子嘉年華 vlog",
    summary: "實測親子票券、分享推車友善路徑與餐飲區。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 1800,
    type: "影片",
    cover: "/travel-community/7730ca546b6dce767d75cf8bd7ffca372808d05c.png",
    duration: "0:08",
    location: "日本東京",
    country: "JP",
    tags: ["親子", "遊樂園"],
    categories: ["遊樂園", "親子景點"],
    createdAt: "2025-11-02",
    likes: 163,
    comments: 28,
    shares: 19,
    mediaType: "video",
  },
  {
    id: 5,
    title: "巴塞隆納秘境教堂",
    summary: "沒有遊客的清晨時光，分享如何進入教堂頂樓。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 3200,
    type: "遊記",
    cover: "/travel-community/32b1772ed86c96aa1ddf11d0f6a1c218def05a4c.png",
    location: "西班牙巴塞隆納",
    country: "ES",
    tags: ["秘境", "建築"],
    categories: ["歷史古蹟"],
    createdAt: "2025-09-30",
    likes: 301,
    comments: 44,
    shares: 63,
    mediaType: "image",
  },
  {
    id: 6,
    title: "台南孔廟文青散步",
    summary: "分享周邊咖啡店、文創選物與拍攝角度。",
    author: "徠步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 1200,
    type: "遊記",
    cover: "/travel-community/fd6ff7b2e620c8d459330b3e2e43e55291d031ea.png",
    location: "台南孔廟",
    country: "TW",
    tags: ["慢旅", "歷史古蹟", "咖啡"],
    categories: ["歷史古蹟"],
    createdAt: "2025-10-10",
    likes: 142,
    comments: 17,
    shares: 15,
    mediaType: "image",
  },
  {
    id: 7,
    title: "南投螢火蟲秘境",
    summary: "捕捉春季限定的螢火蟲，附上交通與裝備檢查表。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 2600,
    type: "隨手拍",
    cover: "/travel-community/6bae12d15af11f9404a862238ae2380681f4fc02.png",
    location: "南投鹿谷",
    country: "TW",
    tags: ["秘境", "自然", "夜拍"],
    categories: ["自然生態"],
    createdAt: "2025-04-18",
    likes: 189,
    comments: 21,
    shares: 27,
    mediaType: "image",
  },
  {
    id: 8,
    title: "南投螢火蟲秘境",
    summary: "捕捉春季限定的螢火蟲，附上交通與裝備檢查表。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 2600,
    type: "隨手拍",
    cover: "/travel-community/6bae12d15af11f9404a862238ae2380681f4fc02.png",
    location: "南投鹿谷",
    country: "TW",
    tags: ["秘境", "自然", "夜拍"],
    categories: ["自然生態"],
    createdAt: "2025-04-18",
    likes: 189,
    comments: 21,
    shares: 27,
    mediaType: "image",
  },
  {
    id: 9,
    title: "南投螢火蟲秘境",
    summary: "捕捉春季限定的螢火蟲，附上交通與裝備檢查表。",
    author: "徒步阿德",
    authorAvatar: "/avatars/default.png",
    miles: 2600,
    type: "隨手拍",
    cover: "/travel-community/6bae12d15af11f9404a862238ae2380681f4fc02.png",
    location: "南投鹿谷",
    country: "TW",
    tags: ["秘境", "自然", "夜拍"],
    categories: ["自然生態"],
    createdAt: "2025-04-18",
    likes: 189,
    comments: 21,
    shares: 27,
    mediaType: "image",
  },
];

export type SortOption = "newest" | "popular" | "miles" | "shares";
export type TimeRangeOption = "all" | "7d" | "30d" | "year";
export type MileageTierOption = "all" | "1000" | "5000" | "10000";

export interface FilterState {
  sort: SortOption;
  timeRange: TimeRangeOption;
  mileageTier: MileageTierOption;
  selectedTags: string[];
  selectedCategories: string[];
}

export const defaultFilterState: FilterState = {
  sort: "newest",
  timeRange: "all",
  mileageTier: "all",
  selectedTags: [],
  selectedCategories: [],
};

export const countryOptions = [
  { value: "", label: "全部國家" },
  { value: "TW", label: "台灣" },
  { value: "JP", label: "日本" },
  { value: "KR", label: "韓國" },
  { value: "ES", label: "西班牙" },
  { value: "TH", label: "泰國" },
  { value: "FR", label: "法國" },
  { value: "IT", label: "義大利" },
  { value: "MV", label: "馬爾地夫" },
  { value: "CA", label: "加拿大" },
  { value: "NZ", label: "紐西蘭" },
];

export const timeRangeOptions = [
  { value: "all", label: "所有時間" },
  { value: "7d", label: "近 7 天" },
  { value: "30d", label: "近 30 天" },
  { value: "year", label: "今年" },
];

export const mileageOptions = [
  { value: "all", label: "不限" },
  { value: "1000", label: "1,000+" },
  { value: "5000", label: "5,000+" },
  { value: "10000", label: "10,000+" },
];

export const tagOptions = ["親子", "夜市", "美食", "秘境", "歷史古蹟", "自然", "慢旅"];

export const categoryOptions = [
  "遊樂園",
  "歷史古蹟",
  "動物園",
  "夜市",
  "親子景點",
  "自然生態",
  "市集",
];
