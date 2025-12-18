'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DFStatusTag } from '../components/DFStatusTag';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Order, ordersStorage } from '../utils/storage';

export default function MemberPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  // ✅ 初始化：載入儲存的訂單資料
  useEffect(() => {
    const storedOrders = ordersStorage.load();
    setOrders(storedOrders);
  }, []);

  // ✅ 導航回首頁
  const handleNavigateHome = () => {
    router.push('/dutyfree-shop');
  };

  // ✅ 點擊訂單
  const handleOrderClick = (order: Order) => {
    router.push(`/dutyfree-shop/order/${order.id}`);
  };

  // ✅ 狀態標籤轉換
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return '已完成';
      case 'processing':
        return '處理中';
      case 'cancelled':
        return '已取消';
      case 'refunding':
        return '退款中';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 lg:px-16 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <button
            onClick={handleNavigateHome}
            className="hover:text-[var(--df-accent-gold)]"
          >
            首頁
          </button>
          {' > '}
          <span>會員中心</span>
        </div>

        <Tabs defaultValue="duty-free" className="w-full">
          {/* 上方分頁 */}
          <TabsList className="mb-4 md:mb-6 bg-white border-b w-full justify-start rounded-none h-auto p-0 overflow-x-auto flex-nowrap">
            {[
              { value: 'member-info', label: '會員資訊' },
              { value: 'machine-order', label: '機票訂單' },
              { value: 'accommodation-order', label: '住宿訂單' },
              { value: 'duty-free', label: '免稅商品訂單', active: true },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`rounded-none border-b-2 border-transparent 
                  data-[state=active]:border-transparent 
                  data-[state=active]:bg-[var(--df-accent-gold)] 
                  data-[state=active]:text-white 
                  px-3 md:px-6 py-3 text-sm md:text-base whitespace-nowrap
                  /* 修正：讓非 active 狀態的 hover 效果保持 */
                  data-[state=inactive]:hover:text-[var(--df-accent-gold)]`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* ... 後續的 TabsContent 保持不變 ... */}

          {/* ============================== */}
          {/* 🚀 Duty-Free 訂單分頁內容 */}
          {/* ============================== */}
          <TabsContent value="duty-free">
            {/* Desktop */}
            <div className="hidden md:block bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--df-primary-dark)] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">#</th>
                      <th className="px-6 py-4 text-left">訂單編號</th>
                      <th className="px-6 py-4 text-left">付款方式</th>
                      <th className="px-6 py-4 text-left">狀態</th>
                      <th className="px-6 py-4 text-left">日期</th>
                      <th className="px-6 py-4 text-left">金額</th>
                      <th className="px-6 py-4 text-left">訂單詳情</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.length > 0 ? (
                      orders.map((order, idx) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{idx + 1}</td>
                          <td className="px-6 py-4 font-medium">{order.id}</td>
                          <td className="px-6 py-4">{order.paymentMethod}</td>
                          <td className="px-6 py-4">
                            <DFStatusTag
                              status={order.status as any}
                              label={getStatusLabel(order.status)}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm">{order.date}</td>
                          <td className="px-6 py-4">
                            TWD {order.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="text-[var(--df-accent-gold)] hover:underline"
                              onClick={() => handleOrderClick(order)}
                            >
                              前往查看
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          尚無訂單紀錄
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">訂單編號</p>
                        <p className="font-medium">{order.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">付款方式</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">金額</span>
                        <span>TWD {order.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">狀態</span>
                        <DFStatusTag
                          status={order.status as any}
                          label={getStatusLabel(order.status)}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">日期</span>
                        <span>{order.date}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        className="text-[var(--df-accent-gold)] hover:underline"
                        onClick={() => handleOrderClick(order)}
                      >
                        前往查看
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">尚無訂單紀錄</p>
              )}
            </div>
          </TabsContent>

          {/* 其他分頁（暫放佔位） */}
          <TabsContent value="member-info">
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-500">會員資訊設定...</p>
            </div>
          </TabsContent>
          <TabsContent value="machine-order">
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-500">機票訂單...</p>
            </div>
          </TabsContent>
          <TabsContent value="accommodation-order">
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-500">住宿訂單...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
