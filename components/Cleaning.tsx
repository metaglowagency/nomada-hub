
import React, { useState } from 'react';
import { Sparkles, Clock, Check, Calendar, ArrowRight, SprayCan, BedDouble, Shirt, Wind, DollarSign } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  icon: any;
}

const SERVICES: ServiceOption[] = [
  {
    id: 'refresh',
    title: 'Mid-Stay Refresh',
    description: 'Tidying of living areas, bathroom sanitization, trash removal, and towel replacement.',
    duration: '1 hour',
    price: 35,
    icon: SprayCan
  },
  {
    id: 'linen',
    title: 'Linen Change Only',
    description: 'Fresh luxury sheets for all beds and a full set of fresh towels.',
    duration: '30 min',
    price: 25,
    icon: BedDouble
  },
  {
    id: 'deep',
    title: 'Full Apartment Clean',
    description: 'Comprehensive cleaning including kitchen deep clean, floors, vacuuming, and linen change.',
    duration: '2.5 hours',
    price: 65,
    icon: Sparkles
  },
  {
    id: 'laundry',
    title: 'Laundry Pick-up',
    description: 'Wash, dry, and fold service. Pricing per bag. Picked up from your door.',
    duration: 'Next Day',
    price: 30,
    icon: Shirt
  }
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const Cleaning: React.FC = () => {
  const { addGuestRequest } = useSystem();
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0].id);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooked, setIsBooked] = useState(false);

  const activeService = SERVICES.find(s => s.id === selectedService) || SERVICES[0];

  const handleBooking = () => {
    if (!selectedTime) return;
    
    // Add centralized request
    addGuestRequest(
        'HOUSEKEEPING', 
        `Booked: ${activeService.title}`, 
        `Time: ${selectedTime}, Charge: $${activeService.price}`
    );

    setIsBooked(true);
    // Reset after delay
    setTimeout(() => {
        setIsBooked(false);
        setSelectedTime('');
    }, 4000);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 mt-2 px-1">
        <div>
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
            A La Carte Services
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white transition-colors duration-500">Paid Housekeeping</h2>
        </div>
        <div className="hidden md:block">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Wind size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Apartment Care</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        
        {/* Service Selection */}
        <div className="lg:col-span-7 flex flex-col pr-2 pb-4">
            <h3 className="text-lg font-serif text-gray-900 dark:text-white mb-4">Select Add-On</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => { setSelectedService(service.id); setIsBooked(false); }}
                        className={`
                            relative p-6 rounded-2xl border text-left transition-all duration-300 group
                            ${selectedService === service.id 
                                ? 'bg-gold-400 text-black border-gold-400 shadow-lg shadow-gold-400/20' 
                                : 'bg-white/50 dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gold-400/50 hover:bg-white dark:hover:bg-white/5'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <service.icon size={24} className={selectedService === service.id ? 'text-black' : 'text-gold-400'} />
                            <div className={`flex items-center text-sm font-bold ${selectedService === service.id ? 'text-black' : 'text-white'}`}>
                                <DollarSign size={14} />
                                <span>{service.price}</span>
                            </div>
                        </div>
                        <h4 className={`text-xl font-serif mb-2 ${selectedService === service.id ? 'text-black' : 'text-gray-900 dark:text-white'}`}>
                            {service.title}
                        </h4>
                        <p className={`text-sm leading-relaxed ${selectedService === service.id ? 'text-black/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            {service.description}
                        </p>
                        <div className={`mt-4 pt-4 border-t ${selectedService === service.id ? 'border-black/10 text-black' : 'border-gray-200 dark:border-white/10 text-gray-400'} flex items-center text-xs font-bold uppercase tracking-widest`}>
                            <Clock size={14} className="mr-2" />
                            {service.duration}
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Time & Confirmation */}
        <div className="lg:col-span-5 flex flex-col">
            <div className="glass-panel p-8 rounded-3xl h-full flex flex-col min-h-[400px]">
                <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-6 flex items-center">
                    <Calendar size={20} className="mr-3 text-gold-400" />
                    Preferred Arrival
                </h3>

                {isBooked ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up">
                        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h4 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">Service Booked</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mb-8">
                            A cleaning team has been assigned for {selectedTime}. The charge of ${activeService.price} will be added to your folio.
                        </p>
                        <button 
                            onClick={() => setIsBooked(false)}
                            className="text-gold-400 text-xs font-bold uppercase tracking-widest hover:text-gold-300"
                        >
                            Book Another Service
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</span>
                            <div className="grid grid-cols-3 gap-3">
                                {TIME_SLOTS.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`
                                            py-3 px-2 rounded-lg text-xs font-bold transition-all duration-300 border
                                            ${selectedTime === time 
                                                ? 'bg-gold-400 text-black border-gold-400' 
                                                : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}
                                        `}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto border-t border-gray-200 dark:border-white/10 pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Charge</span>
                                <span className="text-3xl font-serif text-gray-900 dark:text-white">${activeService.price}</span>
                            </div>
                            
                            <button 
                                onClick={handleBooking}
                                disabled={!selectedTime}
                                className={`
                                    w-full py-5 flex items-center justify-center space-x-3 text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-xl
                                    ${selectedTime 
                                        ? 'bg-gold-400 text-black hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black' 
                                        : 'bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed'}
                                `}
                            >
                                <span>Confirm & Charge</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cleaning;
