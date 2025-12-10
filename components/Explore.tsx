
import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { Activity } from '../types';
import { ArrowRight, MapPin, Star, Calendar, Clock, X, Check, Sun, CloudSun, CloudRain, Wind, Cloud, Loader, Ticket, Volume2 } from 'lucide-react';

const CATEGORIES = ['All', 'Culture', 'Adventure', 'Sightseeing', 'Gastronomy'];

const Explore: React.FC = () => {
  const { activities, promotions, addGuestRequest } = useSystem();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedExp, setSelectedExp] = useState<Activity | null>(null);
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [forecast, setForecast] = useState<any[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(true);

  // Filter activities based on category
  const filtered = activeCategory === 'All' ? activities : activities.filter(e => e.category === activeCategory);
  const activePromotions = promotions.filter(p => p.active);

  const handleBook = (id: string) => {
    // Send to admin
    const act = activities.find(a => a.id === id);
    if(act) {
        addGuestRequest('ACTIVITY', `Booked: ${act.title}`, `Please confirm slot for today/tomorrow. Price: ${act.price}`);
    }
    setBooked(prev => new Set(prev).add(id));
    // Close modal after short delay
    setTimeout(() => {
        setSelectedExp(null);
    }, 2000);
  };

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // Fetch 3-day forecast for Tangier
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=35.7595&longitude=-5.8340&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        
        const daily = data.daily;
        // Take the first 3 days
        const next3Days = daily.time.slice(0, 3).map((time: string, index: number) => ({
            date: new Date(time).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            max: Math.round(daily.temperature_2m_max[index]),
            min: Math.round(daily.temperature_2m_min[index]),
            code: daily.weather_code[index]
        }));
        
        setForecast(next3Days);
        setLoadingForecast(false);
      } catch (e) {
        console.error("Forecast error", e);
        setLoadingForecast(false);
      }
    };
    fetchForecast();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={28} className="text-gold-400" />;
    if (code >= 1 && code <= 3) return <CloudSun size={28} className="text-gold-400" />;
    if (code >= 45 && code <= 48) return <Wind size={28} className="text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain size={28} className="text-blue-400" />;
    if (code >= 80 && code <= 82) return <CloudRain size={28} className="text-blue-400" />;
    return <Cloud size={28} className="text-gray-400" />;
  };

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 mt-2 px-2">
        <div>
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
            Discover Tangier
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">Curated Experiences</h2>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-gray-400 text-sm">Concierge Availability</p>
           <p className="text-white font-serif text-xl">08:00 - 22:00</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-6 py-3 rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border-b-2 whitespace-nowrap
              ${activeCategory === cat 
                ? 'border-gold-400 text-gold-400 bg-white/5' 
                : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-24 pr-2 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
         
         {/* Promotions Banner (Only if exists) */}
         {activePromotions.length > 0 && (
             <div className="md:col-span-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                     {activePromotions.map(promo => (
                         <div key={promo.id} className="glass-panel p-0 rounded-2xl relative overflow-hidden h-32 flex group cursor-pointer hover:border-gold-400/50 transition-colors">
                             <div className="w-32 h-full relative">
                                 <img src={promo.image} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/20" />
                             </div>
                             <div className="flex-1 p-4 flex flex-col justify-center">
                                 <span className={`text-[9px] uppercase font-bold tracking-widest mb-1 ${promo.type === 'EVENT' ? 'text-purple-400' : 'text-green-400'}`}>
                                     {promo.type}
                                 </span>
                                 <h4 className="text-xl font-serif text-white">{promo.title}</h4>
                                 <p className="text-sm text-gray-400">{promo.subtitle}</p>
                             </div>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-black">
                                     <ArrowRight size={16} />
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         )}

         {/* Featured Item (First in list) */}
         {filtered.length > 0 && (
           <div 
             onClick={() => setSelectedExp(filtered[0])}
             className="md:col-span-8 h-[400px] glass-panel p-0 rounded-3xl relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] duration-500"
           >
              <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                 <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-gold-400 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                       Top Pick
                    </span>
                    <div className="flex items-center text-gold-400">
                       <Star size={12} fill="currentColor" />
                       <span className="ml-1 text-xs font-bold">{filtered[0].rating}</span>
                    </div>
                 </div>
                 <h3 className="text-4xl font-serif text-white mb-2">{filtered[0].title}</h3>
                 <p className="text-gray-300 line-clamp-2 max-w-xl text-sm">{filtered[0].description}</p>
                 <div className="flex items-center mt-6 text-white text-xs font-bold uppercase tracking-widest group-hover:text-gold-400 transition-colors">
                    <span>View Details</span>
                    <ArrowRight size={16} className="ml-2" />
                 </div>
              </div>
           </div>
         )}

         {/* Secondary Items */}
         {filtered.slice(1).map((exp) => (
            <div 
              key={exp.id}
              onClick={() => setSelectedExp(exp)}
              className="md:col-span-4 h-[400px] glass-panel p-0 rounded-3xl relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] duration-500"
            >
               <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
               
               <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-gold-400 text-[10px] uppercase tracking-widest font-bold mb-1 block">{exp.category}</span>
                  <h3 className="text-2xl font-serif text-white mb-1">{exp.title}</h3>
                  <div className="flex justify-between items-end border-t border-white/20 pt-3 mt-3">
                     <span className="text-white font-serif italic">{exp.price}</span>
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-gold-400 group-hover:text-black transition-colors">
                        <ArrowRight size={14} />
                     </div>
                  </div>
               </div>
            </div>
         ))}

         {/* Weather Forecast Section */}
         <div className="md:col-span-12 mt-4 pt-6 border-t border-white/10">
            <h3 className="text-xl font-serif text-white mb-6 flex items-center">
               <Sun size={20} className="mr-3 text-gold-400" /> 
               Adventure Outlook <span className="text-gray-500 text-sm font-sans ml-3 tracking-widest uppercase font-bold mt-1">Tangier</span>
            </h3>
            
            {loadingForecast ? (
                <div className="flex justify-center p-8 bg-white/5 rounded-2xl">
                    <Loader className="animate-spin text-gold-400" />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {forecast.map((day, idx) => (
                        <div key={idx} className="glass-panel p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {getWeatherIcon(day.code)}
                                <div>
                                    <span className="block font-bold text-white text-sm">{day.date}</span>
                                    <span className="text-xs text-gray-400">Forecast</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-white text-lg">{day.max}°</span>
                                <span className="text-xs text-gray-500">{day.min}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
              <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-lg" 
                onClick={() => setSelectedExp(null)} 
              />
              <div className="relative w-full max-w-5xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up">
                  
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                      <img src={selectedExp.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                      <button 
                        onClick={() => setSelectedExp(null)}
                        className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white border border-white/10 md:hidden"
                      >
                          <X size={20} />
                      </button>
                  </div>

                  {/* Content Section */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                      <button 
                        onClick={() => setSelectedExp(null)}
                        className="hidden md:flex self-end text-gray-400 hover:text-white transition-colors mb-4"
                      >
                          <X size={24} />
                      </button>

                      <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-2">{selectedExp.category}</span>
                      <h2 className="text-4xl font-serif text-white mb-4 leading-tight">{selectedExp.title}</h2>
                      
                      <div className="flex items-center space-x-6 mb-8 text-sm text-gray-400">
                          <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-gold-400" />
                              {selectedExp.duration}
                          </div>
                          <div className="flex items-center">
                              <Star size={16} className="mr-2 text-gold-400" />
                              {selectedExp.rating} / 5.0
                          </div>
                      </div>

                      <p className="text-gray-300 text-lg font-light leading-relaxed mb-8">
                          {selectedExp.description}
                      </p>

                      <div className="mb-8">
                          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Highlights</h4>
                          <ul className="grid grid-cols-2 gap-3">
                              {selectedExp.highlights.map((highlight, idx) => (
                                  <li key={idx} className="flex items-center text-sm text-gray-400">
                                      <div className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-3" />
                                      {highlight}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                          <div className="text-white">
                              <span className="block text-xs text-gray-500 uppercase tracking-widest">Price per person</span>
                              <span className="font-serif text-2xl">{selectedExp.price}</span>
                          </div>
                          
                          {booked.has(selectedExp.id) ? (
                              <button disabled className="bg-green-500 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 cursor-default">
                                  <span>Request Sent</span>
                                  <Check size={16} />
                              </button>
                          ) : (
                              <button 
                                onClick={() => handleBook(selectedExp.id)}
                                className="bg-gold-400 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-3"
                              >
                                  <span>Book Experience</span>
                                  <Ticket size={16} />
                              </button>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Explore;
