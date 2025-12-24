'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react';
import { DateRange } from '../components/Calendar';
import FilterSidebar from '../components/FilterSidebar';
import HotelResultCard from '../components/HotelResultCard';
import SearchBar from '../components/SearchBar';
import { AmenityKey, MAX_PRICE, MIN_PRICE } from '../interfaces/constants';
import { allMockHotels } from '../interfaces/mockHotels';

const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [priceMin, setPriceMin] = useState(MIN_PRICE);
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityKey[]>([]);
  const [bookingHotelId, setBookingHotelId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    undefined
  );
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const hotelRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [highlightedHotelId, setHighlightedHotelId] = useState<number | null>(
    null
  );

  const getDefaultDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    return { from: today, to: threeDaysLater };
  };

  // 載入 localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('booking_search');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.checkin && parsed.checkout) {
          const checkinDate = new Date(parsed.checkin);
          const checkoutDate = new Date(parsed.checkout);
          if (!isNaN(checkinDate.getTime()) && !isNaN(checkoutDate.getTime())) {
            setSelectedRange({ from: checkinDate, to: checkoutDate });
          } else {
            const defaultDates = getDefaultDates();
            setSelectedRange(defaultDates);
            updateLocalStorage({
              checkin: formatDateLocal(defaultDates.from),
              checkout: formatDateLocal(defaultDates.to),
              guests: parsed.guests || 2,
              rooms: parsed.rooms || 1,
            });
          }
        } else {
          const defaultDates = getDefaultDates();
          setSelectedRange(defaultDates);
          updateLocalStorage({
            checkin: formatDateLocal(defaultDates.from),
            checkout: formatDateLocal(defaultDates.to),
            guests: parsed.guests || 2,
            rooms: parsed.rooms || 1,
          });
        }
        if (parsed.guests && parsed.guests > 0) setGuests(parsed.guests);
        if (parsed.rooms && parsed.rooms > 0) setRooms(parsed.rooms);
      } catch {
        const defaultDates = getDefaultDates();
        setSelectedRange(defaultDates);
        setGuests(2);
        setRooms(1);
        updateLocalStorage({
          checkin: formatDateLocal(defaultDates.from),
          checkout: formatDateLocal(defaultDates.to),
          guests: 2,
          rooms: 1,
        });
      }
    } else {
      const defaultDates = getDefaultDates();
      setSelectedRange(defaultDates);
      setGuests(2);
      setRooms(1);
      updateLocalStorage({
        checkin: formatDateLocal(defaultDates.from),
        checkout: formatDateLocal(defaultDates.to),
        guests: 2,
        rooms: 1,
      });
    }

    setIsLoaded(true);
  }, []);

  // 初始化高亮
  useEffect(() => {
    const initialId =
      parseInt(searchParams.get('scrollToHotelId') || '') ||
      parseInt(localStorage.getItem('scrollToHotelId') || '');
    if (!isNaN(initialId)) setHighlightedHotelId(initialId);
  }, [searchParams]);

  const clearAllFilters = useCallback(() => {
    setPriceMin(MIN_PRICE);
    setPriceMax(MAX_PRICE);
    setSelectedRatings([]);
    setSelectedAmenities([]);
  }, []);

  const filteredHotels = useMemo(() => {
    const min = Math.min(priceMin, priceMax);
    const max = Math.max(priceMin, priceMax);
    return allMockHotels.filter((hotel) => {
      if (hotel.price < min || hotel.price > max) return false;
      if (
        selectedRatings.length > 0 &&
        !selectedRatings.some((r) => hotel.rating >= r)
      )
        return false;
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((a) => hotel.amenities.includes(a))
      )
        return false;
      return true;
    });
  }, [priceMin, priceMax, selectedRatings, selectedAmenities]);

  const updateLocalStorage = (
    updates: Partial<{
      checkin: string;
      checkout: string;
      guests: number;
      rooms: number;
    }>
  ) => {
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

  // 高亮 scroll
  useEffect(() => {
    if (highlightedHotelId !== null) {
      const el = hotelRefs.current[highlightedHotelId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedHotelId]);

  const goToDetail = async (hotelId: number) => {
    setHighlightedHotelId(hotelId);
    setBookingHotelId(hotelId);
    localStorage.setItem('booking_selectedHotelId', hotelId.toString());

    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push(`/hotel-booking/${hotelId}?${searchParams.toString()}`);
    setBookingHotelId(null);
  };

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/hotel/bg1.jpeg')" }}
      >
        <div className="flex flex-col w-full h-full bg-black/70 min-h-screen p-4 md:p-8 items-center justify-center">
          <div className="text-white animate-pulse">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-x-hidden"
      style={{ backgroundImage: "url('/images/hotel/bg1.jpeg')" }}
    >
      <div className="flex flex-col w-full h-full bg-black/70 min-h-screen p-4 md:p-8">
        <SearchBar
          selectedRange={selectedRange}
          onDateChange={handleDateChange}
          guests={guests}
          onGuestsChange={handleGuestsChange}
          rooms={rooms}
          onRoomsChange={handleRoomsChange}
        />

        <div className="flex-1 flex flex-col md:flex-row w-full max-w-6xl mx-auto mt-4 md:mt-6">
          {/* 側邊欄：手機滿版，桌機固定寬 */}
          <div className="w-full md:w-72 flex-shrink-0 h-full px-0 md:px-0">
            <FilterSidebar
              isMobileOpen={showFilter}
              onClose={() => setShowFilter(false)}
              priceMin={priceMin}
              onPriceMinChange={setPriceMin}
              priceMax={priceMax}
              onPriceMaxChange={setPriceMax}
              selectedRatings={selectedRatings}
              onSelectedRatingsChange={setSelectedRatings}
              selectedAmenities={selectedAmenities}
              onSelectedAmenitiesChange={setSelectedAmenities}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* 飯店列表：保持 padding，不要左右捲動 */}
          <main className="flex-1 overflow-y-auto space-y-6 px-4 md:px-8 flex flex-col">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12 text-gray-300">
                <p className="text-lg mb-4">沒有符合條件的飯店</p>
                <button
                  onClick={clearAllFilters}
                  className="text-[#DCBB87] underline"
                >
                  清除篩選條件
                </button>
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  ref={(el) => {
                    hotelRefs.current[hotel.id] = el;
                  }}
                  className={`w-full transition-all duration-300 cursor-pointer ${
                    highlightedHotelId === hotel.id
                      ? 'border-4 border-[#DCBB87] rounded-lg'
                      : ''
                  }`}
                  onClick={() => setHighlightedHotelId(hotel.id)}
                >
                  <HotelResultCard
                    hotel={hotel}
                    onBookClick={() => goToDetail(hotel.id)}
                    isBooking={bookingHotelId === hotel.id}
                  />
                </div>
              ))
            )}
          </main>
        </div>
        <div className="text-start mt-4">
          <button
            onClick={() => router.back()}
            className="border-2 border-[#DCBB87] hover:bg-[#DCBB87] text-white font-semibold px-8 py-1 rounded-full transition-all hover:shadow-lg active:scale-95"
          >
            上一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
