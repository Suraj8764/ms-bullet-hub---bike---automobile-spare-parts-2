import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Heart,
  Scale,
  Eye,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    selectedVehicle,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    addRecentlyViewed
  } = useAppStore();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  // Check vehicle compatibility
  const fitsVehicle = selectedVehicle
    ? product.compatibleVehicles.some(
        (v) =>
          v.make.toLowerCase() === selectedVehicle.make.toLowerCase() &&
          v.model.toLowerCase() === selectedVehicle.model.toLowerCase()
      )
    : true;

  const handleCardClick = () => {
    addRecentlyViewed(product.id);
    onQuickView(product);
  };

  return (
    <div className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-2.5 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden text-slate-100">
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-1.5 z-10">
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Fitment Status Badge */}
        {selectedVehicle && (
          fitsVehicle ? (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-md">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Fits {selectedVehicle.model}
            </span>
          ) : (
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-md">
              <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Check Fit
            </span>
          )
        )}
      </div>

      {/* Floating Wishlist & Compare Buttons */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white border-rose-500 shadow-md'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:text-rose-400 hover:bg-slate-800'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }}
          className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
            isCompared
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:text-blue-400 hover:bg-slate-800'
          }`}
          title="Compare Product"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Image Container - Reduced Height & Compact Fitting */}
      <div
        onClick={handleCardClick}
        className="cursor-pointer relative h-28 sm:h-32 w-full bg-slate-950/90 rounded-lg overflow-hidden mb-2 border border-slate-800/80 flex items-center justify-center p-1.5 group-hover:scale-102 transition-transform duration-300"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
        />

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-2 py-1 bg-slate-900 text-amber-400 font-bold text-[10px] rounded-lg border border-amber-500/30 flex items-center gap-1 shadow-lg">
            <Eye className="w-3 h-3" /> Quick Specs
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Brand & OEM */}
        <div className="flex items-center justify-between text-[9px] text-slate-400">
          <span className="font-bold text-amber-400 uppercase tracking-wider">{product.brand}</span>
          <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 text-[9px]">
            OEM #{product.oemNumber}
          </span>
        </div>

        {/* Product Title */}
        <h4
          onClick={handleCardClick}
          className="font-bold text-xs text-slate-100 line-clamp-2 hover:text-amber-400 cursor-pointer transition-colors leading-tight h-7"
        >
          {product.name}
        </h4>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-[10px] pt-0.5">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <span>⭐ {product.rating}</span>
            <span className="text-slate-500 font-normal text-[9px]">({product.reviewCount})</span>
          </div>

          <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 font-medium">
            <Truck className="w-2.5 h-2.5 text-emerald-400" /> {product.deliveryDays}d Express
          </span>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-1 pt-0.5">
          <span className="text-sm sm:text-base font-black text-slate-100">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          <span className="text-[9px] text-slate-500 ml-auto font-medium">Incl. GST</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider shadow-md shadow-amber-500/10 flex items-center justify-center gap-1 transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
          Add To Cart
        </button>

        <button
          onClick={handleCardClick}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-[11px] transition-colors border border-slate-700"
        >
          Details
        </button>
      </div>
    </div>
  );
};
