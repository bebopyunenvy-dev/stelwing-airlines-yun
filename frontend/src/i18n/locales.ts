export type Locale = 'zh-TW' | 'en';

export const messages: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    // Hero (首頁大標)
    'hero.home.title': '航向展翼',
    'hero.home.subtitle':
      'Stelwing Airlines 提供一站式航空與旅遊服務，讓您的每一趟旅程都舒適、便捷、難忘。',

    // Header Nav
    'nav.flight': '訂購機票',
    'nav.hotel': '住宿預定',
    'nav.dutyfree': '免稅商品',
    'nav.itinerary': '旅程規劃',
    'nav.share': '旅遊分享',
    'nav.faq': '常見問題',

    // Hero 舊版（如果別處有用到可以保留）
    'hero.title': 'Welcome to Stelwing',
    'hero.subtitle':
      'Stelwing Airlines 提供一站式航空與旅遊服務，讓您的每一趟旅程都舒適、便捷、難忘。',

    // 搜尋卡 / Flight search
    'search.roundtrip': '來回',
    'search.oneway': '單程',

    'search.origin.label': '起點',
    'search.origin.placeholder': '搜尋城市 / 機場 / IATA',

    'search.destination.label': '到達',
    'search.destination.placeholder': '搜尋城市 / 機場 / IATA',

    'search.date.label': '日期',
    'search.date.depart': '出發',
    'search.date.return': '回程',

    'search.passenger': '乘客',
    'search.cabin': '艙等',

    'search.submit': '訂購機票',
    'search.swap': '交換出發與到達',

    // Airport picker modal
    'search.airport.title': '選擇機場',
    'search.airport.originTitle': '選擇起點',
    'search.airport.destTitle': '選擇到達',
    'search.airport.placeholder':
      '輸入城市、機場或 IATA 代碼，例如：TPE、Tokyo、NRT',
    'search.airport.loading': '載入中…',
    'search.airport.empty': '目前沒有可選擇的機場',
    'search.airport.cancel': '取消',

    // 首頁：住宿預訂
    'home.hotels.title': '住宿預訂',
    'home.hotels.subtitle':
      '精選全球飯店與特色住宿，一站式完成查詢、比價與預訂，讓每一段旅程都住得舒適又安心。',

    'hotel.name.a': '成田日航酒店',
    'hotel.name.b': '東京成田機場旅館',
    'hotel.name.c': '成田東武酒店',
    'hotel.name.d': '普雷米爾飯店',
    'hotel.name.e': 'Grand Hotel Narita',

    // 首頁：免稅商品
    'home.dutyfree.title': '免稅商品',
    'home.dutyfree.subtitle':
      '起飛前先選好心儀的美妝、精品與旅遊小物，線上預購機上或機場取貨，讓購物更省時、行李更輕盈。',

    // 首頁：旅遊文章輪播
    'home.travelstories.tag': 'TRAVEL STORIES',
    'home.travelstories.read': '前往文章',
    'home.travelstories.prev': '上一篇旅遊文章',
    'home.travelstories.next': '下一篇旅遊文章',
    'home.travelstories.play': '播放輪播',
    'home.travelstories.pause': '暫停輪播',

    // Footer
    'footer.desc':
      'Stelwing Airlines 提供一站式航空與旅遊服務，讓您的每一趟旅程都舒適、便捷、難忘。',
    'footer.services': '服務項目',
    'footer.contact': '聯絡資訊',
    'footer.service.flight': '訂購機票',
    'footer.service.hotel': '住宿預定',
    'footer.service.dutyfree': '免稅商品',
    'footer.service.plan': '旅程規劃',
    'footer.service.community': '旅遊分享',
    'footer.contact.address': '地址：台北市信義區松高路 88 號 10 樓',
    'footer.contact.phone': '電話：02-1234-5678',
    'footer.contact.hours': '服務時間：週一至週五 09:00 - 18:00',
    'footer.copyright': '© 2025 Stelwing Airlines. All rights reserved.',

    'cabin.economy': '經濟艙',
    'cabin.business': '商務艙',

    'auth.login': '登入',
  },

  en: {
    // Hero (首頁大標)
    'hero.home.title': 'Take Off with Stelwing',
    'hero.home.subtitle':
      'Stelwing Airlines brings one-stop air and travel services to make every journey comfortable, seamless, and unforgettable.',

    // Header Nav
    'nav.flight': 'Flights',
    'nav.hotel': 'Hotels',
    'nav.dutyfree': 'Duty-free',
    'nav.itinerary': 'Trip planner',
    'nav.share': 'Travel stories',
    'nav.faq': 'FAQ',

    // Hero 舊版（如果別處有用）
    'hero.title': 'Welcome to Stelwing',
    'hero.subtitle':
      'Stelwing Airlines provides one-stop air and travel services to make every journey comfortable and unforgettable.',

    // Flight search / hero
    'search.roundtrip': 'Round trip',
    'search.oneway': 'One way',

    'search.origin.label': 'From',
    'search.origin.placeholder': 'Search city / airport / IATA',

    'search.destination.label': 'To',
    'search.destination.placeholder': 'Search city / airport / IATA',

    'search.date.label': 'Date',
    'search.date.depart': 'Departure',
    'search.date.return': 'Return',

    'search.passenger': 'Passengers',
    'search.cabin': 'Cabin class',

    'search.submit': 'Search flights',
    'search.swap': 'Swap origin and destination',

    // Airport picker modal
    'search.airport.title': 'Select airport',
    'search.airport.originTitle': 'Select origin',
    'search.airport.destTitle': 'Select destination',
    'search.airport.placeholder':
      'Type a city, airport, or IATA code, e.g. TPE, Tokyo, NRT',
    'search.airport.loading': 'Loading airports…',
    'search.airport.empty': 'No airports available.',
    'search.airport.cancel': 'Cancel',

    // Home: hotels
    'home.hotels.title': 'Hotel Booking',
    'home.hotels.subtitle':
      'Browse curated hotels and unique stays worldwide. Compare, book, and manage your stays in one place for a comfortable journey.',

    'hotel.name.a': 'Narita Nikko Hotel',
    'hotel.name.b': 'Narita Airport Hotel Tokyo',
    'hotel.name.c': 'Tobu Hotel Narita',
    'hotel.name.d': 'Premier Hotel',
    'hotel.name.e': 'Grand Hotel Narita',

    // Home: duty-free
    'home.dutyfree.title': 'Duty-Free Shopping',
    'home.dutyfree.subtitle':
      'Pre-order beauty, fashion, and travel essentials before departure. Pick up on board or at the airport and keep your luggage light.',

    // Home: travel stories
    'home.travelstories.tag': 'TRAVEL STORIES',
    'home.travelstories.read': 'Read article',
    'home.travelstories.prev': 'Previous travel story',
    'home.travelstories.next': 'Next travel story',
    'home.travelstories.play': 'Play slideshow',
    'home.travelstories.pause': 'Pause slideshow',

    // Footer
    'footer.desc':
      'Stelwing Airlines provides one-stop air and travel services to make every journey comfortable and unforgettable.',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.service.flight': 'Book flights',
    'footer.service.hotel': 'Hotel booking',
    'footer.service.dutyfree': 'Duty-free shop',
    'footer.service.plan': 'Trip planner',
    'footer.service.community': 'Travel stories',
    'footer.contact.address':
      'Address: 10F, No. 88, Songgao Rd, Xinyi Dist, Taipei',
    'footer.contact.phone': 'Phone: 02-1234-5678',
    'footer.contact.hours': 'Hours: Mon–Fri 09:00–18:00',
    'footer.copyright': '© 2025 Stelwing Airlines. All rights reserved.',

    'cabin.economy': 'Economy',
    'cabin.business': 'Business',

    'auth.login': 'Login',
  },
};
