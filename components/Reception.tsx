
import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { CreditCard, LogOut, HelpCircle, Wifi, Phone, Clock, FileText, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

const Reception: React.FC = () => {
  const { orders, bookings, rooms } = useSystem();
  
  // Get current guest info
  // In a real app, we'd use auth context. Here we grab the first booking or the "Isabella" booking
  const currentBooking = bookings.find(b => b.roomNumber === '304') || bookings[0];
  const roomOrders = orders.filter(o => o.roomNumber === '304');
  
  const roomTotal = currentBooking ? currentBooking.totalAmount : 0;
  const diningTotal = roomOrders.reduce((acc, curr) => acc + curr.total, 0);
  const taxes = (roomTotal + diningTotal) * 0.10; // 10% tax mock
  const grandTotal = roomTotal + diningTotal + taxes;

  const [checkoutRequested, setCheckoutRequested] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => setActiveFaq(activeFaq === id ? null : id);

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 mt-2 px-1">
        <div>
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
            Digital Front Desk
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white transition-colors duration-500">Support & Billing</h2>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">Apartment ID</p>
           <p className="text-3xl font-serif text-gray-900 dark:text-white">Unit 304</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
         
         {/* LEFT COL: BILLING & CHECKOUT */}
         <div className="flex flex-col gap-6">
            <div className="glass-panel p-8 rounded-3xl">
                <div className="flex items-center space-x-3 mb-6 text-gold-400">
                    <CreditCard size={24} />
                    <h3 className="text-xl font-serif text-gray-900 dark:text-white">Digital Folio</h3>
                </div>

                {/* Bill Summary */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-300 dark:border-white/10">
                        <div>
                            <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">Accommodation</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{currentBooking?.checkInDate} - {currentBooking?.checkOutDate}</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-mono">${roomTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-300 dark:border-white/10">
                         <div>
                            <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">Services & Dining</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{roomOrders.length} Orders</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-mono">${diningTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-300 dark:border-white/10">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">City Tax (10%)</span>
                        <span className="text-gray-900 dark:text-white font-mono">${taxes.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-serif text-gray-900 dark:text-white">Total Due</span>
                        <span className="text-3xl font-serif text-gold-400">${grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Actions */}
                {checkoutRequested ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-fade-in-up">
                        <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm mb-2">Checkout Initiated</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">You may leave the keys on the table. The door will auto-lock upon departure.</p>
                    </div>
                ) : (
                    <button 
                        onClick={() => setCheckoutRequested(true)}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-400 dark:hover:bg-gold-400 hover:text-black transition-colors flex items-center justify-center space-x-2"
                    >
                        <LogOut size={16} />
                        <span>Self Checkout</span>
                    </button>
                )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center mb-3">
                        <Wifi size={20} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">WiFi Network</span>
                    <span className="font-bold text-gray-900 dark:text-white">Nomada_Guest</span>
                    <span className="text-xs text-gray-500 mt-2">Pass: luxury2024</span>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-3">
                        <MessageCircle size={20} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Digital Host</span>
                    <span className="font-bold text-gray-900 dark:text-white">WhatsApp Us</span>
                    <span className="text-xs text-gray-500 mt-2">24/7 Response</span>
                </div>
            </div>
         </div>

         {/* RIGHT COL: INFO & FAQ */}
         <div className="glass-panel p-8 rounded-3xl h-full">
            <div className="flex items-center space-x-3 mb-8 text-gold-400">
                <HelpCircle size={24} />
                <h3 className="text-xl font-serif text-gray-900 dark:text-white">Guest Compendium</h3>
            </div>

            <div className="space-y-4">
                <FaqItem 
                    id="gym" 
                    title="Fitness & Wellness" 
                    active={activeFaq === 'gym'} 
                    toggle={() => toggleFaq('gym')}
                    icon={Wifi} 
                >
                    As a Nomada guest, you have exclusive access to our partner gyms and spas across the city. Purchase day passes in the <strong>Concierge</strong> tab to receive your digital entry code.
                </FaqItem>

                <FaqItem 
                    id="reception" 
                    title="Where is the Reception?" 
                    active={activeFaq === 'reception'} 
                    toggle={() => toggleFaq('reception')}
                    icon={Clock}
                >
                    Nomada Apartments are fully autonomous with no physical front desk. Our support team is available 24/7 via the Chat tab or WhatsApp for any needs.
                </FaqItem>

                <FaqItem 
                    id="house" 
                    title="Cleaning Services" 
                    active={activeFaq === 'house'} 
                    toggle={() => toggleFaq('house')}
                    icon={FileText}
                >
                    We respect your privacy and do not enter for daily cleaning. You can book on-demand housekeeping services (fresh linens, full clean) via the <strong>Cleaning</strong> tab.
                </FaqItem>

                <FaqItem 
                    id="luggage" 
                    title="Luggage Storage" 
                    active={activeFaq === 'luggage'} 
                    toggle={() => toggleFaq('luggage')}
                    icon={FileText}
                >
                    We partner with secure lockers throughout the city for luggage storage before check-in or after check-out. Contact support for the nearest location code.
                </FaqItem>
            </div>
         </div>

      </div>
    </div>
  );
};

const FaqItem: React.FC<{ id: string, title: string, active: boolean, toggle: () => void, children: React.ReactNode, icon: any }> = ({ id, title, active, toggle, children, icon: Icon }) => (
    <div className={`border rounded-xl transition-all duration-300 ${active ? 'bg-white/10 border-gold-400/50' : 'border-gray-200 dark:border-white/10 hover:bg-white/5'}`}>
        <button onClick={toggle} className="w-full flex items-center justify-between p-4 text-left">
            <span className="font-bold text-gray-900 dark:text-white flex items-center">
                 {title}
            </span>
            {active ? <ChevronUp size={16} className="text-gold-400" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${active ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="p-4 pt-0 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-dashed border-gray-600/20 mt-2">
                {children}
            </p>
        </div>
    </div>
);

export default Reception;
