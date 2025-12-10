
import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../context/SystemContext';
import { OrderStatus, Order, MenuItem } from '../types';
import { Clock, CheckCircle, Flame, Bell, Utensils, Printer, History, RefreshCcw, ChefHat, LayoutGrid, ListChecks, Power, AlertCircle, ToggleLeft, ToggleRight, DollarSign, TrendingUp, Plus, X, Save, Image as ImageIcon } from 'lucide-react';

// Bell sound for new orders
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

type KdsTab = 'LIVE' | 'MENU' | 'HISTORY';

const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, hotelConfig, menuItems, updateMenuItem, addMenuItem } = useSystem();
  const [activeTab, setActiveTab] = useState<KdsTab>('LIVE');
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  
  // Add Item State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
      title: '',
      category: 'Breakfast',
      price: '',
      available: true
  });
  
  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevOrderCount = useRef(orders.length);

  // Filter Orders
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED').sort((a,b) => a.timestamp - b.timestamp);
  const historyOrders = orders.filter(o => o.status === 'DELIVERED').sort((a,b) => b.timestamp - a.timestamp);
  
  // Stats
  const pendingCount = activeOrders.filter(o => o.status === 'PENDING').length;
  const preparingCount = activeOrders.filter(o => o.status === 'PREPARING').length;
  const readyCount = activeOrders.filter(o => o.status === 'READY').length;

  // Notification Logic: Play sound when order count increases
  useEffect(() => {
    if (orders.length > prevOrderCount.current) {
        // New order arrived
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed interaction required", e));
        }
    }
    prevOrderCount.current = orders.length;
  }, [orders]);

  const handlePrint = (order: Order) => {
      setPrintingOrder(order);
      // Wait for DOM to update with the printable slip, then print
      setTimeout(() => {
          window.print();
          setPrintingOrder(null);
      }, 500);
  };

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'PENDING') return 'PREPARING';
    if (current === 'PREPARING') return 'READY';
    if (current === 'READY') return 'DELIVERED';
    return null;
  };

  const handleAddItem = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newItem.title || !newItem.price) return;

      const itemToAdd: MenuItem = {
          id: `spec_${Date.now()}`,
          title: newItem.title,
          category: newItem.category || 'Dinner',
          price: newItem.price.includes('$') ? newItem.price : `$${newItem.price}`,
          description: newItem.description || 'Chef Special',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop', // Default food image
          available: true,
          ingredients: ['Chef Selection']
      };

      addMenuItem(itemToAdd);
      setShowAddModal(false);
      setNewItem({ title: '', category: 'Breakfast', price: '', available: true });
  };

  return (
    <div className="h-screen bg-gray-900 text-white font-mono flex relative overflow-hidden">
      <audio ref={audioRef} src={NOTIFICATION_SOUND} />

      {/* --- SIDEBAR --- */}
      <div className="w-20 md:w-64 bg-gray-800 border-r border-gray-700 flex flex-col justify-between z-20">
          <div>
              <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-700">
                 <div className="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center text-black shadow-lg shadow-gold-400/20">
                    <ChefHat size={24} />
                 </div>
                 <div className="hidden md:block ml-3">
                     <h1 className="text-lg font-bold uppercase tracking-wider leading-none text-white">KDS</h1>
                     <span className="text-[10px] text-gray-400 uppercase tracking-widest">Kitchen System</span>
                 </div>
              </div>

              <nav className="p-2 md:p-4 space-y-2">
                  <KdsNavItem 
                      active={activeTab === 'LIVE'} 
                      onClick={() => setActiveTab('LIVE')} 
                      icon={LayoutGrid} 
                      label="Live Orders" 
                      badge={activeOrders.length}
                  />
                  <KdsNavItem 
                      active={activeTab === 'MENU'} 
                      onClick={() => setActiveTab('MENU')} 
                      icon={ListChecks} 
                      label="Stock Manager" 
                  />
                  <KdsNavItem 
                      active={activeTab === 'HISTORY'} 
                      onClick={() => setActiveTab('HISTORY')} 
                      icon={History} 
                      label="History & Shift" 
                  />
              </nav>
          </div>

          <div className="p-4 border-t border-gray-700">
               <div className="hidden md:block">
                   <p className="text-[10px] uppercase text-gray-500 mb-1">Device ID</p>
                   <p className="font-mono text-xs text-gray-300">KDS-MAIN-01</p>
               </div>
          </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col relative bg-gray-900 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 border-b border-gray-700 bg-gray-800/50 backdrop-blur-md flex justify-between items-center px-6">
            <h2 className="text-xl font-bold uppercase tracking-widest">
                {activeTab === 'LIVE' && 'Live Service'}
                {activeTab === 'MENU' && 'Inventory & Specials'}
                {activeTab === 'HISTORY' && 'Shift History'}
            </h2>

            {activeTab === 'LIVE' && (
                <div className="flex space-x-3">
                    <StatusPill count={pendingCount} label="Pending" color="bg-red-500" />
                    <StatusPill count={preparingCount} label="Prep" color="bg-orange-500" />
                    <StatusPill count={readyCount} label="Ready" color="bg-green-500" />
                </div>
            )}
            
            {activeTab === 'MENU' && (
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-gold-400 text-black px-4 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors"
                >
                    <Plus size={16} />
                    <span>Add Special</span>
                </button>
            )}
        </header>

        {/* --- LIVE ORDERS TAB --- */}
        {activeTab === 'LIVE' && (
             <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.length === 0 && (
                         <div className="col-span-full flex flex-col items-center justify-center h-96 text-gray-600 opacity-50">
                             <CheckCircle size={80} className="mb-6" />
                             <p className="text-2xl uppercase tracking-widest font-bold">All caught up</p>
                             <p className="text-sm">Waiting for new orders...</p>
                         </div>
                    )}
                    {activeOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onNextStatus={() => {
                                const next = nextStatus(order.status);
                                if(next) updateOrderStatus(order.id, next);
                            }} 
                            onPrint={() => handlePrint(order)} 
                        />
                    ))}
                </div>
             </div>
        )}

        {/* --- STOCK MANAGEMENT TAB --- */}
        {activeTab === 'MENU' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {menuItems.map(item => (
                        <div key={item.id} className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${item.available !== false ? 'bg-gray-800 border-gray-700' : 'bg-red-900/20 border-red-500/50'}`}>
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.title} className={`w-16 h-16 rounded object-cover ${item.available === false ? 'grayscale opacity-50' : ''}`} />
                                <div>
                                    <h4 className={`font-bold ${item.available === false ? 'text-gray-500 line-through' : 'text-white'}`}>{item.title}</h4>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category} • {item.price}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => updateMenuItem({...item, available: !item.available})}
                                className={`flex flex-col items-center justify-center w-24 h-12 rounded font-bold uppercase text-[10px] tracking-widest transition-colors ${item.available !== false ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500 text-white'}`}
                            >
                                {item.available !== false ? (
                                    <>
                                        <ToggleRight size={24} />
                                        <span>In Stock</span>
                                    </>
                                ) : (
                                    <>
                                        <ToggleLeft size={24} />
                                        <span>86'd</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- HISTORY TAB --- */}
        {activeTab === 'HISTORY' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {/* Shift Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                         <div className="flex items-center space-x-3 text-gold-400 mb-2">
                             <CheckCircle size={20} />
                             <span className="uppercase text-xs font-bold tracking-widest">Orders Completed</span>
                         </div>
                         <p className="text-3xl font-bold">{historyOrders.length}</p>
                     </div>
                     <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                         <div className="flex items-center space-x-3 text-green-400 mb-2">
                             <DollarSign size={20} />
                             <span className="uppercase text-xs font-bold tracking-widest">Est. Revenue</span>
                         </div>
                         <p className="text-3xl font-bold">${historyOrders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
                     </div>
                     <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                         <div className="flex items-center space-x-3 text-blue-400 mb-2">
                             <TrendingUp size={20} />
                             <span className="uppercase text-xs font-bold tracking-widest">Shift Efficiency</span>
                         </div>
                         <p className="text-3xl font-bold">94%</p>
                     </div>
                </div>

                <div className="space-y-4">
                     {historyOrders.map(order => (
                         <div key={order.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                             <div className="flex items-center space-x-4">
                                 <span className="text-gray-500 font-mono text-xs">#{order.id}</span>
                                 <div>
                                     <p className="font-bold text-white">Room {order.roomNumber} - {order.guestName}</p>
                                     <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-green-400">Delivered</p>
                                 <button onClick={() => handlePrint(order)} className="text-xs text-gray-400 hover:text-white flex items-center justify-end mt-1">
                                     <Printer size={12} className="mr-1" /> Reprint
                                 </button>
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        )}

      </div>

      {/* --- ADD SPECIAL MODAL --- */}
      {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in-up">
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                      <h3 className="font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Flame size={18} className="text-gold-400" /> New Kitchen Special
                      </h3>
                      <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleAddItem} className="p-6 space-y-4">
                      <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Item Name</label>
                          <input 
                            autoFocus
                            type="text" 
                            required
                            placeholder="e.g. Catch of the Day"
                            value={newItem.title}
                            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-gold-400 outline-none"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Category</label>
                              <select 
                                value={newItem.category}
                                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-gold-400 outline-none"
                              >
                                  <option value="Breakfast">Breakfast</option>
                                  <option value="Lunch">Lunch</option>
                                  <option value="Dinner">Dinner</option>
                                  <option value="Other">Other</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Price</label>
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. 35"
                                value={newItem.price}
                                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-gold-400 outline-none"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Description (Optional)</label>
                          <textarea 
                            placeholder="Brief description for the guest..."
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-gold-400 outline-none h-20"
                          />
                      </div>
                      
                      <div className="pt-2">
                          <button type="submit" className="w-full bg-gold-400 text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-white transition-colors flex justify-center items-center gap-2">
                              <Save size={18} /> Add to Live Menu
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}


      {/* --- HIDDEN PRINT AREA (80mm Width) --- */}
      <div id="print-area" className="hidden">
          {printingOrder && (
              <div className="w-[300px] text-black font-mono p-2 text-xs">
                  <div className="text-center pb-2 mb-2 border-b border-black">
                      <h1 className="text-lg font-bold uppercase tracking-widest">{hotelConfig.name}</h1>
                      <p className="text-[10px] uppercase">Kitchen Ticket</p>
                  </div>
                  
                  <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-2xl font-bold block">RM {printingOrder.roomNumber}</span>
                        <span className="text-xs uppercase">{printingOrder.guestName}</span>
                      </div>
                      <span className="text-sm font-bold">#{printingOrder.id}</span>
                  </div>
                  
                  <div className="border-b-2 border-dashed border-black mb-4"></div>

                  <ul className="space-y-4 mb-6">
                      {printingOrder.items.map((item, idx) => (
                          <li key={idx} className="flex flex-col">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-sm">1x</span>
                                <span className="font-bold text-sm flex-1 ml-2">{item.title}</span>
                              </div>
                              {item.isVegetarian && <div className="text-[10px] uppercase ml-6 mt-1">** VEGETARIAN **</div>}
                          </li>
                      ))}
                  </ul>

                  <div className="border-b-2 border-dashed border-black mb-4"></div>
                  
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>In: {new Date(printingOrder.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span>{new Date(printingOrder.timestamp).toLocaleDateString()}</span>
                  </div>
              </div>
          )}
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #print-area, #print-area * {
                visibility: visible;
                color: black !important;
                background: white !important;
            }
            #print-area {
                position: absolute;
                left: 0;
                top: 0;
                display: block !important;
                width: 80mm;
            }
        }
      `}</style>
    </div>
  );
};

// --- Sub Components ---

const KdsNavItem: React.FC<{ active: boolean, onClick: () => void, icon: any, label: string, badge?: number }> = ({ active, onClick, icon: Icon, label, badge }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-center md:justify-start space-x-0 md:space-x-3 p-3 rounded-lg transition-all ${active ? 'bg-gold-400 text-black' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        title={label}
    >
        <div className="relative">
            <Icon size={20} />
            {badge !== undefined && badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gray-800">
                    {badge}
                </span>
            )}
        </div>
        <span className="hidden md:block text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
);

const StatusPill: React.FC<{ count: number, label: string, color: string }> = ({ count, label, color }) => (
    <div className={`flex items-center px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700`}>
        <div className={`w-2 h-2 rounded-full ${color} mr-2 animate-pulse`}></div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            {count} {label}
        </span>
    </div>
);

const OrderCard: React.FC<{ 
    order: Order; 
    onNextStatus: () => void; 
    onPrint: () => void;
}> = ({ order, onNextStatus, onPrint }) => {
    
    // Timer Logic
    const [elapsed, setElapsed] = useState(0);
    
    useEffect(() => {
        const updateTimer = () => setElapsed(Math.floor((Date.now() - order.timestamp) / 60000));
        updateTimer();
        const interval = setInterval(updateTimer, 10000); 
        return () => clearInterval(interval);
    }, [order.timestamp]);

    const isUrgent = elapsed > 20;

    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
          case 'PENDING': return 'border-red-500 bg-red-500/10 text-red-400';
          case 'PREPARING': return 'border-orange-500 bg-orange-500/10 text-orange-400';
          case 'READY': return 'border-green-500 bg-green-500/10 text-green-400';
          default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div className={`border-t-8 rounded-lg bg-gray-800 flex flex-col relative transition-all shadow-2xl overflow-hidden ${getStatusStyle(order.status)} ${isUrgent ? 'animate-pulse ring-2 ring-red-500' : ''}`}>
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-black/20">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-400">RM</span>
                    <h3 className="text-4xl font-bold text-white leading-none">{order.roomNumber}</h3>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className={`flex items-center space-x-1 font-mono font-bold text-lg ${elapsed > 15 ? 'text-red-400' : 'text-gray-300'}`}>
                        <Clock size={16} />
                        <span>{elapsed}m</span>
                    </div>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                  <p className="text-xs uppercase font-bold text-gold-400 truncate max-w-[70%]">{order.guestName}</p>
                  <span className="text-[10px] text-gray-500 font-mono">#{order.id}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px] bg-gray-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-start">
                      <span className="text-lg font-bold text-white w-6">1x</span>
                      <span className="text-lg font-bold text-white leading-tight flex-1">{item.title}</span>
                  </div>
                  {item.isVegetarian && (
                      <span className="text-[10px] text-green-400 font-bold uppercase ml-6 mt-1 tracking-wider border border-green-500/30 self-start px-1 rounded">Vegetarian</span>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-black/30 border-t border-white/5 grid grid-cols-4 gap-2">
                <button 
                    onClick={onPrint}
                    className="col-span-1 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors h-12"
                    title="Print Ticket"
                >
                    <Printer size={20} />
                </button>
                <button 
                    onClick={onNextStatus}
                    className={`col-span-3 h-12 text-center font-bold uppercase tracking-widest text-xs rounded transition-colors hover:brightness-110 flex items-center justify-center space-x-2 text-white shadow-lg
                        ${order.status === 'PENDING' ? 'bg-red-600 hover:bg-red-500' : ''}
                        ${order.status === 'PREPARING' ? 'bg-orange-600 hover:bg-orange-500' : ''}
                        ${order.status === 'READY' ? 'bg-green-600 hover:bg-green-500' : ''}
                    `}
                >
                    {order.status === 'PENDING' && <><Flame size={16} /> <span>Start Order</span></>}
                    {order.status === 'PREPARING' && <><Bell size={16} /> <span>Mark Ready</span></>}
                    {order.status === 'READY' && <><CheckCircle size={16} /> <span>Complete</span></>}
                </button>
            </div>
        </div>
    );
};

export default KitchenDisplay;
