
import React, { useState } from 'react';
import { Tab } from '../types';
import { ASSETS } from '../assets';
import { useSystem } from '../context/SystemContext';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Sparkles, 
  Map, 
  Phone, 
  TentTree,
  Globe,
  Wifi,
  Star,
  X,
  Send,
  QrCode,
  Car,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

// Custom Logo Component matching the "Nomada Experience" Arch aesthetics
const NomadaLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Arch Frame */}
    <path d="M10 150V60C10 32.3858 32.3858 10 60 10H40C67.6142 10 90 32.3858 90 60V150H10Z" stroke="currentColor" strokeWidth="2" />
    <path d="M16 150V60C16 38 34 20 50 20C66 20 84 38 84 60V150" stroke="currentColor" strokeWidth="1" />
    
    {/* Base Decoration */}
    <path d="M10 140H90" stroke="currentColor" strokeWidth="1" />
    <path d="M35 140L50 120L65 140" stroke="currentColor" strokeWidth="1" />
    
    {/* Central Stem & Leaves */}
    <line x1="50" y1="120" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 110C50 110 30 100 30 90" stroke="currentColor" strokeWidth="1" />
    <path d="M50 110C50 110 70 100 70 90" stroke="currentColor" strokeWidth="1" />
    <path d="M50 90C50 90 35 80 35 70" stroke="currentColor" strokeWidth="1" />
    <path d="M50 90C50 90 65 80 65 70" stroke="currentColor" strokeWidth="1" />
    
    {/* Top Sun/Radiance */}
    <path d="M50 50L50 35" stroke="currentColor" strokeWidth="1" />
    <path d="M50 50L35 40" stroke="currentColor" strokeWidth="1" />
    <path d="M50 50L65 40" stroke="currentColor" strokeWidth="1" />
    
    {/* Dots/Stardust */}
    <circle cx="25" cy="40" r="1.5" fill="currentColor" />
    <circle cx="75" cy="40" r="1.5" fill="currentColor" />
    <circle cx="50" cy="25" r="1.5" fill="currentColor" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { deviceRoomNumber, language, setLanguage } = useSystem();
  const [imgError, setImgError] = useState(false);
  
  // Modal States
  const [showWifi, setShowWifi] = useState(false);
  const [showRate, setShowRate] = useState(false);
  
  // Rating States
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // WiFi Config
  const wifiSSID = "Nomada_Guest";
  const wifiPass = "luxury2024";
  // Generate QR Code URL for WIFI:S:SSID;T:WPA;P:PASSWORD;;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WIFI:S:${wifiSSID};T:WPA;P:${wifiPass};;`;

  const menuItems = [
    { id: Tab.DASHBOARD, icon: LayoutDashboard, label: 'Home' },
    { id: Tab.DINING, icon: UtensilsCrossed, label: 'Dining' },
    { id: Tab.VALET, icon: Car, label: 'Transport' },
    { id: Tab.ACTIVITIES, icon: TentTree, label: 'Explore' },
    { id: Tab.CLEANING, icon: Sparkles, label: 'Cleaning' },
    { id: Tab.CONCIERGE, icon: Map, label: 'Concierge' },
    { id: Tab.RECEPTION, icon: HelpCircle, label: 'Support' },
  ];

  const handleRateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setTimeout(() => {
          setSubmitted(false);
          setShowRate(false);
          setRating(0);
      }, 2500);
  };

  return (
    <>
    <nav className="h-full w-24 md:w-80 bg-white/60 dark:bg-black/90 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 flex flex-col justify-between py-8 z-20 relative transition-colors duration-500">
      
      {/* Brand / Logo Area */}
      <div className="px-4 md:px-6 flex flex-col items-center justify-center min-h-[120px] mb-4">
        {!imgError && ASSETS.BRANDING.LOGO ? (
          <img 
            src={ASSETS.BRANDING.LOGO} 
            alt="Nomada Logo" 
            className="w-auto h-auto max-w-full max-h-24 md:max-h-32 object-contain filter drop-shadow-md"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center group cursor-default">
              <div className="w-12 h-20 md:w-16 md:h-24 mb-3 text-gold-400 transition-transform duration-700 group-hover:scale-105">
                 <NomadaLogoIcon className="w-full h-full drop-shadow-[0_0_12px_rgba(197,160,89,0.4)]" />
              </div>
              <div className="hidden md:flex flex-col items-center text-center animate-fade-in">
                <h1 className="font-serif text-2xl lg:text-3xl text-gray-900 dark:text-white tracking-[0.25em] leading-tight transition-colors duration-500">
                  NOMADA
                </h1>
                <p className="text-[10px] text-gold-400 uppercase tracking-[0.4em] mt-1 font-medium">
                  Experience
                </p>
              </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col w-full overflow-y-auto space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                group relative flex items-center w-full py-4 px-8 transition-all duration-500 ease-out
                ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gold-400 dark:hover:text-gold-300'}
              `}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gold-400 transition-transform duration-500 ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''}`} />

              <Icon 
                size={22} 
                strokeWidth={1.5}
                className={`
                  relative z-10 mb-1 md:mb-0 md:mr-6 transition-transform duration-500
                  ${isActive ? 'text-gold-400 dark:text-gold-300' : 'group-hover:text-gold-400 dark:group-hover:text-gold-300'}
                `}
              />
              <span className={`
                relative z-10 hidden md:block text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500
                ${isActive ? 'translate-x-1 text-gold-400 dark:text-gold-300' : 'group-hover:translate-x-1'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="px-6 mt-6 space-y-4">
        
        {/* Language Toggle */}
        <button 
            onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')}
            className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors pl-2"
        >
            <Globe size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{language} / {language === 'EN' ? 'FR' : 'EN'}</span>
        </button>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button 
                onClick={() => setShowRate(true)}
                className="bg-white/5 hover:bg-gold-400 hover:text-black border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center transition-all group"
            >
                <Star size={16} className="text-gold-400 group-hover:text-black mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-black hidden md:block">Rate Us</span>
            </button>

            <button 
                onClick={() => setShowWifi(true)}
                className="bg-white/5 hover:bg-gold-400 hover:text-black border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center transition-all group"
            >
                <QrCode size={16} className="text-gray-400 group-hover:text-black mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-black hidden md:block">Wi-Fi</span>
            </button>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-4 transition-colors duration-500 text-center md:text-left pl-2">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 hidden md:block">Guest Room</p>
          <p className="text-xl font-serif text-gray-900 dark:text-white transition-colors duration-500">{deviceRoomNumber}</p>
        </div>
      </div>
    </nav>

    {/* --- WIFI MODAL --- */}
    {showWifi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-white/10 relative text-center">
                <button 
                    onClick={() => setShowWifi(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">Connect to Wi-Fi</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">Scan to Join Automatically</p>
                
                <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-lg">
                    <img src={qrUrl} alt="WiFi QR Code" className="w-48 h-48 mix-blend-multiply" />
                </div>

                <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-300 dark:border-white/10 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-bold">Network</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{wifiSSID}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-gray-500 uppercase font-bold">Password</span>
                        <span className="text-sm font-bold text-gold-400 font-mono">{wifiPass}</span>
                    </div>
                </div>
            </div>
        </div>
    )}

    {/* --- RATING MODAL (Google Style) --- */}
    {showRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/10 relative">
                <button 
                    onClick={() => setShowRate(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>

                {submitted ? (
                    <div className="text-center py-10 animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-green-500/30">
                            <Send size={32} />
                        </div>
                        <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">Thank You</h3>
                        <p className="text-gray-500 text-sm">Your feedback has been shared with Google Reviews.</p>
                    </div>
                ) : (
                    <form onSubmit={handleRateSubmit}>
                        <div className="text-center mb-8">
                            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">We Value Your Opinion</span>
                            <h3 className="text-2xl font-serif text-gray-900 dark:text-white">Rate Your Experience</h3>
                        </div>

                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        size={32} 
                                        fill={(hoverRating || rating) >= star ? '#C5A059' : 'transparent'} 
                                        className={(hoverRating || rating) >= star ? 'text-gold-400' : 'text-gray-300 dark:text-gray-600'} 
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <textarea 
                                placeholder="Share details of your own experience at this place..."
                                className="w-full h-32 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-400 resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={rating === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span>Post to Google</span>
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-4">Publicly posting as {deviceRoomNumber} Guest</p>
                    </form>
                )}
            </div>
        </div>
    )}
    </>
  );
};

export default Sidebar;
