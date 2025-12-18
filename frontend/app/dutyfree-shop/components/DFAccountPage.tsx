import { X } from 'lucide-react';
import { DFStatusTag } from '../components/DFStatusTag';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import type { Order } from '../utils/storage';

interface DFAccountPageProps {
  orders: Order[];
  deleteOrderId: string | null;
  onNavigateHome: () => void;
  onOrderClick: (order: Order) => void;
  onSetDeleteOrderId: (id: string | null) => void;
  onRemoveOrder: (id: string) => void;
}

export function DFAccountPage({
  orders,
  deleteOrderId,
  onNavigateHome,
  onOrderClick,
  onSetDeleteOrderId,
  onRemoveOrder,
}: DFAccountPageProps) {
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
            onClick={onNavigateHome}
            className="hover:text-[var(--df-accent-gold)]"
          >
            首頁
          </button>
          {' > '}
          <span>會員中心</span>
        </div>

        <Tabs defaultValue="duty-free" className="w-full">
          <TabsList className="mb-4 md:mb-6 bg-white border-b w-full justify-start rounded-none h-auto p-0 overflow-x-auto flex-nowrap">
            <TabsTrigger
              value="member-info"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--df-accent-gold)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              會員資訊
            </TabsTrigger>
            <TabsTrigger
              value="machine-order"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--df-accent-gold)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              機票訂單
            </TabsTrigger>
            <TabsTrigger
              value="accommodation-order"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--df-accent-gold)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              住宿訂單
            </TabsTrigger>
            <TabsTrigger
              value="duty-free"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--df-accent-gold)] data-[state=active]:bg-[var(--df-accent-gold)] data-[state=active]:text-white px-3 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              免稅商品訂單
            </TabsTrigger>
          </TabsList>

          <TabsContent value="duty-free">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--df-primary-dark)] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">ID</th>
                      <th className="px-6 py-4 text-left">訂購號碼</th>
                      <th className="px-6 py-4 text-left">商品</th>
                      <th className="px-6 py-4 text-left">付款方式</th>
                      <th className="px-6 py-4 text-left">狀態</th>
                      <th className="px-6 py-4 text-left">成立日期</th>
                      <th className="px-6 py-4 text-left">刪除</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => onOrderClick(order)}
                      >
                        <td className="px-6 py-4">{idx + 1}</td>
                        <td className="px-6 py-4">{order.id}</td>
                        <td className="px-6 py-4">
                          Chanel N°5系列 經典香水-50mL
                        </td>
                        <td className="px-6 py-4">{order.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <DFStatusTag
                            status={order.status as any}
                            label={getStatusLabel(order.status)}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">{order.date}</td>
                        <td className="px-6 py-4">
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetDeleteOrderId(order.id);
                            }}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onOrderClick(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-500">訂購號碼</p>
                      <p className="font-medium">{order.id}</p>
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetDeleteOrderId(order.id);
                      }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">商品</span>
                      <span className="text-right">
                        Chanel N°5系列 經典香水-50mL
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">付款方式</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">狀態</span>
                      <DFStatusTag
                        status={order.status as any}
                        label={getStatusLabel(order.status)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">成立日期</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

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

      {/* Delete Order Confirmation Dialog */}
      <AlertDialog
        open={deleteOrderId !== null}
        onOpenChange={(open) => !open && onSetDeleteOrderId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除訂單</AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除此訂單嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onSetDeleteOrderId(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrderId && onRemoveOrder(deleteOrderId)}
              className="bg-[var(--df-state-error)] hover:bg-[var(--df-state-error)]/90"
            >
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
