import { Clock, MapPin, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface DFPickupModalProps {
  open: boolean;
  onClose: () => void;
}

export function DFPickupModal({ open, onClose }: DFPickupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">免稅品取貨資訊</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Airport Info */}
          <div className="flex items-start gap-4 p-4 bg-[var(--df-surface-alt)] rounded-lg">
            <div className="w-12 h-12 bg-[var(--df-primary-dark)] rounded-full flex items-center justify-center flex-shrink-0">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">桃園國際機場 第一航廈</h3>
              <p className="text-sm text-gray-600">
                Taiwan Taoyuan International Airport Terminal 1
              </p>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-[var(--df-accent-gold)] mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">取貨地點</h4>
              <p className="text-sm text-gray-600">
                出境大廳管制區內，免稅商店櫃檯
                <br />
                Duty Free Shop Counter, Departure Hall (After Security)
              </p>
            </div>
          </div>

          {/* Pickup Time */}
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-[var(--df-accent-gold)] mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">取貨時間</h4>
              <p className="text-sm text-gray-600">
                請於登機前 2 小時至免稅商店櫃檯取貨
                <br />
                Please collect your items at least 2 hours before departure
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-yellow-900">重要提醒</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>請攜帶訂單確認信及有效護照</li>
              <li>免稅品僅限出境旅客購買</li>
              <li>請確認您的航班資訊</li>
              <li>未取貨恕不退款</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              關閉
            </Button>
            <Button className="bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white">
              我已了解
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
