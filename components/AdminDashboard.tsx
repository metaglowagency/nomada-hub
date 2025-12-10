
import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { Booking, GuestProfile, BookingChannel, Room, RoomStatus, MenuItem, Activity, Promotion, RequestStatus } from '../types';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  BedDouble, 
  TrendingUp, 
  CalendarDays,
  FileText,
  Key,
  LogOut,
  Search,
  CheckCircle,
  Printer,
  PenTool,
  Calendar as CalendarIcon,
  RefreshCw,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  ShieldCheck,
  CreditCard,
  Clock,
  XCircle,
  AlertCircle,
  UserPlus,
  X,
  Wrench,
  MessageSquare,
  Send,
  MoreVertical,
  CheckSquare,
  Plus,
  SprayCan,
  Settings,
  Save,
  Building,
  UtensilsCrossed,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Tag,
  Upload,
  Camera,
  Lock,
  Wifi,
  Loader,
  Megaphone,
  Bell
} from 'lucide-react';

type AdminTab = 'OVERVIEW' | 'CHECKING' | 'CALENDAR' | 'BOOKINGS' | 'APARTMENTS' | 'DINING' | 'HOUSEKEEPING' | 'MAINTENANCE' | 'MESSAGES' | 'SETTINGS' | 'MARKETING' | 'REQUESTS';

