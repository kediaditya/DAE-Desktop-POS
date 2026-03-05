
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ViewState, MenuCategory, CartItem, OverlayType } from '../types';
import { THEME, UI_CLASSES } from '../theme';
import { Icon } from '../icons';
import { Button, Card, Modal, Badge, Input } from '../components/UI';

interface POSHomeViewProps {
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

const POSHomeView: React.FC<POSHomeViewProps> = ({ onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState<MenuCategory>(MenuCategory.FUEL);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPump, setSelectedPump] = useState<number | null>(1);
  const [overlay, setOverlay] = useState<OverlayType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [pumpPage, setPumpPage] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(440);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);

  // Resize Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(340, Math.min(600, e.clientX - 24)); // 24px padding
      setLeftPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  const pumpGridCols = useMemo(() => {
    if (leftPanelWidth < 380) return 3;
    if (leftPanelWidth > 520) return 5;
    return 4;
  }, [leftPanelWidth]);

  const addToCart = (item: Partial<CartItem>) => {
    if (isPaid) {
      setCart([]);
      setIsPaid(false);
    }
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name || 'Unknown Item',
      quantity: item.quantity || 1,
      price: item.price || 0,
      total: (item.price || 0) * (item.quantity || 1),
      isFuel: item.isFuel,
      pumpNo: item.isFuel ? selectedPump || undefined : undefined
    };
    setCart(prev => [...prev, newItem]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setIsPaid(false);
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setOverlay(OverlayType.PAYMENT_SUCCESS);
  };

  const closeOverlay = () => { setOverlay(null); setInputValue(''); };

  // Pump Status Types
  type PumpStatus = 
    | 'Disconnected' 
    | 'Closed' 
    | 'Connecting' 
    | 'Idle' 
    | 'Payment' 
    | 'Fueling' 
    | 'IdleManual' 
    | 'CallManual' 
    | 'Suspend' 
    | 'Error';

  const getPumpStatusConfig = (status: string) => {
    switch (status) {
      case 'Disconnected': return { bg: 'bg-red-50 bg-opacity-40', border: 'border-red-500', text: 'text-red-700', icon: Icon.Disconnected, label: 'No Conn', iconColor: 'text-red-500' };
      case 'Closed': return { bg: 'bg-slate-100 bg-opacity-40', border: 'border-slate-400', text: 'text-slate-600', icon: Icon.Closed, label: 'Closed', iconColor: 'text-slate-400' };
      case 'Connecting': return { bg: 'bg-orange-50 bg-opacity-40', border: 'border-orange-500', text: 'text-orange-700', icon: Icon.Connecting, label: 'Connect', animate: 'animate-spin', iconColor: 'text-orange-500' };
      case 'Idle': return { bg: 'bg-emerald-50 bg-opacity-40', border: 'border-emerald-500', text: 'text-emerald-700', icon: Icon.Fuel, label: 'Idle', iconColor: 'text-emerald-500' };
      case 'Payment': return { bg: 'bg-rose-50 bg-opacity-40', border: 'border-rose-500', text: 'text-rose-700', icon: Icon.Payment, label: 'To Pay', iconColor: 'text-rose-500' };
      case 'Fueling': return { bg: 'bg-blue-50 bg-opacity-40', border: 'border-blue-500', text: 'text-blue-700', icon: Icon.Droplets, label: 'Fueling', iconColor: 'text-blue-500' };
      case 'IdleManual': return { bg: 'bg-emerald-50 bg-opacity-40', border: 'border-emerald-500', text: 'text-emerald-700', icon: Icon.Hand, label: 'Manual', iconColor: 'text-emerald-500' };
      case 'CallManual': return { bg: 'bg-red-50 bg-opacity-40', border: 'border-red-500', text: 'text-red-700', icon: Icon.ArrowUp, label: 'Call', iconColor: 'text-red-500' };
      case 'Suspend': return { bg: 'bg-red-50 bg-opacity-40', border: 'border-red-500', text: 'text-red-700', icon: Icon.Suspend, label: 'Suspend', iconColor: 'text-red-500' };
      case 'Error': return { bg: 'bg-red-50 bg-opacity-40', border: 'border-red-500', text: 'text-red-700', icon: Icon.Alert, label: 'Error', iconColor: 'text-red-500' };
      default: return { bg: 'bg-slate-50 bg-opacity-40', border: 'border-slate-300', text: 'text-slate-500', icon: Icon.Fuel, label: 'Unknown', iconColor: 'text-slate-400' };
    }
  };

  // Generate 18 nozzles (3 pumps * 6 nozzles)
  const pumps = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const id = i + 1;
      const pumpNum = Math.ceil(id / 6);
      const nozzleNum = ((id - 1) % 6) + 1;
      
      // Simulate diverse statuses
      let status: PumpStatus = 'Idle';
      
      if (id === 2) status = 'Fueling';
      else if (id === 5) status = 'Payment';
      else if (id === 8) status = 'IdleManual';
      else if (id === 11) status = 'Error';
      else if (id === 12) status = 'CallManual';
      else if (id === 14) status = 'Connecting';
      else if (id === 15) status = 'Suspend';
      else if (id === 17) status = 'Disconnected';
      else if (id === 18) status = 'Closed';

