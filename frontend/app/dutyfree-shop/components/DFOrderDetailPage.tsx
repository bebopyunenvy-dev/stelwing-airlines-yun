import { DFPickupModal } from '../components/DFPickupModal';
import { DFStatusTag } from '../components/DFStatusTag';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import type { Order, OrderProduct } from '../utils/storage';

interface DFOrderDetailPageProps {
  order: Order;
  cart: OrderProduct[];
  pickupModalOpen: boolean;
  onNavigateHome: () => void;
  onNavigateAccount: () => void;
  onOpenPickupModal: () => void;
  onClosePickupModal: () => void;
}

export function DFOrderDetailPage({
  order,
  cart,
  pickupModalOpen,
  onNavigateHome,
  onNavigateAccount,
  onOpenPickupModal,
  onClosePickupModal,
}: DFOrderDetailPageProps) {
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
      case 'refunded':
        return '已退款';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 lg:px-16 max-w-5xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <button
            onClick={onNavigateHome}
            className="hover:text-[var(--df-accent-gold)]"
          >
            首頁
          </button>
          {' > '}
          <button
            onClick={onNavigateAccount}
            className="hover:text-[var(--df-accent-gold)]"
          >
            會員中心
          </button>
          {' > '}
          <span>訂單詳情</span>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-8 shadow-md">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4 mb-6 md:mb-8 pb-6 border-b">
            <div>
              <h1
                style={{
                  fontSize: '1.5rem',
                  lineHeight: '2rem',
                  fontWeight: '600',
                }}
                className="mb-2"
              >
                訂單詳情
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                訂單號碼：{order.id}
              </p>
            </div>
            <DFStatusTag
              status={order.status as any}
              label={getStatusLabel(order.status)}
            />
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <h3 className="font-semibold mb-4">訂單資訊</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">訂單日期：</span>
                  <span>{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">付款方式：</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">訂單總額：</span>
                  <span className="font-semibold">
                    TWD {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">取貨資訊</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">取貨地點：</span>
                  <span>桃園國際機場 第一航廈</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">取貨方式：</span>
                  <span>機場免稅店櫃檯</span>
                </div>
                <Button
                  onClick={onOpenPickupModal}
                  variant="link"
                  className="p-0 h-auto text-[var(--df-accent-gold)]"
                >
                  查看取貨詳情
                </Button>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-4">訂購商品</h3>
            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[var(--df-surface-alt)]">
                  <tr>
                    <th className="px-4 py-3 text-left">商品</th>
                    <th className="px-4 py-3 text-center">數量</th>
                    <th className="px-4 py-3 text-right">單價</th>
                    <th className="px-4 py-3 text-right">小計</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cart.slice(0, order.items).map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">{item.quantity}</td>
                      <td className="px-4 py-4 text-right">
                        TWD {item.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        TWD {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {cart.slice(0, order.items).map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">數量：</span>
                      <span>{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">單價：</span>
                      <span>TWD {item.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>小計：</span>
                      <span>
                        TWD {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="mt-6 flex justify-end">
            <div className="w-full md:max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">小計：</span>
                <span>
                  TWD{' '}
                  {cart
                    .slice(0, order.items)
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span className="text-gray-600">
                    折扣
                    {order.promoCode
                      ? `（${order.promoCode.toUpperCase()}）`
                      : ''}
                    ：
                  </span>
                  <span>-TWD {Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">總計：</span>
                <span
                  className="font-semibold text-[var(--df-accent-gold)]"
                  style={{ fontSize: '1.25rem' }}
                >
                  TWD {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t flex flex-col md:flex-row gap-4 md:justify-end">
            <Button
              variant="outline"
              onClick={onNavigateAccount}
              className="w-full md:w-auto"
            >
              返回訂單列表
            </Button>
            {order.status === 'success' && (
              <Button
                className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white w-full md:w-auto"
                onClick={onOpenPickupModal}
              >
                查看取貨資訊
              </Button>
            )}
          </div>
        </div>
      </div>

      <DFPickupModal open={pickupModalOpen} onClose={onClosePickupModal} />
    </div>
  );
}