const AdminDashboard: React.FC = () => {
  const { 
    hotelConfig, updateHotelConfig,
    orders, bookings, rooms, addRoom, updateRoomStatus, updateBookingStatus, signContract, verifyIdentity, createBooking, checkAvailability, isSyncing, lastSynced, syncChannels,
    tickets, updateTicketStatus, threads, sendMessage,
    menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    activities, addActivity, updateActivity, deleteActivity,
    promotions, addPromotion, deletePromotion, togglePromotion,
    guestRequests, updateRequestStatus
  } = useSystem();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  
  // Calendar View State
  const [currentDate, setCurrentDate] = useState(new Date()); 

  // States for Contract Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showContract, setShowContract] = useState(false);

  // States for New Booking Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newGuestData, setNewGuestData] = useState({
     firstName: '',
     lastName: '',
     email: '',
     phone: '',
     passport: '',
     nationality: '',
     address: '',
     city: '',
     country: '',
     zip: '',
     roomNumber: '',
     checkIn: new Date().toISOString().split('T')[0],
     checkOut: '',
     amount: '',
  });

  // State for Messages
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');

  // State for New Apartment Modal
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
      name: '',
      number: '',
      type: '',
      floor: 1,
  });

  // State for Dining Management
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuFormMode, setMenuFormMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({
      category: 'Breakfast',
      title: '',
      description: '',
      price: '$',
      image: '',
      isVegetarian: false,
      ingredients: [],
      available: true
  });
  const [ingredientInput, setIngredientInput] = useState('');

  // Marketing States
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState<Partial<Activity>>({});
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState<Partial<Promotion>>({});
  const [marketingMode, setMarketingMode] = useState<'ADD' | 'EDIT'>('ADD');

  // Settings State
  const [tempConfig, setTempConfig] = useState(hotelConfig);

  // Filter Bookings for Checking View
  const arrivals = bookings.filter(b => b.status === 'CONFIRMED');
  const departures = bookings.filter(b => b.status === 'CHECKED_IN'); 

  // Kpi Calcs
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0) + bookings.reduce((acc, curr) => curr.status === 'CHECKED_IN' || curr.status === 'CHECKED_OUT' ? acc + curr.totalAmount : acc, 0);
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
  const pendingRequestsCount = guestRequests.filter(r => r.status === 'PENDING').length;

  // --- CALENDAR LOGIC ---
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleOpenContract = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowContract(true);
  };

  const handleSignContract = () => {
    if (selectedBooking) {
      signContract(selectedBooking.id);
      if (selectedBooking.status === 'CONFIRMED' && selectedBooking.isIdVerified) {
         // Auto check-in logic could go here
         updateBookingStatus(selectedBooking.id, 'CHECKED_IN');
      }
      setShowContract(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
     e.preventDefault();
     setBookingError('');
     setIsGeneratingKey(true);

     // SIMULATE API CALL
     const generatedDoorCode = await new Promise<string>((resolve) => {
         setTimeout(() => {
             const code = Math.floor(100000 + Math.random() * 900000).toString();
             resolve(code);
         }, 1000);
     });

     setIsGeneratingKey(false);

     const guest: GuestProfile = {
        id: `G-${Math.floor(Math.random() * 1000)}`,
        fullName: `${newGuestData.firstName} ${newGuestData.lastName}`,
        email: newGuestData.email,
        phone: newGuestData.phone,
        passportNumber: newGuestData.passport,
        nationality: newGuestData.nationality,
        address: newGuestData.address,
        city: newGuestData.city,
        country: newGuestData.country,
        zip: newGuestData.zip,
        isReturning: false
     };
     
     const success = createBooking(
        guest, 
        newGuestData.roomNumber, 
        newGuestData.checkIn, 
        newGuestData.checkOut, 
        parseFloat(newGuestData.amount) || 0,
        generatedDoorCode
     );
     
     if (success) {
        setShowAddModal(false);
        setNewGuestData({
            firstName: '', lastName: '', email: '', phone: '', passport: '', nationality: '', address: '', city: '', country: '', zip: '', roomNumber: '', checkIn: '', checkOut: '', amount: ''
        });
        alert(`Booking Created! Digital Key: ${generatedDoorCode}`);
     } else {
         setBookingError('Room unavailable for selected dates.');
     }
  };

  const handleAddRoom = (e: React.FormEvent) => {
      e.preventDefault();
      const newRoom: Room = {
          id: `apt_${newRoomData.number}`,
          number: newRoomData.number,
          name: newRoomData.name,
          type: newRoomData.type,
          floor: Number(newRoomData.floor),
          status: 'AVAILABLE'
      };
      addRoom(newRoom);
      setShowAddRoomModal(false);
      setNewRoomData({ name: '', number: '', type: '', floor: 1 });
  };

  // --- MENU MANAGEMENT ---
  const handleOpenAddMenu = () => {
      setMenuFormMode('ADD');
      setCurrentMenuItem({
          category: 'Breakfast',
          title: '',
          description: '',
          price: '$',
          image: '',
          isVegetarian: false,
          ingredients: [],
          available: true
      });
      setShowMenuModal(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
      setMenuFormMode('EDIT');
      setCurrentMenuItem(item);
      setShowMenuModal(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentMenuItem.title || !currentMenuItem.price) return;

      const finalImage = currentMenuItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';

      const itemToSave = {
          ...currentMenuItem,
          image: finalImage,
          available: currentMenuItem.available ?? true,
          id: currentMenuItem.id || Math.random().toString(36).substr(2, 9),
      } as MenuItem;

      if (menuFormMode === 'ADD') {
          addMenuItem(itemToSave);
      } else {
          updateMenuItem(itemToSave);
      }
      setShowMenuModal(false);
  };

  const handleAddIngredient = () => {
      if(ingredientInput.trim()) {
          setCurrentMenuItem(prev => ({
              ...prev,
              ingredients: [...(prev.ingredients || []), ingredientInput.trim()]
          }));
          setIngredientInput('');
      }
  };

  const handleRemoveIngredient = (idx: number) => {
      setCurrentMenuItem(prev => ({
          ...prev,
          ingredients: prev.ingredients?.filter((_, i) => i !== idx)
      }));
  };

  // --- MARKETING MANAGEMENT ---
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const act: Activity = {
        id: activityForm.id || Math.random().toString(36),
        title: activityForm.title || 'New Activity',
        subtitle: activityForm.subtitle || '',
        category: activityForm.category || 'General',
        description: activityForm.description || '',
        duration: activityForm.duration || '',
        rating: activityForm.rating || 5,
        price: activityForm.price || '$0',
        image: activityForm.image || 'https://images.unsplash.com/photo-1589307220508-3693d252277d?q=80&w=1000',
        highlights: activityForm.highlights || []
    };

    if (marketingMode === 'ADD') addActivity(act);
    else updateActivity(act);
    setShowActivityModal(false);
  };

  const handleSavePromo = (e: React.FormEvent) => {
      e.preventDefault();
      const promo: Promotion = {
          id: promoForm.id || Math.random().toString(36),
          title: promoForm.title || '',
          subtitle: promoForm.subtitle || '',
          image: promoForm.image || 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000',
          type: promoForm.type || 'EVENT',
          active: promoForm.active ?? true
      };
      addPromotion(promo);
      setShowPromoModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if(messageInput.trim()) {
          sendMessage(activeThreadId, messageInput);
          setMessageInput('');
      }
  }

  const saveSettings = () => {
      updateHotelConfig(tempConfig);
      alert('Settings Saved');
  }

  const handlePrintContract = () => {
      window.print();
  }

  const activeThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-black/50 backdrop-blur-xl">
        <div className="p-8">
           <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-1">Nomada</span>
           <h1 className="text-xl font-serif text-white truncate">{hotelConfig.name}</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
           <div className="mb-4">
             <p className="px-4 text-[10px] text-gray-500 uppercase tracking-wider mb-2">Front Desk</p>
             <AdminNavItem 
                icon={Bell} 
                label="Concierge Desk" 
                isActive={activeTab === 'REQUESTS'} 
                onClick={() => setActiveTab('REQUESTS')} 
                badge={pendingRequestsCount} 
             />
             <AdminNavItem icon={LayoutDashboard} label="Overview" isActive={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} />
             <AdminNavItem icon={ArrowLeftRight} label="Checking" isActive={activeTab === 'CHECKING'} onClick={() => setActiveTab('CHECKING')} />
             <AdminNavItem icon={CalendarIcon} label="Calendar" isActive={activeTab === 'CALENDAR'} onClick={() => setActiveTab('CALENDAR')} />
             <AdminNavItem icon={MessageSquare} label="Inbox" isActive={activeTab === 'MESSAGES'} onClick={() => setActiveTab('MESSAGES')} />
           </div>
           
           <div className="mb-4">
             <p className="px-4 text-[10px] text-gray-500 uppercase tracking-wider mb-2">Operations</p>
             <AdminNavItem icon={UtensilsCrossed} label="Dining & Menu" isActive={activeTab === 'DINING'} onClick={() => setActiveTab('DINING')} />
             <AdminNavItem icon={SprayCan} label="Housekeeping" isActive={activeTab === 'HOUSEKEEPING'} onClick={() => setActiveTab('HOUSEKEEPING')} />
             <AdminNavItem icon={Wrench} label="Maintenance" isActive={activeTab === 'MAINTENANCE'} onClick={() => setActiveTab('MAINTENANCE')} />
             <AdminNavItem icon={BedDouble} label="Apartments" isActive={activeTab === 'APARTMENTS'} onClick={() => setActiveTab('APARTMENTS')} />
             <AdminNavItem icon={CalendarDays} label="Guests" isActive={activeTab === 'BOOKINGS'} onClick={() => setActiveTab('BOOKINGS')} />
             <AdminNavItem icon={Megaphone} label="Marketing" isActive={activeTab === 'MARKETING'} onClick={() => setActiveTab('MARKETING')} />
           </div>

           <div>
             <p className="px-4 text-[10px] text-gray-500 uppercase tracking-wider mb-2">System</p>
             <AdminNavItem icon={Settings} label="Settings" isActive={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} />
           </div>
        </nav>

        <div className="p-8">
           <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Occupancy</p>
              <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mb-2">
                 <div className="bg-gold-400 h-full transition-all duration-1000" style={{ width: `${(occupiedRooms / rooms.length) * 100}%` }}></div>
              </div>
              <p className="text-right text-white font-bold">{occupiedRooms} / {rooms.length}</p>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-serif text-white">
            {activeTab === 'OVERVIEW' && 'Property Overview'}
            {activeTab === 'REQUESTS' && 'Concierge Desk & Requests'}
            {activeTab === 'CHECKING' && 'Arrivals & Departures'}
            {activeTab === 'CALENDAR' && 'Channel Calendar'}
            {activeTab === 'BOOKINGS' && 'Guest Directory'}
            {activeTab === 'APARTMENTS' && 'Unit Status'}
            {activeTab === 'MAINTENANCE' && 'Service & Maintenance'}
            {activeTab === 'HOUSEKEEPING' && 'Housekeeping Schedule'}
            {activeTab === 'DINING' && 'Menu Management & Finance'}
            {activeTab === 'MESSAGES' && 'Unified Inbox'}
            {activeTab === 'MARKETING' && 'Experience & Promotions'}
            {activeTab === 'SETTINGS' && 'System Configuration'}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors w-64"
                />
             </div>
             <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center text-black font-bold">
                M
             </div>
          </div>
        </header>

        {/* --- LIVE REQUESTS TAB --- */}
        {activeTab === 'REQUESTS' && (
            <div className="animate-fade-in-up">
                <div className="grid grid-cols-1 gap-6">
                    {/* Active Requests List */}
                    <div className="glass-panel p-8 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-serif">Incoming Requests</h3>
                            <div className="flex gap-2">
                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold uppercase">{guestRequests.filter(r => r.status === 'PENDING').length} Pending</span>
                                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs font-bold uppercase">{guestRequests.filter(r => r.status === 'PROCESSING').length} Processing</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {guestRequests.sort((a,b) => b.timestamp - a.timestamp).map(req => (
                                <div key={req.id} className={`p-4 rounded-xl border flex justify-between items-start transition-all ${req.status === 'PENDING' ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex gap-4">
                                        <div className={`p-3 rounded-lg flex items-center justify-center h-12 w-12 ${req.status === 'PENDING' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-white text-lg">{req.title}</span>
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase text-gray-400">{req.type}</span>
                                                <span className="text-[10px] text-gray-500">{new Date(req.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 mb-2">{req.details}</p>
                                            <div className="flex items-center gap-2 text-xs text-gold-400 font-mono">
                                                <Users size={12} /> {req.guestName} (Room {req.roomNumber})
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 items-end">
                                        <div className="flex items-center gap-2">
                                            {req.status === 'PENDING' && (
                                                <button 
                                                    onClick={() => updateRequestStatus(req.id, 'PROCESSING')}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-blue-600"
                                                >
                                                    Process
                                                </button>
                                            )}
                                            {(req.status === 'PENDING' || req.status === 'PROCESSING') && (
                                                <button 
                                                    onClick={() => updateRequestStatus(req.id, 'CONFIRMED')}
                                                    className="bg-green-500 text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-green-600"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {(req.status !== 'CANCELLED' && req.status !== 'COMPLETED' && req.status !== 'CONFIRMED') && (
                                                <button 
                                                    onClick={() => updateRequestStatus(req.id, 'CANCELLED')}
                                                    className="bg-gray-700 text-gray-300 px-3 py-2 rounded text-xs font-bold uppercase hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${req.status === 'CONFIRMED' ? 'text-green-400' : req.status === 'CANCELLED' ? 'text-red-400' : 'text-gray-500'}`}>
                                            Status: {req.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {guestRequests.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No active requests.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'OVERVIEW' && (
           <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard icon={DollarSign} label="Total Revenue" value={`${hotelConfig.currency}${totalRevenue.toLocaleString()}`} sub="Dining + Stays" />
                <StatCard icon={TrendingUp} label="RevPAR" value="$210" sub="+5% vs last week" />
                <StatCard icon={Users} label="Pending Arrivals" value={bookings.filter(b => b.status === 'CONFIRMED').length.toString()} sub="Next 24 Hours" />
                <StatCard icon={BedDouble} label="Units Ready" value={rooms.filter(r => r.status === 'AVAILABLE').length.toString()} sub="Clean & Inspected" />
              </div>

              <div className="grid grid-cols-3 gap-6">
                  {/* Recent Activity Table */}
                  <div className="col-span-2 glass-panel p-8 rounded-2xl">
                     <h3 className="text-xl font-serif mb-6">Recent Activity</h3>
                     <table className="w-full text-left text-sm text-gray-400">
                        <thead>
                          <tr className="uppercase tracking-widest text-xs border-b border-white/10">
                             <th className="pb-4">Time</th>
                             <th className="pb-4">Event</th>
                             <th className="pb-4">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-white/5">
                              <td className="py-4">10:42 AM</td>
                              <td className="text-white">New Room Service Order</td>
                              <td>Room 304 - $128.00</td>
                           </tr>
                           <tr className="border-b border-white/5">
                              <td className="py-4">09:15 AM</td>
                              <td className="text-white">Check-in Completed</td>
                              <td>Guest: Thomas Anderson (Room 102)</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Quick Housekeeping Snapshot */}
                  <div className="col-span-1 glass-panel p-8 rounded-2xl">
                      <h3 className="text-xl font-serif mb-6">Room Status</h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center">
                              <span className="text-gray-400">Available</span>
                              <span className="text-green-400 font-bold">{rooms.filter(r => r.status === 'AVAILABLE').length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-gray-400">Occupied</span>
                              <span className="text-red-400 font-bold">{rooms.filter(r => r.status === 'OCCUPIED').length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-gray-400">Dirty</span>
                              <span className="text-yellow-400 font-bold">{rooms.filter(r => r.status === 'DIRTY').length}</span>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        )}

        {/* --- CHECKING TAB --- */}
        {activeTab === 'CHECKING' && (
           <div className="animate-fade-in-up">
              <div className="flex space-x-6 mb-8">
                 <div className="flex-1 glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500">
                    <h3 className="text-xl font-serif mb-4 flex items-center"><ArrowLeftRight className="mr-3 text-blue-500"/> Arrivals Today</h3>
                    <div className="space-y-3">
                       {arrivals.length === 0 && <p className="text-gray-500 text-sm">No pending arrivals.</p>}
                       {arrivals.map(b => (
                          <div key={b.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                             <div>
                                <p className="font-bold">{b.guest.fullName}</p>
                                <p className="text-xs text-gray-500">Room {b.roomNumber} • <ChannelBadge channel={b.channel} /></p>
                             </div>
                             <div className="flex items-center space-x-2">
                                <button onClick={() => handleOpenContract(b)} className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase rounded hover:bg-gray-200">
                                   Start Check-in
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex-1 glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500">
                    <h3 className="text-xl font-serif mb-4 flex items-center"><LogOut className="mr-3 text-orange-500"/> Departures Today</h3>
                    <div className="space-y-3">
                        {departures.length === 0 && <p className="text-gray-500 text-sm">No pending departures.</p>}
                        {departures.map(b => (
                          <div key={b.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                             <div>
                                <p className="font-bold">{b.guest.fullName}</p>
                                <p className="text-xs text-gray-500">Room {b.roomNumber}</p>
                             </div>
                             <button onClick={() => updateBookingStatus(b.id, 'CHECKED_OUT')} className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/50 text-[10px] font-bold uppercase rounded hover:bg-orange-500 hover:text-white">
                                Check Out
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Walk-in Button */}
              <div className="flex justify-end">
                 <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 bg-gold-400 text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
                    <UserPlus size={16} />
                    <span>New Walk-in Booking</span>
                 </button>
              </div>
           </div>
        )}

        {/* --- CALENDAR TAB --- */}
        {activeTab === 'CALENDAR' && (
           <div className="animate-fade-in-up h-[calc(100vh-200px)] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center space-x-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                    <h3 className="text-2xl font-serif">{monthName}</h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight /></button>
                 </div>
                 
                 <div className="flex items-center space-x-3">
                     <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        {isSyncing ? <RefreshCw className="animate-spin text-gold-400" size={14} /> : <Globe size={14} />}
                        {isSyncing ? 'Syncing Channels...' : `Synced: ${lastSynced.toLocaleTimeString()}`}
                     </span>
                     <button onClick={syncChannels} className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded uppercase font-bold">Sync Now</button>
                 </div>
              </div>
              
              <div className="flex-1 glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                  {/* Grid Header (Days) */}
                  <div className="grid grid-cols-12 border-b border-white/10 bg-black/40">
                      <div className="col-span-2 p-4 font-bold border-r border-white/10">Unit / Date</div>
                      {Array.from({ length: 10 }).map((_, i) => {
                          const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                          return (
                              <div key={i} className="col-span-1 p-2 text-center border-r border-white/10 text-xs text-gray-400">
                                  <div className="font-bold text-white">{d.getDate()}</div>
                                  <div>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              </div>
                          );
                      })}
                  </div>

                  {/* Grid Body */}
                  <div className="flex-1 overflow-y-auto">
                      {rooms.map(room => (
                          <div key={room.id} className="grid grid-cols-12 border-b border-white/5 hover:bg-white/5 transition-colors h-16">
                              <div className="col-span-2 p-3 border-r border-white/10 flex flex-col justify-center">
                                  <span className="font-bold text-sm">{room.name}</span>
                                  <span className="text-xs text-gray-500">#{room.number}</span>
                              </div>
                              {/* Booking Bars visualization would go here. Simplified for demo. */}
                              <div className="col-span-10 relative">
                                  {bookings
                                    .filter(b => b.roomNumber === room.number && new Date(b.checkInDate).getMonth() === currentDate.getMonth())
                                    .map(b => {
                                        const startDay = new Date(b.checkInDate).getDate();
                                        const duration = (new Date(b.checkOutDate).getTime() - new Date(b.checkInDate).getTime()) / (1000 * 3600 * 24);
                                        // Simple positioning logic for first 10 days
                                        if (startDay > 10) return null;
                                        return (
                                            <div 
                                                key={b.id}
                                                className={`absolute top-2 bottom-2 rounded px-2 flex items-center text-[10px] font-bold truncate border
                                                    ${b.channel === 'AIRBNB' ? 'bg-[#FF5A5F]/20 border-[#FF5A5F] text-[#FF5A5F]' : ''}
                                                    ${b.channel === 'BOOKING_COM' ? 'bg-[#003580]/20 border-[#003580] text-blue-300' : ''}
                                                    ${b.channel === 'DIRECT' ? 'bg-gold-400/20 border-gold-400 text-gold-400' : ''}
                                                `}
                                                style={{ left: `${(startDay - 1) * 10}%`, width: `${duration * 10}%` }}
                                            >
                                                {b.guest.fullName}
                                            </div>
                                        )
                                    })
                                  }
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
           </div>
        )}

        {/* --- BOOKINGS LIST TAB --- */}
        {activeTab === 'BOOKINGS' && (
           <div className="animate-fade-in-up">
              <div className="glass-panel rounded-2xl overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-black/40 text-xs uppercase text-gray-400 font-bold tracking-widest">
                       <tr>
                          <th className="p-6">Guest</th>
                          <th className="p-6">Stay Dates</th>
                          <th className="p-6">Unit</th>
                          <th className="p-6">Status</th>
                          <th className="p-6">Source</th>
                          <th className="p-6 text-right">Total</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {bookings.map(b => (
                          <tr key={b.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleOpenContract(b)}>
                             <td className="p-6">
                                <div className="font-bold">{b.guest.fullName}</div>
                                <div className="text-xs text-gray-500">{b.id}</div>
                             </td>
                             <td className="p-6 text-sm">
                                <div className="text-white">{b.checkInDate}</div>
                                <div className="text-gray-500">to {b.checkOutDate}</div>
                             </td>
                             <td className="p-6 text-sm font-mono text-gold-400">{b.roomNumber}</td>
                             <td className="p-6"><StatusBadge status={b.status} /></td>
                             <td className="p-6"><ChannelBadge channel={b.channel} /></td>
                             <td className="p-6 text-right font-mono">${b.totalAmount}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* --- APARTMENTS TAB --- */}
        {activeTab === 'APARTMENTS' && (
           <div className="animate-fade-in-up">
               <div className="flex justify-end mb-6">
                   <button onClick={() => setShowAddRoomModal(true)} className="bg-white text-black px-4 py-2 rounded font-bold uppercase text-xs hover:bg-gray-200">
                       Add Unit
                   </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                      <div key={room.id} className="glass-panel p-6 rounded-2xl border-t-4 border-t-gold-400">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="text-xl font-serif font-bold">{room.name}</h3>
                                  <span className="text-xs text-gray-500 font-mono">Unit {room.number} • Floor {room.floor}</span>
                              </div>
                              <RoomStatusBadge status={room.status} />
                          </div>
                          
                          <div className="space-y-3 mb-6">
                              <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Type</span>
                                  <span>{room.type}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Active Guest</span>
                                  <span>{bookings.find(b => b.roomNumber === room.number && b.status === 'CHECKED_IN')?.guest.fullName || '—'}</span>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => updateRoomStatus(room.number, 'DIRTY')}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold uppercase"
                              >
                                  Mark Dirty
                              </button>
                              <button 
                                onClick={() => updateRoomStatus(room.number, 'AVAILABLE')}
                                className="px-3 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded text-[10px] font-bold uppercase"
                              >
                                  Mark Ready
                              </button>
                          </div>
                      </div>
                  ))}
               </div>
           </div>
        )}

        {/* --- DINING TAB --- */}
        {activeTab === 'DINING' && (
           <div className="animate-fade-in-up space-y-8">
               {/* Financials Row */}
               <div className="grid grid-cols-3 gap-6">
                   <StatCard icon={DollarSign} label="F&B Revenue" value="$4,250" sub="This Month" />
                   <StatCard icon={CheckCircle} label="Orders Served" value={orders.filter(o => o.status === 'DELIVERED').length.toString()} sub="Total" />
                   <StatCard icon={UtensilsCrossed} label="Menu Items" value={menuItems.length.toString()} sub="Active" />
               </div>

               <div className="glass-panel p-8 rounded-2xl">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-serif">Menu Management</h3>
                       <button onClick={handleOpenAddMenu} className="bg-gold-400 text-black px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2">
                           <Plus size={16} /> Add Item
                       </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {menuItems.map(item => (
                           <div key={item.id} className="flex bg-white/5 p-4 rounded-xl border border-white/5 hover:border-gold-400/50 transition-colors group">
                               <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-gray-800" />
                               <div className="ml-4 flex-1">
                                   <div className="flex justify-between">
                                       <h4 className="font-bold">{item.title}</h4>
                                       <span className="font-mono text-gold-400">{item.price}</span>
                                   </div>
                                   <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleOpenEditMenu(item)} className="text-xs text-white underline">Edit</button>
                                       <button onClick={() => deleteMenuItem(item.id)} className="text-xs text-red-400 underline">Remove</button>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>
        )}

        {/* --- HOUSEKEEPING TAB --- */}
        {activeTab === 'HOUSEKEEPING' && (
           <div className="animate-fade-in-up">
               <div className="glass-panel p-8 rounded-2xl">
                   <h3 className="text-xl font-serif mb-6">Cleaning Schedule</h3>
                   <table className="w-full text-left">
                       <thead className="bg-black/40 text-xs uppercase text-gray-400 font-bold">
                           <tr>
                               <th className="p-4">Room</th>
                               <th className="p-4">Status</th>
                               <th className="p-4">Priority</th>
                               <th className="p-4 text-right">Action</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                           {rooms.filter(r => r.status === 'DIRTY').map(r => (
                               <tr key={r.id}>
                                   <td className="p-4 font-bold text-lg">{r.number}</td>
                                   <td className="p-4"><RoomStatusBadge status={r.status} /></td>
                                   <td className="p-4"><span className="text-red-400 font-bold text-xs uppercase">High (Checkout)</span></td>
                                   <td className="p-4 text-right">
                                       <button onClick={() => updateRoomStatus(r.number, 'AVAILABLE')} className="bg-white text-black px-3 py-1 rounded text-xs font-bold uppercase hover:bg-green-400">
                                           Mark Clean
                                       </button>
                                   </td>
                               </tr>
                           ))}
                           {rooms.filter(r => r.status === 'DIRTY').length === 0 && (
                               <tr><td colSpan={4} className="p-8 text-center text-gray-500">All rooms are clean.</td></tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </div>
        )}

        {/* --- MAINTENANCE TAB --- */}
        {activeTab === 'MAINTENANCE' && (
           <div className="animate-fade-in-up space-y-6">
                <div className="flex justify-end">
                    <button className="bg-white/10 text-white px-4 py-2 rounded font-bold uppercase text-xs hover:bg-white/20">
                         + Log Ticket
                    </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="glass-panel p-6 rounded-xl flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className={`w-2 h-16 rounded-full ${ticket.priority === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                <div>
                                    <h4 className="font-bold text-lg">{ticket.issue} <span className="text-gray-500 text-sm">in Room {ticket.roomNumber}</span></h4>
                                    <p className="text-gray-400 text-sm">{ticket.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Reported: {ticket.reportedAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <select 
                                    value={ticket.status} 
                                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-bold uppercase text-white outline-none focus:border-gold-400"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
           </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'MESSAGES' && (
           <div className="animate-fade-in-up h-[calc(100vh-140px)] glass-panel rounded-2xl overflow-hidden flex">
               {/* Thread List */}
               <div className="w-1/3 border-r border-white/10 bg-black/20 flex flex-col">
                   <div className="p-4 border-b border-white/10">
                       <h3 className="font-serif font-bold">Inbox ({threads.length})</h3>
                   </div>
                   <div className="flex-1 overflow-y-auto">
                       {threads.map(thread => (
                           <div 
                                key={thread.id} 
                                onClick={() => setActiveThreadId(thread.id)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${activeThreadId === thread.id ? 'bg-white/10 border-l-4 border-l-gold-400' : ''}`}
                           >
                               <div className="flex justify-between mb-1">
                                   <span className="font-bold text-sm">{thread.guestName}</span>
                                   <span className="text-xs text-gray-500">10:45</span>
                               </div>
                               <p className="text-xs text-gray-400 truncate">{thread.lastMessage}</p>
                               <div className="flex justify-between items-center mt-2">
                                   <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500">{thread.channel}</span>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
               
               {/* Chat View */}
               <div className="flex-1 flex flex-col bg-black/40">
                   {activeThread ? (
                       <>
                           <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                               <div>
                                   <h3 className="font-bold">{activeThread.guestName}</h3>
                                   <p className="text-xs text-gray-500">Room {activeThread.roomNumber} • {activeThread.channel}</p>
                               </div>
                               <button className="text-gray-400 hover:text-white"><MoreVertical size={20}/></button>
                           </div>
                           
                           <div className="flex-1 overflow-y-auto p-4 space-y-4">
                               {activeThread.messages.map(msg => (
                                   <div key={msg.id} className={`flex ${msg.sender === 'HOST' ? 'justify-end' : 'justify-start'}`}>
                                       <div className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.sender === 'HOST' ? 'bg-gold-400 text-black' : 'bg-white/10 text-white'}`}>
                                           {msg.text}
                                           <div className={`text-[9px] mt-1 text-right ${msg.sender === 'HOST' ? 'text-black/60' : 'text-gray-500'}`}>{msg.timestamp}</div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                           
                           <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 flex gap-2">
                               <input 
                                   value={messageInput}
                                   onChange={(e) => setMessageInput(e.target.value)}
                                   placeholder="Type a reply..." 
                                   className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-sm focus:border-gold-400 outline-none text-white"
                               />
                               <button type="submit" className="p-2 bg-gold-400 rounded-full text-black hover:bg-white transition-colors">
                                   <Send size={18} />
                               </button>
                           </form>
                       </>
                   ) : (
                       <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation</div>
                   )}
               </div>
           </div>
        )}
        
        {activeTab === 'MARKETING' && (
            <div className="animate-fade-in-up space-y-8">
                {/* Events & Promotions Section */}
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-serif text-white">Events & Promotions</h3>
                        <button 
                            onClick={() => { setPromoForm({}); setShowPromoModal(true); }}
                            className="bg-white text-black px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2 hover:bg-gray-200"
                        >
                            <Plus size={16} /> New Event
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {promotions.map(promo => (
                             <div key={promo.id} className="bg-white/5 rounded-lg p-4 flex gap-4 items-center border border-white/10 relative group">
                                 <img src={promo.image} className="w-16 h-16 rounded object-cover" />
                                 <div className="flex-1">
                                     <h4 className="font-bold text-white">{promo.title}</h4>
                                     <p className="text-xs text-gray-400">{promo.subtitle}</p>
                                     <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-1 inline-block ${promo.type === 'EVENT' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                                         {promo.type}
                                     </span>
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <button 
                                        onClick={() => togglePromotion(promo.id)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${promo.active ? 'bg-green-500 text-black' : 'bg-gray-600 text-gray-300'}`}
                                     >
                                         {promo.active ? 'Active' : 'Hidden'}
                                     </button>
                                     <button 
                                        onClick={() => deletePromotion(promo.id)}
                                        className="text-red-400 hover:text-red-300 text-xs"
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>

                {/* Curated Experiences Section */}
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-serif text-white">Curated Experiences</h3>
                        <button 
                            onClick={() => { setActivityForm({}); setMarketingMode('ADD'); setShowActivityModal(true); }}
                            className="bg-gold-400 text-black px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2 hover:bg-white"
                        >
                            <Plus size={16} /> Add Activity
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {activities.map(activity => (
                             <div key={activity.id} className="group relative rounded-xl overflow-hidden aspect-video border border-white/10">
                                 <img src={activity.image} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                     <button 
                                        onClick={() => { setActivityForm(activity); setMarketingMode('EDIT'); setShowActivityModal(true); }}
                                        className="p-2 bg-white rounded-full text-black hover:bg-gold-400"
                                     >
                                         <Edit3 size={18} />
                                     </button>
                                     <button 
                                        onClick={() => deleteActivity(activity.id)}
                                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                                     >
                                         <Trash2 size={18} />
                                     </button>
                                 </div>
                                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                                     <h4 className="text-white font-bold">{activity.title}</h4>
                                     <p className="text-xs text-gray-300">{activity.category}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'SETTINGS' && (
           <div className="animate-fade-in-up">
              <div className="max-w-2xl">
                  <h3 className="text-2xl font-serif mb-8">System Configuration</h3>
                  
                  <div className="glass-panel p-8 rounded-2xl space-y-6">
                      <div>
                          <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Property Name</label>
                          <input 
                            value={tempConfig.name}
                            onChange={(e) => setTempConfig({...tempConfig, name: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Currency Symbol</label>
                              <input 
                                value={tempConfig.currency}
                                onChange={(e) => setTempConfig({...tempConfig, currency: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Tax Rate (Decimal)</label>
                              <input 
                                type="number" step="0.01"
                                value={tempConfig.taxRate}
                                onChange={(e) => setTempConfig({...tempConfig, taxRate: parseFloat(e.target.value)})}
                                className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Concierge Email</label>
                          <input 
                            value={tempConfig.email}
                            onChange={(e) => setTempConfig({...tempConfig, email: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                          />
                      </div>

                      <div className="pt-4 border-t border-white/10">
                          <button onClick={saveSettings} className="bg-gold-400 text-black px-8 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-white">
                              Save Configuration
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        )}

      </div>

      {/* --- MARKETING MODALS --- */}
      {showActivityModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-white/10 overflow-hidden animate-fade-in-up">
                  <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white uppercase">{marketingMode} Activity</h3>
                      <button onClick={() => setShowActivityModal(false)}><X className="text-gray-400 hover:text-white" /></button>
                  </div>
                  <form onSubmit={handleSaveActivity} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                          <input required placeholder="Title" value={activityForm.title || ''} onChange={e => setActivityForm({...activityForm, title: e.target.value})} className="bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                          <input required placeholder="Subtitle" value={activityForm.subtitle || ''} onChange={e => setActivityForm({...activityForm, subtitle: e.target.value})} className="bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <select value={activityForm.category || 'Adventure'} onChange={e => setActivityForm({...activityForm, category: e.target.value})} className="bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none">
                              <option value="Adventure">Adventure</option>
                              <option value="Culture">Culture</option>
                              <option value="Sightseeing">Sightseeing</option>
                              <option value="Gastronomy">Gastronomy</option>
                          </select>
                          <input required placeholder="Price (e.g. $85)" value={activityForm.price || ''} onChange={e => setActivityForm({...activityForm, price: e.target.value})} className="bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      </div>
                      <textarea placeholder="Description" value={activityForm.description || ''} onChange={e => setActivityForm({...activityForm, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none h-24" />
                      <input required placeholder="Image URL" value={activityForm.image || ''} onChange={e => setActivityForm({...activityForm, image: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Duration (e.g. 3 Hours)" value={activityForm.duration || ''} onChange={e => setActivityForm({...activityForm, duration: e.target.value})} className="bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                          <input type="number" step="0.1" placeholder="Rating (0-5)" value={activityForm.rating || ''} onChange={e => setActivityForm({...activityForm, rating: parseFloat(e.target.value)})} className="bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      </div>
                      <button type="submit" className="w-full bg-gold-400 text-black font-bold uppercase py-3 rounded hover:bg-white">Save Experience</button>
                  </form>
              </div>
          </div>
      )}

      {showPromoModal && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-900 w-full max-w-md rounded-xl border border-white/10 overflow-hidden animate-fade-in-up">
                  <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white uppercase">New Promotion</h3>
                      <button onClick={() => setShowPromoModal(false)}><X className="text-gray-400 hover:text-white" /></button>
                  </div>
                  <form onSubmit={handleSavePromo} className="p-6 space-y-4">
                      <input required placeholder="Title" value={promoForm.title || ''} onChange={e => setPromoForm({...promoForm, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      <input required placeholder="Subtitle" value={promoForm.subtitle || ''} onChange={e => setPromoForm({...promoForm, subtitle: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      <select value={promoForm.type || 'EVENT'} onChange={e => setPromoForm({...promoForm, type: e.target.value as any})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none">
                          <option value="EVENT">Event</option>
                          <option value="OFFER">Offer</option>
                          <option value="ANNOUNCEMENT">Announcement</option>
                      </select>
                      <input required placeholder="Image URL" value={promoForm.image || ''} onChange={e => setPromoForm({...promoForm, image: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" />
                      <button type="submit" className="w-full bg-gold-400 text-black font-bold uppercase py-3 rounded hover:bg-white">Create Promotion</button>
                  </form>
              </div>
          </div>
      )}

      {/* --- ADD BOOKING MODAL --- */}
      {showAddModal && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
               <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                     <UserPlus size={18} className="text-gold-400" /> New Walk-in / Reservation
                  </h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500">
                     <X size={20} />
                  </button>
               </div>
               
               <form onSubmit={handleCreateBooking} className="p-8 grid grid-cols-2 gap-6">
                  {bookingError && (
                      <div className="col-span-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm text-center font-bold">
                          {bookingError}
                      </div>
                  )}
                  
                  {/* --- Personal Details --- */}
                  <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-2">Guest Identity</div>
                  
                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">First Name</label>
                     <input required type="text" value={newGuestData.firstName} onChange={(e) => setNewGuestData({...newGuestData, firstName: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Last Name</label>
                     <input required type="text" value={newGuestData.lastName} onChange={(e) => setNewGuestData({...newGuestData, lastName: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  
                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Passport Number</label>
                     <input required type="text" value={newGuestData.passport} onChange={(e) => setNewGuestData({...newGuestData, passport: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Nationality</label>
                     <input required type="text" value={newGuestData.nationality} onChange={(e) => setNewGuestData({...newGuestData, nationality: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>

                  {/* --- Contact & Address --- */}
                  <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-2 mt-4">Contact & Address</div>

                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Email Address</label>
                     <input required type="email" value={newGuestData.email} onChange={(e) => setNewGuestData({...newGuestData, email: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Phone Number</label>
                     <input required type="tel" value={newGuestData.phone} onChange={(e) => setNewGuestData({...newGuestData, phone: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="col-span-2">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Street Address</label>
                     <input required type="text" value={newGuestData.address} onChange={(e) => setNewGuestData({...newGuestData, address: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>

                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">City</label>
                     <input required type="text" value={newGuestData.city} onChange={(e) => setNewGuestData({...newGuestData, city: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Country</label>
                        <input required type="text" value={newGuestData.country} onChange={(e) => setNewGuestData({...newGuestData, country: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Zip Code</label>
                        <input required type="text" value={newGuestData.zip} onChange={(e) => setNewGuestData({...newGuestData, zip: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                      </div>
                  </div>
                  
                  {/* --- Stay Details --- */}
                  <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 mb-2 mt-4">Stay Information</div>

                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Check In</label>
                     <input required type="date" value={newGuestData.checkIn} onChange={(e) => setNewGuestData({...newGuestData, checkIn: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Check Out</label>
                     <input required type="date" value={newGuestData.checkOut} onChange={(e) => setNewGuestData({...newGuestData, checkOut: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>

                   <div className="col-span-2">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Apartment Selection</label>
                     <select required value={newGuestData.roomNumber} onChange={(e) => setNewGuestData({...newGuestData, roomNumber: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white">
                         <option value="">Select Unit...</option>
                         {rooms.map(r => <option key={r.number} value={r.number}>{r.name} ({r.number})</option>)}
                     </select>
                  </div>

                  {/* ID Upload Simulation */}
                  <div className="col-span-2">
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Identity Verification</label>
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gold-400 hover:text-gold-400 transition-colors cursor-pointer bg-white/5">
                          <Upload size={24} className="mb-2" />
                          <span className="text-xs uppercase font-bold tracking-widest">Upload Passport / ID Scan</span>
                          <span className="text-[10px] mt-1 opacity-60">Automatic OCR Extraction</span>
                      </div>
                  </div>

                  {/* --- Footer Actions --- */}
                  <div className="col-span-2 flex justify-between items-center pt-6 border-t border-white/10 mt-2">
                      <div className="flex items-center space-x-2 text-gray-400">
                          <Lock size={16} />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Automatic Digital Key Generation</span>
                      </div>
                      <div className="flex gap-3">
                          <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 rounded text-sm text-gray-500 hover:text-white transition-colors">Cancel</button>
                          <button 
                            type="submit" 
                            disabled={isGeneratingKey}
                            className="px-8 py-3 bg-gold-400 text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                              {isGeneratingKey ? (
                                  <>
                                    <Loader size={16} className="animate-spin" />
                                    <span>Connecting to Lock API...</span>
                                  </>
                              ) : (
                                  <>
                                    <span>Confirm Booking</span>
                                    <CheckCircle size={16} />
                                  </>
                              )}
                          </button>
                      </div>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* --- ADD/EDIT MENU ITEM MODAL --- */}
      {showMenuModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up flex flex-col md:flex-row h-[600px]">
               {/* Left: Preview */}
               <div className="w-full md:w-1/3 bg-black/20 p-6 flex flex-col justify-center items-center border-r border-white/10 relative">
                   {currentMenuItem.image ? (
                       <img src={currentMenuItem.image} alt="Preview" className="w-full h-48 object-cover rounded-xl shadow-lg mb-4" />
                   ) : (
                       <div className="w-full h-48 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10 border-dashed">
                           <ImageIcon className="text-gray-500" size={32} />
                       </div>
                   )}
                   <h3 className="text-xl font-serif text-white text-center mb-1">{currentMenuItem.title || 'Dish Name'}</h3>
                   <span className="text-gold-400 font-bold font-serif text-lg">{currentMenuItem.price || '$0'}</span>
               </div>
               {/* Right: Form */}
               <div className="flex-1 flex flex-col h-full">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            {menuFormMode === 'ADD' ? <Plus size={18} className="text-gold-400" /> : <Edit3 size={18} className="text-gold-400" />} 
                            {menuFormMode === 'ADD' ? 'Add Menu Item' : 'Edit Menu Item'}
                        </h3>
                        <button onClick={() => setShowMenuModal(false)} className="text-gray-400 hover:text-red-500">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveMenu} className="p-8 flex-1 overflow-y-auto space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Category</label>
                                <select 
                                    value={currentMenuItem.category}
                                    onChange={e => setCurrentMenuItem({...currentMenuItem, category: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                                >
                                    {['Breakfast', 'Lunch', 'Dinner', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Price (e.g. $25)</label>
                                <input 
                                    type="text" 
                                    value={currentMenuItem.price}
                                    onChange={e => setCurrentMenuItem({...currentMenuItem, price: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Item Title</label>
                            <input 
                                type="text" 
                                value={currentMenuItem.title}
                                onChange={e => setCurrentMenuItem({...currentMenuItem, title: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                                placeholder="e.g. Royal Tagine"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Description</label>
                            <textarea 
                                value={currentMenuItem.description}
                                onChange={e => setCurrentMenuItem({...currentMenuItem, description: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none h-20"
                                placeholder="Describe the dish..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Image URL</label>
                            <input 
                                type="text" 
                                value={currentMenuItem.image}
                                onChange={e => setCurrentMenuItem({...currentMenuItem, image: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        {/* Ingredients Builder */}
                        <div>
                             <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Ingredients</label>
                             <div className="flex gap-2 mb-2">
                                 <input 
                                    type="text" 
                                    value={ingredientInput}
                                    onChange={e => setIngredientInput(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded p-2 text-sm text-white focus:border-gold-400 outline-none"
                                    placeholder="Add ingredient..."
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                                 />
                                 <button type="button" onClick={handleAddIngredient} className="bg-white/10 hover:bg-white/20 p-2 rounded text-white">
                                     <Plus size={16} />
                                 </button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                 {currentMenuItem.ingredients?.map((ing, idx) => (
                                     <span key={idx} className="bg-gold-400/20 text-gold-400 text-xs px-2 py-1 rounded flex items-center">
                                         {ing}
                                         <button type="button" onClick={() => handleRemoveIngredient(idx)} className="ml-1 hover:text-white"><X size={12}/></button>
                                     </span>
                                 ))}
                             </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                            <input 
                                type="checkbox" 
                                checked={currentMenuItem.isVegetarian}
                                onChange={e => setCurrentMenuItem({...currentMenuItem, isVegetarian: e.target.checked})}
                                className="w-4 h-4 rounded bg-white/5 border-white/10 accent-gold-400"
                            />
                            <span className="text-sm text-gray-300">Vegetarian / Plant Based</span>
                        </div>
                    </form>

                    <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                         <button type="button" onClick={() => setShowMenuModal(false)} className="px-6 py-3 rounded text-sm text-gray-500 hover:text-white">Cancel</button>
                         <button onClick={handleSaveMenu} className="px-6 py-3 bg-gold-400 text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white">
                             {menuFormMode === 'ADD' ? 'Add Item' : 'Save Changes'}
                         </button>
                    </div>
               </div>
            </div>
          </div>
      )}

      {/* --- ADD APARTMENT MODAL --- */}
      {showAddRoomModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up">
               <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                     <BedDouble size={18} className="text-gold-400" /> New Apartment Profile
                  </h3>
                  <button onClick={() => setShowAddRoomModal(false)} className="text-gray-400 hover:text-red-500">
                     <X size={20} />
                  </button>
               </div>
               <form onSubmit={handleAddRoom} className="p-8 space-y-4">
                  <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Profile Name (e.g. Nomada Origins)</label>
                      <input required type="text" value={newRoomData.name} onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Apartment Number / ID</label>
                      <input required type="text" value={newRoomData.number} onChange={(e) => setNewRoomData({...newRoomData, number: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Room Type</label>
                      <input required type="text" value={newRoomData.type} onChange={(e) => setNewRoomData({...newRoomData, type: e.target.value})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Floor</label>
                      <input required type="number" value={newRoomData.floor} onChange={(e) => setNewRoomData({...newRoomData, floor: Number(e.target.value)})} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded p-3 text-sm focus:border-gold-400 outline-none text-gray-900 dark:text-white" />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                      <button type="button" onClick={() => setShowAddRoomModal(false)} className="px-6 py-3 rounded text-sm text-gray-500 hover:text-white">Cancel</button>
                      <button type="submit" className="px-6 py-3 bg-gold-400 text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white">Save Profile</button>
                  </div>
               </form>
            </div>
          </div>
      )}

      {/* --- CONTRACT MODAL --- */}
      {showContract && selectedBooking && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            {/* ... Existing Contract Modal Content ... */}
            <div className="bg-white text-black w-full max-w-3xl h-[85vh] rounded-lg shadow-2xl flex flex-col animate-fade-in-up">
                 <div className="bg-gray-100 p-4 border-b border-gray-300 flex justify-between items-center rounded-t-lg">
                     <h3 className="font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">Contract</h3>
                     <button onClick={() => setShowContract(false)}><X size={20} /></button>
                 </div>
                 <div className="p-12 flex-1 overflow-y-auto">
                     <h1 className="text-2xl font-serif text-center mb-8">Short Term Rental Agreement</h1>
                     
                     <div className="mb-8 border p-4 rounded bg-gray-50 text-sm">
                         <div className="grid grid-cols-2 gap-4">
                             <div><span className="font-bold">Guest:</span> {selectedBooking.guest.fullName}</div>
                             <div><span className="font-bold">Passport:</span> {selectedBooking.guest.passportNumber}</div>
                             <div><span className="font-bold">Nationality:</span> {selectedBooking.guest.nationality}</div>
                             <div><span className="font-bold">Phone:</span> {selectedBooking.guest.phone || 'N/A'}</div>
                             <div><span className="font-bold">Address:</span> {selectedBooking.guest.address || 'N/A'}, {selectedBooking.guest.city}</div>
                             <div><span className="font-bold">Unit:</span> {selectedBooking.roomNumber}</div>
                             <div><span className="font-bold">Check In:</span> {selectedBooking.checkInDate}</div>
                             <div><span className="font-bold">Check Out:</span> {selectedBooking.checkOutDate}</div>
                         </div>
                     </div>

                     <p className="mb-4">This agreement is between <strong>{hotelConfig.name}</strong> and <strong>{selectedBooking.guest.fullName}</strong> for the rental of Unit {selectedBooking.roomNumber}.</p>
                     <p className="mb-4">1. The Guest agrees to abide by all house rules.</p>
                     <p className="mb-4">2. Check-out time is 11:00 AM on {selectedBooking.checkOutDate}.</p>
                     <p className="mb-4">3. Smoking is strictly prohibited inside the apartment.</p>
                     
                     <p className="mt-8 text-sm text-gray-500">Sign below to accept terms.</p>
                     
                     <div className="mt-8 h-32 border-b border-black border-dashed"></div>
                     <p className="text-xs uppercase mt-2">Guest Signature</p>
                 </div>
                 
                 <div className="p-6 border-t flex justify-between gap-4 bg-gray-50">
                     <div className="flex gap-2">
                         <button onClick={handlePrintContract} className="bg-white border border-gray-300 text-black px-4 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-100 flex items-center gap-2">
                             <Printer size={16} /> Print
                         </button>
                         <button className="bg-white border border-gray-300 text-black px-4 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-100 flex items-center gap-2">
                             <Camera size={16} /> Upload Signed
                         </button>
                     </div>
                     <button onClick={handleSignContract} className="bg-black text-white px-8 py-3 rounded text-sm font-bold uppercase tracking-widest">Sign & Check In</button>
                 </div>
            </div>
         </div>
      )}

    </div>
  );
};

// ... Sub Components ...
const AdminNavItem: React.FC<{ icon: any, label: string, isActive: boolean, onClick: () => void, badge?: number }> = ({ icon: Icon, label, isActive, onClick, badge }) => (
   <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
   >
      <div className="flex items-center space-x-4">
          <Icon size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {badge}
          </span>
      )}
   </button>
);

const ComplianceStep: React.FC<{ label: string, done: boolean, icon: any, action?: () => void, actionLabel?: string }> = ({ label, done, icon: Icon, action, actionLabel }) => (
   <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center space-x-3">
         <div className={`p-1.5 rounded-full ${done ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
            {done ? <CheckCircle size={14} /> : <Icon size={14} />}
         </div>
         <span className={`text-sm ${done ? 'text-white' : 'text-gray-500'}`}>{label}</span>
      </div>
      {!done && action ? (
         <button onClick={action} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded uppercase font-bold text-gray-300">
            {actionLabel}
         </button>
      ) : !done ? (
         <span className="text-[10px] text-gray-600 uppercase font-bold">Pending</span>
      ) : (
         <span className="text-[10px] text-green-500 uppercase font-bold">Done</span>
      )}
   </div>
);

const StatCard: React.FC<{ icon: any, label: string, value: string, sub: string }> = ({ icon: Icon, label, value, sub }) => (
   <div className="glass-panel p-6 rounded-2xl">
     <div className="flex justify-between items-start mb-4">
       <div className="p-3 bg-white/5 rounded-lg text-gold-400">
         <Icon size={20} />
       </div>
     </div>
     <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-1">{label}</h3>
     <p className="text-3xl font-serif text-white mb-2">{value}</p>
     <p className="text-xs text-green-400">{sub}</p>
   </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
   const styles: Record<string, string> = {
      'CONFIRMED': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      'CHECKED_IN': 'bg-green-500/20 text-green-400 border-green-500/20',
      'CHECKED_OUT': 'bg-gray-500/20 text-gray-400 border-gray-500/20',
      'CANCELLED': 'bg-red-500/20 text-red-400 border-red-500/20',
   };
   return (
      <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles['CONFIRMED']}`}>
         {status.replace('_', ' ')}
      </span>
   );
};

const RoomStatusBadge: React.FC<{ status: string }> = ({ status }) => {
   const styles: Record<string, string> = {
      'AVAILABLE': 'bg-green-500',
      'OCCUPIED': 'bg-red-500',
      'DIRTY': 'bg-yellow-500',
      'MAINTENANCE': 'bg-gray-500',
   };
   return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-black ${styles[status]}`}>
         {status}
      </span>
   );
};

const ChannelBadge: React.FC<{ channel: BookingChannel }> = ({ channel }) => {
    if (channel === 'AIRBNB') return <span className="text-[#FF5A5F] font-bold text-xs uppercase">Airbnb</span>;
    if (channel === 'BOOKING_COM') return <span className="text-[#003580] font-bold text-xs uppercase">Booking.com</span>;
    if (channel === 'DIRECT') return <span className="text-gold-400 font-bold text-xs uppercase">Direct</span>;
    return <span className="text-gray-500 font-bold text-xs uppercase">{channel}</span>;
}

export default AdminDashboard;
