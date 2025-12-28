
import React from 'react';
import { Tab } from '../types';
import { ASSETS } from '../assets';
import { useSystem } from '../context/SystemContext';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Sparkles, 
  Map, 
  TentTree,
  Globe,
  QrCode,
  Car,
  HelpCircle,
  Star
} from 'lucide-react';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { deviceRoomNumber, language, setLanguage } = useSystem();
  const [showWifi, setShowWifi] = React.useState(false);
  const [showRate, setShowRate] = React.useState(false);

  const menuItems = [
    { id: Tab.DASHBOARD, icon: LayoutDashboard, label: 'Home' },
    { id: Tab.DINING, icon: UtensilsCrossed, label: 'Dining' },
    { id: Tab.VALET, icon: Car, label: 'Transport' },
    { id: Tab.ACTIVITIES, icon: TentTree, label: 'Explore' },
    { id: Tab.CLEANING, icon: Sparkles, label: 'Cleaning' },
    { id: Tab.CONCIERGE, icon: Map, label: 'Concierge' },
    { id: Tab.RECEPTION, icon: HelpCircle, label: 'Support' },
  ];

  return (
    <>
    <nav className="h-full w-24 md:w-80 bg-white/60 dark:bg-black/90 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 flex flex-col justify-between py-8 z-20 relative transition-colors duration-500">
      
      {/* Brand / Logo Area */}
      <div className="px-4 md:px-6 flex flex-col items-center justify-center mb-8 min-h-[160px]">
        <div className="flex flex-col items-center w-full">
          <img 
              src={ASSETS.BRANDING.LOGO} 
              alt="Nomada Logo" 
              className="w-full h-auto max-h-[180px] object-contain transition-all duration-500"
              onLoad={(e) => (e.currentTarget.style.opacity = '1')}
              onError={(e) => {
                console.error("Failed to load logo from:", ASSETS.BRANDING.LOGO);
                // We keep it empty rather than showing a generic placeholder if the user expects their logo
              }}
          />
          <div className="hidden md:block w-12 h-[1px] bg-gold-400/30 mt-6" />
        </div>
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
        <button 
            onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')}
            className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors pl-2"
        >
            <Globe size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{language} / {language === 'EN' ? 'FR' : 'EN'}</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button onClick={() => setShowRate(true)} className="bg-white/5 hover:bg-gold-400 hover:text-black border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center transition-all group">
                <Star size={16} className="text-gold-400 group-hover:text-black mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-black hidden md:block">Rate</span>
            </button>
            <button onClick={() => setShowWifi(true)} className="bg-white/5 hover:bg-gold-400 hover:text-black border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center transition-all group">
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
    </>
  );
};

export default Sidebar;