      const fuelTypes = ['92# Gas', '95# Gas', '98# Gas', '0# Diesel', '92# Gas', '0# Diesel'];
      const type = fuelTypes[(nozzleNum - 1) % fuelTypes.length];

      return {
        id,
        pumpNum,
        nozzleNum,
        type,
        status
      };
    });
  }, []);

  const ITEMS_PER_PAGE = pumpGridCols * 2;
  const totalPages = Math.ceil(pumps.length / ITEMS_PER_PAGE);
  const visiblePumps = pumps.slice(pumpPage * ITEMS_PER_PAGE, (pumpPage + 1) * ITEMS_PER_PAGE);

  // Reset page if out of bounds due to resize
  useEffect(() => {
    if (pumpPage >= totalPages) {
      setPumpPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, pumpPage]);

  const pumpStats = useMemo(() => {
    return {
      active: pumps.filter(p => ['Fueling', 'Idle', 'IdleManual'].includes(p.status)).length,
      attention: pumps.filter(p => ['Payment', 'CallManual', 'Suspend'].includes(p.status)).length,
      offline: pumps.filter(p => ['Error', 'Disconnected', 'Closed', 'Connecting'].includes(p.status)).length,
    };
  }, [pumps]);

  const hasHiddenActivity = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      const nextPumps = pumps.slice((pumpPage + 1) * ITEMS_PER_PAGE);
      return nextPumps.some(p => p.status === 'Fueling');
    } else {
      const prevPumps = pumps.slice(0, pumpPage * ITEMS_PER_PAGE);
      return prevPumps.some(p => p.status === 'Fueling');
    }
  };

  const getPumpClassName = (status: string, isSelected: boolean) => {
    const config = getPumpStatusConfig(status);
    // Base: Light tint background, thicker colored border
    const base = `relative flex flex-col justify-between p-2 rounded-lg transition-all shadow-sm text-left h-full border-2 ${config.bg} ${config.border}`;
    
    if (isSelected) {
      return `${base} ring-2 ring-offset-1 ring-${THEME.colors.primary}`;
    }
    return base;
  };

  const getMenuClasses = (isActive: boolean, color: string) => {
    if (isActive) {
      return `bg-${color}-50 text-${color}-600 border-${color}-500 shadow-sm ring-1 ring-${color}-500`;
    }
    return `bg-white text-slate-500 hover:bg-slate-50 border-transparent hover:border-slate-200`;
  };

  const MENU_CONFIG = {
    [MenuCategory.FUEL]: { color: 'orange', icon: Icon.Fuel, label: 'Fuel Items' },
    [MenuCategory.NON_FUEL]: { color: 'blue', icon: Icon.Cart, label: 'Goods' },
    [MenuCategory.KEYPAD]: { color: 'slate', icon: Icon.Keypad, label: 'Keypad' },
    [MenuCategory.PAYMENT]: { color: 'emerald', icon: Icon.Payment, label: 'Payment' },
    [MenuCategory.DATA]: { color: 'purple', icon: Icon.Analytics, label: 'History' },
    [MenuCategory.SYSTEM]: { color: 'slate', icon: Icon.Settings, label: 'System' },
  };

  const fuelProducts = [
    { name: '92# Gasoline', price: 6.77 },
    { name: '95# Gasoline', price: 7.23 },
    { name: '98# Gasoline', price: 8.12 },
    { name: '0# Diesel', price: 6.41 },
    { name: '97# Gasoline', price: 7.88 },
  ];

  const nonFuelProducts = [
    { name: 'Oil 10L', price: 120.00 },
    { name: 'RedBull', price: 5.50 },
    { name: 'Wiper Fluid', price: 15.00 },
    { name: 'Soft Tissues', price: 2.50 },
    { name: 'Car Wash', price: 10.00 },
    { name: 'Coffee', price: 3.50 },
    { name: 'Snack Bar', price: 4.20 },
    { name: 'Water 500ml', price: 1.50 },
  ];

  const renderScanModalContent = () => {
    const isGiftCard = overlay === OverlayType.GIFT_CARD;
    return (
      <div className="text-center py-10 space-y-8">
           <div className="relative w-48 h-48 mx-auto">
              <div className={`absolute inset-0 border-4 border-${THEME.colors.primary} ${THEME.radius.large} animate-pulse`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isGiftCard ? <Icon.Payment className={`w-24 h-24 text-${THEME.colors.primary}`} /> : <Icon.Scan className={`w-24 h-24 text-${THEME.colors.primary}`} />}
              </div>
              <div className={`absolute top-1/2 left-0 w-full h-1 bg-${THEME.colors.accent} shadow-lg animate-bounce`}></div>
           </div>
           <div className="space-y-2">
             <h4 className={`text-2xl font-bold text-${THEME.colors.text.base}`}>
                {isGiftCard ? 'Swipe or Scan Gift Card' : 'Scanning Payment'}
             </h4>
             <p className={`text-${THEME.colors.text.muted} font-medium`}>
                {isGiftCard ? 'Please swipe card on the reader' : 'Please position QR code in front of scanner'}
             </p>
           </div>
           <Button onClick={closeOverlay} variant="outline" className="w-full">Cancel</Button>
      </div>
    );
  };

  // STRICT CONSISTENCY CLASSES
  const ICON_CONTAINER_CLASS = `w-8 h-8 bg-${THEME.colors.primaryLight} rounded-full flex items-center justify-center text-${THEME.colors.primary} group-hover:bg-${THEME.colors.primary} group-hover:text-white transition-colors shrink-0`;
  const GRID_BUTTON_CLASS = `relative bg-white hover:border-${THEME.colors.primary} border-2 border-transparent p-3 ${THEME.radius.large} shadow-sm transition-all group hover:shadow-md hover:-translate-y-0.5`;
  const CARD_HEIGHT = "h-24"; 
  const CARD_PRICE = `text-lg ${THEME.typography.heading} text-${THEME.colors.text.base}`; 
  const CARD_NAME = `font-semibold text-${THEME.colors.text.base} text-xs text-left line-clamp-2`;

  // Keypad Button Styles - Updated to use primaryLight instead of blue-50
  const KEY_BTN_BASE = "flex items-center justify-center rounded-md font-semibold text-sm transition-all shadow-sm active:translate-y-0.5 select-none";
  const KEY_FUNC = `bg-${THEME.colors.primaryLight} text-${THEME.colors.primary} hover:bg-${THEME.colors.primaryLightHover} border border-transparent`;
  const KEY_NUM = "bg-white text-slate-800 text-2xl hover:bg-slate-50 border border-slate-200";
  const KEY_ACTION = "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent";

  // Dimensions
  const BOTTOM_BTN_SIZE = "w-28 h-20";
  const TOTAL_BTN_HEIGHT = "h-20"; 

  return (
    <div className={`flex h-screen w-screen bg-${THEME.colors.background} p-6 gap-6 relative select-none`}>
      {/* Left Column: Receipt & Status */}
      <div 
        style={{ width: leftPanelWidth }} 
        className="flex flex-col gap-6 shrink-0 relative transition-[width] duration-75 ease-out"
      >
        {/* Resize Handle */}
        <div
          className="absolute top-0 -right-6 bottom-0 w-12 cursor-col-resize z-50 flex justify-center items-center group/resizer"
          onMouseDown={() => setIsResizing(true)}
        >
           <div className={`w-1.5 h-16 rounded-full transition-colors ${isResizing ? `bg-${THEME.colors.primary}` : 'bg-slate-300 group-hover/resizer:bg-slate-400'}`} />
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden p-0 border-0 shadow-lg ring-1 ring-slate-900/5">
          {/* Header using the new Brand Blue */}
          <div className={`p-3 border-b border-${THEME.colors.border} flex justify-between items-center bg-${THEME.colors.primary} text-white`}>
            <div>
              <h2 className={`text-lg font-semibold text-white`}>New Order</h2>
              <p className={`font-medium opacity-80 text-xs uppercase tracking-wider`}>#TRANS-2026-01-23</p>
            </div>
            <div className="text-right">
              <p className={`font-medium opacity-80 text-xs uppercase tracking-wider`}>Total Amount</p>
              <div className={`text-2xl ${THEME.typography.heading} text-${THEME.colors.accent}`}>${total.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-white">
            {cart.length === 0 ? (
              <div className={`h-full flex flex-col items-center justify-center text-${THEME.colors.text.light}`}>
                <div className={`p-6 bg-${THEME.colors.primaryLight} rounded-full mb-4`}>
                    <Icon.Cart className={`w-8 h-8 text-${THEME.colors.primary} opacity-50`} />
                </div>
                <p className={THEME.typography.body}>No items in cart</p>
                <p className="text-xs text-slate-400 mt-1">Select items from the menu</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className={`flex justify-between items-center p-3 bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} border border-${THEME.colors.borderLight} animate-in slide-in-from-left duration-200 group hover:border-${THEME.colors.primary} transition-colors`}>
                  <div className="flex-1">
                    <p className={`font-semibold text-${THEME.colors.text.base} flex items-center gap-2`}>
                      {item.isFuel && <Icon.Fuel className={`w-4 h-4 text-${THEME.colors.primary}`} />}
                      {item.name}
                      {item.pumpNo && <Badge>Pump {item.pumpNo}</Badge>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-xs text-${THEME.colors.text.muted}`}>${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!item.isFuel && !isPaid && (
                      <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors shadow-sm">
                          <Icon.Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors shadow-sm">
                          <Icon.Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {item.isFuel && (
                       <span className="text-xs font-semibold text-slate-500">{item.quantity.toFixed(2)} L</span>
                    )}
                    <div className="text-right min-w-[60px]">
                      <p className={`font-bold text-${THEME.colors.text.base}`}>${item.total.toFixed(2)}</p>
                    </div>
                    {!isPaid && (
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className={`text-${THEME.colors.text.light} hover:text-${THEME.colors.status.danger} transition-colors`}
                      >
                        <Icon.Delete className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={`p-4 bg-${THEME.colors.surfaceAlt} border-t border-${THEME.colors.border}`}>
             <div className="flex gap-3">
                <Button onClick={clearCart} variant="outline" className="flex-1 border-slate-300" icon={Icon.Reset}>Clear</Button>
                <Button 
                  onClick={() => setOverlay(OverlayType.PAYMENT_SUCCESS)} 
                  disabled={!isPaid}
                  className={`flex-[2] shadow-md shadow-slate-900/10 ${!isPaid ? 'opacity-50 cursor-not-allowed bg-slate-300' : 'bg-slate-800 hover:bg-slate-700'}`} 
                  icon={Icon.Print}
                >
                  Reprint Receipt
                </Button>
             </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 border-0 shadow-lg ring-1 ring-slate-900/5 p-4 min-h-[280px]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className={`font-bold text-${THEME.colors.text.base} flex items-center gap-2`}>
                <Icon.Fuel className={`w-5 h-5 text-${THEME.colors.primary}`} /> 
                <span>Pump Status</span>
              </h3>
              
              {/* Pagination Controls */}
              <div className="flex gap-1">
                  <button 
                    onClick={() => setPumpPage(p => Math.max(0, p - 1))}
                    disabled={pumpPage === 0}
                    className={`p-2 rounded-md transition-colors relative ${pumpPage === 0 ? 'text-slate-200 cursor-not-allowed' : `hover:bg-slate-100 text-${THEME.colors.text.base}`}`}
                  >
                    <Icon.ChevronLeft className="w-6 h-6" />
                    {hasHiddenActivity('prev') && (
                      <span className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-${THEME.colors.accent} animate-pulse`} />
                    )}
                  </button>
                  <button 
                    onClick={() => setPumpPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={pumpPage === totalPages - 1}
                    className={`p-2 rounded-md transition-colors relative ${pumpPage === totalPages - 1 ? 'text-slate-200 cursor-not-allowed' : `hover:bg-slate-100 text-${THEME.colors.text.base}`}`}
                  >
                    <Icon.ChevronRight className="w-6 h-6" />
                    {hasHiddenActivity('next') && (
                      <span className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-${THEME.colors.accent} animate-pulse`} />
                    )}
                  </button>
              </div>
            </div>

            <div className="flex gap-2">
               <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>{pumpStats.active} Active</span>
               </div>
               <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>{pumpStats.attention} Attn</span>
               </div>
               <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  <span>{pumpStats.offline} Off</span>
               </div>
            </div>
          </div>
          
          <div className="relative flex-1 min-h-0 flex flex-col">
            <div className={`grid grid-cols-${pumpGridCols} gap-2 flex-1`}>
              {visiblePumps.map((p) => {
                const config = getPumpStatusConfig(p.status);
                const StatusIcon = config.icon;
                
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                       setSelectedPump(p.id);
                       if(p.status === 'Fueling') setOverlay(OverlayType.FUELING_STATUS);
                    }}
                    className={getPumpClassName(p.status, selectedPump === p.id)}
                  >
                    <div className="flex justify-between items-start w-full mb-1">
                        <div className={`px-1.5 py-0.5 rounded flex items-center justify-center font-bold text-[10px] shadow-sm bg-white/80 text-slate-600`}>
                          {p.pumpNum}-{p.nozzleNum}
                        </div>
                        <StatusIcon className={`w-4 h-4 ${config.iconColor} ${config.animate || ''}`} />
                    </div>
                    <div className="mt-auto w-full">
                      <div className="flex mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config.border} ${config.text} bg-white/50`}>
                            {config.label}
                          </span>
                      </div>
                      <p className={`text-xs font-bold truncate text-slate-700`}>{p.type}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Interaction Menus */}
      <div className="flex-1 flex flex-col gap-6 h-full min-w-0">
        {/* Navigation Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {(Object.keys(MENU_CONFIG) as MenuCategory[]).map((key) => {
            const config = MENU_CONFIG[key];
            const isActive = activeMenu === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMenu(key)}
                className={`flex-1 min-w-[100px] flex flex-col items-center justify-center gap-2 py-4 px-2 ${THEME.radius.base} transition-all group border-2 ${getMenuClasses(isActive, config.color)}`}
              >
                <config.icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? `text-${config.color}-600` : `text-${config.color}-400`}`} />
                <span className={`text-xs font-bold uppercase tracking-wider`}>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <Card className="flex-1 flex overflow-hidden p-0 border-0 shadow-lg ring-1 ring-slate-900/5 bg-white">
          {/* Main Layout: Left (Content + Bottom Bar) | Right (Sidebar) */}
          
          <div className="flex-1 flex flex-col min-w-0 z-0">
             {/* Dynamic Center Content - Border right/bottom to separate from the unified white control block */}
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar [&::-webkit-scrollbar]:hidden bg-slate-50/80 border-r border-b border-slate-200">
              
              {activeMenu === MenuCategory.FUEL && (
                <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {fuelProducts.map((p) => (
                    <button key={p.name} onClick={() => addToCart({ ...p, isFuel: true })} className={`${GRID_BUTTON_CLASS} ${CARD_HEIGHT} flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <div className={ICON_CONTAINER_CLASS}>
                          <Icon.Fuel className="w-4 h-4" />
                        </div>
                        <span className={CARD_PRICE}>${p.price.toFixed(2)}</span>
                      </div>
                      <div>
                          <p className={CARD_NAME}>{p.name}</p>
                          <p className="text-left text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Per Liter</p>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setOverlay(OverlayType.FUEL_UPDATE)} className={`${CARD_HEIGHT} bg-slate-100 border-2 border-dashed border-slate-300 p-4 ${THEME.radius.large} flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-${THEME.colors.primary} hover:text-${THEME.colors.primary} transition-all text-${THEME.colors.text.muted} group`}>
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Icon.Plus className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Manual Update</span>
                  </button>
                </div>
              )}

              {activeMenu === MenuCategory.NON_FUEL && (
                <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {nonFuelProducts.map((p) => (
                    <button key={p.name} onClick={() => addToCart({ ...p, isFuel: false })} className={`${GRID_BUTTON_CLASS} ${CARD_HEIGHT} flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                          <div className={ICON_CONTAINER_CLASS}>
                              <Icon.Cart className="w-4 h-4" />
                          </div>
                          <span className={CARD_PRICE}>${p.price.toFixed(2)}</span>
                      </div>
                      <p className={CARD_NAME}>{p.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {activeMenu === MenuCategory.KEYPAD && (
                <div className="h-full flex flex-col animate-in fade-in duration-300">
                  <div className="grid grid-cols-5 grid-rows-5 gap-3 h-full">
                    {/* Row 1 */}
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Print className="w-5 h-5 opacity-70" />
                      <span>Reprint</span>
                    </button>
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Time className="w-5 h-5 opacity-70" />
                      <span>Hold</span>
                    </button>
                    <button onClick={() => setInputValue(p => p + '7')} className={KEY_BTN_BASE + " " + KEY_NUM}>7</button>
                    <button onClick={() => setInputValue(p => p + '8')} className={KEY_BTN_BASE + " " + KEY_NUM}>8</button>
                    <button onClick={() => setInputValue(p => p + '9')} className={KEY_BTN_BASE + " " + KEY_NUM}>9</button>

                    {/* Row 2 */}
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Tag className="w-5 h-5 opacity-70" />
                      <span>Price</span>
                    </button>
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Delete className="w-5 h-5 opacity-70" />
                      <span>Void Line</span>
                    </button>
                    <button onClick={() => setInputValue(p => p + '4')} className={KEY_BTN_BASE + " " + KEY_NUM}>4</button>
                    <button onClick={() => setInputValue(p => p + '5')} className={KEY_BTN_BASE + " " + KEY_NUM}>5</button>
                    <button onClick={() => setInputValue(p => p + '6')} className={KEY_BTN_BASE + " " + KEY_NUM}>6</button>

                    {/* Row 3 */}
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Percent className="w-5 h-5 opacity-70" />
                      <span>Tax Exempt</span>
                    </button>
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Ticket className="w-5 h-5 opacity-70" />
                      <span>Discount</span>
                    </button>
                    <button onClick={() => setInputValue(p => p + '1')} className={KEY_BTN_BASE + " " + KEY_NUM}>1</button>
                    <button onClick={() => setInputValue(p => p + '2')} className={KEY_BTN_BASE + " " + KEY_NUM}>2</button>
                    <button onClick={() => setInputValue(p => p + '3')} className={KEY_BTN_BASE + " " + KEY_NUM}>3</button>

                    {/* Row 4 */}
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Document className="w-5 h-5 opacity-70" />
                      <span>Pre-Tax</span>
                    </button>
                    <div className="bg-transparent"></div>
                    <button onClick={() => setInputValue(p => p + '00')} className={KEY_BTN_BASE + " " + KEY_NUM}>00</button>
                    <button onClick={() => setInputValue(p => p + '0')} className={KEY_BTN_BASE + " " + KEY_NUM}>0</button>
                    <button onClick={() => setInputValue(p => p + '.')} className={KEY_BTN_BASE + " " + KEY_NUM}>.</button>

                    {/* Row 5 */}
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.User className="w-5 h-5 opacity-70" />
                      <span>Member</span>
                    </button>
                    <button className={`${KEY_BTN_BASE} ${KEY_FUNC} flex-col gap-1`}>
                      <Icon.Truck className="w-5 h-5 opacity-70" />
                      <span>Fleet</span>
                    </button>
                    <button className={`${KEY_BTN_BASE} ${KEY_ACTION}`}>
                      <Icon.Keyboard className="w-5 h-5" />
                    </button>
                    <button className={`${KEY_BTN_BASE} ${KEY_ACTION}`}>Space</button>
                    <button onClick={() => setInputValue(p => p.slice(0, -1))} className={`${KEY_BTN_BASE} ${KEY_ACTION}`}>
                      <Icon.Backspace className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeMenu === MenuCategory.PAYMENT && (
                <div className="grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {[
                    { name: 'Cash', icon: Icon.Cash, desc: 'Currency', overlay: OverlayType.SETTLEMENT_CONFIRM },
                    { name: 'QR Pay', icon: Icon.Scan, desc: 'WeChat/Ali', overlay: OverlayType.LAKALA_SCAN },
                    { name: 'Voucher', icon: Icon.Voucher, desc: 'Promo Code', overlay: OverlayType.VOUCHER_SCAN },
                    { name: 'Member', icon: Icon.User, desc: 'Loyalty', overlay: OverlayType.MEMBER_CHECK },
                    { name: 'Gift Card', icon: Icon.Gift, desc: 'Prepaid', overlay: OverlayType.GIFT_CARD },
                    { name: 'Terminal', icon: Icon.Terminal, desc: 'Bank Card', overlay: OverlayType.SETTLEMENT_CONFIRM },
                    { name: 'Credit', icon: Icon.Payment, desc: 'Credit Card', overlay: OverlayType.SETTLEMENT_CONFIRM },
                    { name: 'Check', icon: Icon.Document, desc: 'Bank Check', overlay: OverlayType.SETTLEMENT_CONFIRM },
                  ].map(p => (
                    <button key={p.name} onClick={() => setOverlay(p.overlay)} className={`${GRID_BUTTON_CLASS} h-24 flex flex-col items-center justify-center gap-2 px-2 text-center`}>
                       <div className={ICON_CONTAINER_CLASS}>
                          <p.icon className="w-5 h-5" />
                       </div>
                       <div>
                          <p className={`text-sm font-semibold text-${THEME.colors.text.base}`}>{p.name}</p>
                          <p className={`text-[10px] text-${THEME.colors.text.muted} mt-0.5`}>{p.desc}</p>
                       </div>
                    </button>
                  ))}
                </div>
              )}

              {activeMenu === MenuCategory.DATA && (
                 <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                      <div>
                          <h2 className={`text-xl font-semibold text-${THEME.colors.text.base}`}>Recent Transactions</h2>
                          <p className="text-sm text-slate-500">Today's activity log</p>
                      </div>
                      <button onClick={() => onNavigate(ViewState.HISTORY)} className={`text-${THEME.colors.primary} text-sm font-semibold hover:underline flex items-center gap-1`}>
                          View Full History <Icon.ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                       {[1,2,3,4,5,6,7].map(i => (
                          <div key={i} className={`flex justify-between items-center p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer`}>
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 bg-${THEME.colors.primaryLight} text-${THEME.colors.primary} rounded-full flex items-center justify-center font-semibold text-sm`}>#{i}</div>
                                <div>
                                  <p className={`font-semibold text-${THEME.colors.text.base} text-sm`}>Order #TRX-9{i}82</p>
                                  <p className={`text-xs text-${THEME.colors.text.light}`}>Jan 23, 14:0{i} • Luo Yun</p>
                                </div>
                             </div>
                             <div className="text-right flex items-center gap-3">
                                  <button className={`p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-${THEME.colors.primary} transition-colors`}>
                                    <Icon.Print className="w-4 h-4" />
                                  </button>
                                  <div>
                                    <p className={`font-semibold text-${THEME.colors.text.base}`}>$124.50</p>
                                    <Badge color="success">Paid</Badge>
                                  </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {activeMenu === MenuCategory.SYSTEM && (
                 <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   {[
                     { name: 'End Shift', icon: Icon.Time, action: () => setOverlay(OverlayType.END_SHIFT) },
                     { name: 'Authorization', icon: Icon.Security, action: () => setOverlay(OverlayType.AUTHORIZATION) },
                     { name: 'Goods Return', icon: Icon.Delete, action: () => setOverlay(OverlayType.REFUND) },
                     { name: 'Diagnostics', icon: Icon.Analytics, action: () => {} },
                     { name: 'Printer Setup', icon: Icon.Print, action: () => {} },
                     { name: 'Language', icon: Icon.Globe, action: () => {} },
                   ].map(s => (
                     <button key={s.name} onClick={s.action} className={`${GRID_BUTTON_CLASS} ${CARD_HEIGHT} flex flex-col items-center justify-center gap-2`}>
                        <div className={ICON_CONTAINER_CLASS}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold text-${THEME.colors.text.base} text-sm`}>{s.name}</span>
                     </button>
                   ))}
                 </div>
              )}
            </div>

            {/* Persistent Bottom Bar - Unified with right panel background */}
            <div className="h-auto px-3 py-3 bg-white flex justify-between items-center shrink-0">
               <div className="flex gap-3">
                 <button onClick={() => setOverlay(OverlayType.MEMBER_CHECK)} className={`${KEY_BTN_BASE} ${BOTTOM_BTN_SIZE} bg-[#F4A228]/10 text-[#F4A228] border border-[#F4A228] hover:bg-[#F4A228]/20 flex-col gap-1`}>
                    <Icon.User className="w-5 h-5" />
                    <span className="text-xs">Mem Acc</span>
                 </button>
                 <button onClick={() => setOverlay(OverlayType.VOUCHER_SCAN)} className={`${KEY_BTN_BASE} ${BOTTOM_BTN_SIZE} bg-[#F4A228]/10 text-[#F4A228] border border-[#F4A228] hover:bg-[#F4A228]/20 flex-col gap-1`}>
                    <Icon.Voucher className="w-5 h-5" />
                    <span className="text-xs">Voucher</span>
                 </button>
               </div>
               
               <div className="flex gap-3">
                 <button onClick={() => setOverlay(OverlayType.LAKALA_SCAN)} className={`${KEY_BTN_BASE} ${BOTTOM_BTN_SIZE} bg-${THEME.colors.secondary} text-white hover:bg-${THEME.colors.secondaryHover} flex-col gap-1`}>
                    <Icon.Scan className="w-6 h-6" />
                    <span className="text-xs">QR Pay</span>
                 </button>
                 <button onClick={() => setOverlay(OverlayType.SETTLEMENT_CONFIRM)} className={`${KEY_BTN_BASE} ${BOTTOM_BTN_SIZE} bg-${THEME.colors.muted} text-white hover:bg-${THEME.colors.mutedHover} flex-col gap-1`}>
                    <Icon.Cash className="w-6 h-6" />
                    <span className="text-xs">Cash</span>
                 </button>
               </div>
            </div>
          </div>

          {/* Persistent Right Action Sidebar - Unified white background, no left border to merge with bottom bar */}
          <div className="w-[140px] bg-white p-3 flex flex-col gap-3 shrink-0 relative">
              <button className={`${KEY_BTN_BASE} ${KEY_ACTION} flex-1 flex-col gap-1`}>
                  <Icon.Keypad className="w-4 h-4 opacity-70" />
                  <span>Qty</span>
              </button>
              <button className={`${KEY_BTN_BASE} ${KEY_ACTION} flex-1 flex-col gap-1`}>
                  <Icon.Cash className="w-4 h-4 opacity-70" />
                  <span>Amount</span>
              </button>
              <button className={`${KEY_BTN_BASE} ${KEY_ACTION} flex-1 flex-col gap-1`}>
                  <Icon.Cart className="w-4 h-4 opacity-70" />
                  <span>Product</span>
              </button>
              <button className={`${KEY_BTN_BASE} ${KEY_ACTION} flex-1 text-lg`}>
                  Enter
              </button>
              <button className={`${KEY_BTN_BASE} bg-red-50 text-red-600 hover:bg-red-100 border-transparent flex-1`}>
                  Cancel
              </button>
              {/* Total Button: Width matches container (w-full), Height matches bottom row buttons (h-20) */}
              <button onClick={() => setOverlay(OverlayType.SETTLEMENT_CONFIRM)} className={`${KEY_BTN_BASE} ${TOTAL_BTN_HEIGHT} bg-${THEME.colors.primary} text-white hover:bg-${THEME.colors.primaryHover} text-xl shadow-md w-full shadow-[${THEME.colors.primary}]/20`}>
                  Total
              </button>
          </div>
        </Card>

        <Card className="px-6 py-4 flex justify-between items-center border-0 shadow-lg ring-1 ring-slate-900/5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <Icon.AuthUser className="w-5 h-5" />
                </div>
                <div>
                    <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider`}>Cashier</p>
                    <p className={`text-sm font-semibold text-${THEME.colors.text.base}`}>Luo Yun</p>
                </div>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <Icon.Time className="w-5 h-5" />
                </div>
                 <div>
                    <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider`}>Time</p>
                    <p className={`text-sm font-medium text-${THEME.colors.text.muted}`}>2026-01-23 14:43</p>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-xs font-medium text-${THEME.colors.text.light}`}>v3.2.0 • Online</div>
          </div>
        </Card>
      </div>

      {/* OVERLAY SCREENS */}
      <Modal isOpen={overlay === OverlayType.REFUND} onClose={closeOverlay} title="Product Refund">
        <div className="space-y-6">
          <p className={`text-center text-${THEME.colors.text.muted} font-medium`}>Enter Receipt Number to initiate refund</p>
          <div className={`bg-${THEME.colors.surfaceAlt} p-6 ${THEME.radius.large} text-center text-4xl font-bold text-${THEME.colors.text.base} tracking-widest min-h-[80px]`}>
            {inputValue || '--- ---'}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3,4,5,6,7,8,9, 'X', 0, 'OK'].map(k => (
              <button key={k} onClick={() => k === 'OK' ? closeOverlay() : k === 'X' ? setInputValue('') : setInputValue(v => v + k)} className={`py-6 ${THEME.radius.base} text-xl font-semibold ${k === 'OK' ? `bg-${THEME.colors.primary} text-white` : `bg-${THEME.colors.surfaceAlt} text-${THEME.colors.text.base} hover:bg-${THEME.colors.border}`}`}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.LAKALA_SCAN || overlay === OverlayType.VOUCHER_SCAN || overlay === OverlayType.GIFT_CARD} onClose={closeOverlay} title={overlay === OverlayType.GIFT_CARD ? "Gift Card Entry" : "Scan Payment"}>
        {renderScanModalContent()}
      </Modal>

      <Modal isOpen={overlay === OverlayType.MEMBER_CHECK} onClose={closeOverlay} title="Loyalty Member Verification">
        <div className="space-y-6">
          <p className={`text-center text-${THEME.colors.text.muted} font-medium`}>Enter Member Phone Number</p>
          <Input 
            autoFocus 
            className="text-center text-3xl font-bold" 
            placeholder="000-0000-0000"
          />
          <div className="flex gap-4">
            <Button onClick={closeOverlay} variant="outline" className="flex-1">Skip</Button>
            <Button onClick={closeOverlay} className="flex-1">Verify Member</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.FUEL_UPDATE} onClose={closeOverlay} title="Manual Fuel Entry">
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className={THEME.typography.subheading}>Pump Number</label>
                 <select className={UI_CLASSES.input}>
                    <option>Pump 01</option><option>Pump 02</option><option>Pump 03</option><option>Pump 04</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className={THEME.typography.subheading}>Fuel Type</label>
                 <select className={UI_CLASSES.input}>
                    <option>92# Gasoline</option><option>95# Gasoline</option><option>0# Diesel</option>
                 </select>
              </div>
           </div>
           <div className="space-y-2">
              <label className={THEME.typography.subheading}>Input Amount ($)</label>
              <Input type="number" className="p-6 text-3xl font-bold" placeholder="0.00" />
           </div>
           <Button onClick={closeOverlay} className="w-full py-5" icon={Icon.Success}>Record Fuel Entry</Button>
        </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.AUTHORIZATION} onClose={closeOverlay} title="Manager Auth">
        <div className="space-y-6">
          <div className={`w-20 h-20 bg-${THEME.colors.accentLight} rounded-full flex items-center justify-center mx-auto mb-2`}>
             <Icon.Security className={`w-10 h-10 text-${THEME.colors.status.warningText}`} />
          </div>
          <h4 className={`text-center font-semibold text-${THEME.colors.text.base}`}>Manager Credentials Required</h4>
          <div className="space-y-4">
             <Input type="text" placeholder="Manager ID" />
             <Input type="password" placeholder="Passcode" />
          </div>
          <Button onClick={closeOverlay} variant="secondary" className="w-full">Authorize Action</Button>
        </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.FUELING_STATUS} onClose={closeOverlay} title="Pump Monitor">
         <div className="space-y-6">
            <div className={`flex items-center gap-6 p-4 bg-${THEME.colors.accentLight} ${THEME.radius.base} border border-${THEME.colors.accent}`}>
               <Icon.Fuel className={`w-12 h-12 text-${THEME.colors.status.warningText} animate-pulse`} />
               <div>
                  <h3 className={`text-xl font-semibold text-${THEME.colors.status.warningText}`}>Fueling in Progress...</h3>
                  <p className={`text-sm text-${THEME.colors.status.warningText}`}>Pump #2 • 95# Gasoline</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className={`p-4 bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} text-center`}>
                  <p className={THEME.typography.subheading}>Liters</p>
                  <p className={`text-3xl ${THEME.typography.heading} text-${THEME.colors.text.base}`}>24.50 L</p>
               </div>
               <div className={`p-4 bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} text-center`}>
                  <p className={THEME.typography.subheading}>Amount</p>
                  <p className={`text-3xl ${THEME.typography.heading} text-${THEME.colors.primary}`}>$177.13</p>
               </div>
            </div>
            
            <div className="flex gap-4 pt-4">
               <Button onClick={closeOverlay} variant="outline" className="flex-1">Stop Pump</Button>
               <Button onClick={closeOverlay} className="flex-1" icon={Icon.Success}>Complete</Button>
            </div>
         </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.SETTLEMENT_CONFIRM} onClose={closeOverlay} title="Order Settlement">
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <p className={THEME.typography.subheading}>Total to Pay</p>
            <h2 className={`text-6xl ${THEME.typography.heading} text-${THEME.colors.text.base}`}>${total.toFixed(2)}</h2>
          </div>
          <div className={`bg-${THEME.colors.surfaceAlt} p-6 ${THEME.radius.large} space-y-3`}>
            <div className="flex justify-between text-sm font-medium"><span className={`text-${THEME.colors.text.muted}`}>Items (Total)</span><span className={`text-${THEME.colors.text.base}`}>{cart.length}</span></div>
            <div className="flex justify-between text-sm font-medium"><span className={`text-${THEME.colors.text.muted}`}>Tax Included</span><span className={`text-${THEME.colors.text.base}`}>$0.00</span></div>
          </div>
          <div className="flex gap-4">
            <Button onClick={closeOverlay} variant="outline" className="flex-1">Cancel</Button>
            <Button onClick={handlePaymentSuccess} className="flex-1" icon={Icon.Payment}>Confirm Payment</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.PAYMENT_SUCCESS} onClose={closeOverlay} title="Payment Successful">
        <div className="text-center space-y-8">
           <div className={`w-24 h-24 bg-${THEME.colors.status.successBg} rounded-full flex items-center justify-center mx-auto animate-bounce`}>
              <Icon.Success className={`w-12 h-12 text-${THEME.colors.status.successText}`} />
           </div>
           <h3 className={`text-2xl font-semibold text-${THEME.colors.text.base}`}>Transaction Completed!</h3>
           <p className={`text-${THEME.colors.text.muted}`}>Would you like to print the receipt now?</p>
           
           <div className="flex gap-4 pt-4">
              <Button onClick={closeOverlay} variant="ghost" className="flex-1">No, Skip</Button>
              <Button onClick={closeOverlay} className="flex-[2]" icon={Icon.Print}>Yes, Print Receipt</Button>
           </div>
        </div>
      </Modal>

      <Modal isOpen={overlay === OverlayType.END_SHIFT} onClose={closeOverlay} title="Shift Management">
        <div className="space-y-8">
           <div className="text-center space-y-2">
              <Icon.Time className={`w-12 h-12 text-${THEME.colors.primary} mx-auto`} />
              <h4 className={`text-2xl ${THEME.typography.heading} text-${THEME.colors.text.base}`}>End Current Shift?</h4>
              <p className={`text-${THEME.colors.text.muted}`}>System will generate shift report and sign out</p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} border border-${THEME.colors.borderLight}`}>
                 <p className={THEME.typography.subheading}>Sales</p>
                 <p className={`text-xl font-bold text-${THEME.colors.text.base}`}>$1,240.50</p>
              </div>
              <div className={`p-4 bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} border border-${THEME.colors.borderLight}`}>
                 <p className={THEME.typography.subheading}>Trans.</p>
                 <p className={`text-xl font-bold text-${THEME.colors.text.base}`}>42</p>
              </div>
           </div>
           <div className="flex gap-4">
             <Button onClick={closeOverlay} variant="outline" className="flex-1">Cancel</Button>
             <Button onClick={onLogout} variant="danger" className="flex-1">Close Shift</Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default POSHomeView;