import React from 'react';
import { X, Scale, ShoppingCart, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const CompareModal: React.FC = () => {
  const { isCompareOpen, setCompareOpen, compareList, toggleCompare, clearCompare, products, addToCart } = useAppStore();

  if (!isCompareOpen) return null;

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-5xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setCompareOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider">Compare Spare Parts</h3>
              <p className="text-xs text-slate-400">Side-by-side technical specification, fitment, and price evaluation.</p>
            </div>
          </div>

          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 uppercase tracking-wider font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {comparedProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold">No products added for comparison.</p>
            <p className="text-xs text-slate-500 mt-1">Click the "Compare" scale icon on any product card in the catalog to add items here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-3 w-40 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">Feature / Spec</th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-3 min-w-[200px] max-w-[240px] align-top bg-slate-900 border-l border-slate-800">
                      <div className="relative">
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="absolute -top-1 -right-1 text-slate-500 hover:text-rose-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-24 h-24 object-cover rounded-xl mb-2 border border-slate-800 mx-auto bg-slate-950"
                        />
                        <h5 className="font-bold text-white line-clamp-2 text-xs mb-1">{p.name}</h5>
                        <div className="text-amber-400 font-black text-sm">₹{p.price.toLocaleString('en-IN')}</div>
                        <button
                          onClick={() => addToCart(p)}
                          className="mt-2 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 uppercase tracking-wider"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">OEM Part Number</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-mono text-amber-400 font-bold border-l border-slate-800">{p.oemNumber}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">Brand</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-semibold text-white border-l border-slate-800">{p.brand}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">Category</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-slate-300 border-l border-slate-800">{p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">Warranty</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-emerald-400 font-medium border-l border-slate-800">{p.warranty}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">Stock Status</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 border-l border-slate-800">
                      {p.stock > 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> In Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-950 font-bold text-slate-400 uppercase tracking-wider">Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-amber-400 font-bold border-l border-slate-800">
                      ⭐ {p.rating} ({p.reviewCount} reviews)
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
