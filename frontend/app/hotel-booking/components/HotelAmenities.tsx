import {
  Bell,
  Briefcase,
  BusFront,
  Car,
  Coffee,
  Utensils,
  Wifi,
} from 'lucide-react';
import { AmenityKey } from '../interfaces/constants';

interface Props {
  amenityKeys: AmenityKey[];
}

const amenityIcons: Record<AmenityKey, { label: string; icon: any }> = {
  wifi: { label: 'Wi-Fi', icon: Wifi },
  parking: { label: '停車場', icon: Car },
  cafe: { label: '咖啡廳', icon: Coffee },
  restaurant: { label: '餐廳', icon: Utensils },
  frontDesk24h: { label: '24小時櫃檯', icon: Bell },
  luggageStorage: { label: '行李寄存', icon: Briefcase },
  shuttleService: { label: '接駁車', icon: BusFront },
};

export default function HotelAmenities({ amenityKeys }: Props) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">設施與服務</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {amenityKeys.map((key) => {
          const Icon = amenityIcons[key]?.icon;
          const label = amenityIcons[key]?.label;
          return (
            <div key={key} className="flex items-center gap-2 text-gray-700">
              {Icon && <Icon size={18} className="text-[#DCBB87]" />}
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
