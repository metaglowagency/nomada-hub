
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles, Send, Wifi, Coffee, Clock3, Utensils, Gift, Calendar, Users, CheckCircle, MapPin, ChevronRight, Star, Dumbbell, Ticket } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

type ConciergeTab = 'CHAT' | 'DINING' | 'PASSES' | 'AMENITIES';

const Concierge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConciergeTab>('CHAT');
  
  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 mt-2 px-1">
        <div>
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
            At Your Service
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white transition-colors duration-500">Concierge</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Navigation Sidebar (Inner) */}
        <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            <NavButton 
                active={activeTab === 'CHAT'} 
                onClick={() => setActiveTab('CHAT')} 
                icon={MessageSquare} 
                label="Live Chat" 
            />
            <NavButton 
                active={activeTab === 'DINING'} 
                onClick={() => setActiveTab('DINING')} 
                icon={Utensils} 
                label="City Dining" 
            />
            <NavButton 
                active={activeTab === 'PASSES'} 
                onClick={() => setActiveTab('PASSES')} 
                icon={Ticket} 
                label="Gym & Spa Passes" 
            />
            <NavButton 
                active={activeTab === 'AMENITIES'} 
                onClick={() => setActiveTab('AMENITIES')} 
                icon={Gift} 
                label="House Comforts" 
            />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border border-white/10 dark:border-white/5 bg-white/50 dark:bg-black/40">
            {activeTab === 'CHAT' && <ChatInterface />}
            {activeTab === 'DINING' && <DiningInterface />}
            {activeTab === 'PASSES' && <PassesInterface />}
            {activeTab === 'AMENITIES' && <AmenitiesInterface />}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button 
        onClick={onClick}
        className={`
            flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 whitespace-nowrap lg:whitespace-normal
            ${active 
                ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20' 
                : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white'}
        `}
    >
        <Icon size={20} />
        <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </button>
);

