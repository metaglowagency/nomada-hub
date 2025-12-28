
import React, { useState, useRef } from 'react';
import { useSystem } from '../context/SystemContext';
import { Booking, GuestProfile, BookingChannel, Room, RoomStatus, MenuItem, Activity, Promotion, RequestStatus } from '../types';
// Add missing import for ASSETS
import { ASSETS } from '../assets';
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
  Bell,
  RefreshCcw
} from 'lucide-react';

type AdminTab = 'OVERVIEW' | 'CHECKING' | 'CALENDAR' | 'BOOKINGS' | 'APARTMENTS' | 'DINING' | 'HOUSEKEEPING' | 'MAINTENANCE' | 'MESSAGES' | 'SETTINGS' | 'MARKETING' | 'REQUESTS';

const AdminDashboard: React.FC = () => {
  const { 
    hotelConfig, updateHotelConfig, resetSystemData,
    orders, bookings, rooms, addRoom, updateRoomStatus, updateBookingStatus, signContract, verifyIdentity, createBooking, checkAvailability, isSyncing, lastSynced, syncChannels,
    tickets, updateTicketStatus, threads, sendMessage,
    menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    activities, addActivity, updateActivity, deleteActivity,
    promotions, addPromotion, deletePromotion, togglePromotion,
    guestRequests, updateRequestStatus
  } = useSystem();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newGuestData, setNewGuestData] = useState({
     firstName: '', lastName: '', email: '', phone: '', passport: '', nationality: '', address: '', city: '', country: '', zip: '', roomNumber: '', checkIn: new Date().toISOString().split('T')[0], checkOut: '', amount: '',
  });
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ name: '', number: '', type: '', floor: 1, });
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuFormMode, setMenuFormMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({
      category: 'Breakfast', title: '', description: '', price: '$', image: '', isVegetarian: false, ingredients: [], available: true
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState<Partial<Activity>>({});
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState<Partial<Promotion>>({});
  const [marketingMode, setMarketingMode] = useState<'ADD' | 'EDIT'>('ADD');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempConfig, setTempConfig] = useState(hotelConfig);

  const arrivals = bookings.filter(b => b.status === 'CONFIRMED');
  const departures = bookings.filter(b => b.status === 'CHECKED_IN'); 
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0) + bookings.reduce((acc, curr) => curr.status === 'CHECKED_IN' || curr.status === 'CHECKED_OUT' ? acc + curr.totalAmount : acc, 0);
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
  const pendingRequestsCount = guestRequests.filter(r => r.status === 'PENDING').length;
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleOpenContract = (booking: Booking) => { setSelectedBooking(booking); setShowContract(true); };
  const handleSignContract = () => { if (selectedBooking) { signContract(selectedBooking.id); if (selectedBooking.status === 'CONFIRMED' && selectedBooking.isIdVerified) { updateBookingStatus(selectedBooking.id, 'CHECKED_IN'); } setShowContract(false); } };

  const handleCreateBooking = async (e: React.FormEvent) => {
     e.preventDefault(); setBookingError(''); setIsGeneratingKey(true);
     const generatedDoorCode = await new Promise<string>((resolve) => { setTimeout(() => { const code = Math.floor(100000 + Math.random() * 900000).toString(); resolve(code); }, 1000); });
     setIsGeneratingKey(false);
     const guest: GuestProfile = { id: `G-${Math.floor(Math.random() * 1000)}`, fullName: `${newGuestData.firstName} ${newGuestData.lastName}`, email: newGuestData.email, phone: newGuestData.phone, passportNumber: newGuestData.passport, nationality: newGuestData.nationality, address: newGuestData.address, city: newGuestData.city, country: newGuestData.country, zip: newGuestData.zip, isReturning: false };
     const success = createBooking(guest, newGuestData.roomNumber, newGuestData.checkIn, newGuestData.checkOut, parseFloat(newGuestData.amount) || 0, generatedDoorCode);
     if (success) { setShowAddModal(false); setNewGuestData({ firstName: '', lastName: '', email: '', phone: '', passport: '', nationality: '', address: '', city: '', country: '', zip: '', roomNumber: '', checkIn: '', checkOut: '', amount: '' }); } else { setBookingError('Room unavailable.'); }
  };

  const handleAddRoom = (e: React.FormEvent) => {
      e.preventDefault();
      const newRoom: Room = { id: `apt_${newRoomData.number}`, number: newRoomData.number, name: newRoomData.name, type: newRoomData.type, floor: Number(newRoomData.floor), status: 'AVAILABLE' };
      addRoom(newRoom); setShowAddRoomModal(false); setNewRoomData({ name: '', number: '', type: '', floor: 1 });
  };

  const handleOpenAddMenu = () => { setMenuFormMode('ADD'); setCurrentMenuItem({ category: 'Breakfast', title: '', description: '', price: '$', image: '', isVegetarian: false, ingredients: [], available: true }); setShowMenuModal(true); };
  const handleOpenEditMenu = (item: MenuItem) => { setMenuFormMode('EDIT'); setCurrentMenuItem(item); setShowMenuModal(true); };
  const handleSaveMenu = (e: React.FormEvent) => {
      e.preventDefault(); if (!currentMenuItem.title || !currentMenuItem.price) return;
      const itemToSave = { ...currentMenuItem, image: currentMenuItem.image || ASSETS.DINING.BREAKFAST.SUNRISE, available: currentMenuItem.available ?? true, id: currentMenuItem.id || Math.random().toString(36).substr(2, 9), } as MenuItem;
      if (menuFormMode === 'ADD') addMenuItem(itemToSave); else updateMenuItem(itemToSave);
      setShowMenuModal(false);
  };

  const handleAddIngredient = () => { if(ingredientInput.trim()) { setCurrentMenuItem(prev => ({ ...prev, ingredients: [...(prev.ingredients || []), ingredientInput.trim()] })); setIngredientInput(''); } };
  const handleRemoveIngredient = (idx: number) => { setCurrentMenuItem(prev => ({ ...prev, ingredients: prev.ingredients?.filter((_, i) => i !== idx) })); };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              alert("Photo too large! Please use a file smaller than 2MB for browser storage.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => { setActivityForm(prev => ({ ...prev, image: reader.result as string })); };
          reader.readAsDataURL(file);
      }
  };

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
        image: activityForm.image || ASSETS.ACTIVITIES.CAVES,
        highlights: activityForm.highlights || []
    };
    if (marketingMode === 'ADD') addActivity(act); else updateActivity(act);
    setShowActivityModal(false);
  };

  const handleSavePromo = (e: React.FormEvent) => {
      e.preventDefault();
      const promo: Promotion = { id: promoForm.id || Math.random().toString(36), title: promoForm.title || '', subtitle: promoForm.subtitle || '', image: promoForm.image || '', type: promoForm.type || 'EVENT', active: promoForm.active ?? true };
      addPromotion(promo); setShowPromoModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => { e.preventDefault(); if(messageInput.trim()) { sendMessage(activeThreadId, messageInput); setMessageInput(''); } };
  const saveSettings = () => { updateHotelConfig(tempConfig); alert('Settings Saved'); };

  const activeThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <div className="w-64 border-r border-white/10 flex flex-col bg-black/50 backdrop-blur-xl">
        <div className="p-8"><span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-1">Nomada</span><h1 className="text-xl font-serif text-white truncate">{hotelConfig.name}</h1></div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
           <div className="mb-4">
             <p className="px-4 text-[10px] text-gray-500 uppercase tracking-wider mb-2">Front Desk</p>
             <AdminNavItem icon={Bell} label="Concierge Desk" isActive={activeTab === 'REQUESTS'} onClick={() => setActiveTab('REQUESTS')} badge={pendingRequestsCount} />
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
           <div><p className="px-4 text-[10px] text-gray-500 uppercase tracking-wider mb-2">System</p><AdminNavItem icon={Settings} label="Settings" isActive={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} /></div>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-serif text-white">
            {activeTab === 'OVERVIEW' && 'Property Overview'}
            {activeTab === 'SETTINGS' && 'System Configuration'}
            {/* ... other tab titles ... */}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center text-black font-bold">M</div>
          </div>
        </header>

        {activeTab === 'SETTINGS' && (
           <div className="animate-fade-in-up">
              <div className="max-w-2xl">
                  <h3 className="text-2xl font-serif mb-8">System Configuration</h3>
                  <div className="glass-panel p-8 rounded-2xl space-y-6">
                      <div><label className="block text-xs uppercase font-bold text-gray-500 mb-2">Property Name</label><input value={tempConfig.name} onChange={(e) => setTempConfig({...tempConfig, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none" /></div>
                      <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                          <button onClick={saveSettings} className="w-full bg-gold-400 text-black px-8 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-white transition-all">Save Configuration</button>
                          <button 
                            onClick={resetSystemData}
                            className="w-full border border-red-500/50 text-red-400 px-8 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                              <RefreshCcw size={16} />
                              Reset All Data (Emergency)
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        )}
        
        {/* ... Rest of Tab Conditionals (MARKETING, DINING, REQUESTS, etc) ... */}
        {activeTab === 'MARKETING' && (
            <div className="animate-fade-in-up space-y-8">
                <div className="glass-panel p-8 rounded-2xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-serif text-white">Curated Experiences</h3><button onClick={() => { setActivityForm({}); setMarketingMode('ADD'); setShowActivityModal(true); }} className="bg-gold-400 text-black px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2 hover:bg-white"><Plus size={16} /> Add Activity</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{activities.map(activity => (<div key={activity.id} className="group relative rounded-xl overflow-hidden aspect-video border border-white/10"><img src={activity.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"><button onClick={() => { setActivityForm(activity); setMarketingMode('EDIT'); setShowActivityModal(true); }} className="p-2 bg-white rounded-full text-black hover:bg-gold-400"><Edit3 size={18} /></button><button onClick={() => deleteActivity(activity.id)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"><Trash2 size={18} /></button></div><div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none"><h4 className="text-white font-bold">{activity.title}</h4><p className="text-xs text-gray-300">{activity.category}</p></div></div>))}</div></div>
            </div>
        )}
      </div>

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
                      <textarea placeholder="Description" value={activityForm.description || ''} onChange={e => setActivityForm({...activityForm, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-400 outline-none h-24" />
                      <div>
                          <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Experience Photo</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div onClick={() => fileInputRef.current?.click()} className="relative border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-white/5 min-h-[140px] overflow-hidden group/upload">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                    {activityForm.image ? (<><img src={activityForm.image} className="w-full h-full object-cover absolute inset-0" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 flex flex-col items-center justify-center transition-opacity"><Camera size={24} className="text-white mb-1" /><span className="text-[10px] text-white font-bold uppercase">Change Photo</span></div></>) : (<div className="flex flex-col items-center p-4 text-gray-500 hover:text-gold-400"><Upload size={24} className="mb-2" /><span className="text-[10px] uppercase font-bold tracking-widest text-center">Upload Local Photo</span></div>)}
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Or use External URL</span>
                                    <input placeholder="https://..." value={activityForm.image || ''} onChange={e => setActivityForm({...activityForm, image: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white focus:border-gold-400 outline-none" />
                                </div>
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-gold-400 text-black font-bold uppercase py-3 rounded hover:bg-white transition-all">Save Experience</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const AdminNavItem: React.FC<{ icon: any, label: string, isActive: boolean, onClick: () => void, badge?: number }> = ({ icon: Icon, label, isActive, onClick, badge }) => (
   <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><div className="flex items-center space-x-4"><Icon size={20} /><span className="text-sm font-bold uppercase tracking-widest">{label}</span></div>{badge !== undefined && badge > 0 && (<span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{badge}</span>)}</button>
);

const StatCard: React.FC<{ icon: any, label: string, value: string, sub: string }> = ({ icon: Icon, label, value, sub }) => (
   <div className="glass-panel p-6 rounded-2xl"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-white/5 rounded-lg text-gold-400"><Icon size={20} /></div></div><h3 className="text-xs uppercase tracking-widest text-gray-500 mb-1">{label}</h3><p className="text-3xl font-serif text-white mb-2">{value}</p><p className="text-xs text-green-400">{sub}</p></div>
);

export default AdminDashboard;
