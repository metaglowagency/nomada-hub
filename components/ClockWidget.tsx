
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ClockWidget: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Force Tangier Timezone (Africa/Casablanca)
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Casablanca',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Casablanca',
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  };

  const timeString = date.toLocaleTimeString('en-US', timeOptions);
  const cleanTime = timeString.replace(/(AM|PM)/, '').trim();
  const period = timeString.match(/(AM|PM)/)?.[0];
  const dateString = date.toLocaleDateString('en-US', dateOptions);

  return (
    <div 
        className="glass-panel p-5 rounded-3xl h-full flex flex-col justify-between relative transition-all duration-500 hover:bg-white/20 dark:hover:bg-white/5 group"
        role="timer"
        aria-label={`Current time in Tangier is ${timeString}, ${dateString}`}
    >
      <div className="flex justify-between items-start">
         <div className="flex items-center space-x-2 text-gold-400">
            <Clock size={12} aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Tangier</span>
         </div>
      </div>
      
      <div>
         <div className="flex items-baseline justify-center md:justify-start" aria-hidden="true">
            {/* Matches Weather Widget Size */}
            <span className="text-5xl lg:text-5xl font-light text-gray-900 dark:text-white tracking-tighter group-hover:scale-105 transition-all origin-left duration-500">{cleanTime}</span>
            <span className="text-xs text-gray-500 ml-1 font-bold self-start mt-2">{period}</span>
         </div>
         <div className="text-xs text-gray-500 dark:text-gray-400 font-serif italic mt-0 pl-1 text-center md:text-left transition-colors duration-500" aria-hidden="true">
            {dateString}
         </div>
      </div>
    </div>
  );
};

export default ClockWidget;
