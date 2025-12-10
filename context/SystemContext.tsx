
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, MenuItem, OrderStatus, AppMode, Booking, Room, BookingStatus, GuestProfile, MaintenanceTicket, MessageThread, Activity, Promotion, Language, OrderItem, GuestRequest, RequestStatus, RequestType } from '../types';
import { ASSETS } from '../assets';

interface HotelConfig {
  name: string;
  currency: string;
  taxRate: number;
  email: string;
}

interface SystemContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  // Configuration
  deviceRoomNumber: string; 
  setDeviceRoomNumber: (room: string) => void;
  hotelConfig: HotelConfig;
  updateHotelConfig: (config: Partial<HotelConfig>) => void;
  
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Order Management
  orders: Order[];
  addOrder: (items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Menu Management
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  // Hotel Management
  bookings: Booking[];
  rooms: Room[];
  addRoom: (room: Room) => void; 
  updateRoomStatus: (roomNumber: string, status: import('../types').RoomStatus) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  createBooking: (guest: GuestProfile, roomNumber: string, checkIn: string, checkOut: string, amount: number, doorCode?: string) => boolean;
  checkAvailability: (roomNumber: string, checkIn: string, checkOut: string) => boolean;
  signContract: (bookingId: string) => void;
  verifyIdentity: (bookingId: string) => void;
  // Channel Manager
  isSyncing: boolean;
  lastSynced: Date;
  syncChannels: () => Promise<void>;
  // PMS Features
  tickets: MaintenanceTicket[];
  addTicket: (ticket: MaintenanceTicket) => void;
  updateTicketStatus: (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => void;
  threads: MessageThread[];
  sendMessage: (threadId: string, text: string) => void;
  // Marketing & Explore
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  promotions: Promotion[];
  addPromotion: (promo: Promotion) => void;
  deletePromotion: (id: string) => void;
  togglePromotion: (id: string) => void;
  // NEW: Central Guest Requests
  guestRequests: GuestRequest[];
  addGuestRequest: (type: RequestType, title: string, details: string) => void;
  updateRequestStatus: (id: string, status: RequestStatus, notes?: string) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

// --- INITIAL DATA CONSTANTS ---
// ... (Keeping existing constants)
const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Breakfast
  {
    id: 'b1',
    category: 'Breakfast',
    title: 'The Nomad Morning',
    description: 'Two organic eggs any style, beef bacon, roasted mushrooms, hash browns, and sourdough toast.',
    price: '$28',
    image: ASSETS.DINING.BREAKFAST.NOMAD_MORNING,
    ingredients: ['Organic Eggs', 'Beef Bacon', 'Portobello Mushrooms', 'Russet Potatoes', 'Sourdough Bread', 'Farm Butter', 'Black Peppercorn'],
    available: true,
    customizationOptions: [{name: 'Scrambled'}, {name: 'Fried'}, {name: 'Poached'}, {name: 'Extra Toast', price: 5}]
  },
  {
    id: 'b2',
    category: 'Breakfast',
    title: 'Marrakech Sunrise',
    description: 'Assortment of Moroccan breads (Msemen, Baghrir), honey, Amlou, olive oil, and mint tea.',
    price: '$26',
    image: ASSETS.DINING.BREAKFAST.SUNRISE,
    isVegetarian: true,
    ingredients: ['Semolina Flour', 'Organic Honey', 'Argan Oil', 'Almonds', 'Extra Virgin Olive Oil', 'Fresh Mint', 'Gunpowder Green Tea'],
    available: true
  },
  {
    id: 'b3',
    category: 'Breakfast',
    title: 'Acai Wellness Bowl',
    description: 'Organic acai blend topped with homemade granola, dragon fruit, chia seeds, and coconut flakes.',
    price: '$22',
    image: ASSETS.DINING.BREAKFAST.ACAI,
    isVegetarian: true,
    ingredients: ['Organic Acai Pulp', 'Banana', 'Rolled Oats', 'Dragon Fruit', 'Chia Seeds', 'Coconut Flakes', 'Agave Syrup', 'Blueberries'],
    available: true,
    pairingId: 'b2',
    pairingReason: 'Pair with Moroccan Mint Tea for a refreshing finish.'
  },
  // Lunch
  {
    id: 'l1',
    category: 'Lunch',
    title: 'Wagyu Beef Burger',
    description: 'Brioche bun, truffle mayo, aged cheddar, caramelized onions, served with hand-cut fries.',
    price: '$34',
    image: ASSETS.DINING.LUNCH.BURGER,
    ingredients: ['Wagyu Beef Patty', 'Brioche Bun', 'Black Truffle', 'Egg Yolk', 'Aged Cheddar', 'Yellow Onions', 'Maris Piper Potatoes'],
    available: true,
    pairingId: 'o3', 
    pairingReason: 'Double down on luxury with extra Truffle Fries.',
    customizationOptions: [{name: 'Medium Rare'}, {name: 'Medium'}, {name: 'Well Done'}, {name: 'No Onions'}]
  },
  {
    id: 'l2',
    category: 'Lunch',
    title: 'Atlas Caesar Salad',
    description: 'Crisp romaine, parmesan crisps, anchovy dressing, and grilled lemon chicken breast.',
    price: '$24',
    image: ASSETS.DINING.LUNCH.SALAD,
    ingredients: ['Romaine Hearts', 'Parmesan Reggiano', 'Anchovy Fillets', 'Garlic', 'Lemon Juice', 'Free-range Chicken Breast', 'Sourdough Croutons'],
    available: true
  },
  {
    id: 'l3',
    category: 'Lunch',
    title: 'Lobster Roll',
    description: 'Poached Atlantic lobster, celery, chives, and lemon aioli on a buttered brioche roll.',
    price: '$38',
    image: ASSETS.DINING.LUNCH.LOBSTER,
    ingredients: ['Atlantic Lobster Tail', 'Celery Stalk', 'Chives', 'Lemon Zest', 'Homemade Mayonnaise', 'Clarified Butter', 'Brioche Roll'],
    available: true
  },
  // Dinner
  {
    id: 'd1',
    category: 'Dinner',
    title: 'Royal Lamb Tagine',
    description: 'Slow-cooked lamb shank with prunes, toasted almonds, sesame seeds, and saffron sauce.',
    price: '$42',
    image: ASSETS.DINING.DINNER.TAGINE,
    ingredients: ['Lamb Shank', 'Dried Prunes', 'Roasted Almonds', 'White Sesame Seeds', 'Saffron Threads', 'Red Onion', 'Ginger', 'Cinnamon Stick'],
    available: true,
    pairingId: 'b2',
    pairingReason: 'Best enjoyed with traditional Moroccan breads to soak up the sauce.'
  },
  {
    id: 'd2',
    category: 'Dinner',
    title: 'Saffron Risotto',
    description: 'Carnaroli rice, saffron pistils, 24-month aged parmesan, and gold leaf.',
    price: '$36',
    image: ASSETS.DINING.DINNER.RISOTTO,
    isVegetarian: true,
    ingredients: ['Carnaroli Rice', 'Saffron Pistils', 'Parmesan Cheese', 'Unsalted Butter', 'White Wine', 'Edible Gold Leaf', 'Vegetable Broth'],
    available: true
  },
  {
    id: 'd3',
    category: 'Dinner',
    title: 'Pan-Seared Sea Bass',
    description: 'Served with fennel purée, citrus reduction, and sautéed wild spinach.',
    price: '$38',
    image: ASSETS.DINING.DINNER.SEABASS,
    ingredients: ['Sea Bass Fillet', 'Fennel Bulb', 'Orange Juice', 'Lemon Juice', 'Wild Spinach', 'Garlic', 'Olive Oil', 'Maldon Sea Salt'],
    available: true
  },
  // Other
  {
    id: 'o1',
    category: 'Other',
    title: 'Artisan Cheese Board',
    description: 'Selection of local and imported cheeses, fig jam, walnuts, and crackers.',
    price: '$28',
    image: ASSETS.DINING.SNACKS.CHEESE,
    isVegetarian: true,
    ingredients: ['Brie de Meaux', 'Roquefort', 'Local Goat Cheese', 'Fresh Figs', 'Walnuts', 'Wildflower Honey', 'Artisan Crackers', 'Grapes'],
    available: true
  },
  {
    id: 'o2',
    category: 'Other',
    title: 'Orange Blossom Tart',
    description: 'Almond cream, fresh orange zest, and caramelized pistachios on a sablé breton.',
    price: '$18',
    image: ASSETS.DINING.SNACKS.TART,
    isVegetarian: true,
    ingredients: ['Almond Flour', 'Heavy Cream', 'Organic Eggs', 'Cane Sugar', 'Orange Blossom Water', 'Pistachios', 'Butter'],
    available: true
  },
  {
    id: 'o3',
    category: 'Other',
    title: 'Truffle Fries',
    description: 'Hand-cut fries, parmesan, black truffle oil, and garlic aioli.',
    price: '$16',
    image: ASSETS.DINING.SNACKS.FRIES,
    isVegetarian: true,
    ingredients: ['Agria Potatoes', 'Black Truffle Oil', 'Parmesan Cheese', 'Parsley', 'Garlic', 'Egg Yolk', 'Lemon Juice'],
    available: true
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Caves of Hercules',
    subtitle: 'Mythical Sunset',
    category: 'Adventure',
    duration: '3 Hours',
    rating: 4.8,
    price: '$85',
    image: ASSETS.ACTIVITIES.CAVES,
    description: 'Explore the mythical limestone caves where Hercules allegedly rested. Witness the stunning "Map of Africa" opening to the Atlantic Ocean at sunset.',
    highlights: ['Private Transport', 'Guided History', 'Sunset Views', 'Tea Ceremony']
  },
  {
    id: '2',
    title: 'Cape Spartel Lighthouse',
    subtitle: 'Meeting of Oceans',
    category: 'Sightseeing',
    duration: '2 Hours',
    rating: 4.9,
    price: '$60',
    image: ASSETS.ACTIVITIES.SPARTEL,
    description: 'Stand at the edge of the world where the Mediterranean Sea meets the Atlantic Ocean. Enjoy panoramic views from the historic lighthouse built in 1864.',
    highlights: ['Ocean Convergence', 'Historic Lighthouse', 'Photo Opportunities', 'Coastal Drive']
  },
  {
    id: '3',
    title: 'Kasbah & Medina Walk',
    subtitle: 'Historical Medina',
    category: 'Culture',
    duration: '4 Hours',
    rating: 4.7,
    price: '$55',
    image: ASSETS.ACTIVITIES.MEDINA,
    description: 'Get lost in the labyrinth of Tangier’s old city. Visit the Kasbah museum, weave through narrow blue alleys, and discover hidden artisan workshops.',
    highlights: ['Kasbah Museum', 'Artisan Shops', 'Architectural Tour', 'Local Pastries']
  },
  {
    id: '4',
    title: 'Mint Tea at Café Hafa',
    subtitle: 'Legendary Views',
    category: 'Gastronomy',
    duration: '2 Hours',
    rating: 4.6,
    price: '$40',
    image: ASSETS.ACTIVITIES.HAFA,
    description: 'Experience the legendary Café Hafa, a terrace café overlooking the Strait of Gibraltar that has hosted writers and musicians since 1921.',
    highlights: ['Panoramic Views', 'Traditional Mint Tea', 'Historical Significance', 'Relaxed Atmosphere']
  },
  {
    id: '5',
    title: 'American Legation Museum',
    subtitle: 'Art & History',
    category: 'Culture',
    duration: '1.5 Hours',
    rating: 4.5,
    price: '$30',
    image: ASSETS.ACTIVITIES.MUSEUM,
    description: 'Visit the only US National Historic Landmark located in a foreign country. Discover the long history of friendship between Morocco and the United States.',
    highlights: ['Paul Bowles Wing', 'Historic Art', 'Architecture', 'Guided Tour']
  }
];

const INITIAL_PROMOTIONS: Promotion[] = [
    {
        id: 'p1',
        title: 'Sunset Jazz on the Roof',
        subtitle: 'Live Music Tonight',
        image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop',
        type: 'EVENT',
        active: true
    },
    {
        id: 'p2',
        title: 'Spa Happy Hour',
        subtitle: '20% Off Treatments 2pm-5pm',
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop',
        type: 'OFFER',
        active: true
    }
];

const MOCK_ROOMS: Room[] = [
  { id: 'apt_origins', number: '304', name: 'Nomada Origins', type: 'Signature Penthouse', description: 'Our flagship residence.', floor: 3, status: 'AVAILABLE' },
  { id: 'apt_oasis', number: '101', name: 'Urban Oasis', type: 'Junior Suite', floor: 1, status: 'OCCUPIED' },
  { id: 'apt_atlas', number: '102', name: 'Atlas View', type: 'Junior Suite', floor: 1, status: 'AVAILABLE' },
  { id: 'apt_blue', number: '201', name: 'The Blue Pearl', type: 'Executive Suite', floor: 2, status: 'DIRTY' },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-7829', guestId: 'G-101', roomNumber: '304',
    guest: { id: 'G-101', fullName: 'Isabella Rossellini', email: 'isa@example.com', passportNumber: 'A123', nationality: 'Italian', phone: '+3900', isReturning: true, address: 'Via Roma 1', city: 'Milan', country: 'Italy' },
    checkInDate: '2023-10-01', checkOutDate: '2023-10-05', status: 'CHECKED_OUT', totalAmount: 4500, channel: 'DIRECT', isContractSigned: true, isIdVerified: true, isDepositPaid: true, doorCode: '8821'
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-101', roomNumber: '304', guestName: 'Isabella Rossellini',
    items: [{ id: 'b1', category: 'Breakfast', title: 'The Nomad Morning', description: '', price: '$28', image: ASSETS.DINING.BREAKFAST.NOMAD_MORNING }],
    status: 'PENDING', timestamp: Date.now() - 1000 * 60 * 5, total: 28
  },
];

