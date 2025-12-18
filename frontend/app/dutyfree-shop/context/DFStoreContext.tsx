'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';
import { authStorage, cartStorage, promoStorage } from '../utils/storage';

// ===============================
// 型別定義
// ===============================
interface Product {
  id: string;
  name: string;
  sub: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category?: string;
  subcategory?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface DFStoreContextType {
  products: Product[];
  cart: CartItem[];
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void; // 新增：登出方法
  discount: number;
  promoCode: string;
  discountPercent: number;
  checkoutItem: Product | null;
  setCheckoutItem: (item: Product | null) => void;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  applyPromoCode: (code: string) => void;
  clearPromoCode: () => void;
  clearCart: () => void; //  新增：清空購物車
}

// ===============================
// Context 建立
// ===============================
const DFStoreContext = createContext<DFStoreContextType | undefined>(undefined);

// ===============================
// Provider 實作
// ===============================
export function DFStoreProvider({ children }: { children: React.ReactNode }) {
  // -------------------------------
  // 假資料
  // -------------------------------
  const products: Product[] = [
    {
      id: '1',
      name: 'Dior 迪奧癮誘超模漆光唇釉',
      sub: '花蜜護唇精華質地 6ml',
      description:
        '融合高濃度花蜜精華與漆光色料，一抹即現鮮明色澤與鏡面光感。輕盈不厚重的質地能長效保濕，同時修護乾裂唇紋，打造柔滑飽滿的立體唇形，全天維持水潤亮澤。',
      price: 8800,
      image: '/images/dutyfree/dior4.png',
      images: [
        '/images/dutyfree/dior1.png',
        '/images/dutyfree/dior2.png',
        '/images/dutyfree/dior3.png',
        '/images/dutyfree/dior4.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '6',
      name: 'Dior 迪奧雪晶靈透亮粉餅',
      sub: '高效持妝光感粉餅 12g',
      description:
        '蘊含雪絨花精萃與礦物粉體，能瞬間提亮膚色並修飾毛孔。質地輕盈細緻，柔焦光感自然服貼，長時間控油不暗沉。附高密度粉撲，上妝滑順不卡粉，維持清透亮澤一整天。',
      price: 3200,
      image: '/images/dutyfree/dior5.png',
      images: [
        '/images/dutyfree/dior5.png',
        '/images/dutyfree/dior6.png',
        '/images/dutyfree/dior7.jpg',
        '/images/dutyfree/dior8.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '7',
      name: 'CHANEL 香奈兒四色眼影盤',
      sub: '霧光絢采限量版 2g',
      description:
        '結合絲絨與珠光質地，色澤飽和細緻，可自由搭配打造自然或濃郁妝感。粉質細膩不飛粉，輕鬆延展並服貼眼皮，長效不暈染。附專用雙頭刷具，適合日常與宴會使用。',
      price: 2800,
      image: '/images/dutyfree/c1.png',
      images: [
        '/images/dutyfree/c1.png',
        '/images/dutyfree/c2.png',
        '/images/dutyfree/c3.png',
        '/images/dutyfree/c4.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '8',
      name: 'Shu Uemura 植村秀極細眉筆',
      sub: '防水持色硬筆芯 0.09g',
      description:
        '日本精製筆芯，硬度適中不易斷裂，筆觸穩定可精準描繪眉型。防水抗汗配方讓妝效長效持久不暈染，自然顯色不生硬，輕鬆打造立體柔和眉感。附可替換筆蕊設計，方便實用。',
      price: 1450,
      image: '/images/dutyfree/s1.png',
      images: [
        '/images/dutyfree/s1.png',
        '/images/dutyfree/s2.png',
        '/images/dutyfree/s3.png',
        '/images/dutyfree/s4.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '13',
      name: 'YSL 奢華緞面唇膏',
      sub: '訂製色選 3.2g',
      description:
        '結合高濃度色料與護唇複合物，一抹呈現耀眼飽和色澤並同時保濕。柔滑膏體貼合雙唇，長時間維持不顯唇紋的緞面光澤，是旅行補妝的必備單品。',
      price: 1520,
      image: '/images/dutyfree/ysl1.png',
      images: [
        '/images/dutyfree/ysl1.png',
        '/images/dutyfree/ysl1.png',
        '/images/dutyfree/ysl1.png',
        '/images/dutyfree/ysl1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '14',
      name: 'Giorgio Armani 光韻持久粉底液',
      sub: '完美光澤妝 30ml',
      description:
        '獨家微絲光感科技，提供中高遮瑕卻仍維持輕盈透氣的膚觸。連續補水配方讓底妝一整天不暗沉，打造如專業彩妝師般的柔霧光澤肌。',
      price: 2550,
      image: '/images/dutyfree/armani1.png',
      images: [
        '/images/dutyfree/armani1.png',
        '/images/dutyfree/armani1.png',
        '/images/dutyfree/armani1.png',
        '/images/dutyfree/armani1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '15',
      name: 'NARS 炙熱頰彩盤',
      sub: '六色旅行限定版',
      description:
        '集結品牌明星色調的頰彩盤，霧面與光澤質地一次擁有。粉質細緻易暈染，能依膚色自由疊擦，打造立體輪廓與自然紅潤感。',
      price: 2280,
      image: '/images/dutyfree/nars1.png',
      images: [
        '/images/dutyfree/nars1.png',
        '/images/dutyfree/nars1.png',
        '/images/dutyfree/nars1.png',
        '/images/dutyfree/nars1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '16',
      name: 'Tom Ford 絲絨唇霜筆',
      sub: '柔霧質地 2g',
      description:
        '將唇線筆與唇膏二合一，筆尖易於勾勒唇線，筆身柔霧膏體可快速填滿雙唇。高度顯色不沾杯，並添加滋養油脂維持柔軟觸感。',
      price: 1980,
      image: '/images/dutyfree/tf1.png',
      images: [
        '/images/dutyfree/tf1.png',
        '/images/dutyfree/tf1.png',
        '/images/dutyfree/tf1.png',
        '/images/dutyfree/tf1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '17',
      name: 'Laura Mercier 柔光透明蜜粉',
      sub: '經典控油 29g',
      description:
        '細緻粉末可瞬間柔焦毛孔並延長底妝持久度。無色系不改變粉底色號，吸油不吸水，維持肌膚透亮輕盈的裸肌感受。',
      price: 1680,
      image: '/images/dutyfree/lm1.png',
      images: [
        '/images/dutyfree/lm1.png',
        '/images/dutyfree/lm1.png',
        '/images/dutyfree/lm1.png',
        '/images/dutyfree/lm1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '18',
      name: 'Bobbi Brown 精準流線眼線液',
      sub: '防水快速乾 0.5ml',
      description:
        '極細0.1mm軟性筆尖可靈活描繪眼線，防水抗汗且不暈染。濃黑色澤一次到位，不需反覆描繪，打造俐落眼神。',
      price: 1280,
      image: '/images/dutyfree/bb1.png',
      images: [
        '/images/dutyfree/bb1.png',
        '/images/dutyfree/bb1.png',
        '/images/dutyfree/bb1.png',
        '/images/dutyfree/bb1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '19',
      name: 'Hourglass 漸層修容盤',
      sub: '限定旅行版 9g',
      description:
        '結合打亮、腮紅與修容三種色選，採用光擴散科技在臉上形成自然漸層。粉質細膩易於暈染，適合旅途中快速完妝。',
      price: 2650,
      image: '/images/dutyfree/hg1.png',
      images: [
        '/images/dutyfree/hg1.png',
        '/images/dutyfree/hg1.png',
        '/images/dutyfree/hg1.png',
        '/images/dutyfree/hg1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '20',
      name: 'Charlotte Tilbury 星空打亮盤',
      sub: '絲滑高光 10g',
      description:
        '珍珠微粒與柔焦粉體結合，輕抹即可打造宛如星芒的立體光澤。質地細緻不卡粉，可用於顴骨、眉骨與鎖骨等部位。',
      price: 2380,
      image: '/images/dutyfree/ct1.png',
      images: [
        '/images/dutyfree/ct1.png',
        '/images/dutyfree/ct1.png',
        '/images/dutyfree/ct1.png',
        '/images/dutyfree/ct1.png',
      ],
      category: '美妝保養',
      subcategory: '彩妝',
    },
    {
      id: '9',
      name: 'Hermès 經典緹花絲巾',
      sub: '柔軟真絲材質 90x90cm',
      description:
        '以細膩緹花工藝編織出典雅圖紋，展現品牌經典美學。絲質柔滑親膚，色澤飽滿亮麗，可隨心變化造型，無論頸巾或髮飾皆能散發高雅氣質，是時尚配件中的永恆經典。',
      price: 12800,
      image: '/images/dutyfree/h1.png',
      images: [
        '/images/dutyfree/h1.png',
        '/images/dutyfree/h2.png',
        '/images/dutyfree/h3.png',
        '/images/dutyfree/h1.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '21',
      name: 'Louis Vuitton Monogram 長夾',
      sub: '經典帆布材質',
      description:
        '沿用經典 Monogram 帆布搭配皮革內裡，多卡層設計方便收納旅行文件。拉鍊零錢層與鈔票夾一應俱全，兼具質感與實用性。',
      price: 26800,
      image: '/images/dutyfree/lv1.png',
      images: [
        '/images/dutyfree/lv1.png',
        '/images/dutyfree/lv1.png',
        '/images/dutyfree/lv1.png',
        '/images/dutyfree/lv1.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '22',
      name: 'Burberry 格紋羊毛圍巾',
      sub: '雙面經典設計',
      description:
        '選用蘇格蘭羊毛纖維織就，雙面不同色調可依造型自由變換。柔軟保暖又具輕盈垂墜感，是秋冬旅遊的最佳配件。',
      price: 11800,
      image: '/images/dutyfree/bb2.png',
      images: [
        '/images/dutyfree/bb2.png',
        '/images/dutyfree/bb2.png',
        '/images/dutyfree/bb2.png',
        '/images/dutyfree/bb2.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '23',
      name: 'Tiffany & Co. 經典銀手環',
      sub: '925 純銀拱形',
      description:
        '極簡線條搭配品牌刻印，散發清新優雅氣質。彈性開口設計方便佩戴，可單獨配戴或疊搭手錶展現不同風格。',
      price: 16200,
      image: '/images/dutyfree/t1.png',
      images: [
        '/images/dutyfree/t1.png',
        '/images/dutyfree/t1.png',
        '/images/dutyfree/t1.png',
        '/images/dutyfree/t1.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '24',
      name: 'Ray-Ban 經典飛行員墨鏡',
      sub: '抗 UV400 鏡片',
      description:
        '金屬細框結合可調式鼻墊，配戴舒適不易滑落。UV400 鏡片提供全方位防護，無論城市漫遊或海島度假都能保持清晰視野。',
      price: 6800,
      image: '/images/dutyfree/r1.jpeg',
      images: [
        '/images/dutyfree/r1.jpeg',
        '/images/dutyfree/r1.jpeg',
        '/images/dutyfree/r1.jpeg',
        '/images/dutyfree/r1.jpeg',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '25',
      name: 'Montblanc 星際原子筆',
      sub: '樹脂筆身 銀色筆夾',
      description:
        '象徵成就與品味的經典書寫工具，流暢筆芯適合簽署重要文件。旅行攜帶不占空間，商務人士的體面之選。',
      price: 12500,
      image: '/images/dutyfree/m1.png',
      images: [
        '/images/dutyfree/m1.png',
        '/images/dutyfree/m1.png',
        '/images/dutyfree/m1.png.jpg',
        '/images/dutyfree/m1.png.jpg',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '26',
      name: 'Cartier LOVE 玫瑰金戒指',
      sub: '經典螺絲飾釘',
      description:
        '使用 18K 玫瑰金打造細緻戒圈，象徵恆久與承諾。簡潔線條搭配螺絲刻紋，低調卻難以忽視，適合作為紀念禮物。',
      price: 48800,
      image: '/images/dutyfree/cartier.png',
      images: [
        '/images/dutyfree/cartier.png',
        '/images/dutyfree/cartier.png',
        '/images/dutyfree/cartier.png',
        '/images/dutyfree/cartier.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '27',
      name: 'Fendi Logo 棒球帽',
      sub: '防潑水尼龍',
      description:
        '立體刺繡 FF Logo 搭配輕盈尼龍帽身，內裡吸汗帶可保持乾爽。俐落帽型能提升整體穿搭層次，是機場時尚的亮點。',
      price: 10500,
      image: '/images/dutyfree/f1.png',
      images: [
        '/images/dutyfree/f1.png',
        '/images/dutyfree/f1.png',
        '/images/dutyfree/f1.jpg',
        '/images/dutyfree/f1.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '28',
      name: 'Celine Triomphe 小方包',
      sub: '牛皮金釦設計',
      description:
        '以柔軟小牛皮打造的迷你方包，搭配 Triomphe 金屬釦點綴。可手提亦可斜背，完美收納旅途必備物品並點亮造型。',
      price: 59800,
      image: '/images/dutyfree/celine.png',
      images: [
        '/images/dutyfree/celine.png',
        '/images/dutyfree/celine.png',
        '/images/dutyfree/celine.png',
        '/images/dutyfree/celine.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '10',
      name: 'Gucci 方框太陽眼鏡',
      sub: '抗UV400鏡片 義大利製',
      description:
        '採用輕盈醋酸纖維鏡框與金屬細節結構，兼具舒適與耐用。UV400防護鏡片可有效阻擋紫外線傷害，並維持清晰視野。經典方框設計展現俐落風格，適合日常穿搭與旅行配戴。',
      price: 16200,
      image: '/images/dutyfree/g1.png',
      images: [
        '/images/dutyfree/g1.png',
        '/images/dutyfree/g1.png',
        '/images/dutyfree/g1.png',
        '/images/dutyfree/g1.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '11',
      name: 'Rolex 蠔式恆動腕錶',
      sub: '不鏽鋼錶殼 自動上鍊',
      description:
        '以精鋼打造堅固錶殼，防水深度達100米。搭載自動上鍊機芯，走時精準穩定。簡潔錶面搭配夜光刻度與指針，無論商務或休閒皆展現雋永質感，是經典工藝的象徵。',
      price: 328000,
      image: '/images/dutyfree/rolex.png',
      images: [
        '/images/dutyfree/rolex.png',
        '/images/dutyfree/rolex.png',
        '/images/dutyfree/rolex.png',
        '/images/dutyfree/rolex.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
    {
      id: '12',
      name: 'Prada 漁夫帽尼龍系列',
      sub: '經典三角標徽 藍色款',
      description:
        '以高級尼龍面料打造，具備輕盈與防潑水特性。帽型立體俐落，搭配品牌經典金屬三角標誌，展現低調奢華風格。適合日常外出或旅遊穿搭，輕鬆塑造時尚造型。',
      price: 9800,
      image: '/images/dutyfree/p1.png',
      images: [
        '/images/dutyfree/p1.png',
        '/images/dutyfree/p1.png',
        '/images/dutyfree/p1.png',
        '/images/dutyfree/p1.png',
      ],
      category: '時尚精品',
      subcategory: '配件',
    },
  ];

  // -------------------------------
  // 狀態管理
  // -------------------------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [checkoutItem, setCheckoutItem] = useState<Product | null>(null);

  // -------------------------------
  // 初始化：載入儲存資料
  // -------------------------------
  useEffect(() => {
    const savedCart = cartStorage.load();
    const savedLogin = authStorage.loadLoginState(); // ✅ 改成 sessionStorage
    const savedPromo = promoStorage.load();

    if (savedCart.length) setCart(savedCart);
    if (savedLogin) setIsLoggedIn(savedLogin);
    if (savedPromo.promoCode) {
      setPromoCode(savedPromo.promoCode);
      setDiscount(savedPromo.discount);
      setDiscountPercent(savedPromo.discountPercent);
    }
  }, []);

  // -------------------------------
  // 資料持久化
  // -------------------------------
  useEffect(() => cartStorage.save(cart), [cart]);
  useEffect(() => authStorage.saveLoginState(isLoggedIn), [isLoggedIn]);
  useEffect(() => {
    if (promoCode) promoStorage.save(promoCode, discount, discountPercent);
  }, [promoCode, discount, discountPercent]);

  // -------------------------------
  // 功能方法
  // -------------------------------
  const addToCart = (product: Product, qty: number) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
    toast.success('已加入購物車！', { description: `${product.name} x${qty}` });
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success('商品已移除');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const applyPromoCode = (code: string) => {
    if (code.toLowerCase() === 'stelwing95') {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const discountAmount = Math.round(subtotal * 0.05);
      setPromoCode(code);
      setDiscount(discountAmount);
      setDiscountPercent(5);
      toast.success('折扣碼已套用', { description: '95 折優惠' });
    } else {
      toast.error('無效的折扣碼');
    }
  };

  const clearPromoCode = () => {
    setPromoCode('');
    setDiscount(0);
    setDiscountPercent(0);
    promoStorage.clear();
    toast.info('已移除折扣碼');
  };

  // 登出方法：清除 session 與登入狀態
  const logout = () => {
    setIsLoggedIn(false);
    authStorage.clearAuth();
    toast.info('您已登出');
  };

  // 清空購物車
  const clearCart = useCallback(() => {
    setCart([]);
    cartStorage.clear();
    toast.info('購物車已清空');
  }, []);

  // -------------------------------
  // Context 提供值
  // -------------------------------
  return (
    <DFStoreContext.Provider
      value={{
        products,
        cart,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        discount,
        promoCode,
        discountPercent,
        checkoutItem,
        setCheckoutItem,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        applyPromoCode,
        clearPromoCode,
        clearCart,
      }}
    >
      {children}
    </DFStoreContext.Provider>
  );
}

// ===============================
// 自訂 Hook
// ===============================
export const useDFStore = () => {
  const ctx = useContext(DFStoreContext);
  if (!ctx) throw new Error('useDFStore 必須在 DFStoreProvider 內使用');
  return ctx;
};
