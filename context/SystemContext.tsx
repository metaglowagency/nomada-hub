
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
  deviceRoomNumber: string; 
  setDeviceRoomNumber: (room: string) => void;
  hotelConfig: HotelConfig;
  updateHotelConfig: (config: Partial<HotelConfig>) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  orders: Order[];
  addOrder: (items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  bookings: Booking[];
  rooms: Room[];
  addRoom: (room: Room) => void; 
  updateRoomStatus: (roomNumber: string, status: import('../types').RoomStatus) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  createBooking: (guest: GuestProfile, roomNumber: string, checkIn: string, checkOut: string, amount: number, doorCode?: string) => boolean;
  checkAvailability: (roomNumber: string, checkIn: string, checkOut: string) => boolean;
  signContract: (bookingId: string) => void;
  verifyIdentity: (bookingId: string) => void;
  isSyncing: boolean;
  lastSynced: Date;
  syncChannels: () => Promise<void>;
  tickets: MaintenanceTicket[];
  addTicket: (ticket: MaintenanceTicket) => void;
  updateTicketStatus: (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => void;
  threads: MessageThread[];
  sendMessage: (threadId: string, text: string) => void;
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  promotions: Promotion[];
  addPromotion: (promo: Promotion) => void;
  deletePromotion: (id: string) => void;
  togglePromotion: (id: string) => void;
  guestRequests: GuestRequest[];
  addGuestRequest: (type: RequestType, title: string, details: string) => void;
  updateRequestStatus: (id: string, status: RequestStatus, notes?: string) => void;
  resetSystemData: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

// --- FACTORY DEFAULT DATA ---
const DEFAULT_ROOMS: Room[] = [
  { id: 'apt_origins', number: '304', name: 'Nomada Origins', type: 'Signature Penthouse', floor: 3, status: 'OCCUPIED' },
  { id: 'apt_oasis', number: '101', name: 'Urban Oasis', type: 'Junior Suite', floor: 1, status: 'AVAILABLE' },
  { id: 'apt_atlas', number: '102', name: 'Atlas View', type: 'Junior Suite', floor: 1, status: 'AVAILABLE' },
  { id: 'apt_blue', number: '201', name: 'The Blue Pearl', type: 'Executive Suite', floor: 2, status: 'DIRTY' },
];

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'b1', category: 'Breakfast', title: 'The Nomad Morning', description: 'Two organic eggs any style...', price: '$28', image: ASSETS.DINING.BREAKFAST.NOMAD_MORNING, available: true },
  { id: 'l1', category: 'Lunch', title: 'Wagyu Beef Burger', description: 'Brioche bun, truffle mayo...', price: '$34', image: ASSETS.DINING.LUNCH.BURGER, available: true },
  { id: 'd1', category: 'Dinner', title: 'Royal Lamb Tagine', description: 'Slow-cooked lamb shank...', price: '$42', image: ASSETS.DINING.DINNER.TAGINE, available: true },
];

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Caves of Hercules', subtitle: 'Mythical Sunset', category: 'Adventure', duration: '3 Hours', rating: 4.8, price: '$85', image: ASSETS.ACTIVITIES.CAVES, description: 'Explore the mythical limestone caves...', highlights: ['Private Transport', 'Guided History'] },
  { id: '2', title: 'Cape Spartel', subtitle: 'Meeting of Oceans', category: 'Sightseeing', duration: '2 Hours', rating: 4.9, price: '$60', image: ASSETS.ACTIVITIES.SPARTEL, description: 'Edge of the world view...', highlights: ['Ocean Convergence'] },
  { id: '3', title: 'Kasbah Walk', subtitle: 'Ancient Medina', category: 'Culture', duration: '4 Hours', rating: 4.7, price: '$55', image: ASSETS.ACTIVITIES.MEDINA, description: 'Labyrinth of history...', highlights: ['Kasbah Museum', 'Artisan Shops'] },
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'BK-7829', guestId: 'G-101', roomNumber: '304',
    guest: { id: 'G-101', fullName: 'Isabella Rossellini', email: 'isa@example.com', passportNumber: 'A123', nationality: 'Italian', phone: '+3900', isReturning: true },
    checkInDate: '2023-10-01', checkOutDate: '2023-10-05', status: 'CHECKED_IN', totalAmount: 4500, channel: 'DIRECT', isContractSigned: true, isIdVerified: true, isDepositPaid: true, doorCode: '8821'
  },
];

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    // Extra safety: check if empty array was saved (might happen on error)
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
        return fallback;
    }
    return parsed || fallback;
  } catch (e) {
    console.error(`Error loading ${key}, returning fallback`, e);
    return fallback;
  }
}

