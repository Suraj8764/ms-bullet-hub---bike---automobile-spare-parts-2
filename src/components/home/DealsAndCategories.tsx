import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';

interface DealsAndCategoriesProps {
  onSelectCategory: (categorySlug: string) => void;
  onQuickView: (product: Product) => void;
}

export const DealsAndCategories: React.FC<DealsAndCategoriesProps> = ({ onSelectCategory, onQuickView }) => {
  const { products, categories, brands } = useAppStore();

  // Deal Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.isTodayDeal).slice(0, 4);

  return (
    <div className="py-8 space-y-12">
      {/* 1. Today's Flash Deals Section with Timer */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Flame className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Today's Flash Deals on OEM Spare Parts</h2>
                <p className="text-xs text-slate-400">Exclusive discount pricing refreshed daily.</p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 font-sans font-bold uppercase text-[11px]">Ends in:</span>
              <span className="text-slate-950 font-black bg-amber-400 px-2 py-0.5 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="text-slate-950 font-black bg-amber-400 px-2 py-0.5 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="text-slate-950 font-black bg-amber-400 px-2 py-0.5 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Flash Deals Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Browse Bike Spare Categories</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore OEM components across major systems.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 group-hover:border-amber-500/40 transition-colors overflow-hidden p-1">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <h4 className="font-bold text-xs text-slate-200 line-clamp-1 group-hover:text-amber-400 transition-colors uppercase tracking-wider">{cat.name}</h4>
              <span className="text-[10px] text-slate-500 font-mono mt-1">{cat.itemCount || 0}+ Parts</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Automotive Brands Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest">Top Genuine OEM Brands</h3>
            <span className="text-xs text-slate-400">100% Authorized Genuine Distributors</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            {brands.map((b, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 shrink-0 flex items-center gap-2 hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                <span className="text-amber-400 font-extrabold text-sm">{b.name}</span>
                {b.origin && <span className="text-[10px] text-slate-500 uppercase font-mono">({b.origin})</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

