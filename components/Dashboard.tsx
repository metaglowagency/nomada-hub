
import React from 'react';
import WeatherWidget from './WeatherWidget';
import ClockWidget from './ClockWidget';
import ActivityScroller from './ActivityScroller';
import { useSystem } from '../context/SystemContext';
import { ASSETS } from '../assets';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles,
  Lightbulb,
  BellOff,
  Wind
} from 'lucide-react';
import { Tab } from '../types';

interface DashboardProps {
    onNavigate: (tab: Tab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { bookings, rooms, deviceRoomNumber, guestRequests } = useSystem();
  
  const [suiteState, setSuiteState] = React.useState({ light: true, privacy: false, ac: 22 });

  const currentRoom = (rooms || []).find(r => r.number === deviceRoomNumber);
  const roomName = currentRoom?.name || `Suite ${deviceRoomNumber}`;

  const activeBooking = (bookings || []).find(b => 
    b.roomNumber === deviceRoomNumber && b.status === 'CHECKED_IN'
  );

  const guestName = activeBooking ? activeBooking.guest.fullName.split(' ')[0] : 'Guest';

  const latestRequest = (guestRequests || [])
    .filter(r => r.roomNumber === deviceRoomNumber && r.status !== 'COMPLETED' && r.status !== 'CANCELLED')
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <div className="flex flex-col animate-fade-in-up h-full pb-4 gap-6" role="main">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 px-1 shrink-0">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
           <div className="mb-4 md:mb-0">
              <img 
                src={ASSETS.BRANDING.LOGO} 
                alt="Nomada Logo" 
                className="h-32 md:h-40 w-auto object-contain transition-all"
                onError={(e) => {
                   console.error("Dashboard logo load fail:", ASSETS.BRANDING.LOGO);
                }}
              />
           </div>

           <div className="pb-2">
              <div className="flex items-center space-x-3 mb-1">
                  <span className="w-2 h-2 rounded-full animate-pulse bg-gold-400 shadow-[0_0_8px_rgba(197,160,89,0.6)]"></span>
                  <span className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.4em]">
                      {activeBooking ? roomName : 'Nomada Experience'}
                  </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white leading-tight">
                {greeting}, <span className="italic text-gray-400 dark:text-gray-500 font-light">{guestName}.</span>
              </h1>
           </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl mb-2">
            <ControlIcon 
                icon={Lightbulb} 
                active={suiteState.light} 
                onClick={() => setSuiteState(s => ({...s, light: !s.light}))} 
            />
            <ControlIcon 
                icon={BellOff} 
                active={suiteState.privacy} 
                onClick={() => setSuiteState(s => ({...s, privacy: !s.privacy}))} 
                danger 
            />
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center px-4 space-x-3">
                <Wind size={16} className="text-gray-500" />
                <span className="text-sm font-mono text-white font-bold">{suiteState.ac}°</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-48 shrink-0">
         <div className="lg:col-span-3"><ClockWidget /></div>
         <div className="lg:col-span-3"><WeatherWidget /></div>
         <div className="lg:col-span-6">
            {latestRequest ? (
                <div className="glass-panel p-5 rounded-3xl h-full flex flex-col justify-between border-t-4 border-t-gold-400 animate-fade-in shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[9px] text-gold-400 uppercase tracking-[0.3em] font-bold block mb-0.5">Active Request</span>
                            <h3 className="text-lg font-serif text-white">{latestRequest.title}</h3>
                        </div>
                        <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${latestRequest.status === 'PENDING' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500 text-white animate-pulse'}`}>
                            {latestRequest.status}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 italic line-clamp-1 leading-relaxed">"{latestRequest.details}"</p>
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></div>
                            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Host is responding</span>
                         </div>
                         <button onClick={() => onNavigate(Tab.CONCIERGE)} className="text-gold-400 hover:text-white transition-colors"><MessageCircle size={16} /></button>
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-5 rounded-3xl h-full flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all border border-dashed border-white/10 shadow-lg" onClick={() => onNavigate(Tab.CONCIERGE)}>
                    <div className="flex-1">
                        <span className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold block mb-0.5">Local Knowledge</span>
                        <h3 className="text-lg font-serif text-white mb-1 text-gold-400">The Host's Secret</h3>
                        <p className="text-xs text-gray-400 italic">"Kasbah Museum garden has the best sunset views in the city..."</p>
                    </div>
                    <div className="w-10 h-10 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all">
                        <Sparkles size={18} className="animate-pulse" />
                    </div>
                </div>
            )}
         </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col mt-2">
             <div className="flex justify-between items-center mb-4 px-2 shrink-0">
                 <div>
                    <span className="text-[10px] text-gold-400 uppercase tracking-[0.3em] font-bold block mb-0.5">Curated Experiences</span>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white">Discover Tangier</h2>
                 </div>
                 <button onClick={() => onNavigate(Tab.ACTIVITIES)} className="group flex items-center space-x-3 text-[10px] bg-white/5 hover:bg-gold-400 hover:text-black dark:text-white px-5 py-2.5 rounded-full uppercase font-bold transition-all border border-white/10">
                    <span>Explore All</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
             <div className="flex-1 relative z-10 min-h-0 py-1"><ActivityScroller /></div>
      </div>
    </div>
  );
};

const ControlIcon: React.FC<{ icon: any, active: boolean, onClick: () => void, danger?: boolean }> = ({ icon: Icon, active, onClick, danger }) => (
    <button 
        onClick={onClick}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${active 
            ? (danger ? 'bg-red-500/20 text-red-500' : 'bg-gold-400 text-black shadow-lg shadow-gold-400/20') 
            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
    >
        <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
    </button>
);

export default Dashboard;
