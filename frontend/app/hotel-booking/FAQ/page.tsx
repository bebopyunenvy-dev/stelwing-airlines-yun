'use client';

import { useState } from 'react';

// UI 元件
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import SearchView from '../components/ui/SearchView';
import TabButton from '../components/ui/TabButton';

// 卡片元件 - 行李規定
import CarryOnCard from '../components/FAQ-notice/CarryOnCard';
import CheckedLuggageCard from '../components/FAQ-notice/CheckedLuggageCard';
import ProhibitedItemsCard from '../components/FAQ-notice/ProhibitedItemsCard';

// 卡片元件 - 機場資訊
import BookingProcessCard from '../components/FAQ-notice/BookingProcessCard';
import ImportantInfoCard from '../components/FAQ-notice/ImportantInfoCard';
import PowerSpecsCard from '../components/FAQ-notice/PowerSpecsCard';

// 卡片元件 - 出入境須知
import CustomsProcessCard from '../components/FAQ-notice/CustomsProcessCard';
import { CustomsRulesCard } from '../components/FAQ-notice/CustomsRulesCard';
import EntryRequirementsCard from '../components/FAQ-notice/EntryRequirementsCard';

// 卡片元件 - 緊急聯絡
import EmbassyContactCard from '../components/FAQ-notice/EmbassyContactCard';
import EmergencyNumbersCard from '../components/FAQ-notice/EmergencyNumbersCard';
import TravelAssistanceCard from '../components/FAQ-notice/TravelAssistanceCard';

// 卡片元件 - 安全提醒
import CommonScamsCard from '../components/FAQ-notice/CommonScamsCard';
import CommunicationSafetyCard from '../components/FAQ-notice/CommunicationSafetyCard';
import FinancialSafetyCard from '../components/FAQ-notice/FinancialSafetyCard';
import SafetyTipsCard from '../components/FAQ-notice/SafetyTipsCard';