// 1. Chat Interface
const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'agent', text: 'Good evening. How may I assist you with your stay today?', time: 'Just now' }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), sender: 'guest', text: text, time: 'Now' }]);
        setInput('');
        
        // Auto-reply simulation
        setTimeout(() => {
            let reply = 'Thank you. I have notified the team and will get back to you shortly.';
            if (text.toLowerCase().includes('wifi')) reply = 'The network is "Nomada_Guest" and the password is "luxury2024".';
            if (text.toLowerCase().includes('gym')) reply = 'We partner with City Club (5 mins walk). You can book a day pass in the "Gym & Spa Passes" tab.';
            
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: reply, time: 'Now' }]);
        }, 1500);
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const QuickAction: React.FC<{ icon: any, label: string, query: string }> = ({ icon: Icon, label, query }) => (
        <button 
            onClick={() => handleSend(query)}
            className="flex items-center gap-2 bg-white/10 hover:bg-gold-400 hover:text-black border border-white/10 rounded-full px-4 py-2 text-xs transition-all whitespace-nowrap"
        >
            <Icon size={14} /> {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/40 dark:bg-black/20">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Youssef is Online</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'guest' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl ${msg.sender === 'guest' ? 'bg-gold-400 text-black rounded-tr-none' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-tl-none'}`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <span className={`text-[10px] block mt-2 opacity-60 ${msg.sender === 'guest' ? 'text-black' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {/* Smart Chips Area */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                <QuickAction icon={Wifi} label="Wifi Password" query="What is the Wifi password?" />
                <QuickAction icon={Clock3} label="Late Checkout" query="Is late checkout available?" />
                <QuickAction icon={Dumbbell} label="Gym Access" query="Where is the nearest partner gym?" />
            </div>

            <div className="p-4 bg-white/40 dark:bg-black/20 border-t border-gray-200 dark:border-white/5">
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Type your request..."
                        className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 dark:text-white transition-colors"
                    />
                    <button 
                        onClick={() => handleSend(input)}
                        className="bg-gold-400 text-black p-3 rounded-xl hover:bg-gold-300 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. City Dining Interface (New)
const DiningInterface: React.FC = () => {
    const { addGuestRequest } = useSystem();
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
    const [bookingState, setBookingState] = useState<'IDLE' | 'CONFIRMED'>('IDLE');

    const RESTAURANTS = [
        {
            id: 'r1',
            name: 'El Morocco Club',
            cuisine: 'Contemporary Moroccan',
            price: '$$$',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
            desc: 'A Kasbah institution mixing fine dining with a legendary piano bar. Famous for its camel burger and sophisticated atmosphere.'
        },
        {
            id: 'r2',
            name: 'Salon Bleu',
            cuisine: 'Mediterranean Terrace',
            price: '$$',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1574960533077-d4642b58079d?q=80&w=800&auto=format&fit=crop',
            desc: 'Stunning rooftop views of the strait. Perfect for a sunset couscous or fresh seafood platter in a relaxed setting.'
        },
        {
            id: 'r3',
            name: 'Villa Josephine',
            cuisine: 'French Gastronomy',
            price: '$$$$',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=800&auto=format&fit=crop',
            desc: 'Old-world glamour in a historic villa on the Old Mountain road. Exceptional service and classic French cuisine.'
        },
        {
            id: 'r4',
            name: 'La Saveur du Poisson',
            cuisine: 'Rustic Seafood',
            price: '$$',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1621857053538-4e580436214f?q=80&w=800&auto=format&fit=crop',
            desc: 'A unique set-menu experience featuring only the freshest local catch. No menu, just the chefs daily inspiration.'
        }
    ];

    const handleReserve = () => {
        const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurant);
        addGuestRequest('DINING_RESERVATION', `Reservation: ${restaurant?.name}`, 'Table for 2, Tonight');
        setBookingState('CONFIRMED');
        setTimeout(() => {
            setBookingState('IDLE');
            setSelectedRestaurant(null);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-8 pb-4 shrink-0">
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">City Dining Guide</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Our concierge's top recommendations for Tangier. We handle the reservation.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {RESTAURANTS.map(rest => (
                        <div key={rest.id} className="group glass-panel p-0 rounded-2xl overflow-hidden hover:border-gold-400/50 transition-all duration-300">
                            <div className="h-40 relative">
                                <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h4 className="font-serif text-xl mb-1">{rest.name}</h4>
                                    <div className="flex items-center space-x-2 text-xs">
                                        <span className="bg-gold-400 text-black px-1.5 py-0.5 rounded font-bold">{rest.rating}</span>
                                        <span className="text-gray-300">{rest.cuisine}</span>
                                        <span className="text-gold-400">{rest.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">{rest.desc}</p>
                                
                                {selectedRestaurant === rest.id ? (
                                    <div className="bg-white/5 rounded-xl p-4 animate-fade-in">
                                        {bookingState === 'CONFIRMED' ? (
                                            <div className="flex items-center justify-center text-green-400 space-x-2 py-2">
                                                <CheckCircle size={20} />
                                                <span className="text-sm font-bold uppercase tracking-widest">Request Sent</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <h5 className="text-xs font-bold uppercase text-gold-400">Request Table</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex items-center bg-black/20 rounded px-3 py-2 border border-white/10">
                                                        <Calendar size={14} className="text-gray-400 mr-2" />
                                                        <span className="text-sm">Tonight</span>
                                                    </div>
                                                    <div className="flex items-center bg-black/20 rounded px-3 py-2 border border-white/10">
                                                        <Users size={14} className="text-gray-400 mr-2" />
                                                        <span className="text-sm">2 Guests</span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => setSelectedRestaurant(null)} className="flex-1 py-2 text-xs text-gray-400 hover:text-white">Cancel</button>
                                                    <button onClick={handleReserve} className="flex-[2] bg-gold-400 text-black font-bold uppercase text-xs rounded hover:bg-white transition-colors">Confirm Request</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setSelectedRestaurant(rest.id)}
                                        className="w-full border border-white/10 hover:bg-gold-400 hover:text-black hover:border-gold-400 text-gray-300 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        Reserve Table
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 3. Amenities Interface (New)
const AmenitiesInterface: React.FC = () => {
    const { addGuestRequest } = useSystem();
    const [requestedItems, setRequestedItems] = useState<Set<string>>(new Set());

    const AMENITIES = [
        { id: 'towel', label: 'Extra Towels', icon: Sparkles },
        { id: 'water', label: 'Bottled Water', icon: Coffee }, // Using coffee as generic drink icon
        { id: 'pillow', label: 'Firm Pillows', icon: Gift },
        { id: 'adapter', label: 'Power Adapter', icon: Wifi }, // Using wifi/tech icon
        { id: 'ice', label: 'Ice Bucket', icon: Sparkles },
        { id: 'toiletries', label: 'Toiletries Kit', icon: Gift },
    ];

    const handleRequest = (id: string) => {
        const item = AMENITIES.find(a => a.id === id);
        addGuestRequest('HOUSEKEEPING', `Item: ${item?.label}`, 'Deliver ASAP');
        
        setRequestedItems(prev => new Set(prev).add(id));
        setTimeout(() => {
            setRequestedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 4000);
    };

    return (
        <div className="flex flex-col h-full p-8">
            <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">House Comforts</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">One-tap requests delivered to your room in minutes.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {AMENITIES.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => handleRequest(item.id)}
                        disabled={requestedItems.has(item.id)}
                        className={`
                            p-6 rounded-2xl border flex flex-col items-center justify-center transition-all duration-500
                            ${requestedItems.has(item.id) 
                                ? 'bg-green-500 text-black border-green-500 scale-95' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold-400 text-gray-300 hover:text-white'}
                        `}
                    >
                        {requestedItems.has(item.id) ? (
                            <CheckCircle size={32} className="mb-2" />
                        ) : (
                            <item.icon size={32} className={`mb-2 ${requestedItems.has(item.id) ? 'text-black' : 'text-gold-400'}`} />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {requestedItems.has(item.id) ? 'On the way' : item.label}
                        </span>
                    </button>
                ))}
            </div>
            
            <div className="mt-auto pt-8 border-t border-white/10">
                <p className="text-xs text-center text-gray-500 italic">For special requests not listed here, please use the Live Chat.</p>
            </div>
        </div>
    );
};

// 4. Passes Interface (Gym & Spa)
const PassesInterface: React.FC = () => {
    const { addGuestRequest } = useSystem();
    const [justClicked, setJustClicked] = useState<string | null>(null);

    const handleRequestPass = (title: string) => {
        addGuestRequest('SPA_GYM', `Pass Request: ${title}`, 'Send digital code');
        setJustClicked(title);
        setTimeout(() => setJustClicked(null), 3000);
    }

    return (
        <div className="flex flex-col h-full relative">
             <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-100/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent" />
             </div>

             <div className="relative z-10 p-8 h-full overflow-y-auto custom-scrollbar">
                <h3 className="text-3xl font-serif text-gray-900 dark:text-white mb-2">Partner Wellness Access</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">Purchase digital day passes to the city's finest gyms and spas. We send the entry code directly to your phone.</p>

                <div className="grid grid-cols-1 gap-4 max-w-2xl">
                    <PassCard 
                        title="City Club Fitness" 
                        type="Gym Day Pass" 
                        price="$15" 
                        desc="Full access to cardio, weights, and sauna. Located 5 mins walk away."
                        icon={Dumbbell}
                        onClick={() => handleRequestPass("City Club Fitness")}
                        isClicked={justClicked === "City Club Fitness"}
                    />
                    <PassCard 
                        title="Hammam Al-Andalus" 
                        type="Spa Entry Ticket" 
                        price="$45" 
                        desc="Entry to traditional baths including scrub and massage. 10 mins by taxi."
                        icon={Sparkles}
                        onClick={() => handleRequestPass("Hammam Al-Andalus")}
                        isClicked={justClicked === "Hammam Al-Andalus"}
                    />
                    <PassCard 
                        title="Mobile Massage" 
                        type="In-Room Service" 
                        price="$80" 
                        desc="Certified therapist comes to your apartment. Includes table and oils."
                        icon={Clock3}
                        onClick={() => handleRequestPass("Mobile Massage")}
                        isClicked={justClicked === "Mobile Massage"}
                    />
                </div>
             </div>
        </div>
    );
};

const PassCard: React.FC<{ title: string; type: string; price: string; desc: string; icon: any, onClick: () => void, isClicked: boolean }> = ({ title, type, price, desc, icon: Icon, onClick, isClicked }) => (
    <div onClick={onClick} className="group bg-white/60 dark:bg-white/5 border border-white/20 p-6 rounded-2xl hover:bg-gold-400 transition-all duration-300 cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="text-xl font-serif text-gray-900 dark:text-white group-hover:text-black">{title}</h4>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover:text-black/60">{type}</span>
            </div>
            <span className="text-lg font-serif italic text-gold-400 group-hover:text-black">{price}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-black/80 mb-4">{desc}</p>
        <div className="flex justify-between items-center">
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black/60 flex items-center">
                 <Icon size={14} className="mr-1" /> {isClicked ? 'Requesting...' : 'Request Pass'}
             </span>
             <span className={`w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center transition-colors ${isClicked ? 'bg-green-500 text-white' : 'group-hover:border-black/20 group-hover:bg-black group-hover:text-white'}`}>
                 {isClicked ? <CheckCircle size={16} /> : <span className="text-lg">+</span>}
             </span>
        </div>
    </div>
);

export default Concierge;