const MOCK_TICKETS: MaintenanceTicket[] = [
  { id: 'T-101', roomNumber: '201', issue: 'Leak', description: 'AC dripping.', priority: 'HIGH', status: 'OPEN', reportedAt: '10 mins ago' },
];

const MOCK_THREADS: MessageThread[] = [
  {
    id: 'TH-1', guestName: 'Thomas Anderson', roomNumber: '102', channel: 'AIRBNB', lastMessage: 'Extra pillow?', unreadCount: 1,
    messages: [{ id: 'm1', sender: 'HOST', text: 'Hello', timestamp: '10:00' }, { id: 'm2', sender: 'GUEST', text: 'Extra pillow?', timestamp: '10:05' }]
  }
];

const MOCK_REQUESTS: GuestRequest[] = [
    { id: 'req_1', guestName: 'Thomas Anderson', roomNumber: '102', type: 'TRANSPORT', title: 'Rent Range Rover', details: 'Full day rental, tomorrow 9am', status: 'PENDING', timestamp: Date.now() - 1000 * 60 * 30 },
    { id: 'req_2', guestName: 'Isabella Rossellini', roomNumber: '304', type: 'SPA_GYM', title: 'Hammam Booking', details: '2 Guests, 5pm Today', status: 'PROCESSING', timestamp: Date.now() - 1000 * 60 * 120 }
];

