import { Order } from '../../dutyfree-shop/utils/storage';

export const mockDutyFreeOrders: Order[] = [
  {
    id: 'DF2025-1241',
    date: '2025/11/21',
    status: 'success',
    total: 14200,
    discount: 1000,
    promoCode: 'BLACK5',
    items: 2,
    paymentMethod: '信用卡付款',
    products: [
      {
        id: '1',
        name: 'Dior 迪奧癮誘超模漆光唇釉',
        sub: '花蜜護唇精華質地 6ml',
        description:
          '融合高濃度花蜜精華與漆光色料，一抹即現鮮明色澤與鏡面光感。',
        price: 8800,
        quantity: 1,
        image: '/images/dutyfree/dior4.png',
      },
      {
        id: '13',
        name: 'YSL 奢華緞面唇膏',
        sub: '訂製色選 3.2g',
        description: '高濃度色料與護唇複合物，一抹耀眼飽和色澤。',
        price: 6400,
        quantity: 1,
        image: '/images/dutyfree/ysl1.png',
      },
    ],
  },
  {
    id: 'DF2025-3628',
    date: '2025/11/15',
    status: 'refunding',
    total: 8200,
    items: 1,
    paymentMethod: '現金',
    products: [
      {
        id: '7',
        name: 'CHANEL 香奈兒四色眼影盤',
        sub: '霧光絢采限量版 2g',
        description: '絲絨與珠光質地，色澤飽和細緻。',
        price: 8200,
        quantity: 1,
        image: '/images/dutyfree/c1.png',
      },
    ],
  },
  {
    id: 'DF2025-5082',
    date: '2025/11/10',
    status: 'success',
    total: 1980,
    items: 1,
    paymentMethod: '信用卡付款',
    products: [
      {
        id: '16',
        name: 'Tom Ford 絲絨唇霜筆',
        sub: '柔霧質地 2g',
        description: '筆尖易於勾勒唇線，柔霧膏體快速填滿雙唇。',
        price: 1980,
        quantity: 1,
        image: '/images/dutyfree/tf1.png',
      },
    ],
  },
  {
    id: 'DF2025-7779',
    date: '2025/11/09',
    status: 'disabled',
    total: 1520,
    items: 1,
    paymentMethod: '信用卡付款',
    products: [
      {
        id: '14',
        name: 'YSL 奢華緞面唇膏',
        sub: '訂製色選 3.2g',
        description: '柔滑膏體貼合雙唇，維持不顯唇紋的緞面光澤。',
        price: 1520,
        quantity: 1,
        image: '/images/dutyfree/ysl1.png',
      },
    ],
  },
];
