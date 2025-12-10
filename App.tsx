
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
import VoiceAssistant from './components/VoiceAssistant'; // Import VoiceAssistant
import { ASSETS } from './assets';
import { SystemProvider, useSystem } from './context/SystemContext';
import { BellRing, ConciergeBell, MapPin, ChefHat, Monitor, User, Sun, Moon, ArrowRight, Mic } from 'lucide-react';

// Wrapper component to handle routing based on System Context
const AppContent: React.FC = () => {
  const { mode, setMode, theme, toggleTheme, rooms, setDeviceRoomNumber } = useSystem();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [bgIndex, setBgIndex] = useState(0);
  const [showRoleSelector, setShowRoleSelector] = useState(true);
  
  // Voice Assistant State
  const [showVoice, setShowVoice] = useState(false);
  
  // State for Tablet Assignment
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  // Rotate backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % ASSETS.BACKGROUNDS.length);
    }, 90000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (selectedMode: AppMode) => {
    if (selectedMode === AppMode.GUEST) {
        // Don't just go to guest, ask which room this is first
        setShowRoomSelector(true);
    } else {
        setMode(selectedMode);
        setShowRoleSelector(false);
    }
  };

  const handleRoomConfirm = () => {
      if (!selectedRoomId) return;
      setDeviceRoomNumber(selectedRoomId);
      setMode(AppMode.GUEST);
      setShowRoomSelector(false);
      setShowRoleSelector(false);
  };

  // --- ROLE SELECTOR SCREEN ---
  if (showRoleSelector) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden font-sans">
        {/* Background */}
        <div className="absolute inset-0 opacity-40">
           <div 
             className="w-full h-full"
             style={{
               backgroundImage: `url(${ASSETS.BACKGROUNDS[1]})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               filter: 'blur(20px) brightness(0.5)'
             }}
           />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center">
           <h1 className="text-6xl font-serif text-white mb-2 tracking-tight">NOMADA</h1>
           <p className="text-gold-400 uppercase tracking-[0.4em] mb-16 text-sm">Ecosystem Portal</p>
           
           {!showRoomSelector ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <button 
                        onClick={() => handleRoleSelect(AppMode.GUEST)}
                        className="glass-panel p-10 rounded-2xl group hover:bg-white/10 transition-all duration-300 flex flex-col items-center border-t-4 border-t-transparent hover:border-t-gold-400"
                    >
                        <User size={48} className="text-gray-400 group-hover:text-white mb-6 transition-colors" />
                        <h2 className="text-xl font-serif text-white mb-2">Guest Suite</h2>
                        <p className="text-gray-500 text-sm">In-Room Tablet Interface</p>
                    </button>

                    <button 
                        onClick={() => handleRoleSelect(AppMode.KITCHEN)}
                        className="glass-panel p-10 rounded-2xl group hover:bg-white/10 transition-all duration-300 flex flex-col items-center border-t-4 border-t-transparent hover:border-t-orange-500"
                    >
                        <ChefHat size={48} className="text-gray-400 group-hover:text-white mb-6 transition-colors" />
                        <h2 className="text-xl font-serif text-white mb-2">Kitchen Display</h2>
                        <p className="text-gray-500 text-sm">Order Management System</p>
                    </button>

                    <button 
                        onClick={() => handleRoleSelect(AppMode.ADMIN)}
                        className="glass-panel p-10 rounded-2xl group hover:bg-white/10 transition-all duration-300 flex flex-col items-center border-t-4 border-t-transparent hover:border-t-blue-500"
                    >
                        <Monitor size={48} className="text-gray-400 group-hover:text-white mb-6 transition-colors" />
                        <h2 className="text-xl font-serif text-white mb-2">Admin Dashboard</h2>
                        <p className="text-gray-500 text-sm">Property Overview</p>
                    </button>
                </div>
           ) : (
               <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl animate-fade-in-up">
                   <h2 className="text-2xl font-serif text-white mb-6">Device Assignment</h2>
                   <p className="text-gray-400 text-sm mb-6">Select the Apartment Profile this device belongs to. This will link the dashboard to the specific unit.</p>
                   
                   <div className="space-y-4 mb-8">
                       {rooms.map(room => (
                           <button
                                key={room.number}
                                onClick={() => setSelectedRoomId(room.number)}
                                className={`w-full p-4 rounded-xl text-left border transition-all flex justify-between items-center ${selectedRoomId === room.number ? 'bg-gold-400 text-black border-gold-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                           >
                               <div>
                                   <span className="block font-bold text-sm">{room.name}</span>
                                   <span className="text-xs opacity-70">Unit {room.number}</span>
                               </div>
                               {selectedRoomId === room.number && <ArrowRight size={16} />}
                           </button>
                       ))}
                   </div>

                   <div className="flex gap-4">
                       <button onClick={() => setShowRoomSelector(false)} className="flex-1 py-3 text-gray-500 hover:text-white transition-colors">Back</button>
                       <button 
                            onClick={handleRoomConfirm} 
                            disabled={!selectedRoomId}
                            className="flex-1 bg-white text-black font-bold uppercase tracking-widest text-xs py-3 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                            Launch
                       </button>
                   </div>
               </div>
           )}
        </div>
      </div>
    );
  }

  // --- KITCHEN MODE ---
  if (mode === AppMode.KITCHEN) {
    return (
        <div className="dark">
            <KitchenDisplay />
            <button 
                onClick={() => setShowRoleSelector(true)} 
                className="fixed bottom-4 left-4 text-white/20 hover:text-white text-xs z-50 uppercase tracking-widest"
            >
                Exit to Menu
            </button>
        </div>
    );
  }

  // --- ADMIN MODE ---
  if (mode === AppMode.ADMIN) {
    return (
        <div className="dark">
            <AdminDashboard />
            <button 
                onClick={() => setShowRoleSelector(true)} 
                className="fixed bottom-4 left-4 text-white/20 hover:text-white text-xs z-50 uppercase tracking-widest"
            >
                Exit to Menu
            </button>
        </div>
    );
  }

  // --- GUEST MODE (Original App) ---
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
      {/* Backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        {ASSETS.BACKGROUNDS.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
          >
             <div 
               className="w-full h-full animate-slow-zoom"
               style={{
                 backgroundImage: `url(${bg})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
               }}
             />
          </div>
        ))}
        {/* Dynamic Gradient based on Theme - Adjusted for darker, richer black mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent pointer-events-none transition-colors duration-500" />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 pointer-events-none mix-blend-overlay transition-all duration-500" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 relative z-10 p-8 md:p-12 overflow-y-auto h-full scroll-smooth">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
           {renderContent()}
        </div>
      </main>

      {/* Status Bar */}
      <div className="absolute top-8 right-10 z-30 flex space-x-6 items-center">
        
        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md hover:bg-gold-400 hover:text-white dark:hover:text-black transition-all text-gray-600 dark:text-white border border-transparent dark:border-white/10"
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center space-x-2 text-gray-600 dark:text-white/80 hover:text-gold-300 transition-colors cursor-pointer">
           <BellRing size={18} strokeWidth={1.5} />
           <span className="text-xs uppercase tracking-[0.2em] font-light hidden md:inline">Service</span>
        </div>
        <button onClick={() => setShowRoleSelector(true)} className="opacity-0 hover:opacity-100 transition-opacity text-white/20">.</button>
      </div>

      {/* --- FLOATING VOICE ASSISTANT BUTTON --- */}
      <div className="fixed bottom-8 right-8 z-40">
          <button 
            onClick={() => setShowVoice(true)}
            className="w-16 h-16 rounded-full bg-gold-400 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
          >
              <Mic size={28} className="group-hover:animate-pulse" />
          </button>
      </div>

      {/* --- VOICE ASSISTANT OVERLAY --- */}
      {showVoice && <VoiceAssistant onClose={() => setShowVoice(false)} onNavigate={setActiveTab} />}

    </div>
  );
};

const App: React.FC = () => {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
};

export default App;
