
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Sun, Moon, Coffee, Utensils, Sparkles, Clock, CheckCircle } from 'lucide-react';

// --- MOOD PLAYER WIDGET ---
const MOOD_TRACKS = [
    { id: 'desert', name: 'Desert Wind', icon: Sun, color: 'text-orange-400', src: 'https://assets.mixkit.co/active_storage/sfx/1206/1206-preview.mp3' }, // Wind
    { id: 'jazz', name: 'Lobby Jazz', icon: Music, color: 'text-gold-400', src: 'https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3' }, // Smooth
    { id: 'rain', name: 'Tangier Rain', icon: Cloud, color: 'text-blue-400', src: 'https://assets.mixkit.co/active_storage/sfx/1126/1126-preview.mp3' }, // Rain
];

import { Cloud } from 'lucide-react';

export const MoodPlayer: React.FC = () => {
    const [activeMood, setActiveMood] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleMood = (moodId: string) => {
        if (activeMood === moodId) {
            // Toggle play/pause
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            // Change track
            setActiveMood(moodId);
            setIsPlaying(true);
            // In a real app, we'd handle source changing more gracefully
            setTimeout(() => audioRef.current?.play(), 100);
        }
    };

    const currentTrack = MOOD_TRACKS.find(t => t.id === activeMood);

    return (
        <div className="glass-panel p-5 rounded-3xl h-full flex flex-col relative overflow-hidden group">
            <audio ref={audioRef} src={currentTrack?.src} loop />
            
            <div className="flex justify-between items-center mb-4 z-10">
                 <div className="flex items-center space-x-2 text-gold-400">
                    <Music size={14} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Ambiance</span>
                 </div>
                 {isPlaying && (
                     <div className="flex gap-1">
                         <div className="w-1 h-3 bg-gold-400 animate-pulse rounded-full" style={{animationDelay: '0ms'}}></div>
                         <div className="w-1 h-3 bg-gold-400 animate-pulse rounded-full" style={{animationDelay: '100ms'}}></div>
                         <div className="w-1 h-3 bg-gold-400 animate-pulse rounded-full" style={{animationDelay: '200ms'}}></div>
                     </div>
                 )}
            </div>

            <div className="space-y-3 z-10">
                {MOOD_TRACKS.map(track => (
                    <button
                        key={track.id}
                        onClick={() => toggleMood(track.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${activeMood === track.id ? 'bg-white/10 border-gold-400' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                        <div className="flex items-center space-x-3">
                            <track.icon size={16} className={track.color} />
                            <span className={`text-xs font-bold ${activeMood === track.id ? 'text-white' : 'text-gray-500'}`}>{track.name}</span>
                        </div>
                        {activeMood === track.id && (
                            <div className="text-white">
                                {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Background Glow */}
            {activeMood && isPlaying && (
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            )}
        </div>
    );
};

// --- DAILY AGENDA WIDGET ---
export const DailyAgenda: React.FC<{ guestName: string }> = ({ guestName }) => {
    // Mock Data - In real app, comes from Booking Context + Orders
    const events = [
        { time: '08:00', title: 'Breakfast Served', loc: 'Atlas Room', icon: Coffee, status: 'past' },
        { time: '11:00', title: 'Housekeeping', loc: 'Room 304', icon: Sparkles, status: 'active' },
        { time: '19:30', title: 'Dinner Reservation', loc: 'Rooftop', icon: Utensils, status: 'future' },
    ];

    return (
        <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-gold-400">
                    <Clock size={14} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold">My Itinerary</span>
                </div>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', {weekday: 'short'})}</span>
            </div>

            <div className="flex-1 space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-white/10" />

                {events.map((evt, idx) => (
                    <div key={idx} className={`relative pl-10 py-3 group ${evt.status === 'past' ? 'opacity-40' : 'opacity-100'}`}>
                        {/* Dot */}
                        <div className={`absolute left-[9px] top-4 w-1.5 h-1.5 rounded-full border border-black ${evt.status === 'active' ? 'bg-gold-400 scale-125 shadow-[0_0_10px_rgba(197,160,89,1)]' : 'bg-gray-600'}`} />
                        
                        <div className="flex justify-between items-start">
                             <div>
                                 <span className="text-[10px] font-mono text-gold-400 block mb-0.5">{evt.time}</span>
                                 <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                                 <p className="text-[10px] text-gray-400">{evt.loc}</p>
                             </div>
                             <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                 <evt.icon size={14} />
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                 <button className="text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors">View Full Calendar</button>
            </div>
        </div>
    );
};
