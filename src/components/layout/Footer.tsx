import React from 'react';
import {
  Wrench,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Smartphone,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../utils/i18n';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const { language, setAppDownloadModalOpen } = useAppStore();

  return (
    <footer className="bg-[#05070c]/95 text-slate-300 pt-12 pb-8 border-t border-slate-800/80">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-slate-800/80">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">100% Genuine OEM Parts</h4>
            <p className="text-xs text-slate-400 mt-0.5">Sourced directly from authorized manufacturers & brand distributors.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Fast Express Delivery</h4>
            <p className="text-xs text-slate-400 mt-0.5">Safe door-step shipping across 19,000+ Indian PIN codes.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">7-Day Easy Returns</h4>
            <p className="text-xs text-slate-400 mt-0.5">Zero hassle fitment replacement guarantee for damaged or wrong parts.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Mechanic Support 24/7</h4>
            <p className="text-xs text-slate-400 mt-0.5">Consult expert mechanics before purchasing via WhatsApp or call.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center font-black text-lg italic text-slate-950 shadow-lg shadow-orange-500/20">
              MS
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase">
              MS <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">BULLET HUB</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4 font-normal">
            India's premier Royal Enfield, motorcycle & scooter spare parts eCommerce engine. Search 50,000+ OEM two-wheeler components, brass chain kits, 4T synthetic lubricants, and bike electricals with instant vehicle fitment verification.
          </p>

          <div className="text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Plot 104, Mancheswar Industrial Estate, Sector 3, Bhubaneswar, Odisha - 751010</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Customer Helpline: +91 1800-419-7700 (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Support Email: support@msbullethub.in</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-400 pl-2 uppercase tracking-wider">Customer Care</h4>
          <ul className="text-xs text-slate-400 space-y-2.5">
            <li>
              <button onClick={() => onNavigateTab('tracking')} className="hover:text-amber-400 transition-colors">
                Track Order Status
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('catalog')} className="hover:text-amber-400 transition-colors">
                Browse OEM Parts Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('admin')} className="hover:text-amber-400 transition-colors">
                Admin Management Portal
              </button>
            </li>
            <li><span className="hover:text-amber-400 cursor-pointer">Shipping & GST Rates Policy</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Returns & Cancellation</span></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-400 pl-2 uppercase tracking-wider">Popular Categories</h4>
          <ul className="text-xs text-slate-400 space-y-2.5">
            <li><span className="hover:text-amber-400 cursor-pointer">Brass Chain & Sprocket Kits</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">100% Synthetic 4T Engine Oils</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Ceramic Disc Brake Pads</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Bike Batteries (Exide VRLA)</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Iridium Spark Plugs</span></li>
          </ul>
        </div>

        {/* App Install Box */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-400 pl-2 uppercase tracking-wider">PWA Mobile App</h4>
          <p className="text-xs text-slate-400 mb-3">Install MS BULLET HUB app on your smartphone for faster OEM lookup & offline tracking.</p>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>MS BULLET HUB App</span>
            </div>
            <button
              onClick={() => setAppDownloadModalOpen(true)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              Scan QR / Download App
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 MS BULLET HUB Automotive Technologies Pvt. Ltd. All Rights Reserved. GSTIN: 21AABCP9981Z1ZP</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Razorpay Verified
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> UPI Instant
          </span>
        </div>
      </div>
    </footer>
  );
};
