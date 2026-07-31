import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Star,
  FileText,
  Share2,
  Heart,
  Scale,
  Package,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, selectedVehicle, toggleWishlist, wishlist, toggleCompare, compareList } = useAppStore();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'reviews'>('specs');
  const [pincode, setPincode] = useState('751010');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeStatus('Available for 24-Hour Express Delivery with Free Shipping!');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-4xl p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto pr-1 space-y-6">
          {/* Main Grid: Gallery Left, Info Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Column */}
            <div>
              <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4 mb-3">
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`w-16 h-16 rounded-xl bg-slate-950 border overflow-hidden shrink-0 transition-all ${
                        selectedImgIndex === idx ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta Column */}
            <div className="space-y-4">
              {/* Brand & OEM Badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold rounded-lg uppercase tracking-wider">
                  {product.brand} OEM Part
                </span>
                <span className="font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
                  OEM: {product.oemNumber}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-extrabold text-white leading-snug">{product.name}</h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <span>⭐ {product.rating}</span>
                  <span className="text-slate-500">({product.reviewCount} Reviews)</span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units left)
                </span>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-baseline gap-3">
                <span className="text-2xl font-black text-white">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    Save {product.discountPercent}%
                  </span>
                )}
                <span className="text-[10px] text-slate-400 ml-auto">HSN {product.hsnCode} (18% GST)</span>
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>

              {/* Pincode Delivery Check */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Check Pincode Delivery & Shipping</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700"
                  />
                  <button
                    onClick={checkPincode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold text-xs rounded-lg border border-slate-700"
                  >
                    Check
                  </button>
                </div>
                {pincodeStatus && (
                  <p className="text-[11px] text-emerald-400 font-medium mt-1.5">{pincodeStatus}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  Add To Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>

                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isCompared ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Spec / Compatibility / Reviews Tabs */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex border-b border-slate-800 gap-6 text-xs font-bold text-slate-400 mb-4">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 transition-colors ${activeTab === 'specs' ? 'text-orange-400 border-b-2 border-orange-500' : 'hover:text-white'}`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('compatibility')}
                className={`pb-2 transition-colors ${activeTab === 'compatibility' ? 'text-orange-400 border-b-2 border-orange-500' : 'hover:text-white'}`}
              >
                Compatible Vehicles ({product.compatibleVehicles.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 transition-colors ${activeTab === 'reviews' ? 'text-orange-400 border-b-2 border-orange-500' : 'hover:text-white'}`}
              >
                Customer Reviews
              </button>
            </div>

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {product.specifications.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-400 font-medium">{s.label}</span>
                    <span className="text-white font-bold">{s.value}</span>
                  </div>
                ))}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400 font-medium">Warranty Period</span>
                  <span className="text-emerald-400 font-bold">{product.warranty}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400 font-medium">Country of Origin</span>
                  <span className="text-white font-bold">{product.countryOfOrigin || 'India'}</span>
                </div>
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-2 text-xs">
                {product.compatibleVehicles.map((v, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-sm">{v.make} {v.model}</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">{v.fuelType} | {v.engine || 'Standard Variant'}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[11px] rounded-lg border border-emerald-500/30">
                      Years: {v.years.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm">Customer Feedback</h5>
                    <p className="text-slate-400">100% verified buyers at MS BULLET HUB.</p>
                  </div>
                  <div className="text-right text-amber-400 font-extrabold text-lg">
                    ⭐ {product.rating} / 5.0
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>Amanpreet Singh</span>
                    <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-slate-300">Exact fit for my Swift! Zero noise and great stopping power.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
