
import React, { useState } from 'react';
import { MenuItem, OrderItem } from '../types';
import { useSystem } from '../context/SystemContext';
import { Plus, Check, ShoppingBag, X, ChefHat, Info, ArrowRight, Loader, Utensils, Heart } from 'lucide-react';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Other'];

const Dining: React.FC = () => {
  const { addOrder, menuItems } = useSystem();
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  
  // Customization State within Modal
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalNotes, setModalNotes] = useState('');
  const [modalPairingSelected, setModalPairingSelected] = useState(false);

  // Filter items by category AND availability (Kitchen Stock)
  const availableItems = menuItems.filter(item => item.available !== false);
  
  const filteredItems = activeCategory === 'All' 
    ? availableItems 
    : availableItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem, notes: string, addPairing: boolean) => {
      const newItems: OrderItem[] = [];
      
      // Add Main Item
      newItems.push({ ...item, notes });

      // Add Pairing if selected
      if (addPairing && item.pairingId) {
          const pairItem = menuItems.find(i => i.id === item.pairingId);
          if (pairItem) {
              newItems.push({ ...pairItem, notes: `Pairing for ${item.title}` });
          }
      }

      setCart(prev => [...prev, ...newItems]);
      setSelectedItem(null);
      resetModal();
  };

  const resetModal = () => {
      setModalNotes('');
      setModalPairingSelected(false);
      setModalQuantity(1);
  }

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      addOrder(cart);
      setCart([]);
      setIsSubmitting(false);
      setOrderSent(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setOrderSent(false), 3000);
    }, 1500);
  };

  const getPairingItem = (id?: string) => menuItems.find(i => i.id === id);

  return (
    <div className="h-full flex flex-col animate-fade-in-up relative">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 mt-2">
        <div>
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 block">
            Culinary Arts
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">In-Room Dining</h2>
        </div>
        
        {/* Cart Indicator / Kitchen Info */}
        <div className="flex flex-col items-end">
           <div className="hidden md:block mb-2">
             <p className="text-right text-gray-400 text-sm">Kitchen Open: 24 Hours</p>
             <p className="text-right text-gold-400 text-xs uppercase tracking-widest mt-1">Est. Delivery: 35 mins</p>
           </div>
           
           {cart.length > 0 ? (
             <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex items-center space-x-3 bg-gold-400 text-black px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
             >
               {isSubmitting ? (
                 <>
                    <Loader className="animate-spin" size={16} />
                    <span>Sending...</span>
                 </>
               ) : (
                 <>
                    <ShoppingBag size={16} />
                    <span>Order Tray ({cart.length})</span>
                 </>
               )}
             </button>
           ) : orderSent ? (
              <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-4 py-2 rounded">
                 <Check size={16} />
                 <span className="text-xs font-bold uppercase tracking-wider">Order Sent to Kitchen</span>
              </div>
           ) : null}
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
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

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-24 pr-2 custom-scrollbar flex-1 min-h-0">
        {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="glass-panel p-0 rounded-2xl overflow-hidden group hover:bg-white/5 transition-colors duration-500 flex flex-col cursor-pointer"
            >
              {/* Image Area */}
              <div className="h-48 w-full relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                
                {item.isVegetarian && (
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                        Plant Based
                    </div>
                )}
                
                {/* Info Icon hint */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                    <Info size={16} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-white group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-lg font-serif italic text-gold-400">{item.price}</span>
                </div>
                
                <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 flex-1 line-clamp-2">
                  {item.description}
                </p>

                <div className="w-full py-4 flex items-center justify-center space-x-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border border-white/20 text-white group-hover:bg-white group-hover:text-black">
                    <Plus size={14} /> <span>Customize</span>
                </div>
              </div>
            </div>
        ))}
      </div>

      {/* REIMAGINED ITEM DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-lg transition-opacity duration-300" 
            onClick={() => { setSelectedItem(null); resetModal(); }} 
          />
          <div className="relative w-full max-w-6xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up">
            
            {/* Modal Image Section */}
            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                
                <button 
                    onClick={() => { setSelectedItem(null); resetModal(); }}
                    className="absolute top-4 left-4 md:hidden bg-black/50 backdrop-blur-md p-2 rounded-full text-white border border-white/10"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Modal Content Section */}
            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col overflow-y-auto">
                <div className="hidden md:flex justify-end mb-4">
                     <button 
                        onClick={() => { setSelectedItem(null); resetModal(); }}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-2">
                    <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">
                        {selectedItem.category}
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                    {selectedItem.title}
                </h2>

                <div className="flex items-center space-x-4 mb-8 text-gray-400">
                    <span className="text-2xl text-white font-serif italic">{selectedItem.price}</span>
                    {selectedItem.isVegetarian && (
                         <span className="border border-white/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-2">
                             <Heart size={10} fill="currentColor" /> Plant Based
                         </span>
                    )}
                </div>

                <p className="text-gray-300 text-lg font-light leading-relaxed mb-8">
                    {selectedItem.description}
                </p>

                {/* --- UPSELL SECTION: THE PERFECT PAIRING --- */}
                {selectedItem.pairingId && getPairingItem(selectedItem.pairingId) && (
                    <div className="mb-8 bg-gradient-to-r from-gold-400/20 to-transparent p-6 rounded-xl border border-gold-400/30">
                        <div className="flex items-center space-x-2 mb-3 text-gold-400">
                            <Utensils size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Sommelier's Recommendation</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <img 
                                src={getPairingItem(selectedItem.pairingId)?.image} 
                                className="w-16 h-16 rounded-lg object-cover border border-white/10"
                            />
                            <div className="flex-1">
                                <h4 className="text-white font-serif text-lg">{getPairingItem(selectedItem.pairingId)?.title}</h4>
                                <p className="text-sm text-gray-400 italic mb-2">{selectedItem.pairingReason}</p>
                                <div 
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => setModalPairingSelected(!modalPairingSelected)}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${modalPairingSelected ? 'bg-gold-400 border-gold-400 text-black' : 'border-gray-500'}`}>
                                        {modalPairingSelected && <Check size={12} />}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wide ${modalPairingSelected ? 'text-white' : 'text-gray-500'}`}>
                                        Add for {getPairingItem(selectedItem.pairingId)?.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PREFERENCES & NOTES --- */}
                <div className="mb-8">
                    <label className="flex items-center space-x-2 mb-4 text-gray-400">
                        <ChefHat size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Chef's Notes & Preferences</span>
                    </label>
                    <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-gold-400 min-h-[80px]"
                        placeholder="Allergies, dietary restrictions, or special requests (e.g. 'Sauce on side')..."
                        value={modalNotes}
                        onChange={(e) => setModalNotes(e.target.value)}
                    />
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    {/* Simplified Quantity for MVP */}
                    <div className="text-white text-sm">
                        Total Estimate: <span className="font-serif text-xl ml-2">{selectedItem.price}</span>
                        {modalPairingSelected && <span className="text-gold-400 ml-1"> + pairing</span>}
                    </div>

                    <button 
                        onClick={() => handleAddToCart(selectedItem, modalNotes, modalPairingSelected)}
                        className="bg-gold-400 text-black px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-3"
                    >
                        <span>Add to Tray</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dining;
