import React from 'react';
import { HeroSection } from './HeroSection';
import { DealsAndCategories } from './DealsAndCategories';
import { ProductCard } from '../common/ProductCard';
import { useAppStore } from '../../store/useAppStore';
import { Product } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, BookOpen } from 'lucide-react';

interface HomeViewProps {
  onNavigateTab: (tab: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab, onQuickView }) => {
  const { products, reviews, blogs, setCategoryFilter, setAIDoctorOpen } = useAppStore();

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const trendingParts = products.filter((p) => p.isTrending).slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Hero Section */}
      <HeroSection onExploreCatalog={() => onNavigateTab('catalog')} />

      {/* 2. Today's Deals & Categories */}
      <DealsAndCategories
        onSelectCategory={(slug) => {
          setCategoryFilter(slug);
          onNavigateTab('catalog');
        }}
        onQuickView={onQuickView}
      />

      {/* 3. Best Selling Automotive Parts */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Best Selling OEM Spare Parts</h2>
            <p className="text-xs text-slate-400 mt-0.5">Top-rated parts with highest fitment satisfaction rate.</p>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
          ))}
        </div>
      </section>

      {/* 4. AI Diagnostic Callout Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 text-amber-400 font-black text-[10px] uppercase rounded-full tracking-wider border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Powered by Gemini AI
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">Not Sure Which Spare Part Fits Your Bike?</h3>
            <p className="text-xs font-semibold text-slate-950/90 leading-relaxed">
              Describe squeaks, engine knocks, or upload a photo of your worn component. Our Master AI Mechanic diagnoses the issue in seconds.
            </p>
          </div>

          <button
            onClick={() => setAIDoctorOpen(true)}
            className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black rounded-2xl text-xs flex items-center gap-2 shadow-2xl shrink-0 transition-transform hover:scale-105 border border-amber-500/30 uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Launch AI Symptom Doctor</span>
          </button>
        </div>
      </section>

      {/* 5. Trending & New Arrivals */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Trending & New Arrivals</h2>
            <p className="text-xs text-slate-400 mt-0.5">High demand performance brake rotors, synthetic oils & iridium spark plugs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingParts.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
          ))}
        </div>
      </section>

      {/* 6. Customer Reviews Carousel */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Verified Customer Reviews</h2>
              <p className="text-xs text-slate-400">Read feedback from bike riders across India.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{rev.customerName}</span>
                  <span className="text-amber-400 font-bold">
                    {'⭐'.repeat(Math.max(1, Math.min(5, rev.rating)))}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-amber-400">{rev.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Verified Purchase on {rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIY Automotive Maintenance Blogs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Automotive Advice & DIY Guides</h2>
              <p className="text-xs text-slate-400">Expert mechanic tips to keep your bike running smoothly.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 group hover:border-amber-500/50 transition-colors">
              <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover rounded-xl border border-slate-800" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">{blog.category} | {blog.readTime}</span>
              <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-amber-400 transition-colors">{blog.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{blog.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