export default function FAQPage() {
  const [selectedTab, setSelectedTab] = useState('行李規定');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // ── 國家選項 ───────────────────────────────────────
  const countryOptions = ['台灣', '日本', '泰國', '新加坡'];

  // ── 階層式城市選項 ─────────────────────────────────
  const getCityOptions = (country: string): string[] => {
    const cityMap: Record<string, string[]> = {
      台灣: ['台北-桃園', '台北-松山', '高雄-小港'],
      日本: ['東京-成田', '東京-羽田'],
      泰國: ['曼谷-素萬那普', '曼谷-廊曼'],
      新加坡: ['新加坡-樟宜'],
    };
    return cityMap[country] ?? ['請選擇國家'];
  };

  const cityOptions = getCityOptions(selectedCountry);

  // ── Tab 選項 ───────────────────────────────────────
  const tabButtons = [
    '行李規定',
    '機場資訊',
    '出入境須知',
    '緊急聯絡',
    '安全提醒',
  ];

  // ========== 行李規定資料 ==========
  const checkedLuggageRestrictions = [
    {
      category: '經濟艙',
      weight: '23公斤以下',
      dimensions: '長寬高總和不超過158cm',
      pieces: '1-2件（依航空公司而定）',
    },
    {
      category: '商務艙',
      weight: '32公斤以下',
      dimensions: '長寬高總和不超過158cm',
      pieces: '2件',
    },
  ];

  const carryOnRestrictions = {
    category: '標準',
    dimensions: '55cm x 40cm x 25cm以內',
    weight: '7-10公斤（依航空公司而定）',
    liquids: '每瓶不超過100ml，總量不超過1公升',
  };

  const prohibitedItems = [
    {
      category: '完全禁止',
      items: ['易燃易爆物品', '毒品及管制藥品', '武器及刀具', '腐蝕性化學品'],
    },
    {
      category: '限制攜帶',
      items: [
        '鋰電池（需隨身攜帶）',
        '液體（符合3-1-1規定）',
        '食品（需申報檢疫）',
        '現金超過100萬日圓',
      ],
    },
  ];

  // ========== 機場資訊資料 ==========
  const processData = [
    {
      step: 'Step 1',
      title: '抵達機場',
      description: '建議國際航班提前3小時抵達',
    },
    {
      step: 'Step 2',
      title: '辦理報到手續',
      description: '出示護照、機票，託運行李',
    },
    {
      step: 'Step 3',
      title: '通過安全檢查',
      description: '脫鞋、筆電平板單獨檢查',
    },
    {
      step: 'Step 4',
      title: '出境審查',
      description: '出示護照、登機證',
    },
    {
      step: 'Step 5',
      title: '前往登機門',
      description: '確認登機門位置，注意廣播',
    },
  ];

  const powerData = {
    voltage: {
      standard: '100V',
      frequency: ['50Hz（東日本）', '60Hz（西日本）'],
    },
    plugTypes: {
      primary: '扁片無接地極',
      secondary: '三孔扁片型（較少使用）',
      recommendation: '建議攜帶轉換插頭',
    },
  };

  const importantInfoData = {
    transportation: [
      '日本車輛靠左行駛，先下後上',
      '建內預約接駁車或計程車服務',
      '情愛搭乘機場巴士，請提早預訂',
      '情遵守當地駕駛規定',
    ],
    facilities: [
      '推薦前往「いただきます」',
      '用餐可選擇「ごちそうさまでした」',
      '不要在禁煙區吸菸',
    ],
    shopping: [
      '大部分商店接受信用卡',
      '機場實體店，部分店舖可辦理退稅',
      '外國旅客可享免稅優惠（消費滿5000日圓）',
    ],
  };

  // ========== 出入境須知資料 ==========
  const entryRequirementsData = {
    documents: [
      '有效護照（剩餘效期6個月以上）',
      '來回機票或離境機票',
      '入境卡（飛機上或機場填寫）',
      '海關申報表',
    ],
    stayPeriod: [
      '台灣護照：免簽證90天',
      '香港特區護照：免簽證90天',
      '澳門特區護照：免簽證90天',
    ],
    transfer: [
      '24小時內轉機且不出機場，通常免簽證',
      '轉機超過24小時建議確認簽證需求',
    ],
  };

  const customsRulesData = {
    dutyFree: [
      '酒類：3瓶（每瓶760ml以下）',
      '香菸：400支或雪茄100支',
      '香水：2盎司',
      '其他物品：20萬日圓以下',
    ],
    prohibited: [
      '現金超過100萬日圓',
      '貴重物品（手錶、珠寶等）',
      '農產品及肉品',
      '動植物產品',
    ],
    notice: '肉類製品、新鮮水果、種子等物品嚴格禁止攜入',
  };

  const customsProcessData = [
    {
      step: 'Step 1',
      title: '檢疫檢查',
      description: '健康檢查、動植物檢疫',
    },
    {
      step: 'Step 2',
      title: '入境審查',
      description: '護照查驗、指紋按壓、拍照',
    },
    {
      step: 'Step 3',
      title: '行李提領',
      description: '依航班資訊至指定轉盤提領行李',
    },
    {
      step: 'Step 4',
      title: '海關檢查',
      description: '申報物品檢查、選擇紅色或綠色通道',
    },
  ];

  // ========== 緊急聯絡資料 ==========
  const embassyContactData = [
    {
      name: '台北駐日經濟文化代表處',
      address: '東京都港區白金台5-20-2',
      phone: '03-3280-7811',
      emergencyPhone: '090-5572-3327',
      hours: '週一至週五 9:00-17:30',
    },
    {
      name: '台北駐大阪經濟文化辦事處',
      address: '大阪市住友生命大阪國際大廈38樓',
      phone: '06-6443-8481',
      emergencyPhone: '080-6192-3746',
      hours: '週一至週五 9:00-17:30',
    },
  ];

  const emergencyNumbersData = {
    emergency: ['警察：110', '消防/救護車：119', '海上保安廳：118'],
    other: {
      name: '其他服務',
      address: '大阪市住友生命大阪國際大廈38樓',
      phone: '06-6443-8481',
      emergencyPhone: '080-6192-3746',
    },
  };

  const travelAssistanceData = [
    {
      name: '成田機場旅遊服務中心',
      details: [
        '據位置：第1航廈1樓到達大廳',
        '電話：0476-30-3383',
        '營業時間：8:00-20:00',
        '提供多國語言服務',
      ],
    },
    {
      name: '東京觀光資訊中心',
      details: [
        '進駐位：JR新宿站南口',
        '設櫃：觀廳三樓9樓',
        '上車：JR上野站',
        '電話：03-3201-3331',
      ],
    },
    {
      name: '外國人旅遊熱線',
      details: [
        '24小時服務：050-3816-2787',
        '支援語言：英語、中文、韓語、日語',
        '提供交通、住宿、觀光等諮詢',
      ],
    },
  ];

  // ========== 安全提醒資料 ==========
  const commonScamsData = {
    street: [
      '假冒店：在觀光地點高價索取款',
      '酒吧拉客：歌舞伎町等地高額消費',
      '假警察：要求檢查證件及金錢',
    ],
    online: [
      '虛假Wi-Fi：免費Wi-Fi竊取個人資料',
      '假購物網：超低價商品取款後失聯',
      '釣魚簡訊：假冒銀行或政府機關',
    ],
  };

  const safetyTipsData = {
    highRisk: [
      '歌舞伎町（新宿）：夜間娛樂區，小心拉客',
      '六本木：外國人聚集區，注意酒吧消費',
      '上野公園：夜間避免單獨前往',
      '涉谷中心街：人潮擁擠，小心扒手',
    ],
    tips: [
      '隨身攜帶護照影本，正本放飯店保險箱',
      '避免攜帶大量現金',
      '夜間避免單獨行動',
      '注意個人物品，特別是電車上',
    ],
    notice: '日本整體治安良好，但仍需注意個人財物安全，避免單獨前往偏僻地區',
  };

  const financialSafetyData = {
    creditCard: [
      '大型商店、餐廳普遍接受信用卡',
      '小型商店可能僅收現金',
      '使用ATM時遮擋密碼輸入',
      '避免使用來路不明的ATM',
    ],
    cashTips: [
      '7-Eleven ATM支援多數國外卡片',
      '郵局ATM也可提領外幣',
      '銀行ATM通常僅開放時間內使用',
      '提領時確保周圍環境安全',
    ],
  };

  const communicationSafetyData = {
    internet: [
      '使用官方Wi-Fi熱點',
      '避免在公共Wi-Fi處理敏感資訊',
      '考慮租用行動Wi-Fi設備',
      '重要資料建議使用VPN',
    ],
    emergency: [
      '記錄重要聯絡號碼',
      '下載離線地圖備用',
      '告知家人行程規劃',
      '購買旅遊保險並了解理賠程序',
    ],
  };

  // ── Handlers ───────────────────────────────────────────────
  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    setSelectedCity('');
  };

  const handleCityChange = (val: string) => {
    setSelectedCity(val);
  };

  const handleTabClick = (tab: string) => setSelectedTab(tab);

  const handleSearch = () => {
    setIsSearching(true);
    console.log('Search:', { selectedCountry, selectedCity, searchKeyword });
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="bg-[#1f2e3c] py-10">
      {/* Hero + 搜尋區 */}
      <section className="w-full py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 sm:gap-8">
          <h1 className="text-xl sm:text-2xl md:text-[24px] font-bold text-center text-white">
            目的地旅遊資訊
          </h1>

          <div className="w-full max-w-[704px]">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
              <Dropdown
                options={countryOptions}
                placeholder="國家"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="flex-1"
              />
              <Dropdown
                options={cityOptions}
                placeholder="城市 / 機場"
                value={selectedCity}
                onChange={handleCityChange}
                className="flex-1"
              />
              <SearchView
                placeholder="關鍵字"
                value={searchKeyword}
                onChange={(val) => setSearchKeyword(val)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
            </div>

            <div className="flex justify-center">
              <Button
                text="搜尋"
                text_font_size="text-lg"
                text_font_weight="font-bold"
                text_color="text-black"
                border_border_radius="rounded-full"
                className="px-15 py-2"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tab 導覽 */}
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center border-[3px] border-[#8e7c60] rounded-full p-3">
            {tabButtons.map((tab) => (
              <TabButton
                key={tab}
                text={tab}
                selected={selectedTab === tab}
                onClick={() => handleTabClick(tab)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 搜尋中提示 */}
      {isSearching && (
        <div className="text-center text-white py-4">
          <p className="text-lg animate-pulse">搜尋中...</p>
        </div>
      )}

      {/* 卡片區 */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[1104px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          {/* 行李規定 Tab */}
          {selectedTab === '行李規定' && !isSearching && (
            <>
              <CheckedLuggageCard data={checkedLuggageRestrictions} />
              <CarryOnCard data={carryOnRestrictions} />
              <ProhibitedItemsCard data={prohibitedItems} />
            </>
          )}

          {/* 機場資訊 Tab */}
          {selectedTab === '機場資訊' && !isSearching && (
            <>
              <BookingProcessCard data={processData} />
              <PowerSpecsCard data={powerData} />
              <ImportantInfoCard data={importantInfoData} />
            </>
          )}

          {/* 出入境須知 Tab */}
          {selectedTab === '出入境須知' && !isSearching && (
            <>
              <EntryRequirementsCard data={entryRequirementsData} />
              <CustomsRulesCard data={customsRulesData} />
              <CustomsProcessCard data={customsProcessData} />
            </>
          )}

          {/* 緊急聯絡 Tab */}
          {selectedTab === '緊急聯絡' && !isSearching && (
            <>
              <EmbassyContactCard data={embassyContactData} />
              <EmergencyNumbersCard data={emergencyNumbersData} />
              <TravelAssistanceCard data={travelAssistanceData} />
            </>
          )}

          {/* 安全提醒 Tab */}
          {selectedTab === '安全提醒' && !isSearching && (
            <>
              <CommonScamsCard data={commonScamsData} />
              <SafetyTipsCard data={safetyTipsData} />
              <FinancialSafetyCard data={financialSafetyData} />
              <CommunicationSafetyCard data={communicationSafetyData} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
