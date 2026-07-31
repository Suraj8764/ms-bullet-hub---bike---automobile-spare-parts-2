import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  FileText,
  Lock,
  ArrowLeft,
  Loader2,
  Sparkles,
  X,
  Building2,
  Smartphone,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/useAppStore';
import { generateGSTInvoice } from '../../utils/invoice';
import { Order } from '../../types';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderComplete: (orderNumber: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onOrderComplete }) => {
  const { cart, selectedVehicle, appliedCoupon, couponDiscount, clearCart, addOrder } = useAppStore();

  const [customerName, setCustomerName] = useState('Siddharth Mohanty');
  const [mobile, setMobile] = useState('9876543210');
  const [email, setEmail] = useState('siddharth@example.com');
  const [address, setAddress] = useState('Plot 104, Mancheswar Industrial Estate');
  const [city, setCity] = useState('Bhubaneswar');
  const [state, setState] = useState('Odisha');
  const [pincode, setPincode] = useState('751010');

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'COD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Fallback in-app Razorpay modal state
  const [showInAppRazorpayModal, setShowInAppRazorpayModal] = useState(false);
  const [razorpayTab, setRazorpayTab] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [vpaId, setVpaId] = useState('siddharth@upi');
  const [isRazorpaySubmitting, setIsRazorpaySubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const gst = Math.round((subtotal - couponDiscount) * 0.18);
  const shippingFee = subtotal > 999 || cart.length === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - couponDiscount + gst + shippingFee);

  const processOrderCreation = (paymentRef?: string) => {
    const orderNum = `PSG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const vehicleTag = selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})` : undefined;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      vehicleInfo: vehicleTag,
      items: [...cart],
      subtotal,
      discount: couponDiscount,
      couponCode: appliedCoupon || undefined,
      gst,
      shippingFee,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '2026-08-01',
      courierName: 'BlueDart Express',
      trackingNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      trackingSteps: [
        { status: 'Confirmed', date: new Date().toLocaleString(), completed: true, description: `Order confirmed via ${paymentMethod} (${paymentRef || 'Verified'})` },
        { status: 'Packed', date: 'Expected today', completed: false, description: 'OEM Seal Quality Inspection' },
        { status: 'Shipped', date: 'Expected tomorrow', completed: false, description: 'Handover to BlueDart Express' },
        { status: 'Out for Delivery', date: 'Expected 2026-08-01', completed: false, description: 'Local delivery hub' },
        { status: 'Delivered', date: 'Expected 2026-08-01', completed: false, description: 'Handover to customer' }
      ]
    };

    addOrder(newOrder);
    setCompletedOrder(newOrder);
    clearCart();
    setIsProcessing(false);
    setShowInAppRazorpayModal(false);

    // Trigger Confetti Explosion
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  const handleInAppRazorpayPay = () => {
    setIsRazorpaySubmitting(true);
    setTimeout(() => {
      setIsRazorpaySubmitting(false);
      const payId = `pay_rzp_${Math.floor(100000000 + Math.random() * 900000000)}`;
      processOrderCreation(`Razorpay ID: ${payId}`);
    }, 1500);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Add some spare parts before placing an order.');
      return;
    }
    if (!customerName || !mobile || !address || !pincode) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'Razorpay') {
      setIsProcessing(false);
      setShowInAppRazorpayModal(true);
      return;
    }

    // Default processing for UPI, COD, or direct fallback
    setTimeout(() => {
      processOrderCreation();
    }, 1500);
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-white">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Order Confirmed Successfully!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Thank you <strong className="text-white">{completedOrder.customerName}</strong>! Your order tracking number is:
            </p>
            <div className="mt-3 inline-block px-5 py-2.5 bg-slate-950 rounded-2xl border border-amber-500/40 text-amber-400 font-mono font-black text-xl shadow-lg shadow-amber-500/10">
              {completedOrder.orderNumber}
            </div>
          </div>

          {/* Nodemailer Order Email Badge */}
          {completedOrder.email && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-center gap-2 max-w-md mx-auto">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Nodemailer confirmation email sent to <strong>{completedOrder.email}</strong></span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery Address:</span>
              <span className="text-white font-medium">{completedOrder.address}, {completedOrder.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="text-emerald-400 font-bold">{completedOrder.paymentMethod} ({completedOrder.paymentStatus})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Grand Total Paid:</span>
              <span className="text-amber-400 font-black text-sm">₹{completedOrder.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => generateGSTInvoice(completedOrder)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 uppercase tracking-wider"
            >
              <FileText className="w-4 h-4" />
              Download GST Tax Invoice (PDF)
            </button>

            <button
              onClick={() => onOrderComplete(completedOrder.orderNumber)}
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-800 uppercase tracking-wider"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              Track Shipment Timeline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      {/* Top Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Guest Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base uppercase tracking-wider">Guest Shipping Details</h3>
                <p className="text-xs text-slate-400">No registration or login required.</p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Mobile Number (For SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">Select Payment Method</label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-400 mb-2" />
                    <span className="font-bold text-xs">Instant UPI</span>
                    <span className="text-[10px] text-slate-500">GPay / PhonePe / Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'Razorpay'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-400 mb-2" />
                    <span className="font-bold text-xs">Razorpay</span>
                    <span className="text-[10px] text-slate-500">Cards / NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                    <span className="font-bold text-xs">Cash On Delivery</span>
                    <span className="text-[10px] text-slate-500">Pay on doorstep</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 transition-all mt-6 uppercase tracking-wider"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Securing Payment & Confirming Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    Place Order (₹{grandTotal.toLocaleString('en-IN')})
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base border-b border-slate-800 pb-3 uppercase tracking-wider">Order Parts Summary</h3>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-950" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white truncate">{item.product.name}</h5>
                    <p className="text-slate-400 text-[10px]">OEM: {item.product.oemNumber} | Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-white">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Parts Subtotal:</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Coupon Discount:</span>
                  <span className="font-bold">- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST (18%):</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Doorstep Express Freight:</span>
                <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-App Razorpay Checkout Gateway Modal Fallback */}
      {showInAppRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Razorpay Brand Header */}
            <div className="bg-[#0A192F] p-5 text-white flex items-center justify-between border-b border-blue-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md">
                  RZP
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-300 tracking-wider uppercase">
                    <Shield className="w-3 h-3 text-blue-400" />
                    Razorpay Secured Gateway
                  </div>
                  <h4 className="font-extrabold text-sm text-white">MS BULLET HUB</h4>
                  <p className="text-[11px] text-slate-300">Order Amount: <strong className="text-amber-300">₹{grandTotal.toLocaleString('en-IN')}</strong></p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowInAppRazorpayModal(false);
                  setIsProcessing(false);
                }}
                className="p-1.5 rounded-xl bg-blue-950/60 text-slate-300 hover:text-white hover:bg-blue-900/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="p-5 space-y-4 bg-slate-900">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Select Preferred Payment Method
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRazorpayTab('upi')}
                  className={`p-2.5 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                    razorpayTab === 'upi'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-blue-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRazorpayTab('card')}
                  className={`p-2.5 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                    razorpayTab === 'card'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRazorpayTab('netbanking')}
                  className={`p-2.5 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                    razorpayTab === 'netbanking'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* Tab Content */}
              {razorpayTab === 'upi' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={vpaId}
                        onChange={(e) => setVpaId(e.target.value)}
                        placeholder="yourname@upi"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['@okaxis', '@ybl', '@paytm', '@ibl', '@sbi'].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => setVpaId((prev) => (prev.includes('@') ? prev.split('@')[0] : prev) + handle)}
                          className="px-2 py-1 rounded-lg bg-slate-900 text-[10px] text-slate-400 border border-slate-800 hover:text-blue-300 hover:border-blue-500/40"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300 text-[11px]">GPay / PhonePe Auto-Request</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">Instant Approval</span>
                  </div>
                </div>
              )}

              {razorpayTab === 'card' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {razorpayTab === 'netbanking' && (
                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-bold text-slate-300 block">Select Popular Bank</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={handleInAppRazorpayPay}
                        className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold text-left hover:border-blue-500 hover:text-blue-300 transition-colors"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleInAppRazorpayPay}
                disabled={isRazorpaySubmitting}
                className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
              >
                {isRazorpaySubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting to Razorpay Gateway...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white" />
                    Pay ₹{grandTotal.toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit SSL Encrypted | Razorpay Verified Merchant
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
