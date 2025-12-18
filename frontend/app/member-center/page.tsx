'use client';

import { useAuth } from '@/app/context/auth-context';
import { Award, Calendar, Camera, TrendingUp } from 'lucide-react'; // ✅【新增】Camera
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MileageOverview from './components/MileageOverview';
import MileageTable from './components/MileageTable';
import MileageTabs from './components/MileageTabs';

// ✅【保留】性別與等級顯示對照表
const genderLabels = { male: '男', female: '女', M: '男', F: '女' };
const levelLabels = {
  Green: '普卡會員',
  Silver: '銀卡會員',
  Gold: '金卡會員',
  Platinum: '白金會員',
};

const sanitizePhone = (value: string) => value.replace(/\D/g, '');
const formatPhoneDisplay = (value: string) => {
  const digits = sanitizePhone(value);
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 10)}`;
};

const formatDate = (value?: string) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('zh-TW');
  } catch {
    return value;
  }
};

export default function MemberInfoPage() {
  const router = useRouter();
  const { refresh: refreshAuth } = useAuth();

  // ✅【保留】會員資料（動態）
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rule');
  // =========================
  // ✅【新增】頭像彈窗所需狀態
  // =========================
  const [avatarOptions, setAvatarOptions] = useState<any[]>([]); // ✅ 圖庫清單
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // ✅ Modal 開關
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null); // ✅ 選擇中的 avatarId

  // ✅【保留】載入會員資料
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/member-center/login');
      return;
    }

    fetch('http://localhost:3007/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          router.push('/member-center/login');
          return;
        }

        // ⚠️ /verify 目前只回傳基本欄位（你後端的 select）
        //    這裡先用安全預設，之後你擴充 /verify 回傳 avatar 資料就會自動帶出
        setMember({
          memberId: data.member.memberId,
          firstName: data.member.firstName || '',
          lastName: data.member.lastName || '',
          username: data.member.username || '',
          avatarChoice: data.member.avatarChoice || null,
          email: data.member.email,
          level: data.member.membershipLevel || 'Green',
          mileage: data.member.mileage || 0, // ✅ 從後端撈哩程
          gender: data.member.gender || '',
          birthDate: data.member.birthDate || '',
          phone: sanitizePhone(data.member.phoneNumber || ''),
          country: data.member.country || '',
          city: data.member.city || '',
          postalCode: data.member.postalCode || '',
          address: data.member.address || '',
          passportNumber: data.member.passportNumber || '',
          passportExpiry: data.member.passportExpiry || '',
          registerDate: data.member.createdAt || '',
          lastLogin: data.member.lastLogin || '',
          avatar: {
            imagePath: data.member.avatar?.imagePath || '/avatars/default.png',
            label: data.member.avatar?.label || '預設頭像',
          },
        });
      })
      .catch(() => router.push('/member-center/login'))
      .finally(() => setLoading(false));
  }, [router]);

  // =========================
  // ✅【新增】載入頭像圖庫（只跑一次）
  // =========================
  useEffect(() => {
    fetch('http://localhost:3007/api/auth/avatars')
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) setAvatarOptions(data.avatars || []);
      })
      .catch((err) => console.error('頭像圖庫載入錯誤:', err));
  }, []);

  // =========================
  // ✅【新增】開啟頭像 Modal（預選現在的 avatarChoice）
  // =========================
  const openAvatarModal = () => {
    if (member?.avatarChoice) {
      setSelectedAvatarId(Number(member.avatarChoice));
    } else {
      setSelectedAvatarId(null);
    }
    setIsAvatarModalOpen(true);
  };

  // =========================
  // ✅【新增】儲存頭像
  // =========================
  const handleSaveAvatar = async () => {
    if (!member || !selectedAvatarId) return;

    try {
      const res = await fetch('http://localhost:3007/api/auth/update-avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.memberId,
          avatarChoice: selectedAvatarId,
        }),
      });

      const data = await res.json();

      if (data?.ok) {
        // 從圖庫找出選取的那一張，更新本地狀態
        const newly = avatarOptions.find(
          (a) => a.avatarId === selectedAvatarId
        );
        setMember((prev: any) => ({
          ...prev,
          avatarChoice: selectedAvatarId,
          avatar: newly
            ? { imagePath: newly.imagePath, label: newly.label }
            : prev.avatar,
        }));
        refreshAuth();
        setIsAvatarModalOpen(false);
      } else {
        alert(data?.message || '更新頭像失敗');
      }
    } catch (err) {
      console.error('更新頭像錯誤:', err);
      alert('伺服器連線錯誤，請稍後再試');
    }
  };

  // ✅【保留】載入中/錯誤顯示
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#1F2E3C]">
        資料載入中...
      </div>
    );
  if (!member)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#B91C1C]">
        無法取得會員資料，請重新登入
      </div>
    );

  const levelLabel =
    levelLabels[member.level as keyof typeof levelLabels] ??
    member.level ??
    '一般會員';

  const displayName =
    `${member.lastName || ''}${member.firstName || ''}`.trim() ||
    member.username ||
    '未填寫';
  const nickname = member.username || '尚未設定';
  const formattedPhone = formatPhoneDisplay(member.phone || '');
  const birthDateLabel = formatDate(member.birthDate);
  const infoItems = [
    { label: '姓氏', value: member.lastName || '未填寫' },
    { label: '名字', value: member.firstName || '未填寫' },
    { label: '暱稱', value: nickname },
    {
      label: '性別',
      value:
        genderLabels[member.gender as keyof typeof genderLabels] || '未設定',
    },
    { label: '生日', value: birthDateLabel || '未填寫' },
    { label: '電話', value: formattedPhone || '未填寫' },
    { label: 'Email', value: member.email, span: 2 },
    { label: '國家', value: member.country || '未填寫' },
    { label: '縣市', value: member.city || '未填寫' },
    { label: '郵遞區號', value: member.postalCode || '未填寫' },
    { label: '地址', value: member.address || '未填寫', span: 4 },
  ];

  const getSpanClass = (span?: number) => {
    if (span === 4) return 'sm:col-span-2 lg:col-span-4';
    if (span === 3) return 'sm:col-span-2 lg:col-span-3';
    if (span === 2) return 'sm:col-span-2 lg:col-span-2';
    return '';
  };
  const nextLevelPercent = 0;

  return (
    <>
      <div className="bg-white rounded-b-lg shadow-sm">
        <div className="flex flex-col lg:flex-row min-h-[300px]">
          {/* 左側基本資料 */}
          <div className="w-full lg:w-[235px] border-b lg:border-b-0 lg:border-r-2 border-[#D4D4D4] p-6 flex flex-col items-center">
            {/* =========================
                ✅【修改】頭像可點擊，右下角加相機鈕 → 開啟 Modal
               ========================= */}
            <div className="relative">
              <img
                src={member.avatar.imagePath}
                alt={member.avatar.label}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover ring-4 ring-[#DCBB87] mb-4 cursor-pointer hover:opacity-80 transition"
                onClick={openAvatarModal} // ✅ 點頭像開彈窗
              />
              <button
                type="button"
                onClick={openAvatarModal}
                className="absolute bottom-2 right-2 bg-[#DCBB87] hover:bg-[#C5A872] text-[#1F2E3C] p-2 rounded-full shadow"
                aria-label="更換頭像"
              >
                <Camera size={16} />
              </button>
            </div>

            <h3 className="text-[#1F2E3C] -mt-1 mb-1 text-center text-base font-semibold">
              {displayName}
            </h3>
            <div className="text-xs text-[#999] mb-2">暱稱：{nickname}</div>
            <div className="px-3 py-1 rounded-full text-xs lg:text-sm bg-[#DCBB87] text-[#1F2E3C]">
              {levelLabel}
            </div>

            {/* Info group */}
            <div className="mt-6 w-full space-y-4 border-t border-[#E5E5E5] pt-4">
              <div className="flex items-center gap-3">
                <Award className="text-[#DCBB87]" size={16} />
                <div className="flex-1">
                  <div className="text-[10px] lg:text-xs text-[#999]">
                    會員編號
                  </div>
                  <div className="text-xs lg:text-sm">
                    ST-{String(member.memberId).padStart(6, '0')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="text-[#DCBB87]" size={16} />
                <div className="flex-1">
                  <div className="text-[10px] lg:text-xs text-[#999]">
                    哩程數
                  </div>
                  <div className="text-xs">
                    {member.mileage?.toLocaleString() || 0} 哩
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-[#DCBB87]" size={16} />
                <div className="flex-1">
                  <div className="text-[10px] lg:text-xs text-[#999]">
                    註冊日期
                  </div>
                  <div className="text-xs lg:text-sm">
                    {member.registerDate
                      ? new Date(member.registerDate).toLocaleDateString(
                          'zh-TW'
                        )
                      : '—'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-[#DCBB87]" size={16} />
                <div className="flex-1">
                  <div className="text-[10px] lg:text-xs text-[#999]">
                    註冊日期
                  </div>
                  <div className="text-xs lg:text-sm">
                    {member.registerDate
                      ? new Date(member.registerDate).toLocaleDateString(
                          'zh-TW'
                        )
                      : '—'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-[#DCBB87]" size={16} />
                <div className="flex-1">
                  <div className="text-[10px] lg:text-xs text-[#999]">
                    最後登入
                  </div>
                  <div className="text-xs lg:text-sm">
                    {member.lastLogin
                      ? new Date(member.lastLogin).toLocaleString('zh-TW')
                      : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側詳細資料 */}
          <div className="flex-1 p-6 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className={`min-h-[60px] ${getSpanClass(item.span)} space-y-1`}
                >
                  <div className="text-xs text-[#666]">{item.label}</div>
                  <div className="text-sm text-[#1F2E3C] whitespace-pre-line">
                    {item.value || '未填寫'}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ 保留你的 UI：更改 → 前往 profile */}
            <div className="mt-6 flex lg:justify-end">
              <Link
                href="/member-center/profile"
                className="
                  inline-flex items-center justify-center
                  px-5 py-2 text-sm
                  bg-[#DCBB87] text-[#1F2E3C]
                  hover:bg-[#C5A872]
                  rounded-full
                  transition-colors
                  text-center
                "
              >
                修改
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- 哩程系統 --- */}
      <div className="mt-8">
        <MileageOverview
          mileage={member.mileage}
          level={levelLabel}
          nextLevelPercent={nextLevelPercent}
        />
      </div>

      <MileageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4 min-h-[420px]">
        {activeTab === 'rule' ? (
          <div className="p-6 border bg-white border-[#BA9A60] rounded-xl h-full">
            <h3 className="font-semibold text-[#1F2E3C] mb-3">哩程說明</h3>
            <ul className="text-sm text-[#444] space-y-2">
              <li>．每消費 NT$20 可累積 1 哩程</li>
              <li>．哩程可用於兌換機票、升等、免稅商品等優惠</li>
              <li>．哩程有效期限為 2 年，請於期限內使用</li>
            </ul>
          </div>
        ) : (
          <div className="h-full">
            <MileageTable />
          </div>
        )}
      </div>
      {/* =========================
          ✅【新增】頭像選擇 Modal
         ========================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[520px]">
            <h2 className="text-lg font-semibold text-[#1F2E3C] mb-4">
              選擇你的頭像
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
              {avatarOptions.map((a) => (
                <button
                  key={a.avatarId}
                  type="button"
                  onClick={() => setSelectedAvatarId(a.avatarId)}
                  className={`w-[88px] h-[88px] flex items-center justify-center rounded-full overflow-hidden transition focus-visible:outline-none ${
                    selectedAvatarId === a.avatarId
                      ? 'ring-[6px] ring-[#DCBB87]'
                      : 'ring-0 hover:ring-[4px] hover:ring-[#BA9A60]'
                  }`}
                  aria-label={a.label}
                  title={a.label}
                >
                  <img
                    src={a.imagePath}
                    alt={a.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 text-[#1F2E3C] border border-gray-300 rounded hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={!selectedAvatarId}
                className="px-4 py-2 bg-[#DCBB87] text-[#1F2E3C] rounded hover:bg-[#C5A872] disabled:opacity-60"
              >
                儲存變更
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
