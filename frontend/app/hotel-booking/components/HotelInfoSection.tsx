import { HotelDetailData } from '../interfaces/HotelDetailData';

export default function HotelInfoSection({
  hotel,
}: {
  hotel: HotelDetailData;
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-[#303D49]">{hotel.name}</h1>
      <p className="text-gray-500 italic">{hotel.engName}</p>

      <div className="flex items-center gap-2 mt-2 text-[#DCBB87]">
        {'⭐'.repeat(Math.round(hotel.rating))}
        <span className="text-gray-700 ml-2">
          {hotel.rating.toFixed(1)} · {hotel.reviewCount} 則評論
        </span>
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">{hotel.description}</p>

      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>📍 地址：{hotel.address}</p>
        <p>☎️ 聯絡電話：{hotel.contact}</p>
        <p>✉️ 電子郵件：{hotel.email}</p>
      </div>
    </section>
  );
}
