
import React from 'react';
import WeatherWidget from './WeatherWidget';
import ClockWidget from './ClockWidget';
import ActivityScroller from './ActivityScroller';
import { useSystem } from '../context/SystemContext';
import { ShoppingBag, ArrowRight, Car, Coffee, Shirt, Lock, BellRing, Phone, Zap, Map } from 'lucide-react';
import { Tab } from '../types';

interface DashboardProps {
    onNavigate: (tab: Tab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { orders, bookings, rooms, deviceRoomNumber } = useSystem();
  
  // Find current room details
  const currentRoom = rooms.find(r => r.number === deviceRoomNumber);
  const roomName = currentRoom?.name || `Suite ${deviceRoomNumber}`;

  // Find the most recent active order for this device
  const activeOrder = orders.find(o => o.status !== 'DELIVERED' && o.roomNumber === deviceRoomNumber);

  // CRITICAL LOGIC: Find the active booking for THIS room
  const activeBooking = bookings.find(b => 
    b.roomNumber === deviceRoomNumber && b.status === 'CHECKED_IN'
  );

  const guestName = activeBooking ? activeBooking.guest.fullName.split(' ')[0] : 'Guest';
  const isReturning = activeBooking?.guest.isReturning;
  const isCheckedIn = !!activeBooking;

  return (
    <div className="flex flex-col animate-fade-in-up h-full pb-2 gap-8" role="main" aria-label="Dashboard Home">
      
      {/* 1. Header / Greeting Section (Compact) */}
      <div className="flex justify-between items-end shrink-0 px-1">
        <div>
           <div className="flex items-center space-x-3 mb-1" role="status" aria-label={isCheckedIn ? "Guest Checked In" : "System Standby"}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] ${isCheckedIn ? 'bg-green-500' : 'bg-orange-500'}`} aria-hidden="true"></span>
              <span className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                  {isCheckedIn ? roomName : 'System Online'}
              </span>
           </div>
           
           <h1 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white leading-none transition-colors duration-500">
             {isCheckedIn ? (
                <>
                  {isReturning ? 'Welcome back,' : 'Discover Nomada,'} <span className="italic text-gray-400 dark:text-gray-500">{guestName}.</span>
                </>
             ) : (
                <>
                  Welcome to <span className="italic text-gray-400 dark:text-gray-500">{roomName}.</span>
                </>
             )}
           </h1>
        </div>
      </div>

      {/* 2. TOP ZONE: Essentials & Operations (Fixed Height Grid) */}
      <div className="h-64 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* COL 1: Clock */}
         <div className="h-full">
             <ClockWidget />
         </div>

         {/* COL 2: Weather */}
         <div className="h-full">
             <WeatherWidget />
         </div>

         {/* COL 3: Status & Quick Actions */}
         <div className="h-full flex flex-col gap-4">
            
            {/* Live Status Card (Conditional) */}
            {activeOrder && (
                 <div className="glass-panel p-5 rounded-3xl relative overflow-hidden flex flex-col justify-center h-1/2 shrink-0 animate-fade-in-up">
                     <div className="relative z-10">
                         <div className="flex justify-between items-start mb-1">
                             <span className="text-[9px] text-gold-400 uppercase tracking-[0.25em] font-bold">Kitchen Status</span>
                             <span className="bg-gold-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                                 {activeOrder.status}
                             </span>
                         </div>
                         <h3 className="text-base text-gray-900 dark:text-white font-serif mb-0">Order #{activeOrder.id}</h3>
                         <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-3">
                             <div className="h-full bg-gold-400 w-2/3 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                         </div>
                     </div>
                 </div>
            )}

            {/* Quick Actions Grid */}
             <div 
                className={`grid grid-cols-2 gap-3 ${activeOrder ? 'h-1/2' : 'h-full'} ${!isCheckedIn ? 'opacity-50 pointer-events-none' : ''}`}
                role="region" 
                aria-label="Quick Actions"
            >
                <QuickAction icon={Car} label="Driver" onClick={() => onNavigate(Tab.VALET)} />
                <QuickAction icon={Coffee} label="Coffee" onClick={() => onNavigate(Tab.DINING)} />
                <QuickAction icon={BellRing} label="Assist" onClick={() => onNavigate(Tab.CONCIERGE)} />
                <QuickAction icon={Map} label="Map" onClick={() => onNavigate(Tab.ACTIVITIES)} />
            </div>
         </div>
      </div>

      {/* 3. BOTTOM ZONE: Curated Experiences (Open Layout) */}
      <div className="flex-1 min-h-0 flex flex-col">
             
             <div className="flex justify-between items-center mb-4 relative z-10 shrink-0 px-2">
                 <div>
                    <span className="text-[9px] text-gold-400 uppercase tracking-[0.25em] font-bold block mb-0.5">Curated Experiences</span>
                    <h2 className="text-xl font-serif text-gray-900 dark:text-white">Explore Tangier</h2>
                 </div>
                 <button 
                    onClick={() => onNavigate(Tab.ACTIVITIES)}
                    className="text-[9px] bg-black/5 dark:bg-white/10 hover:bg-gold-400 hover:text-black dark:text-white px-3 py-1.5 rounded-full uppercase font-bold transition-colors"
                 >
                    View All
                 </button>
             </div>

             <div className="flex-1 relative z-10 min-h-0">
                 <ActivityScroller />
             </div>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ icon: any, label: string, onClick?: () => void }> = ({ icon: Icon, label, onClick }) => (
   <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center rounded-2xl bg-white/40 dark:bg-black/60 border border-white/40 dark:border-white/5 hover:bg-gold-400 hover:text-white dark:hover:text-black transition-all duration-300 group h-full w-full backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
    aria-label={`Request ${label}`}
   >
      <Icon size={18} className="mb-1 text-gray-500 dark:text-gray-400 group-hover:text-white dark:group-hover:text-black transition-colors" aria-hidden="true" />
      <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-500 group-hover:text-white dark:group-hover:text-black transition-colors">{label}</span>
   </button>
);

export default Dashboard;
