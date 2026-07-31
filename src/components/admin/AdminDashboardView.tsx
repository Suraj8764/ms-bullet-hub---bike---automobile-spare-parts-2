import React, { useState, useMemo } from 'react';
import {
  Lock,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  LogOut,
  Search,
  DollarSign,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Filter,
  Layers,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Zap,
  Boxes,
  ArrowUpRight,
  ChevronRight,
  Tag,
  MapPin,
  Wrench,
  Percent
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Product, Order, Coupon, GarageLocation } from '../../types';
import { generateGSTInvoice } from '../../utils/invoice';

export const AdminDashboardView: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    adminPassword,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    deleteCategory,
    brands,
    addBrand,
    deleteBrand,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    garages,
    addGarage,
    deleteGarage,
    orders,
    updateOrderStatus
  } = useAppStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'coupons' | 'garages' | 'orders' | 'inventory' | 'settings'>('overview');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Password update form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Product CRUD Form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Rolon');
  const [formCategory, setFormCategory] = useState('Chain & Sprocket');
  const [formOem, setFormOem] = useState('');
  const [formPrice, setFormPrice] = useState('1200');
  const [formStock, setFormStock] = useState('25');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=800&auto=format&fit=crop&q=80');

  // Category Add Form State
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=500&auto=format&fit=crop&q=80');
  const [catDesc, setCatDesc] = useState('');

  // Brand Add Form State
  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandOriginInput, setBrandOriginInput] = useState('India');

  // Coupon Add Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState('15');
  const [couponMaxDiscount, setCouponMaxDiscount] = useState('200');
  const [couponMinOrder, setCouponMinOrder] = useState('999');

  // Garage Add Form State
  const [garageName, setGarageName] = useState('');
  const [garageAddress, setGarageAddress] = useState('');
  const [garageCity, setGarageCity] = useState('Bhubaneswar');
  const [garagePhone, setGaragePhone] = useState('+91 98765 00112');
  const [garageServices, setGarageServices] = useState('Chain Replacement, Engine Service, Oil Change');

  // Restock Feedback
  const [restockToast, setRestockToast] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) {
      setLoginError(true);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formOem) return;

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        updateProduct({
          ...existing,
          name: formName,
          brand: formBrand,
          category: formCategory,
          oemNumber: formOem,
          price: Number(formPrice),
          stock: Number(formStock),
          images: [formImage]
        });
      }
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, '-'),
        sku: `SKU-${formOem}`,
        oemNumber: formOem,
        partNumber: formOem,
        category: formCategory,
        categorySlug: formCategory.toLowerCase().replace(/\s+/g, '-'),
        brand: formBrand,
        price: Number(formPrice),
        originalPrice: Math.round(Number(formPrice) * 1.25),
        discountPercent: 20,
        rating: 4.8,
        reviewCount: 1,
        stock: Number(formStock),
        description: 'OEM high precision automotive component.',
        specifications: [{ label: 'Material', value: 'High Grade Metal/Composite' }],
        compatibleVehicles: [{ make: 'Maruti Suzuki', model: 'Swift', years: [2021, 2022, 2023, 2024] }],
        images: [formImage],
        warranty: '12 Months',
        deliveryDays: 2,
        hsnCode: '87083000',
        gstRate: 18
      };
      addProduct(newProd);
    }

    setIsAddingProduct(false);
    setEditingProductId(null);
    setFormName('');
    setFormOem('');
  };

  const handleEditClick = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormOem(p.oemNumber);
    setFormPrice(p.price.toString());
    setFormStock(p.stock.toString());
    setFormImage(p.images[0] || 'https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=800&auto=format&fit=crop&q=80');
    setIsAddingProduct(true);
  };

  const handleQuickRestock = (p: Product, count: number) => {
    updateProduct({ ...p, stock: p.stock + count });
    setRestockToast(`Added +${count} units to ${p.name}`);
    setTimeout(() => setRestockToast(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 4 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    changeAdminPassword(newPassword);
    setPasswordMessage({ type: 'success', text: 'Master Password updated successfully! Saved to local store.' });
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      id: `cat-${Date.now()}`,
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      icon: 'Disc',
      image: catImage || 'https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=500&auto=format&fit=crop&q=80',
      itemCount: 0,
      description: catDesc || 'OEM motorcycle component system.'
    });
    setCatName('');
    setCatDesc('');
    setRestockToast(`Added category: ${catName}`);
    setTimeout(() => setRestockToast(null), 3000);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandNameInput) return;
    addBrand({
      name: brandNameInput,
      logo: '',
      origin: brandOriginInput || 'India'
    });
    setBrandNameInput('');
    setRestockToast(`Added brand: ${brandNameInput}`);
    setTimeout(() => setRestockToast(null), 3000);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addCoupon({
      code: couponCode.toUpperCase(),
      discountPercent: Number(couponDiscountPercent),
      maxDiscount: Number(couponMaxDiscount),
      minOrderValue: Number(couponMinOrder),
      expiryDate: '2026-12-31',
      description: `Flat ${couponDiscountPercent}% OFF up to ₹${couponMaxDiscount} on orders above ₹${couponMinOrder}.`,
      active: true
    });
    setCouponCode('');
    setRestockToast(`Created coupon: ${couponCode.toUpperCase()}`);
    setTimeout(() => setRestockToast(null), 3000);
  };

  const handleSaveGarage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!garageName) return;
    addGarage({
      id: `gar-${Date.now()}`,
      name: garageName,
      address: garageAddress || 'Main Road',
      city: garageCity,
      state: 'Odisha',
      pincode: '751001',
      phone: garagePhone,
      distanceKm: 3.5,
      rating: 4.9,
      reviewsCount: 1,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80',
      services: garageServices.split(',').map((s) => s.trim())
    });
    setGarageName('');
    setGarageAddress('');
    setRestockToast(`Added garage: ${garageName}`);
    setTimeout(() => setRestockToast(null), 3000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.oemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.mobile.includes(searchTerm);
      const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, orderStatusFilter]);

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < 15);
  const totalUnitsInStock = products.reduce((acc, p) => acc + p.stock, 0);

  // If Admin is NOT logged in -> Sleek Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-8 backdrop-blur-xl relative overflow-hidden">
          {/* Decorative ambient background blur */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Restricted Portal
              </span>
              <h2 className="text-2xl font-black text-white mt-3 tracking-tight">MS BULLET HUB Control Console</h2>
              <p className="text-xs text-slate-400 mt-1">Authenticate with Master Passkey to access inventory & order management.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Master Passkey</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError(false);
                    }}
                    placeholder="Enter passkey (default: admin123)"
                    className="w-full bg-slate-950 text-white text-xs p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-xs text-rose-400 font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Invalid Admin Security Passkey!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99]"
              >
                Sign In to Enterprise Console
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800/80">
              Authorized Personnel Only • Encrypted Admin Session
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 text-white space-y-6">
      {/* Toast Alert */}
      {restockToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          {restockToast}
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE SYSTEM ONLINE
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">| MongoDB Atlas Synchronized</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">MS BULLET HUB Enterprise Console</h2>
          <p className="text-xs text-slate-400">Real-time inventory management, order processing, and telemetry.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
              AD
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-white leading-tight">Master Admin</p>
              <p className="text-[9px] text-slate-400">Superuser</p>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 bg-slate-800 hover:bg-rose-600/90 text-slate-300 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: `Catalog (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'garages', label: `Garages (${garages.length})`, icon: Wrench },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
          { id: 'inventory', label: `Low Stock (${lowStockProducts.length})`, icon: AlertTriangle, badge: lowStockProducts.length > 0 ? lowStockProducts.length : null },
          { id: 'settings', label: 'Security', icon: KeyRound }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-slate-950 text-rose-400' : 'bg-rose-500 text-white'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-amber-500/30 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">Total Revenue</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mt-3">₹{totalRevenue.toLocaleString('en-IN')}</h3>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.5% vs last month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-blue-500/30 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">Total Orders</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mt-3">{totalOrders} Orders</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Fulfillment Rate</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-purple-500/30 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">Active SKUs</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mt-3">{products.length} Items</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                <Boxes className="w-3.5 h-3.5 text-purple-400" />
                <span>{totalUnitsInStock} total units in stock</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-rose-500/30 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">Low Stock Warning</span>
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-rose-400 mt-3">{lowStockProducts.length} Parts</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-rose-400/90 mt-2 font-bold">
                <span>Requires reorder soon</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Monthly Sales & Revenue Trajectory</h4>
                  <p className="text-[11px] text-slate-400">Order volume & revenue breakdown across 2026</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  INR (₹)
                </span>
              </div>

              <div className="h-52 flex items-end justify-between gap-2 pt-6 px-2 bg-slate-950/70 rounded-xl border border-slate-800/80 relative">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, idx) => {
                  const heights = [45, 60, 40, 75, 90, 68, 98];
                  const h = heights[idx];
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-8 text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded shadow-lg transition-all z-10 whitespace-nowrap">
                        ₹{(h * 1450).toLocaleString('en-IN')}
                      </span>
                      <div
                        style={{ height: `${h}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 via-orange-500 to-amber-400 rounded-t-lg group-hover:brightness-125 transition-all shadow-md shadow-amber-500/10"
                      />
                      <span className="text-[10px] text-slate-400 font-bold">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Categories Distribution */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white border-b border-slate-800 pb-3">
                  Catalog Distribution by Category
                </h4>
                <div className="space-y-3 pt-3">
                  {[
                    { label: 'Brakes & Suspension', count: products.filter(p => p.category === 'Brakes & Suspension').length, color: 'bg-amber-500' },
                    { label: 'Engine Components', count: products.filter(p => p.category === 'Engine Components').length, color: 'bg-blue-500' },
                    { label: 'Electrical & Ignition', count: products.filter(p => p.category === 'Electrical & Ignition').length, color: 'bg-purple-500' },
                    { label: 'Filters & Lubricants', count: products.filter(p => p.category === 'Filters & Lubricants').length, color: 'bg-emerald-500' }
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat.label}</span>
                        <span className="font-bold text-white">{cat.count} parts</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, (cat.count / Math.max(1, products.length)) * 100)}%` }}
                          className={`h-full ${cat.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gemini Part Assistant AI actively routes 85% of OEM queries automatically!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex flex-1 items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by part name, OEM number, or brand..."
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-600"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setIsAddingProduct(!isAddingProduct);
                setEditingProductId(null);
                setFormName('');
                setFormOem('');
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {isAddingProduct ? 'Close Form' : 'Add New OEM Part'}
            </button>
          </div>

          {/* Add / Edit Form Modal/Panel */}
          {isAddingProduct && (
            <form onSubmit={handleSaveProduct} className="p-5 md:p-6 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h5 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {editingProductId ? 'Edit Product Specification' : 'Add New OEM Part to Store'}
                </h5>
                <button type="button" onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Enfield Classic 350 Brake Pads"
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">OEM Part Number</label>
                  <input
                    type="text"
                    required
                    value={formOem}
                    onChange={(e) => setFormOem(e.target.value.toUpperCase())}
                    placeholder="e.g. 55810M74L00"
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Product Image URL</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20"
                >
                  Save Part
                </button>
              </div>
            </form>
          )}

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Spare Part Name</th>
                  <th className="p-4">OEM Part Number</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-4 font-bold text-white max-w-xs">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-800" />
                        <span className="truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-400">{p.oemNumber}</td>
                    <td className="p-4 text-slate-300">{p.brand}</td>
                    <td className="p-4 font-extrabold text-white">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] ${
                        p.stock < 15 ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Part"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Part"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (100% Responsive) */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-xs text-white truncate">{p.name}</h5>
                    <p className="text-[10px] font-mono font-bold text-amber-400 mt-0.5">OEM: {p.oemNumber}</p>
                    <p className="text-[10px] text-slate-400">{p.brand} • {p.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Price</span>
                    <span className="font-black text-white">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Stock</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      p.stock < 15 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {p.stock} units
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-2 text-slate-300 bg-slate-800 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 text-rose-400 bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Categories & Brands Management */}
      {activeTab === 'categories' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Add Category Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                <Layers className="w-5 h-5" />
                <span>Add New Product Category</span>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category Name</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Performance Exhausts"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category Image URL</label>
                  <input
                    type="text"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                  <input
                    type="text"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Short description..."
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* Add Brand Form */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-5 h-5" />
                <span>Add OEM Brand / Manufacturer</span>
              </div>
              <form onSubmit={handleSaveBrand} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandNameInput}
                    onChange={(e) => setBrandNameInput(e.target.value)}
                    placeholder="e.g. Akrapovič, Brembo, Motul"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Origin Country</label>
                  <input
                    type="text"
                    value={brandOriginInput}
                    onChange={(e) => setBrandOriginInput(e.target.value)}
                    placeholder="e.g. India, Germany, Italy"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
                >
                  Create Brand
                </button>
              </form>
            </div>
          </div>

          {/* Existing Categories List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Existing System Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-12 h-12 object-cover rounded-xl border border-slate-800" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.description || 'OEM parts category'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Brands List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Existing OEM Brands ({brands.length})</h3>
            <div className="flex flex-wrap gap-3">
              {brands.map((b) => (
                <div key={b.name} className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs font-bold text-white">
                  <span>{b.name} <span className="text-slate-500 text-[10px]">({b.origin})</span></span>
                  <button
                    onClick={() => deleteBrand(b.name)}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Discount Coupons Management */}
      {activeTab === 'coupons' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Tag className="w-5 h-5" />
              <span>Create Dynamic Promo Coupon Code</span>
            </div>
            <form onSubmit={handleSaveCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BULLET20"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={couponDiscountPercent}
                  onChange={(e) => setCouponDiscountPercent(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Max Discount (₹)</label>
                <input
                  type="number"
                  value={couponMaxDiscount}
                  onChange={(e) => setCouponMaxDiscount(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-bold"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
                >
                  Generate Active Coupon Code
                </button>
              </div>
            </form>
          </div>

          {/* Existing Coupons Table */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Active Promo Coupons ({coupons.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 font-mono font-black text-sm rounded-lg border border-amber-500/30">
                      {c.code}
                    </span>
                    <button
                      onClick={() => toggleCouponStatus(c.code)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">{c.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Min Order: ₹{c.minOrderValue}</span>
                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="text-rose-400 hover:text-rose-300 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Certified Workshop Garages */}
      {activeTab === 'garages' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Wrench className="w-5 h-5" />
              <span>Add Certified Workshop / Garage Partner</span>
            </div>
            <form onSubmit={handleSaveGarage} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Workshop Name</label>
                <input
                  type="text"
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  placeholder="e.g. Bullet Master Workshop"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">City</label>
                <input
                  type="text"
                  value={garageCity}
                  onChange={(e) => setGarageCity(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Address</label>
                <input
                  type="text"
                  value={garageAddress}
                  onChange={(e) => setGarageAddress(e.target.value)}
                  placeholder="Plot No 42, Janpath Road"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={garagePhone}
                  onChange={(e) => setGaragePhone(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Offered Services (Comma separated)</label>
                <input
                  type="text"
                  value={garageServices}
                  onChange={(e) => setGarageServices(e.target.value)}
                  placeholder="e.g. Brake Replacement, Engine Overhaul, Oil Change"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
                >
                  Register Garage Workshop
                </button>
              </div>
            </form>
          </div>

          {/* Existing Garages List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Registered Workshops ({garages.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {garages.map((g) => (
                <div key={g.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">{g.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{g.address}, {g.city}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Services: {g.services.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => deleteGarage(g.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Order Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex flex-1 items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders by order ID, customer name, or phone..."
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['ALL', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderStatusFilter === st
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.map((o) => (
              <div key={o.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-amber-400 text-sm">{o.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {o.paymentMethod}
                      </span>
                    </div>
                    <p className="text-slate-300 font-bold">Customer: {o.customerName} • <span className="text-slate-400 font-normal">{o.mobile}</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white font-extrabold text-sm bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      ₹{o.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => generateGSTInvoice(o)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Invoice PDF
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Ordered Items ({o.items.length})</span>
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300 font-medium">
                      <span>{it.quantity}x {it.product.name}</span>
                      <span className="font-mono">₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Status Updater */}
                <div className="flex flex-wrap items-center justify-between text-xs gap-3 pt-1">
                  <span className="text-slate-400">
                    Fulfillment Status: <strong className="text-amber-400 font-extrabold">{o.orderStatus}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="text-slate-400 text-[11px] font-bold">Update Status:</label>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                      className="bg-slate-950 text-white text-xs p-2 rounded-xl border border-slate-800 font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Inventory Alerts & Quick Restock */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold text-rose-200">Low Stock Triggered Parts ({lowStockProducts.length})</p>
              <p className="text-[11px] text-rose-300/80">Automated inventory monitor flagged these OEM items with less than 15 units.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-black text-sm text-white">{p.name}</h5>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {p.stock} left
                    </span>
                  </div>
                  <p className="text-xs font-mono text-amber-400 mt-1">OEM: {p.oemNumber}</p>
                  <p className="text-xs text-slate-400 mt-1">Brand: {p.brand} • Category: {p.category}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickRestock(p, 10)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold rounded-xl text-xs transition-colors"
                    >
                      +10 Restock
                    </button>
                    <button
                      onClick={() => handleQuickRestock(p, 25)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors"
                    >
                      +25 Bulk
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Security & Admin Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Master Passkey & Admin Security</h3>
                <p className="text-xs text-slate-400">Update your secret passkey for dashboard authentication.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">New Passkey</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new passkey..."
                  className="w-full bg-slate-950 text-white text-xs p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Confirm New Passkey</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new passkey..."
                  className="w-full bg-slate-950 text-white text-xs p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {passwordMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                    passwordMessage.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                Update Secret Passkey
              </button>
            </form>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <p className="font-bold text-amber-400">🔐 Master Passkey Storage:</p>
              <p>Passkeys can be set via <code className="text-amber-300 font-mono">VITE_ADMIN_MASTER_PASSWORD</code> environment variable or saved locally. Default is <code className="text-amber-300 font-mono">admin123</code>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
