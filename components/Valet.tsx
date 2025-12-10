
import React, { useState } from 'react';
import { Car, MapPin, Clock, CheckCircle, Key, Navigation, Phone, ChevronRight, Calendar, Info } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

type TransportType = 'CHAUFFEUR' | 'RENTAL';

const Valet: React.FC = () => {
  const { addGuestRequest } = useSystem();
  const [activeTab, setActiveTab] = useState<TransportType>('CHAUFFEUR');
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'REQUESTING' | 'CONFIRMED'>('IDLE');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Rental Form State
  const [rentalDate, setRentalDate] = useState('');
  const [rentalDuration, setRentalDuration] = useState('1 Day');
  
  // Driver Form State
  const [driverDest, setDriverDest] = useState('');
  const [driverTime, setDriverTime] = useState('Immediate (ASAP)');

  const DRIVERS = [
      { id: 'd1', name: 'Mercedes S-Class', type: 'Private Chauffeur', price: '$80/hr', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop' },
      { id: 'd2', name: 'Mercedes V-Class', type: 'Group Transfer', price: '$120/hr', image: 'https://images.unsplash.com/photo-1605218427306-633ba87c9759?q=80&w=800&auto=format&fit=crop' },
      { id: 'd3', name: 'City Taxi', type: 'Standard Ride', price: 'Metered', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop' },
  ];

  const RENTALS = [
      { id: 'r1', name: 'Fiat 500', type: 'Compact City', price: '$45/day', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop', details: 'Perfect for navigating the Medina and narrow streets.' },
      { id: 'r2', name: 'Range Rover Evoque', type: 'Luxury SUV', price: '$160/day', image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=800&auto=format&fit=crop', details: 'Comfort and style for coastal drives to Hercules Caves.' },
      { id: 'r3', name: 'Jeep Wrangler', type: 'Adventure 4x4', price: '$140/day', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop', details: 'Rugged capability for exploring the Riff Mountains.' },
  ];

  const handleRequest = () => {
      setRequestStatus('REQUESTING');
      
      const vehicle = [...DRIVERS, ...RENTALS].find(v => v.id === selectedVehicle);
      const title = activeTab === 'CHAUFFEUR' ? `Driver: ${vehicle?.name}` : `Rental: ${vehicle?.name}`;
      const details = activeTab === 'CHAUFFEUR' 
        ? `To: ${driverDest || 'Not Specified'}, Time: ${driverTime}` 
        : `Start: ${rentalDate || 'Today'}, Duration: ${rentalDuration}`;

      setTimeout(() => {
          addGuestRequest('TRANSPORT', title, details);
          setRequestStatus('CONFIRMED');
      }, 1500);
  };

  const resetRequest = () => {
      setRequestStatus('IDLE');
      setSelectedVehicle(null);
      setDriverDest('');
      setRentalDate('');
  };

  const vehiclesToDisplay = activeTab === 'CHAUFFEUR' ? DRIVERS : RENTALS;

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 mt-2 px-1">
        <div>
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
            Partner Services
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white transition-colors duration-500">Transportation</h2>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-3">
              <button 
                onClick={() => { setActiveTab('CHAUFFEUR'); resetRequest(); }}
                className={`p-4 rounded-xl text-left border transition-all flex items-center gap-3 ${activeTab === 'CHAUFFEUR' ? 'bg-gold-400 text-black border-gold-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                  <Car size={20} />
                  <div>
                    <span className="font-bold uppercase text-xs tracking-widest block">Driver & Taxi</span>
                    <span className="text-[10px] opacity-70">On-demand pickup</span>
                  </div>
              </button>
              <button 
                onClick={() => { setActiveTab('RENTAL'); resetRequest(); }}
                className={`p-4 rounded-xl text-left border transition-all flex items-center gap-3 ${activeTab === 'RENTAL' ? 'bg-gold-400 text-black border-gold-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                  <Key size={20} />
                  <div>
                    <span className="font-bold uppercase text-xs tracking-widest block">Rent a Car</span>
                    <span className="text-[10px] opacity-70">Daily Rentals</span>
                  </div>
              </button>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
              <div className="space-y-6">
                  {requestStatus === 'CONFIRMED' ? (
                        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center animate-fade-in-up">
                            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/30">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-3xl font-serif text-gray-900 dark:text-white mb-2">Request Received</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                {activeTab === 'CHAUFFEUR' 
                                    ? "Our concierge is contacting the driver. You will receive a confirmation call shortly."
                                    : "We have notified our rental partner. They will deliver the vehicle paperwork to your room."}
                            </p>
                            <button onClick={resetRequest} className="text-gold-400 text-xs font-bold uppercase tracking-widest hover:text-white">Back to Fleet</button>
                        </div>
                  ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehiclesToDisplay.map(vehicle => (
                                <div 
                                    key={vehicle.id}
                                    onClick={() => setSelectedVehicle(vehicle.id)}
                                    className={`glass-panel p-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group border-2 ${selectedVehicle === vehicle.id ? 'border-gold-400 ring-2 ring-gold-400/20' : 'border-transparent hover:border-white/20'}`}
                                >
                                    <div className="h-48 relative">
                                        <img src={vehicle.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {vehicle.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`p-6 transition-colors ${selectedVehicle === vehicle.id ? 'bg-gold-400 text-black' : ''}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-current">{vehicle.name}</h4>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm ${selectedVehicle === vehicle.id ? 'text-black/80' : 'text-gray-500 dark:text-gray-400'}`}>{vehicle.price}</span>
                                            <ChevronRight size={16} className={selectedVehicle === vehicle.id ? 'text-black' : 'text-gray-500'} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedVehicle && (
                            <div className="glass-panel p-6 rounded-2xl animate-fade-in-up border-t-4 border-t-gold-400">
                                <h4 className="text-lg font-serif text-gray-900 dark:text-white mb-4">
                                    {activeTab === 'CHAUFFEUR' ? 'Ride Details' : 'Rental Request'}
                                </h4>
                                
                                {activeTab === 'RENTAL' && (
                                     <p className="text-sm text-gray-500 mb-6 flex items-start">
                                         <Info size={16} className="mr-2 shrink-0 mt-0.5 text-gold-400" />
                                         Vehicle will be delivered to the hotel entrance. Valid driver's license and passport required upon handover.
                                     </p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {activeTab === 'CHAUFFEUR' ? (
                                        <>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Destination</label>
                                                <div className="flex items-center bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                                                    <Navigation size={16} className="text-gold-400 mr-3" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Where to?" 
                                                        className="bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none w-full" 
                                                        value={driverDest}
                                                        onChange={(e) => setDriverDest(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Pick-up Time</label>
                                                <div className="flex items-center bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                                                    <Clock size={16} className="text-gold-400 mr-3" />
                                                    <select 
                                                        value={driverTime}
                                                        onChange={(e) => setDriverTime(e.target.value)}
                                                        className="bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none w-full appearance-none"
                                                    >
                                                        <option>Immediate (ASAP)</option>
                                                        <option>In 15 Minutes</option>
                                                        <option>In 30 Minutes</option>
                                                        <option>In 1 Hour</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Start Date</label>
                                                <div className="flex items-center bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                                                    <Calendar size={16} className="text-gold-400 mr-3" />
                                                    <input 
                                                        type="date" 
                                                        value={rentalDate}
                                                        onChange={(e) => setRentalDate(e.target.value)}
                                                        className="bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none w-full" 
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Duration</label>
                                                <div className="flex items-center bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                                                    <Clock size={16} className="text-gold-400 mr-3" />
                                                    <select 
                                                        value={rentalDuration}
                                                        onChange={(e) => setRentalDuration(e.target.value)}
                                                        className="bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none w-full appearance-none"
                                                    >
                                                        <option>1 Day</option>
                                                        <option>2 Days</option>
                                                        <option>3 Days</option>
                                                        <option>1 Week</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button 
                                    onClick={handleRequest}
                                    className="w-full bg-gold-400 text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors"
                                >
                                    {activeTab === 'CHAUFFEUR' ? 'Confirm Driver' : 'Request Availability'}
                                </button>
                            </div>
                        )}
                      </>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Valet;
