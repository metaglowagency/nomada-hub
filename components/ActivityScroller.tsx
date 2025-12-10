
import React, { useRef } from 'react';
import { useSystem } from '../context/SystemContext';
import { ArrowRight, MapPin } from 'lucide-react';

const ActivityScroller: React.FC = () => {
  const { activities } = useSystem();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Take only top 5 for the dashboard widget
  const featuredActivities = activities.slice(0, 5);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div 
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x snap-mandatory h-full items-stretch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featuredActivities.map((activity) => (
          <div 
            key={activity.id}
            className="flex-none w-[260px] md:w-[320px] h-full rounded-2xl relative overflow-hidden group snap-center cursor-pointer border border-white/5 shadow-xl transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Background Image with Zoom Effect */}
            <img 
              src={activity.image} 
              alt={activity.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
            
            {/* Content Container */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
               
               {/* Location / Tag */}
               <div className="flex items-center space-x-2 mb-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <MapPin size={10} className="text-gold-400" />
                  <span className="text-[9px] uppercase tracking-widest text-gold-400 font-bold">Tangier</span>
               </div>

               {/* Title & Subtitle */}
               <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-serif text-white mb-1 leading-tight line-clamp-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-light uppercase tracking-widest opacity-80 line-clamp-1">
                    {activity.subtitle}
                  </p>
               </div>
               
               {/* Action Line */}
               <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                  <span className="text-lg font-serif italic text-white">{activity.price}</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-gold-400 group-hover:text-black transition-colors duration-300">
                      <ArrowRight size={14} />
                  </div>
               </div>
            </div>
          </div>
        ))}
        
        {/* "More" Card */}
         <div className="flex-none w-[100px] h-full rounded-2xl relative overflow-hidden group snap-center cursor-pointer border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
             <div className="text-center">
                 <div className="w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center mx-auto mb-2 text-gray-400">
                     <ArrowRight size={16} />
                 </div>
                 <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">View All</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default ActivityScroller;