// --- HELPER FOR PERSISTENCE ---
// Using new keys (v2) to ensure fresh data load
function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return fallback;
  }
}

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(AppMode.GUEST);
  const [deviceRoomNumber, setDeviceRoomNumber] = useState('304'); 
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<Language>('EN');
  
  // Persistent State Initialization with V2 keys
  const [hotelConfig, setHotelConfig] = useState<HotelConfig>(() => loadState('nomada_v2_config', {
      name: 'Nomada Hotel & Suites', currency: '$', taxRate: 0.10, email: 'concierge@nomada.com'
  }));
  const [orders, setOrders] = useState<Order[]>(() => loadState('nomada_v2_orders', MOCK_ORDERS));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadState('nomada_v2_menu', INITIAL_MENU_ITEMS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('nomada_v2_bookings', MOCK_BOOKINGS));
  const [rooms, setRooms] = useState<Room[]>(() => loadState('nomada_v2_rooms', MOCK_ROOMS));
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => loadState('nomada_v2_tickets', MOCK_TICKETS));
  const [threads, setThreads] = useState<MessageThread[]>(() => loadState('nomada_v2_threads', MOCK_THREADS));
  const [activities, setActivities] = useState<Activity[]>(() => loadState('nomada_v2_activities', INITIAL_ACTIVITIES));
  const [promotions, setPromotions] = useState<Promotion[]>(() => loadState('nomada_v2_promotions', INITIAL_PROMOTIONS));
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>(() => loadState('nomada_v2_requests', MOCK_REQUESTS));

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => { localStorage.setItem('nomada_v2_config', JSON.stringify(hotelConfig)); }, [hotelConfig]);
  useEffect(() => { localStorage.setItem('nomada_v2_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('nomada_v2_menu', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('nomada_v2_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('nomada_v2_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('nomada_v2_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('nomada_v2_threads', JSON.stringify(threads)); }, [threads]);
  useEffect(() => { localStorage.setItem('nomada_v2_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('nomada_v2_promotions', JSON.stringify(promotions)); }, [promotions]);
  useEffect(() => { localStorage.setItem('nomada_v2_requests', JSON.stringify(guestRequests)); }, [guestRequests]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateHotelConfig = (config: Partial<HotelConfig>) => {
      setHotelConfig(prev => ({ ...prev, ...config }));
  };

  // --- REQUEST LOGIC ---
  const addGuestRequest = (type: RequestType, title: string, details: string) => {
      const activeBooking = bookings.find(b => b.roomNumber === deviceRoomNumber && b.status === 'CHECKED_IN');
      const guestName = activeBooking ? activeBooking.guest.fullName : `Guest (Room ${deviceRoomNumber})`;
      
      const newReq: GuestRequest = {
          id: `REQ-${Date.now()}`,
          guestName,
          roomNumber: deviceRoomNumber,
          type,
          title,
          details,
          status: 'PENDING',
          timestamp: Date.now()
      };
      setGuestRequests(prev => [newReq, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RequestStatus, notes?: string) => {
      setGuestRequests(prev => prev.map(req => req.id === id ? { ...req, status, notes: notes || req.notes } : req));
  };

  // --- ORDER LOGIC ---
  const addOrder = (items: OrderItem[]) => {
    const activeBooking = bookings.find(b => b.roomNumber === deviceRoomNumber && b.status === 'CHECKED_IN');
    const guestName = activeBooking ? activeBooking.guest.fullName : 'Guest';

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(), 
      roomNumber: deviceRoomNumber, 
      guestName: guestName,
      items,
      status: 'PENDING',
      timestamp: Date.now(),
      total: items.reduce((acc, item) => acc + parseFloat(item.price.replace('$', '') || '0'), 0),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status } : order));
  };

  // --- MENU MANAGEMENT LOGIC ---
  const addMenuItem = (item: MenuItem) => {
      setMenuItems(prev => [...prev, item]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
      setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteMenuItem = (id: string) => {
      setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // --- HOTEL MANAGEMENT LOGIC ---
  const addRoom = (room: Room) => {
     setRooms(prev => [...prev, room]);
  };

  const updateRoomStatus = (roomNumber: string, status: import('../types').RoomStatus) => {
      setRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, status } : r));
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      if (status === 'CHECKED_IN') updateRoomStatus(booking.roomNumber, 'OCCUPIED');
      else if (status === 'CHECKED_OUT') updateRoomStatus(booking.roomNumber, 'DIRTY');
    }
  };

  const checkAvailability = (roomNumber: string, checkIn: string, checkOut: string): boolean => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const conflict = bookings.find(b => {
       if (b.roomNumber !== roomNumber || b.status === 'CANCELLED' || b.status === 'CHECKED_OUT') return false;
       const bStart = new Date(b.checkInDate).getTime();
       const bEnd = new Date(b.checkOutDate).getTime();
       return (start < bEnd && end > bStart);
    });
    return !conflict;
  };

  const createBooking = (guest: GuestProfile, roomNumber: string, checkIn: string, checkOut: string, amount: number, doorCode?: string): boolean => {
    if (!checkAvailability(roomNumber, checkIn, checkOut)) return false;
    const newBooking: Booking = {
      id: `BK-${Math.floor(Math.random() * 10000)}`,
      guestId: guest.id, guest, roomNumber, checkInDate: checkIn, checkOutDate: checkOut, status: 'CONFIRMED', totalAmount: amount, channel: 'DIRECT',
      isContractSigned: false, isIdVerified: false, isDepositPaid: false, eta: 'Now',
      doorCode: doorCode
    };
    setBookings(prev => [newBooking, ...prev]);
    return true;
  };

  const signContract = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isContractSigned: true } : b));
  };

  const verifyIdentity = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isIdVerified: true } : b));
  };

  const syncChannels = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLastSynced(new Date());
    setIsSyncing(false);
  };

  // --- PMS LOGIC ---
  const addTicket = (ticket: MaintenanceTicket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const sendMessage = (threadId: string, text: string) => {
    const newMessage: import('../types').Message = {
      id: Math.random().toString(), sender: 'HOST', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, lastMessage: text, messages: [...t.messages, newMessage] } : t));
  };

  // --- MARKETING LOGIC ---
  const addActivity = (activity: Activity) => {
      setActivities(prev => [...prev, activity]);
  };
  const updateActivity = (activity: Activity) => {
      setActivities(prev => prev.map(a => a.id === activity.id ? activity : a));
  };
  const deleteActivity = (id: string) => {
      setActivities(prev => prev.filter(a => a.id !== id));
  };

  const addPromotion = (promo: Promotion) => {
      setPromotions(prev => [promo, ...prev]);
  };
  const deletePromotion = (id: string) => {
      setPromotions(prev => prev.filter(p => p.id !== id));
  };
  const togglePromotion = (id: string) => {
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <SystemContext.Provider value={{ 
      mode, setMode, deviceRoomNumber, setDeviceRoomNumber, theme, toggleTheme, language, setLanguage,
      hotelConfig, updateHotelConfig,
      orders, addOrder, updateOrderStatus,
      menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
      bookings, rooms, addRoom, updateRoomStatus, updateBookingStatus, createBooking, checkAvailability, signContract, verifyIdentity,
      isSyncing, lastSynced, syncChannels,
      tickets, addTicket, updateTicketStatus,
      threads, sendMessage,
      activities, addActivity, updateActivity, deleteActivity,
      promotions, addPromotion, deletePromotion, togglePromotion,
      guestRequests, addGuestRequest, updateRequestStatus
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
