
import React, { useState } from 'react';
import { Sun, Moon, Thermometer, Wind, BellOff, SprayCan } from 'lucide-react';

const RoomControls: React.FC = () => {
  const [temp, setTemp] = useState(22);
  const [lightingScene, setLightingScene] = useState<'Day' | 'Relax' | 'Night'>('Relax');
  const [privacy, setPrivacy] = useState<'None' | 'DND' | 'Clean'>('None');

  return (
    <div className="glass-panel p-5 rounded-3xl h-full flex flex-col justify-between" role="region" aria-label="Room Environment Controls">
      {/* Header */}
      <div className="flex items-center justify-between text-gold-400 mb-2">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Suite Control</span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" aria-hidden="true"></div>
      </div>

      <div className="flex flex-col gap-3 h-full justify-center">
        {/* Temperature - Compact */}
        <div className="flex items-center justify-between bg-black/5 dark:bg-black/40 p-3 rounded-2xl border border-gray-200 dark:border-white/5 transition-colors duration-500">
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/50 dark:bg-white/5 rounded-full text-gray-900 dark:text-white transition-colors duration-500" aria-hidden="true">
                 <Wind size={16} />
              </div>
              <div role="group" aria-label="Climate Control">
                 <span className="block text-[10px] text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-0.5">Climate</span>
                 <span 
                    className="text-2xl font-serif text-gray-900 dark:text-white leading-none transition-colors duration-500"
                    role="meter" 
                    aria-valuenow={temp} 
                    aria-valuemin={16} 
                    aria-valuemax={30}
                    aria-label="Current Set Temperature"
                 >
                     {temp}°
                 </span>
              </div>
           </div>
           <div className="flex space-x-2">
              <button 
                onClick={() => setTemp(t => t - 1)}
                className="w-10 h-10 rounded-xl border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-white dark:hover:bg-white hover:text-black dark:hover:text-black transition-colors text-lg font-light focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label="Decrease Temperature"
              >-</button>
              <button 
                onClick={() => setTemp(t => t + 1)}
                className="w-10 h-10 rounded-xl border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-white dark:hover:bg-white hover:text-black dark:hover:text-black transition-colors text-lg font-light focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label="Increase Temperature"
              >+</button>
           </div>
        </div>

        {/* Lighting Scenes - Compact */}
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Lighting Scenes">
            {(['Day', 'Relax', 'Night'] as const).map((scene) => (
                <button
                key={scene}
                onClick={() => setLightingScene(scene)}
                aria-pressed={lightingScene === scene}
                className={`
                    py-3 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-gold-400
                    ${lightingScene === scene 
                    ? 'bg-gold-400 text-black border-gold-400 shadow-lg shadow-gold-400/20' 
                    : 'bg-black/5 dark:bg-black/40 text-gray-500 dark:text-gray-400 border-transparent hover:bg-black/10 dark:hover:bg-black/60 hover:text-gray-900 dark:hover:text-white'}
                `}
                >
                {scene === 'Day' && <Sun size={16} className="mb-1" aria-hidden="true" />}
                {scene === 'Relax' && <Thermometer size={16} className="mb-1" aria-hidden="true" />}
                {scene === 'Night' && <Moon size={16} className="mb-1" aria-hidden="true" />}
                <span className="text-[9px] uppercase font-bold tracking-widest">{scene}</span>
                </button>
            ))}
        </div>

        {/* Privacy Toggles - Compact */}
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Privacy and Housekeeping">
           <button 
             onClick={() => setPrivacy(privacy === 'DND' ? 'None' : 'DND')}
             aria-pressed={privacy === 'DND'}
             className={`py-3 rounded-xl flex items-center justify-center space-x-2 border transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${privacy === 'DND' ? 'bg-red-500/20 border-red-500 text-red-500 dark:text-red-400' : 'bg-black/5 dark:bg-black/40 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-black/60'}`}
           >
              <BellOff size={14} aria-hidden="true" />
              <span className="text-[9px] uppercase font-bold tracking-widest">Privacy</span>
           </button>
           <button 
             onClick={() => setPrivacy(privacy === 'Clean' ? 'None' : 'Clean')}
             aria-pressed={privacy === 'Clean'}
             className={`py-3 rounded-xl flex items-center justify-center space-x-2 border transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${privacy === 'Clean' ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400' : 'bg-black/5 dark:bg-black/40 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-black/60'}`}
           >
              <SprayCan size={14} aria-hidden="true" />
              <span className="text-[9px] uppercase font-bold tracking-widest">Clean</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default RoomControls;
