
import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { CreditCard, LogOut, HelpCircle, Wifi, Phone, Clock, FileText, ChevronDown, ChevronUp, MessageCircle, Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Reception: React.FC = () => {
  const { orders, bookings, rooms } = useSystem();
  const [showKey, setShowKey] = useState(false);
  
  const currentBooking = bookings.find(b => b.roomNumber === '304') || bookings[0];
  const roomOrders = orders.filter(o => o.roomNumber === '304');
  
  const roomTotal = currentBooking ? currentBooking.totalAmount : 0;
  const diningTotal = roomOrders.reduce((acc, curr) => acc + curr.total, 0);
  const taxes = (roomTotal + diningTotal) * 0.10;
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
         
         {/* LEFT COL: ACCESS & BILLING */}
         <div className="flex flex-col gap-6">
            
            {/* DIGITAL SUITE KEY - NOW IN RECEPTION */}
            <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-gold-400 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] text-gold-400 uppercase tracking-[0.3em] font-bold block mb-1">Access Control</span>
                        <h3 className="text-xl font-serif text-white">Digital Suite Key</h3>
                    </div>
                    <ShieldCheck size={24} className="text-green-500" />
                </div>
                
                <div className="flex items-center justify-center py-6">
                    <div 
                        onClick={() => setShowKey(!showKey)}
                        className="flex items-center space-x-6 px-10 py-5 bg-black/40 rounded-2xl border border-white/10 cursor-pointer hover:border-gold-400 transition-all active:scale-95 group shadow-2xl"
                    >
                        <Key size={28} className={showKey ? 'text-gold-400' : 'text-gray-600'} />
                        <span className={`text-4xl font-mono tracking-[0.5em] font-bold ${showKey ? 'text-white' : 'text-gray-700 blur-sm transition-all duration-300'}`}>
                            {currentBooking?.doorCode || '8821'}
                        </span>
                        {showKey ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-2">Tap to reveal code for Unit {currentBooking?.roomNumber || '304'}</p>
            </div>

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

                    <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-serif text-gray-900 dark:text-white">Total Due</span>
                        <span className="text-3xl font-serif text-gold-400">${grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Actions */}
                {checkoutRequested ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-fade-in-up">
                        <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm mb-2">Checkout Initiated</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">The door will auto-lock upon departure.</p>
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
         </div>

         {/* RIGHT COL: INFO & FAQ */}
         <div className="glass-panel p-8 rounded-3xl h-full">
            <div className="flex items-center space-x-3 mb-8 text-gold-400">
                <HelpCircle size={24} />
                <h3 className="text-xl font-serif text-gray-900 dark:text-white">Guest Compendium</h3>
            </div>

            <div className="space-y-4">
                <FaqItem id="gym" title="Fitness & Wellness" active={activeFaq === 'gym'} toggle={() => toggleFaq('gym')} icon={Wifi}>
                    As a Nomada guest, you have exclusive access to our partner gyms and spas across the city. Purchase day passes in the <strong>Concierge</strong> tab to receive your digital entry code.
                </FaqItem>

                <FaqItem id="reception" title="Where is the Reception?" active={activeFaq === 'reception'} toggle={() => toggleFaq('reception')} icon={Clock}>
                    Nomada Apartments are fully autonomous with no physical front desk. Our support team is available 24/7 via the Chat tab or WhatsApp for any needs.
                </FaqItem>

                <FaqItem id="house" title="Cleaning Services" active={activeFaq === 'house'} toggle={() => toggleFaq('house')} icon={FileText}>
                    We respect your privacy and do not enter for daily cleaning. You can book on-demand housekeeping services (fresh linens, full clean) via the <strong>Cleaning</strong> tab.
                </FaqItem>

                <FaqItem id="luggage" title="Luggage Storage" active={activeFaq === 'luggage'} toggle={() => toggleFaq('luggage')} icon={FileText}>
                    We partner with secure lockers throughout the city for luggage storage. Contact support for the nearest location code.
                </FaqItem>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <Wifi size={18} className="mx-auto mb-2 text-gold-400" />
                    <span className="block text-[10px] uppercase text-gray-500">Nomada_Guest</span>
                    <span className="text-xs font-bold text-white">luxury2024</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <MessageCircle size={18} className="mx-auto mb-2 text-green-500" />
                    <span className="block text-[10px] uppercase text-gray-500">24/7 Support</span>
                    <span className="text-xs font-bold text-white">WhatsApp Host</span>
                </div>
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
