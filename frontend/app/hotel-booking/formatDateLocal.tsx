'use client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import Calendar, { DateRange } from './components/Calendar';
import HotelCard from './components/HotelCard';
import SearchBar from './components/SearchBar';
import { HotelCardData } from './interfaces/HotelCardData';
import { calculateNights } from './utils/dateUtils';

const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Page() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = React.useState(false);

  const hotels: HotelCardData[] = [
    {
      id: 1,
      name: 'Toyoko Inn Narita Airport',
      location: 'Tokyo, Japan',
      distance: '距離機場約 0.1 公里',
      rating: 4.6,
      price: 3500,
      image: '/images/hotel/room1.jpeg',
      amenities: {
        wifi: true,
        parking: true,
        cafe: true,
        restaurant: true,
        frontDesk24h: true,
        luggageStorage: true,
      },
    },
    {
      id: 2,
      name: 'Hotel Nikko Narita',
      location: 'Tokyo, Japan',
      distance: '距離機場約 0.3公里',
      rating: 4.9,
      price: 5500,
      image: '/images/hotel/room2.jpeg',
      amenities: {
        wifi: true,
        parking: true,
        cafe: true,
        restaurant: true,
        frontDesk24h: true,
        luggageStorage: true,
        shuttleService: true,
      },
    },
    {
      id: 3,
      name: 'Hotel Mystays Premier Narita',
      location: 'Tokyo, Japan',
      distance: '第二航廈・機場內',
      rating: 4.7,
      price: 10000,
      image: '/images/hotel/room3.jpeg',
      amenities: {
        wifi: true,
        parking: true,
        cafe: true,
        restaurant: true,
        frontDesk24h: true,
        luggageStorage: true,
        shuttleService: true,
      },
    },
    {
      id: 4,
      name: 'Garden Hotel Narita',
      location: 'Tokyo, Japan',
      distance: '距離機場約 0.2公里',
      rating: 4.8,
      price: 1200,
      image: '/images/hotel/room4.jpeg',
      amenities: {
        wifi: true,
        parking: true,
        cafe: true,
        restaurant: true,
        frontDesk24h: true,
        luggageStorage: true,
        shuttleService: true,
      },
    },
    {
      id: 5,
      name: 'Narita Tobu Hotel Airport',
      location: 'Tokyo, Japan',
      distance: '第二航廈・機場內',
      rating: 4.8,
      price: 18000,
      image: '/images/hotel/room5.jpeg',
      amenities: {
        wifi: true,
        parking: true,
        cafe: true,
        restaurant: true,
        frontDesk24h: true,
        luggageStorage: true,
        shuttleService: true,
      },
    },
  ];

  const [selectedRange, setSelectedRange] = React.useState<
    DateRange | undefined
  >(undefined);
  const [guests, setGuests] = React.useState(2);
  const [rooms, setRooms] = React.useState(1);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const updateLocalStorage = (
    updates: Partial<{
      checkin: string;
      checkout: string;
      guests: number;
      rooms: number;
    }>
  ) => {
    if (typeof window === 'undefined') return;
    const existing = JSON.parse(localStorage.getItem('booking_search') || '{}');
    localStorage.setItem(
      'booking_search',
      JSON.stringify({ ...existing, ...updates })
    );
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from && range?.to) {
      updateLocalStorage({
        checkin: formatDateLocal(range.from),
        checkout: formatDateLocal(range.to),
        guests,
        rooms,
      });
    }
  };

  const handleGuestsChange = (newGuests: number) => {
    setGuests(newGuests);
    updateLocalStorage({ guests: newGuests });
  };

  const handleRoomsChange = (newRooms: number) => {
    setRooms(newRooms);
    updateLocalStorage({ rooms: newRooms });
  };

  const handleCardClick = (hotel: HotelCardData) => {
    localStorage.setItem('scrollToHotelId', hotel.id.toString());
    router.push('/hotel-booking/search');
  };

  const getNights = () => {
    if (!selectedRange?.from || !selectedRange?.to) return 1;
    return calculateNights(selectedRange.from, selectedRange.to);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[url('/images/hotel/bg1.jpeg')] bg-cover bg-center sm:bg-top bg-no-repeat bg-black/70 bg-blend-darken pb-10">
        <div className="text-white py-12 px-4 flex items-center justify-center">
          <div className="animate-pulse">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/hotel/bg1.jpeg')] bg-cover bg-center sm:bg-top bg-no-repeat bg-black/70 bg-blend-darken pb-10">
      <SearchBar
        selectedRange={selectedRange}
        onDateChange={handleDateChange}
        guests={guests}
        onGuestsChange={handleGuestsChange}
        rooms={rooms}
        onRoomsChange={handleRoomsChange}
      />

      <div className="flex justify-center px-4 mb-10">
        <div className="w-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <Calendar selected={selectedRange} onSelect={handleDateChange} />
        </div>
      </div>

      {/* ⭐ 優化白色容器自適應 + 卡片間距 */}
      <div className="bg-white/90 py-7 rounded-lg shadow-md mx-auto px-5 max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
          TOP 5 附近優質飯店
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => handleCardClick(hotel)}
            >
              <HotelCard
                hotel={{ ...hotel, price: hotel.price * getNights() }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
