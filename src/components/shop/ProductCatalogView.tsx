import React, { useState } from 'react';
import {
  Filter,
  Grid,
  List,
  Table,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';

interface ProductCatalogViewProps {
  onQuickView: (product: Product) => void;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({ onQuickView }) => {
  const {
    products,
    categories,
    brands,
    selectedVehicle,
    activeSearchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setCategoryFilter,
    selectedBrandName,
    setBrandFilter
  } = useAppStore();

  const [priceMax, setPriceMax] = useState(8000);
  const [onlyFitsVehicle, setOnlyFitsVehicle] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'priceLow' | 'priceHigh' | 'rating'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter Products
  let filtered = products.filter((p) => {
    // Alphabet Filter (A to Z)
    if (selectedAlphabet !== 'ALL') {
      const cleanName = p.name.trim().toUpperCase();
      const matchLetterPrefix = cleanName.startsWith(selectedAlphabet);
      const matchHyphenPrefix = cleanName.startsWith(`${selectedAlphabet} -`) || cleanName.startsWith(`${selectedAlphabet}-`);
      if (!matchLetterPrefix && !matchHyphenPrefix) {
        return false;
      }
    }
    // Search query
    if (activeSearchQuery.trim()) {
      const q = activeSearchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchOem = p.oemNumber.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchName && !matchOem && !matchBrand && !matchCategory) return false;
    }

    // Category
    if (selectedCategorySlug && p.categorySlug !== selectedCategorySlug) {
      return false;
    }

    // Brand
    if (selectedBrandName && p.brand.toLowerCase() !== selectedBrandName.toLowerCase()) {
      return false;
    }

    // Price
    if (p.price > priceMax) return false;

    // Rating
    if (p.rating < minRating) return false;

    // Vehicle Fitment
    if (onlyFitsVehicle && selectedVehicle) {
      const fits = p.compatibleVehicles.some(
        (v) =>
          v.make.toLowerCase() === selectedVehicle.make.toLowerCase() &&
          v.model.toLowerCase() === selectedVehicle.model.toLowerCase()
      );
      if (!fits) return false;
    }

    return true;
  });

  // Sort
  if (sortBy === 'priceLow') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceHigh') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setBrandFilter(null);
    setPriceMax(8000);
    setOnlyFitsVehicle(false);
    setMinRating(0);
    setSelectedAlphabet('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-6">
      {/* Catalog Title & Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider">Automobile Spare Parts Catalog</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing <strong className="text-amber-400">{filtered.length}</strong> verified OEM parts
            {selectedCategorySlug && ` in ${selectedCategorySlug}`}
            {selectedAlphabet !== 'ALL' && ` starting with "${selectedAlphabet}"`}
          </p>
        </div>

        {/* View Mode & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Fitment Toggle */}
          {selectedVehicle && (
            <button
              onClick={() => setOnlyFitsVehicle(!onlyFitsVehicle)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                onlyFitsVehicle
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Only Fits My {selectedVehicle.model}
            </button>
          )}

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="relevance" className="bg-slate-950">Sort: Relevance</option>
            <option value="priceLow" className="bg-slate-950">Price: Low to High</option>
            <option value="priceHigh" className="bg-slate-950">Price: High to Low</option>
            <option value="rating" className="bg-slate-950">Highest Customer Rating</option>
          </select>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Filter Parts'}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* A to Z Alphabetical Catalog Filter Bar */}
      <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col gap-2.5 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            A to Z Bullet & Bike Spare Parts Alphabetical Index
          </span>
          {selectedAlphabet !== 'ALL' && (
            <button
              onClick={() => setSelectedAlphabet('ALL')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
            >
              Show All Parts (Reset A-Z)
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedAlphabet(letter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
                selectedAlphabet === letter
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-105'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar Left, Catalog Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filter Sidebar */}
        <div className={`lg:col-span-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 uppercase tracking-wider text-slate-200">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filter Catalog
            </h3>
            <button
              onClick={clearFilters}
              className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              System Category
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition-colors ${
                  selectedCategorySlug === null ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition-colors truncate ${
                    selectedCategorySlug === cat.slug ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-amber-400 font-mono">₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={300}
              max={10000}
              step={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Brand
            </label>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setBrandFilter(null)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg ${selectedBrandName === null ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300 hover:bg-slate-800/50'}`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setBrandFilter(b.name)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg truncate ${
                    selectedBrandName === b.name ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Products Area */}
        <div className="lg:col-span-9">
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-400 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3">
              <Search className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="font-extrabold text-base text-white">No spare parts match your filters</h3>
              <p className="text-xs text-slate-400">Try resetting filters or searching for another OEM number or vehicle model.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 hover:border-amber-500/40 transition-all">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-slate-800 shrink-0 bg-slate-950 p-1" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">{p.brand} | OEM #{p.oemNumber}</span>
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">{p.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                    <span className="text-[11px] text-amber-400 font-bold mt-0.5 block">⭐ {p.rating} ({p.reviewCount})</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-white block">₹{p.price.toLocaleString('en-IN')}</span>
                    <button onClick={() => onQuickView(p)} className="mt-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] rounded-lg uppercase tracking-wider shadow-md shadow-amber-500/10">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
