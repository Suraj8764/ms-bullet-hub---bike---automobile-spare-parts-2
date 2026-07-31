import React from 'react';
import { Home, Compass, Wrench, Sparkles, ShoppingBag, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../utils/i18n';

interface MobileBottomBarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ activeTab, onNavigateTab }) => {
  const { cart, language, setCartOpen, setGarageModalOpen, setAIDoctorOpen, setAppDownloadModalOpen } = useAppStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070a11]/95 backdrop-blur-2xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
      {/* Home */}
      <button
        onClick={() => onNavigateTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl min-w-[60px] transition-all ${
          activeTab === 'home' ? 'text-amber-400 font-extrabold scale-105' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
      </button>

      {/* Parts Catalog */}
      <button
        onClick={() => onNavigateTab('catalog')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl min-w-[60px] transition-all ${
          activeTab === 'catalog' ? 'text-amber-400 font-extrabold scale-105' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Parts</span>
      </button>

      {/* My Garage */}
      <button
        onClick={() => setGarageModalOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl min-w-[60px] text-slate-400 hover:text-amber-400 transition-all"
      >
        <Wrench className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Garage</span>
      </button>

      {/* AI Doctor */}
      <button
        onClick={() => setAIDoctorOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl min-w-[55px] text-amber-400 hover:text-amber-300 transition-all"
      >
        <Sparkles className="w-5 h-5 fill-amber-400 text-amber-400" />
        <span className="text-[10px] uppercase font-bold tracking-wider">AI</span>
      </button>

      {/* QR App Download */}
      <button
        onClick={() => setAppDownloadModalOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl min-w-[55px] text-amber-400 hover:text-amber-300 transition-all"
      >
        <QrCode className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] uppercase font-bold tracking-wider">App QR</span>
      </button>

      {/* Cart Drawer Toggle */}
      <button
        onClick={() => setCartOpen(true)}
        className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl min-w-[60px] text-slate-400 hover:text-white transition-all"
      >
        <ShoppingBag className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] uppercase font-bold tracking-wider">{getTranslation(language, 'cart')}</span>
        {cartItemCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-md">
            {cartItemCount}
          </span>
        )}
      </button>
    </div>
  );
};