function saveState(key: string, value: any) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn(`Storage quota exceeded for ${key}. Use smaller images.`);
    }
}

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(AppMode.GUEST);
  const [deviceRoomNumber, setDeviceRoomNumber] = useState('304'); 
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<Language>('EN');
  
  const [hotelConfig, setHotelConfig] = useState<HotelConfig>(() => loadState('nomada_v2_config', { name: 'Nomada Hotel & Suites', currency: '$', taxRate: 0.10, email: 'concierge@nomada.com' }));
  const [orders, setOrders] = useState<Order[]>(() => loadState('nomada_v2_orders', []));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadState('nomada_v2_menu', DEFAULT_MENU_ITEMS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('nomada_v2_bookings', DEFAULT_BOOKINGS));
  const [rooms, setRooms] = useState<Room[]>(() => loadState('nomada_v2_rooms', DEFAULT_ROOMS));
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => loadState('nomada_v2_tickets', []));
  const [threads, setThreads] = useState<MessageThread[]>(() => loadState('nomada_v2_threads', []));
  const [activities, setActivities] = useState<Activity[]>(() => loadState('nomada_v2_activities', DEFAULT_ACTIVITIES));
  const [promotions, setPromotions] = useState<Promotion[]>(() => loadState('nomada_v2_promotions', []));
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>(() => loadState('nomada_v2_requests', []));

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());

  useEffect(() => { saveState('nomada_v2_config', hotelConfig); }, [hotelConfig]);
  useEffect(() => { saveState('nomada_v2_orders', orders); }, [orders]);
  useEffect(() => { saveState('nomada_v2_menu', menuItems); }, [menuItems]);
  useEffect(() => { saveState('nomada_v2_bookings', bookings); }, [bookings]);
  useEffect(() => { saveState('nomada_v2_rooms', rooms); }, [rooms]);
  useEffect(() => { saveState('nomada_v2_tickets', tickets); }, [tickets]);
  useEffect(() => { saveState('nomada_v2_threads', threads); }, [threads]);
  useEffect(() => { saveState('nomada_v2_activities', activities); }, [activities]);
  useEffect(() => { saveState('nomada_v2_promotions', promotions); }, [promotions]);
  useEffect(() => { saveState('nomada_v2_requests', guestRequests); }, [guestRequests]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const updateHotelConfig = (config: Partial<HotelConfig>) => setHotelConfig(prev => ({ ...prev, ...config }));

  const resetSystemData = () => {
      if (confirm('Are you sure? This will clear all custom uploads and reset the app to factory settings.')) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const addGuestRequest = (type: RequestType, title: string, details: string) => {
      const activeBooking = bookings.find(b => b.roomNumber === deviceRoomNumber && b.status === 'CHECKED_IN');
      const newReq: GuestRequest = { id: `REQ-${Date.now()}`, guestName: activeBooking?.guest.fullName || 'Guest', roomNumber: deviceRoomNumber, type, title, details, status: 'PENDING', timestamp: Date.now() };
      setGuestRequests(prev => [newReq, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RequestStatus, notes?: string) => {
      setGuestRequests(prev => prev.map(req => req.id === id ? { ...req, status, notes: notes || req.notes } : req));
  };

  const addOrder = (items: OrderItem[]) => {
    const newOrder: Order = { id: Math.random().toString(36).substr(2, 6).toUpperCase(), roomNumber: deviceRoomNumber, guestName: 'Guest', items, status: 'PENDING', timestamp: Date.now(), total: items.reduce((acc, item) => acc + parseFloat(item.price.replace('$', '') || '0'), 0) };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status } : order));
  const addMenuItem = (item: MenuItem) => setMenuItems(prev => [item, ...prev]);
  const updateMenuItem = (updatedItem: MenuItem) => setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  const deleteMenuItem = (id: string) => setMenuItems(prev => prev.filter(item => item.id !== id));
  const addRoom = (room: Room) => setRooms(prev => [...prev, room]);
  const updateRoomStatus = (roomNumber: string, status: import('../types').RoomStatus) => setRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, status } : r));
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
    return !bookings.find(b => {
       if (b.roomNumber !== roomNumber || b.status === 'CANCELLED' || b.status === 'CHECKED_OUT') return false;
       const bStart = new Date(b.checkInDate).getTime();
       const bEnd = new Date(b.checkOutDate).getTime();
       return (start < bEnd && end > bStart);
    });
  };

  const createBooking = (guest: GuestProfile, roomNumber: string, checkIn: string, checkOut: string, amount: number, doorCode?: string): boolean => {
    if (!checkAvailability(roomNumber, checkIn, checkOut)) return false;
    const newBooking: Booking = { id: `BK-${Math.floor(Math.random() * 10000)}`, guestId: guest.id, guest, roomNumber, checkInDate: checkIn, checkOutDate: checkOut, status: 'CONFIRMED', totalAmount: amount, channel: 'DIRECT', isContractSigned: false, isIdVerified: false, isDepositPaid: false, doorCode: doorCode };
    setBookings(prev => [newBooking, ...prev]);
    return true;
  };

  const signContract = (bookingId: string) => setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isContractSigned: true } : b));
  const verifyIdentity = (bookingId: string) => setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, isIdVerified: true } : b));

  const syncChannels = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSynced(new Date());
    setIsSyncing(false);
  };

  const addTicket = (ticket: MaintenanceTicket) => setTickets(prev => [ticket, ...prev]);
  const updateTicketStatus = (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const sendMessage = (threadId: string, text: string) => {
    const newMessage: import('../types').Message = { id: Math.random().toString(), sender: 'HOST', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, lastMessage: text, messages: [...t.messages, newMessage] } : t));
  };

  const addActivity = (activity: Activity) => {
      setActivities(prev => [activity, ...prev]); 
  };
  const updateActivity = (activity: Activity) => setActivities(prev => prev.map(a => a.id === activity.id ? activity : a));
  const deleteActivity = (id: string) => setActivities(prev => prev.filter(a => a.id !== id));
  const addPromotion = (promo: Promotion) => setPromotions(prev => [promo, ...prev]);
  const deletePromotion = (id: string) => setPromotions(prev => prev.filter(p => p.id !== id));
  const togglePromotion = (id: string) => setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

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
      guestRequests, addGuestRequest, updateRequestStatus, resetSystemData
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
