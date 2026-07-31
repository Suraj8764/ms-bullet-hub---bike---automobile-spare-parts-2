import React, { useState } from 'react';
import {
  Car,
  Search,
  ShoppingCart,
  Heart,
  Scale,
  Sparkles,
  MapPin,
  Wrench,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  UserCheck,
  QrCode,
  Mic,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../utils/i18n';
import { AdminTab } from '../admin/AdminDashboardView';

interface NavbarProps {
  onNavigateTab: (tab: string) => void;
  onNavigateAdmin?: (subTab: AdminTab) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateTab, onNavigateAdmin, activeTab }) => {
  const {
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    selectedVehicle,
    cart,
    wishlist,
    compareList,
    setCartOpen,
    setWishlistOpen,
    setGarageModalOpen,
    setCompareOpen,
    setAIDoctorOpen,
    setMechanicModalOpen,
    setBarcodeScannerOpen,
    setAppDownloadModalOpen,
    setVoiceSearchOpen,
    activeSearchQuery,
    setSearchQuery,
    setCategoryFilter,
    isAdminLoggedIn,
    logoutAdmin,
    categories
  } = useAppStore();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSearchQuery.trim()) {
      onNavigateTab('catalog');
    }
  };

  const handleCategorySelect = (slug: string) => {
    setCategoryFilter(slug);
    onNavigateTab('catalog');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e17]/90 backdrop-blur-2xl text-slate-100 shadow-2xl border-b border-slate-800/80">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#05070c]/90 text-slate-400 text-[11px] border-b border-slate-800/50 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Taglines */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-extrabold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              100% Genuine Royal Enfield & OEM Bike Parts
            </span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="hidden md:inline flex items-center gap-1.5 text-slate-300 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              {getTranslation(language, 'noAccountNeeded')}
            </span>
          </div>

          {/* Right Utility Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigateTab('tracking')}
              className={`hover:text-amber-400 transition-colors font-semibold ${activeTab === 'tracking' ? 'text-amber-400 font-extrabold' : ''
                }`}
            >
              {getTranslation(language, 'trackOrder')}
            </button>

            <button
              onClick={() => setAppDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all font-bold text-[11px]"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Download App / QR Scanner</span>
            </button>

            <button
              onClick={() => setMechanicModalOpen(true)}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation(language, 'garageLocator')}</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase font-bold text-[10px]">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between ${language === 'en' ? 'text-amber-400 font-bold' : ''}`}
                  >
                    <span>English</span>
                    <span>EN</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setIsLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between ${language === 'hi' ? 'text-amber-400 font-bold' : ''}`}
                  >
                    <span>हिंदी</span>
                    <span>HI</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('or'); setIsLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between ${language === 'or' ? 'text-amber-400 font-bold' : ''}`}
                  >
                    <span>ଓଡ଼ିଆ</span>
                    <span>OR</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Admin Avatar & Menu (Shown ONLY after login) */}
            {isAdminLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all text-xs font-bold cursor-pointer group"
                  title="Admin Account Menu"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm">
                    A
                  </div>
                  <span className="text-[10px] font-bold hidden sm:inline text-slate-200 group-hover:text-amber-400 transition-colors">
                    Admin
                  </span>
                  <ChevronDown className={`w-3 h-3 text-emerald-400 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>

                {isAdminMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setIsAdminMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                      <div className="px-3.5 py-2 border-b border-slate-800 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xs">
                            A
                          </div>
                          <div className="truncate">
                            <p className="font-extrabold text-white text-xs truncate">Administrator</p>
                            <p className="text-[10px] text-slate-400 truncate">admin@bulletspares.com</p>
                          </div>
                        </div>
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[9px] font-bold">
                          ● Session Active
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          if (onNavigateAdmin) {
                            onNavigateAdmin('dashboard');
                          } else {
                            onNavigateTab('admin');
                          }
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          if (onNavigateAdmin) {
                            onNavigateAdmin('settings');
                          } else {
                            onNavigateTab('admin');
                          }
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                      >
                        <Settings className="w-4 h-4 text-amber-400" />
                        <span>Settings</span>
                      </button>

                      <div className="border-t border-slate-800 my-1" />

                      <button
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          logoutAdmin();
                          if (activeTab === 'admin') {
                            onNavigateTab('home');
                          }
                        }}
                        className="w-full px-3.5 py-2 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 md:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigateTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center font-black text-xl italic text-slate-950 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            MS
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              MS <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">BULLET HUB</span>
            </div>
            <p className="text-[9px] text-slate-400 tracking-widest uppercase font-bold -mt-1">
              Royal Enfield & Bike Spare Parts
            </p>
          </div>
        </div>

        {/* Vehicle Selection Widget */}
        <button
          onClick={() => setGarageModalOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all text-left shadow-md max-w-xs"
        >
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div className="text-xs min-w-[110px] hidden sm:block">
            <span className="text-slate-400 block text-[9px] uppercase font-black tracking-widest">
              {getTranslation(language, 'myGarage')}
            </span>
            <span className="text-white font-bold truncate block text-xs">
              {selectedVehicle
                ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                : getTranslation(language, 'selectVehicle')}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {/* Global Search Capsule */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] max-w-xl order-last md:order-none">
          <div className="relative flex items-center bg-slate-900/90 rounded-2xl px-3.5 py-1.5 border border-slate-800 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="bg-transparent border-none text-xs focus:outline-none w-full text-white placeholder:text-slate-500 py-1"
            />

            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              <button
                type="button"
                onClick={() => setVoiceSearchOpen(true)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setBarcodeScannerOpen(true)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title="Barcode / OEM Scanner"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-3.5 py-1 rounded-xl text-xs transition-all shadow-md shadow-amber-500/10"
              >
                Find
              </button>
            </div>
          </div>
        </form>

        {/* Actions (AI Doctor, Compare, Wishlist, Cart) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAIDoctorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span className="hidden lg:inline">{getTranslation(language, 'aiAssistant')}</span>
          </button>

          <button
            onClick={() => setCompareOpen(true)}
            className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-amber-500/30 transition-all"
            title="Compare Parts"
          >
            <Scale className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setWishlistOpen(true)}
            className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-amber-500/30 transition-all"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{getTranslation(language, 'cart')}</span>
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black flex items-center justify-center">
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Category Navigation Strip */}
      <nav className="bg-[#070a11]/90 backdrop-blur-md text-slate-300 border-t border-slate-800/80 px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => {
              setCategoryFilter(null);
              onNavigateTab('catalog');
            }}
            className={`hover:text-amber-400 transition-colors ${activeTab === 'catalog' ? 'text-amber-400 font-black' : ''
              }`}
          >
            {getTranslation(language, 'allCategories')}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className="hover:text-amber-400 transition-colors text-slate-300"
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-amber-400 font-black hover:underline flex items-center gap-1"
          >
            🔥 {getTranslation(language, 'todayDeals')}
          </button>
        </div>
      </nav>
    </header>
  );
};
