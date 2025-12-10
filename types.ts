
export enum Tab {
  DASHBOARD = 'Dashboard',
  DINING = 'In-Room Dining',
  CLEANING = 'Housekeeping',
  CONCIERGE = 'Concierge',
  VALET = 'Transportation',
  RECEPTION = 'Reception',
  ACTIVITIES = 'Activities',
}

export enum AppMode {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  KITCHEN = 'KITCHEN',
}

export type Language = 'EN' | 'FR';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE';

export type BookingChannel = 'DIRECT' | 'AIRBNB' | 'BOOKING_COM' | 'EXPEDIA';

// --- NEW REQUEST TYPES FOR BACK OFFICE ---
export type RequestType = 'TRANSPORT' | 'ACTIVITY' | 'DINING_RESERVATION' | 'SPA_GYM' | 'HOUSEKEEPING' | 'GENERAL';
export type RequestStatus = 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface GuestRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  type: RequestType;
  title: string;      // e.g., "Rent Range Rover"
  details: string;    // e.g., "2 Days, Starting Tomorrow"
  status: RequestStatus;
  timestamp: number;
  notes?: string;     // Admin notes (e.g., "Called Partner X, waiting for confirm")
}

export interface GuestProfile {
  id: string;
  fullName: string;
  email: string;
  passportNumber: string;
  nationality: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  isReturning?: boolean;
}

export interface Booking {
  id: string;
  guestId: string;
  guest: GuestProfile;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  totalAmount: number;
  channel: BookingChannel;
  // Compliance & Checking Fields
  isContractSigned: boolean;
  isIdVerified: boolean;
  isDepositPaid: boolean;
  eta?: string; // Estimated Time of Arrival
  doorCode?: string; // Generated Smart Lock Code
}

export interface Room {
  id: string;       // Unique ID
  number: string;   // "304"
  name: string;     // "Nomada Origins"
  type: string;     // "Signature Penthouse"
  description?: string; 
  status: RoomStatus;
  floor: number;
}

export interface MenuItemOption {
  name: string;
  price?: number; // Optional extra cost
  selected?: boolean;
}

export interface MenuItem {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  image: string;
  isVegetarian?: boolean;
  available?: boolean;
  ingredients?: string[];
  // New Upselling Fields
  pairingId?: string; // ID of a recommended drink/side
  pairingReason?: string; // "Bold red wine complements the steak"
  customizationOptions?: MenuItemOption[]; // e.g. "Rare", "Medium", "Sauce on Side"
}

export interface OrderItem extends MenuItem {
  notes?: string;
  selectedOptions?: string[];
}

export interface Order {
  id: string;
  roomNumber: string;
  guestName?: string; 
  items: OrderItem[];
  status: OrderStatus;
  timestamp: number; 
  total: number;
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  duration: string;
  rating: number;
  price: string;
  image: string;
  highlights: string[];
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'EVENT' | 'OFFER' | 'ANNOUNCEMENT';
  active: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  high: number;
  low: number;
  location: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: string;
}

// --- NEW TYPES FOR PMS FEATURES ---

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  issue: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  reportedAt: string;
  assignedTo?: string;
}

export interface Message {
  id: string;
  sender: 'GUEST' | 'HOST' | 'SYSTEM';
  text: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  guestName: string;
  roomNumber?: string;
  channel: BookingChannel;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}
