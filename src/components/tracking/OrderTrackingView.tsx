import React, { useState } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  ShieldCheck,
  PhoneCall,
  Smartphone,
  KeyRound,
  ArrowRight,
  List
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { generateGSTInvoice } from '../../utils/invoice';
import { Order } from '../../types';

interface OrderTrackingViewProps {
  initialOrderId?: string;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ initialOrderId = '' }) => {
  const { orders } = useAppStore();

  const [activeTab, setActiveTab] = useState<'single' | 'mobile_otp'>('single');

  // Single Order Tracking State
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId || 'PSG-2026-89412');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    orders.find((o) => o.orderNumber === searchOrderId || o.id === searchOrderId) || orders[0] || null
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  // Mobile OTP State
  const [otpMobile, setOtpMobile] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  const handleTrackSingle = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const query = searchOrderId.trim().toLowerCase();
    const phoneQuery = mobileNumber.trim();

    const found = orders.find((o) => {
      const matchOrderNum = query !== '' && (o.orderNumber.toLowerCase() === query || o.id.toLowerCase() === query || o.orderNumber.toLowerCase().includes(query));
      const matchPhone = phoneQuery !== '' && o.mobile.includes(phoneQuery);
      if (query !== '' && phoneQuery !== '') {
        return matchOrderNum && matchPhone;
      }
      return matchOrderNum || matchPhone;
    });

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setSearchError(`No active order found for Order ID "${searchOrderId}" with Mobile "${mobileNumber}".`);
    }
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpMobile || otpMobile.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError(null);
    setOtpSent(true);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234' || otpInput.length === 4) {
      setOtpVerified(true);
      setOtpError(null);
      const matched = orders.filter((o) => o.mobile.includes(otpMobile.trim()));
      setUserOrders(matched);
    } else {
      setOtpError('Invalid OTP code. Enter 1234 for instant verification.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center mb-3 border border-orange-500/30">
          <Truck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black">Live Order & Shipment Tracking</h2>
        <p className="text-xs text-slate-400 mt-1">Track your OEM spare parts shipment anytime without logging in.</p>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'single'
              ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          Track by Order ID + Mobile
        </button>

        <button
          onClick={() => setActiveTab('mobile_otp')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'mobile_otp'
              ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          My Orders via Mobile OTP (Guest)
        </button>
      </div>

      {/* TAB 1: Single Order Tracking Form */}
      {activeTab === 'single' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-8">
          <form onSubmit={handleTrackSingle} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">Order Number *</label>
              <input
                type="text"
                required
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value.toUpperCase())}
                placeholder="e.g. PSG-2026-89412"
                className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">Mobile Number *</label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-orange-500/20 uppercase tracking-wider"
              >
                <Search className="w-4 h-4" />
                Track Order
              </button>
            </div>
          </form>

          {searchError && (
            <p className="text-xs text-rose-400 font-bold mt-3 text-center bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
              {searchError}
            </p>
          )}
        </div>
      )}

      {/* TAB 2: Mobile OTP Lookup Form for Guest */}
      {activeTab === 'mobile_otp' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-8 space-y-4">
          {!otpVerified ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-amber-400">View All Guest Orders via Mobile OTP</h3>
                <p className="text-xs text-slate-400 mt-0.5">Enter your phone number to receive an instant OTP verification code.</p>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={otpMobile}
                      onChange={(e) => setOtpMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
                  >
                    Send Instant OTP SMS
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 text-center">
                    SMS OTP sent to <strong>+91 {otpMobile}</strong>. (Use demo OTP: <strong>1234</strong>)
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Enter 4-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-slate-950 text-white text-center text-lg font-mono tracking-widest p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
                  >
                    Verify & View My Orders
                  </button>
                </form>
              )}

              {otpError && (
                <p className="text-xs text-rose-400 font-bold text-center bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  {otpError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-400">Verified Mobile: +91 {otpMobile}</span>
                </div>
                <button
                  onClick={() => {
                    setOtpVerified(false);
                    setOtpSent(false);
                  }}
                  className="text-xs text-slate-400 hover:text-amber-400"
                >
                  Change Mobile
                </button>
              </div>

              {userOrders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No previous orders found for mobile number {otpMobile}.</p>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">All Orders ({userOrders.length})</h4>
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSearchedOrder(ord);
                        setActiveTab('single');
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-500/50 transition-colors"
                    >
                      <div>
                        <span className="font-mono font-black text-amber-400 text-sm">{ord.orderNumber}</span>
                        <p className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString('en-IN')} | {ord.items.length} Parts</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white text-xs">₹{ord.grandTotal.toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] text-emerald-400 font-bold">{ord.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tracked Order Result Card */}
      {searchedOrder && activeTab === 'single' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in duration-300">
          {/* Order Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Reference</span>
              <h3 className="text-lg font-black font-mono text-orange-400">{searchedOrder.orderNumber}</h3>
              <p className="text-xs text-slate-400">Placed on: {new Date(searchedOrder.createdAt).toLocaleString('en-IN')}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Courier Partner</span>
              <p className="text-sm font-bold text-white">{searchedOrder.courierName || 'BlueDart Express'}</p>
              <p className="text-xs text-emerald-400 font-mono font-bold">AWB: {searchedOrder.trackingNumber || 'BD9823145IN'}</p>
            </div>
          </div>

          {/* 5-Step Visual Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Shipment Timeline</h4>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
              {searchedOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="flex md:flex-col items-center gap-3 relative z-10 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      step.completed
                        ? 'bg-orange-500 text-slate-950 ring-4 ring-orange-500/20'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="md:text-center min-w-0">
                    <h5 className={`font-bold text-xs ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                      {step.status}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Parts List */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Parts in this Package</h4>
            <div className="space-y-2">
              {searchedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center gap-3 text-xs">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-800" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white truncate">{item.product.name}</h5>
                    <p className="text-slate-400 text-[10px]">OEM #{item.product.oemNumber} | Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-orange-400">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => generateGSTInvoice(searchedOrder)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 uppercase tracking-wider"
            >
              <FileText className="w-4 h-4" />
              Download GST Tax Invoice (PDF)
            </button>

            <a
              href="tel:18004197700"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-400" /> Need Help? Call 1800-419-7700
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

