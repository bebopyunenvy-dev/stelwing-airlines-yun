import { Plane, Calendar, Clock, MapPin, Luggage, Utensils } from "lucide-react"

interface FlightInfo {
  flightNo: string;
  date: string;
  departure: {
    airport: string;
    time: string;
    terminal: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal: string;
  };
  seat: string;
  baggage: string;
  meal: string;
}

interface BoardingPassProps {
  flight: FlightInfo;
  title: string;
}

export default function BoardingPass({ flight, title }: BoardingPassProps) {
  return (
    <div className="bg-white border-2 border-[#DCBB87] rounded-lg overflow-hidden">
      <div className="bg-[#DCBB87] px-6 py-3">
        <h3 className="text-[#1F2E3C] font-medium">{title}</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-[#666666] mb-1">出發</div>
            <div className="text-2xl text-[#1F2E3C] mb-1">{flight.departure.airport}</div>
            <div className="text-sm text-[#666666]">{flight.departure.terminal}</div>
          </div>
          <div className="px-8">
            <Plane size={32} className="text-[#DCBB87]" />
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm text-[#666666] mb-1">抵達</div>
            <div className="text-2xl text-[#1F2E3C] mb-1">{flight.arrival.airport}</div>
            <div className="text-sm text-[#666666]">{flight.arrival.terminal}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E5]">
          <div className="flex items-start gap-2">
            <Calendar className="text-[#DCBB87] mt-1" size={18} />
            <div>
              <div className="text-sm text-[#666666]">日期</div>
              <div className="text-[#1F2E3C]">{flight.date}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="text-[#DCBB87] mt-1" size={18} />
            <div>
              <div className="text-sm text-[#666666]">起飛時間</div>
              <div className="text-[#1F2E3C]">{flight.departure.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="text-[#DCBB87] mt-1" size={18} />
            <div>
              <div className="text-sm text-[#666666]">座位</div>
              <div className="text-[#1F2E3C]">{flight.seat}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Plane className="text-[#DCBB87] mt-1" size={18} />
            <div>
              <div className="text-sm text-[#666666]">航班編號</div>
              <div className="text-[#1F2E3C]">{flight.flightNo}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Luggage className="text-[#DCBB87] mt-1" size={18} />
            <div>
              <div className="text-sm text-[#666666]">托運行李</div>
              <div className="text-[#1F2E3C]">{flight.baggage}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Utensils className="text-[#DCBB87] mt-1" size={18} />
            <div>
              <div className="text-sm text-[#666666]">餐食</div>
              <div className="text-[#1F2E3C]">{flight.meal}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
