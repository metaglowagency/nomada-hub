
import React, { useState, useEffect } from 'react';
import { Tab, AppMode } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Dining from './components/Dining';
import KitchenDisplay from './components/KitchenDisplay';
import AdminDashboard from './components/AdminDashboard';
import Explore from './components/Explore';
import Cleaning from './components/Cleaning';
import Concierge from './components/Concierge';
import Reception from './components/Reception';
import Valet from './components/Valet';
import VoiceAssistant from './components/VoiceAssistant';
import { ASSETS } from './assets';
import { SystemProvider, useSystem } from './context/SystemContext';
import { ChefHat, Monitor, User, Sun, Moon, ArrowRight, Mic, BellRing, Key, Lock, ShieldCheck, Smartphone } from 'lucide-react';

const AppContent: React.FC = () => {
  const { mode, setMode, theme, toggleTheme, rooms, bookings, setDeviceRoomNumber } = useSystem();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [bgIndex, setBgIndex] = useState(0);
  const [showRoleSelector, setShowRoleSelector] = useState(true);
  const [showVoice, setShowVoice] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showGuestPin, setShowGuestPin] = useState(false);
  const [pin, setPin] = useState('');
  const [pendingMode, setPendingMode] = useState<AppMode | null>(null);

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) setBgIndex(0); // Morning
      else if (hour >= 11 && hour < 17) setBgIndex(1); // Day
      else if (hour >= 17 && hour < 20) setBgIndex(2); // Sunset
      else setBgIndex(3); // Night
    };
    updateBackground();
    const interval = setInterval(updateBackground, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (selectedMode: AppMode) => {
    if (selectedMode === AppMode.GUEST) {
        setShowRoomSelector(true);
    } else {
        setPendingMode(selectedMode);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (pin === '0000' && pendingMode) {
          setMode(pendingMode);
          setShowRoleSelector(false);
          setPin('');
          setPendingMode(null);
      } else {
          alert("Incorrect Security PIN");
          setPin('');
      }
  };

  const handleGuestLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const roomBooking = bookings.find(b => b.roomNumber === selectedRoomId && b.status === 'CHECKED_IN');
      const correctPin = roomBooking?.doorCode || '8821'; 

      if (pin === correctPin) {
          setDeviceRoomNumber(selectedRoomId);
          setMode(AppMode.GUEST);
          setShowRoomSelector(false);
          setShowGuestPin(false);
          setShowRoleSelector(false);
          setPin('');
      } else {
          alert("Invalid Door Code. Please check your check-in email.");
          setPin('');
      }
  };

  const handleRoomSelect = (roomId: string) => {
      setSelectedRoomId(roomId);
      setShowGuestPin(true);
  };

  if (showRoleSelector) {
    const LogoHeader = () => (
      <div className="mb-12 flex flex-col items-center">
        <img 
          src={ASSETS.BRANDING.LOGO} 
          alt="Nomada Logo" 
          className="h-48 md:h-64 w-auto object-contain mb-8 transition-all"
        />
        <p className="text-gold-400 uppercase tracking-[0.6em] text-xs font-bold">Ecosystem Portal</p>
      </div>
    );

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 opacity-40">
           <div className="w-full h-full" style={{ backgroundImage: `url(${ASSETS.BACKGROUNDS[1]})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px) brightness(0.5)' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl w-full text-center">
           <LogoHeader />

           {!showRoomSelector && !pendingMode ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
                    <button onClick={() => handleRoleSelect(AppMode.GUEST)} className="glass-panel p-10 rounded-3xl group hover:bg-white/10 transition-all duration-500 flex flex-col items-center border-t-4 border-t-transparent hover:border-t-gold-400">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-gold-400 group-hover:text-black transition-all">
                            <User size={32} />
                        </div>
                        <h2 className="text-xl font-serif text-white mb-2">Guest Login</h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">In-Suite Access</p>
                    </button>
                    <button onClick={() => handleRoleSelect(AppMode.KITCHEN)} className="glass-panel p-10 rounded-3xl group hover:bg-white/10 transition-all duration-500 flex flex-col items-center border-t-4 border-t-transparent hover:border-t-orange-500">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-black transition-all">
                            <ChefHat size={32} />
                        </div>
                        <h2 className="text-xl font-serif text-white mb-2">Kitchen Display</h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Back-office KDS</p>
                    </button>
                    <button onClick={() => handleRoleSelect(AppMode.ADMIN)} className="glass-panel p-10 rounded-3xl group hover:bg-white/10 transition-all duration-500 flex flex-col items-center border-t-4 border-t-transparent hover:border-t-blue-500">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-black transition-all">
                            <Monitor size={32} />
                        </div>
                        <h2 className="text-xl font-serif text-white mb-2">Management</h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Property PMS</p>
                    </button>
                </div>
           ) : pendingMode ? (
               <div className="max-w-sm mx-auto glass-panel p-10 rounded-3xl animate-fade-in-up">
                   <ShieldCheck size={48} className="text-gold-400 mx-auto mb-6" />
                   <h2 className="text-2xl font-serif text-white mb-2">Staff Verification</h2>
                   <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Enter Authorization PIN</p>
                   <form onSubmit={handlePinSubmit}>
                       <input 
                           autoFocus
                           type="password" 
                           value={pin}
                           onChange={(e) => setPin(e.target.value)}
                           maxLength={4}
                           className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center text-3xl tracking-[1em] text-white mb-6 focus:border-gold-400 outline-none font-mono"
                           placeholder="****"
                       />
                       <div className="flex gap-4">
                           <button type="button" onClick={() => setPendingMode(null)} className="flex-1 py-3 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                           <button type="submit" className="flex-1 bg-white text-black font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-gold-400 transition-colors">Verify</button>
                       </div>
                   </form>
               </div>
           ) : showGuestPin ? (
               <div className="max-w-sm mx-auto glass-panel p-10 rounded-3xl animate-fade-in-up">
                   <Lock size={48} className="text-gold-400 mx-auto mb-6" />
                   <h2 className="text-2xl font-serif text-white mb-1">Suite Access</h2>
                   <p className="text-gray-400 text-sm mb-2 font-serif italic">{rooms.find(r => r.number === selectedRoomId)?.name}</p>
                   <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest font-bold">Enter your 4-digit Door Code</p>
                   <form onSubmit={handleGuestLoginSubmit}>
                       <input 
                           autoFocus
                           type="password" 
                           value={pin}
                           onChange={(e) => setPin(e.target.value)}
                           maxLength={4}
                           className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center text-3xl tracking-[1em] text-white mb-6 focus:border-gold-400 outline-none font-mono"
                           placeholder="****"
                       />
                       <div className="flex gap-4">
                           <button type="button" onClick={() => setShowGuestPin(false)} className="flex-1 py-3 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-[10px]">Back</button>
                           <button type="submit" className="flex-1 bg-gold-400 text-black font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-white transition-colors">Login to Suite</button>
                       </div>
                   </form>
               </div>
           ) : (
               <div className="max-w-lg mx-auto glass-panel p-10 rounded-3xl animate-fade-in-up">
                   <div className="flex items-center justify-center mb-8 space-x-4">
                        <Key size={32} className="text-gold-400" />
                        <div className="text-left">
                            <h2 className="text-2xl font-serif text-white">Apartment Selection</h2>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Choose your unit to begin</p>
                        </div>
                   </div>
                   
                   <div className="space-y-3 mb-10 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                       {rooms.map(room => (
                           <button 
                                key={room.number} 
                                onClick={() => handleRoomSelect(room.number)} 
                                className={`w-full p-5 rounded-2xl text-left border transition-all flex justify-between items-center bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-gold-400/50 group`}
                           >
                               <div className="flex items-center space-x-4">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-gray-500 group-hover:text-gold-400 transition-colors`}>
                                       <Smartphone size={16} />
                                   </div>
                                   <div>
                                       <span className="block font-bold text-sm tracking-wide text-white">{room.name}</span>
                                       <span className="text-[10px] uppercase opacity-70 tracking-widest">Suite {room.number} • Floor {room.floor}</span>
                                   </div>
                               </div>
                               <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                           </button>
                       ))}
                   </div>

                   <div className="flex gap-6 items-center border-t border-white/10 pt-8">
                       <button onClick={() => setShowRoomSelector(false)} className="w-full py-4 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">Return to Roles</button>
                   </div>
               </div>
           )}
        </div>
      </div>
    );
  }

  if (mode === AppMode.KITCHEN) return <div className="dark"><KitchenDisplay /></div>;
  if (mode === AppMode.ADMIN) return <div className="dark"><AdminDashboard /></div>;

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD: return <Dashboard onNavigate={setActiveTab} />;
      case Tab.DINING: return <Dining />;
      case Tab.VALET: return <Valet />;
      case Tab.ACTIVITIES: return <Explore />;
      case Tab.CLEANING: return <Cleaning />;
      case Tab.CONCIERGE: return <Concierge />; 
      case Tab.RECEPTION: return <Reception />; 
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={`${theme} relative w-full h-screen overflow-hidden flex font-sans transition-colors duration-500 bg-gray-100 dark:bg-black`}>
      <div className="absolute inset-0 overflow-hidden">
        {ASSETS.BACKGROUNDS.map((bg, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-full h-full animate-slow-zoom" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent pointer-events-none" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 relative z-10 p-8 md:p-12 overflow-y-auto h-full scroll-smooth">
        <div className="max-w-7xl mx-auto h-full flex flex-col">{renderContent()}</div>
      </main>

      <div className="absolute top-8 right-10 z-30 flex space-x-6 items-center">
        <button onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md hover:bg-gold-400 hover:text-white dark:hover:text-black transition-all text-gray-600 dark:text-white border border-transparent dark:border-white/10">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-white/80 hover:text-gold-300 transition-colors cursor-pointer" onClick={() => setActiveTab(Tab.RECEPTION)}>
           <BellRing size={18} strokeWidth={1.5} />
           <span className="text-xs uppercase tracking-[0.2em] font-light hidden md:inline">Service</span>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-40">
          <button onClick={() => setShowVoice(true)} className="w-16 h-16 rounded-full bg-gold-400 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
              <Mic size={28} />
          </button>
      </div>

      {showVoice && <VoiceAssistant onClose={() => setShowVoice(false)} onNavigate={setActiveTab} />}
    </div>
  );
};

const App: React.FC = () => <SystemProvider><AppContent /></SystemProvider>;
export default App;
