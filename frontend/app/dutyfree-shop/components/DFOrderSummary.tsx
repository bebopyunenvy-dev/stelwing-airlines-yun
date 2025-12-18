import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface DFOrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  promoCode?: string;
  sticky?: boolean;
}

export function DFOrderSummary({
  items,
  subtotal,
  discount = 0,
  promoCode,
  sticky = false,
}: DFOrderSummaryProps) {
  const total = subtotal - discount;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${sticky ? 'sticky top-24' : ''}`}
    >
      <h2 className="text-xl font-semibold mb-4">訂購摘要</h2>
      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
            <div className="text-sm font-medium whitespace-nowrap">
              ${(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">小計</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--df-state-success)]">
              優惠券{promoCode ? `（${promoCode.toUpperCase()}）` : ''}
            </span>
            <span className="text-[var(--df-state-success)]">
              -${discount.toLocaleString()} (折扣)
            </span>
          </div>
        )}

        <div className="flex justify-between border-t pt-3">
          <span className="font-semibold">總計</span>
          <span
            className="font-semibold"
            style={{
              fontSize: '1.75rem',
              lineHeight: '2.25rem',
              color: 'var(--df-text-dark)',
            }}
          >
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
