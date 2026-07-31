import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon
  } = useAppStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const gst = Math.round((subtotal - couponDiscount) * 0.18);
  const shippingFee = subtotal > 999 || cart.length === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - couponDiscount + gst + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput.trim());
    setCouponMessage({ success: res.success, text: res.message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 text-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-400" />
            <h3 className="font-extrabold text-lg">Your Spare Parts Cart</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <ShoppingCart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="font-bold text-sm text-slate-300">Your cart is empty.</p>
              <p className="text-xs mt-1">Browse our OEM catalog and add parts with verified vehicle fitment.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 flex gap-2.5 relative group hover:border-slate-700 transition-all"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 object-contain p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0 pr-5">
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">
                    {item.product.brand} | OEM #{item.product.oemNumber}
                  </span>
                  <h5 className="font-bold text-xs text-slate-100 truncate mt-0.5">{item.product.name}</h5>

                  {item.selectedVehicle && (
                    <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                      ✓ Fits {item.selectedVehicle.make} {item.selectedVehicle.model}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:text-orange-400"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:text-orange-400"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-black text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Breakdown & Checkout Button */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs text-orange-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" /> Code {appliedCoupon} applied (-₹{couponDiscount})
                  </span>
                  <button onClick={removeCoupon} className="text-slate-400 hover:text-white underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. PSG100)"
                    className="flex-1 bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold rounded-xl text-xs border border-slate-700"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p className={`text-[11px] mt-1 font-medium ${couponMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Parts Subtotal:</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-orange-400">
                  <span>Coupon Discount:</span>
                  <span className="font-bold">- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated GST (18%):</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Doorstep Delivery:</span>
                <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="text-orange-400">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setCartOpen(false);
                onCheckout();
              }}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Proceed to Guest Checkout</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
