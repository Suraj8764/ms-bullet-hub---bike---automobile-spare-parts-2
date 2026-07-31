import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Tag,
  Boxes,
  Users,
  Ticket,
  BarChart2,
  Image as ImageIcon,
  Settings,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Lock,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Filter,
  Upload,
  Bell,
  ChevronDown,
  CreditCard,
  Truck,
  ArrowUpRight,
  Eye,
  Printer,
  XCircle,
  DollarSign,
  Building,
  Check,
  X,
  Zap,
  KeyRound,
  ExternalLink,
  FileSpreadsheet,
  Database,
  MapPin,
  Wrench,
  Percent,
  Sparkles,
  ArrowDownRight,
  User
} from 'lucide-react';
import { useAppStore, CategoryItem, BrandItem, BannerItem } from '../../store/useAppStore';
import { Product, Order, Coupon, GarageLocation } from '../../types';
import { generateGSTInvoice } from '../../utils/invoice';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'customers'
  | 'coupons'
  | 'reports'
  | 'banners'
  | 'settings';

export interface AdminDashboardViewProps {
  onExitAdmin?: () => void;
  initialTab?: AdminTab;
}

// CSV Exporter Helper Function
function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onExitAdmin, initialTab = 'dashboard' }) => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    adminPassword,
    products,
    addProduct,
    bulkAddProducts,
    updateProduct,
    updateProductStock,
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
    banners,
    addBanner,
    deleteBanner,
    toggleBannerStatus,
    storeSettings,
    updateStoreSettings,
    orders,
    updateOrderStatus,
    cancelOrder,
    refundOrder
  } = useAppStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; database: string; message: string } | null>(null);
  const [checkingDb, setCheckingDb] = useState(false);

  const checkDatabaseStatus = async () => {
    setCheckingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setDbStatus({
        connected: false,
        database: 'Server Offline or Unreachable',
        message: 'Failed to contact backend API server.'
      });
    } finally {
      setCheckingDb(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // Password Form State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification Popover state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Product CRUD Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Rolon');
  const [formCategory, setFormCategory] = useState('Chain & Sprocket');
  const [formOem, setFormOem] = useState('');
  const [formPrice, setFormPrice] = useState('1200');
  const [formOriginalPrice, setFormOriginalPrice] = useState('1500');
  const [formStock, setFormStock] = useState('25');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=800&auto=format&fit=crop&q=80');
  const [formDescription, setFormDescription] = useState('High-durability OEM specification spare part engineered for Royal Enfield motorcycles.');
  const [formHsn, setFormHsn] = useState('8714');
  const [formGst, setFormGst] = useState('18');

  // Bulk Upload Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Category Add Form State
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=500&auto=format&fit=crop&q=80');
  const [catDesc, setCatDesc] = useState('');

  // Brand Add Form State
  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandOriginInput, setBrandOriginInput] = useState('India');
  const [brandLogoInput, setBrandLogoInput] = useState('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80');

  // Coupon Add Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState('15');
  const [couponMaxDiscount, setCouponMaxDiscount] = useState('200');
  const [couponMinOrder, setCouponMinOrder] = useState('999');

  // Banner Add Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerTag, setBannerTag] = useState('SEASONAL SALE');
  const [bannerImageUrl, setBannerImageUrl] = useState('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80');

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasswordInput('');
    }
  };

  // Product Form Reset
  const resetProductForm = () => {
    setFormName('');
    setFormBrand('Rolon');
    setFormCategory('Chain & Sprocket');
    setFormOem('');
    setFormPrice('1200');
    setFormOriginalPrice('1500');
    setFormStock('25');
    setFormImage('https://images.unsplash.com/photo-1600706432523-9881831dd78e?w=800&auto=format&fit=crop&q=80');
    setFormDescription('High-durability OEM specification spare part engineered for Royal Enfield motorcycles.');
    setFormHsn('8714');
    setFormGst('18');
    setEditingProductId(null);
    setIsAddingProduct(false);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormOem(p.oemNumber);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : (p.price * 1.2).toString());
    setFormStock(p.stock.toString());
    setFormImage(p.images[0] || '');
    setFormDescription(p.description || '');
    setFormHsn(p.hsnCode || '8714');
    setFormGst(p.gstRate ? p.gstRate.toString() : '18');
    setIsAddingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formOem) return;

    const priceNum = Number(formPrice) || 0;
    const origPriceNum = Number(formOriginalPrice) || priceNum;
    const stockNum = Number(formStock) || 0;
    const discountCalc = origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0;

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        updateProduct({
          ...existing,
          name: formName,
          brand: formBrand,
          category: formCategory,
          oemNumber: formOem,
          price: priceNum,
          originalPrice: origPriceNum,
          discountPercent: discountCalc,
          stock: stockNum,
          images: [formImage],
          description: formDescription,
          hsnCode: formHsn,
          gstRate: Number(formGst) || 18
        });
        triggerToast(`Updated product "${formName}"`);
      }
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: `SKU-${formOem}-${Math.floor(100 + Math.random() * 900)}`,
        oemNumber: formOem,
        partNumber: `PN-${formOem}`,
        category: formCategory,
        categorySlug: formCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: formBrand,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: discountCalc,
        rating: 4.8,
        reviewCount: 1,
        stock: stockNum,
        description: formDescription,
        specifications: [
          { label: 'Material', value: 'Heavy Duty Alloy Steel' },
          { label: 'OEM Part No', value: formOem },
          { label: 'Warranty', value: '1 Year Manufacturer Defect' }
        ],
        compatibleVehicles: [
          { make: 'Royal Enfield', model: 'Classic 350', years: [2021, 2022, 2023, 2024, 2025, 2026] }
        ],
        images: [formImage],
        warranty: '1 Year',
        deliveryDays: 3,
        hsnCode: formHsn,
        gstRate: Number(formGst) || 18
      };
      addProduct(newProd);
      triggerToast(`Added new OEM part "${formName}"`);
    }

    resetProductForm();
  };

  // Quick 1-Click Demo Bulk Upload
  const handleDemoBulkImport = () => {
    const demoItems: Product[] = [
      {
        id: `prod-bulk-${Date.now()}-1`,
        name: 'Royal Enfield Genuine Clutch Cable - Hunter / Classic 350 J-Series',
        slug: 're-clutch-cable-j-series',
        sku: 'SKU-RE-CC-101',
        oemNumber: 'RAC00012/A',
        partNumber: 'PN-RAC00012',
        category: 'Clutch & Cable',
        categorySlug: 'clutch-cable',
        brand: 'Royal Enfield Genuine',
        price: 349,
        originalPrice: 420,
        discountPercent: 17,
        rating: 4.9,
        reviewCount: 18,
        stock: 35,
        description: 'Teflon coated long-life clutch cable engineered for smooth lever response.',
        specifications: [{ label: 'Cable Length', value: '1120 mm' }],
        compatibleVehicles: [{ make: 'Royal Enfield', model: 'Classic 350', years: [2021, 2022, 2023] }],
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'],
        warranty: '6 Months',
        deliveryDays: 2,
        hsnCode: '8714',
        gstRate: 18
      },
      {
        id: `prod-bulk-${Date.now()}-2`,
        name: 'CEAT Zoom Plus Tubeless Tyre 120/80-18 Rear',
        slug: 'ceat-zoom-plus-120-80-18',
        sku: 'SKU-CEAT-ZP-18',
        oemNumber: 'CEAT-TYR-180',
        partNumber: 'PN-CEAT-180',
        category: 'Tyres & Wheels',
        categorySlug: 'tyres',
        brand: 'CEAT',
        price: 3199,
        originalPrice: 3800,
        discountPercent: 15,
        rating: 4.8,
        reviewCount: 42,
        stock: 12,
        description: 'High-grip all-weather tread pattern for superior stability on highway and dirt roads.',
        specifications: [{ label: 'Tyre Size', value: '120/80-18 Rear' }],
        compatibleVehicles: [{ make: 'Royal Enfield', model: 'Bullet 350', years: [2018, 2019, 2020, 2021, 2022] }],
        images: ['https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=800&auto=format&fit=crop&q=80'],
        warranty: '3 Years Warranty',
        deliveryDays: 4,
        hsnCode: '4011',
        gstRate: 28
      }
    ];

    bulkAddProducts(demoItems);
    setIsBulkModalOpen(false);
    triggerToast(`Successfully imported ${demoItems.length} demo products into inventory!`);
  };

  // Top 10 Metrics Calculations
  const metrics = useMemo(() => {
    const totalRev = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    const todaySales = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0); // Active sales value

    const totalOrdersCount = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Confirmed' || (o.orderStatus as string) === 'Pending').length;
    const packedOrders = orders.filter((o) => o.orderStatus === 'Packed').length;
    const shippedOrders = orders.filter((o) => o.orderStatus === 'Shipped').length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    return {
      todaySales,
      totalRev,
      totalOrdersCount,
      pendingOrders,
      packedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockCount,
      outOfStockCount
    };
  }, [orders, products]);

  // Notifications List
  const notificationAlerts = useMemo(() => {
    const alerts: { id: string; type: 'warning' | 'danger' | 'info'; title: string; subtitle: string; date: string }[] = [];

    const lowProds = products.filter((p) => p.stock <= 10);
    lowProds.forEach((p) => {
      alerts.push({
        id: `alert-${p.id}`,
        type: p.stock === 0 ? 'danger' : 'warning',
        title: p.stock === 0 ? `OUT OF STOCK: ${p.name}` : `LOW STOCK ALERT: ${p.name}`,
        subtitle: `Remaining stock: ${p.stock} units. OEM #${p.oemNumber}`,
        date: 'Just now'
      });
    });

    orders.slice(0, 3).forEach((o) => {
      alerts.push({
        id: `alert-ord-${o.id}`,
        type: 'info',
        title: `NEW ORDER: #${o.orderNumber}`,
        subtitle: `₹${o.grandTotal.toLocaleString('en-IN')} by ${o.customerName} (${o.paymentMethod})`,
        date: 'Recent'
      });
    });

    return alerts;
  }, [products, orders]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch =
        ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.mobile.includes(orderSearch) ||
        (ord.email && ord.email.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchStatus =
        orderStatusFilter === 'ALL'
          ? true
          : orderStatusFilter === 'Pending'
            ? ord.orderStatus === 'Confirmed' || (ord.orderStatus as string) === 'Pending'
            : ord.orderStatus === orderStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.oemNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(globalSearch.toLowerCase());

      const matchCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;

      return matchSearch && matchCat;
    });
  }, [products, globalSearch, productCategoryFilter]);

  // Customers Aggregation from Orders
  const customerList = useMemo(() => {
    const map = new Map<string, { name: string; mobile: string; email: string; city: string; ordersCount: number; totalSpent: number }>();

    orders.forEach((o) => {
      const key = o.mobile || o.customerName;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customerName,
          mobile: o.mobile,
          email: o.email || 'N/A',
          city: o.city,
          ordersCount: 1,
          totalSpent: o.grandTotal
        });
      } else {
        const existing = map.get(key)!;
        existing.ordersCount += 1;
        existing.totalSpent += o.grandTotal;
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Password Update Form Submit
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 4 characters long.' });
      return;
    }
    changeAdminPassword(newPassword);
    setPasswordMessage({ type: 'success', text: 'Admin Master Password updated successfully!' });
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPasswordInput('');
  };

  // CSV Export Actions
  const handleExportOrdersCSV = () => {
    const rows = orders.map((o) => ({
      Order_Number: o.orderNumber,
      Date: o.createdAt,
      Customer_Name: o.customerName,
      Mobile: o.mobile,
      Email: o.email || '',
      City: o.city,
      Vehicle: o.vehicleInfo || '',
      Subtotal: o.subtotal,
      Discount: o.discount,
      GST: o.gst,
      Shipping_Fee: o.shippingFee,
      Grand_Total: o.grandTotal,
      Payment_Method: o.paymentMethod,
      Payment_Status: o.paymentStatus,
      Order_Status: o.orderStatus
    }));
    exportToCSV(`ms_bullet_hub_orders_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    triggerToast('Exported Orders to CSV Excel file!');
  };

  const handleExportProductsCSV = () => {
    const rows = products.map((p) => ({
      Product_Name: p.name,
      OEM_Number: p.oemNumber,
      Brand: p.brand,
      Category: p.category,
      Price_INR: p.price,
      Original_Price_INR: p.originalPrice,
      Stock_Quantity: p.stock,
      HSN_Code: p.hsnCode,
      GST_Rate: p.gstRate,
      Warranty: p.warranty
    }));
    exportToCSV(`ms_bullet_hub_inventory_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    triggerToast('Exported Products Inventory to CSV Excel file!');
  };

  // -------------------------------------------------------------
  // UNAUTHENTICATED ADMIN LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden text-slate-100">
        {/* Ambient mesh lighting */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              ENTERPRISE SECURITY CONSOLE
            </span>
            <h2 className="text-2xl font-black text-white mt-2">MS BULLET HUB</h2>
            <p className="text-xs text-slate-400 mt-1">Central Admin Portal & Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Master Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter master password..."
                  className="w-full bg-slate-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Invalid credentials. Default password is <code className="bg-rose-950 px-1.5 py-0.5 rounded font-mono font-bold">admin123</code></span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" /> Authenticate Admin Session
            </button>
          </form>

          {/* Demo Auto-fill Helper */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center space-y-2">
            <p className="text-[11px] text-slate-500">Demo Testing Helper:</p>
            <button
              onClick={() => {
                setPasswordInput('admin123');
                setLoginError(false);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auto-Fill "admin123"
            </button>
          </div>

          {onExitAdmin && (
            <div className="mt-4 text-center">
              <button
                onClick={onExitAdmin}
                className="text-xs text-slate-400 hover:text-amber-400 underline transition-colors cursor-pointer"
              >
                ← Return to Customer Website
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ENTERPRISE ADMIN PORTAL LAYOUT
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow-md shadow-amber-500/20 shrink-0 border border-amber-400/30">
            MS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg text-white leading-none tracking-tight">MS BULLET HUB</h1>
              <span className="hidden sm:inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                Admin Console
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Central Inventory & Order Management
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search products, OEM parts, customer orders..."
            className="w-full bg-slate-950/80 text-white text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Header Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl border border-slate-700 relative cursor-pointer"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {notificationAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {notificationAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Popover Box */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
                  <span>System Notifications ({notificationAlerts.length})</span>
                  <button onClick={() => setIsNotificationOpen(false)} className="text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {notificationAlerts.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl border text-[11px] ${n.type === 'danger'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                          : n.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                        }`}
                    >
                      <p className="font-bold">{n.title}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{n.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DB Status Badge */}
          <button
            onClick={checkDatabaseStatus}
            disabled={checkingDb}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${dbStatus?.connected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            title="Click to re-check MongoDB connection"
          >
            <Database className={`w-3.5 h-3.5 ${checkingDb ? 'animate-spin' : ''}`} />
            <span>{dbStatus?.connected ? 'MongoDB Connected' : 'DB: Local/In-Memory'}</span>
          </button>

          {/* Quick Action Button */}
          <button
            onClick={() => {
              setActiveTab('products');
              resetProductForm();
              setIsAddingProduct(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/10 hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Part
          </button>

          {/* Exit / Switch to Customer Store */}
          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Return to Customer Storefront"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Storefront</span>
            </button>
          )}

          {/* Admin Avatar & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="flex items-center gap-2 p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer group"
              title="Admin Account Menu"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                Admin
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {isAdminMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsAdminMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-800 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xs">
                        A
                      </div>
                      <div className="truncate">
                        <p className="font-extrabold text-white text-xs truncate">Administrator</p>
                        <p className="text-[10px] text-slate-400 truncate">admin@bulletspares.com</p>
                      </div>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[9px] font-bold">
                      ● Active Session
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      setActiveTab('dashboard');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      setActiveTab('settings');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      logoutAdmin();
                      if (onExitAdmin) onExitAdmin();
                    }}
                    className="w-full px-3.5 py-2 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex relative">
        {/* DESKTOP STICKY SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 space-y-1 shrink-0 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 mb-2">
            Core Modules
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" /> Orders
            </div>
            {orders.length > 0 && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" /> Products Catalog
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'products' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <Boxes className="w-4 h-4" /> Inventory & Alerts
            </div>
            {metrics.lowStockCount > 0 && (
              <span className="bg-rose-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md">
                {metrics.lowStockCount} LOW
              </span>
            )}
          </button>

          <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 pt-4 mb-2 border-t border-slate-800">
            Catalog & Brand Config
          </div>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Layers className="w-4 h-4" /> Categories
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'brands'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Tag className="w-4 h-4" /> Brands
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'banners'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <ImageIcon className="w-4 h-4" /> Store Banners
          </button>

          <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 pt-4 mb-2 border-t border-slate-800">
            Analytics & Marketing
          </div>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'customers'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Users className="w-4 h-4" /> Customers Directory
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'coupons'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Ticket className="w-4 h-4" /> Coupons & Promos
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <BarChart2 className="w-4 h-4" /> Sales Reports & Tax
          </button>

          <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 pt-4 mb-2 border-t border-slate-800">
            System & Security
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Settings className="w-4 h-4" /> Store Settings
          </button>

          {/* Quick System Badge Footer */}
          <div className="mt-6 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> GST Ready Portal
            </p>
            <p className="text-[10px] text-slate-500">GSTIN: {storeSettings.gstin}</p>
          </div>
        </aside>

        {/* MOBILE HORIZONTAL NAVIGATION PILLS */}
        <div className="lg:hidden w-full bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto flex items-center gap-2 shrink-0">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Boxes },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'brands', label: 'Brands', icon: Tag },
            { id: 'reports', label: 'Reports', icon: BarChart2 },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'coupons', label: 'Coupons', icon: Ticket },
            { id: 'banners', label: 'Banners', icon: ImageIcon },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === item.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300'
                  }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN VIEW CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto overflow-x-hidden">

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Enterprise Command Dashboard</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time revenue, order fulfillment status, and inventory metrics</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setIsAddingProduct(true);
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Part
                  </button>
                </div>
              </div>

              {/* 10 TOP DASHBOARD METRIC CARDS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {/* 1. Today's Sales */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Today Sales</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">₹{metrics.todaySales.toLocaleString('en-IN')}</h3>
                  <p className="text-[9px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" /> +14.2% today
                  </p>
                </div>

                {/* 2. Total Revenue */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">₹{metrics.totalRev.toLocaleString('en-IN')}</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-1">Gross Sales (GST Incl.)</p>
                </div>

                {/* 3. Total Orders */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{metrics.totalOrdersCount}</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-1">Lifetime Orders</p>
                </div>

                {/* 4. Pending Orders */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-amber-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pending Orders</span>
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-amber-300">{metrics.pendingOrders}</h3>
                  <p className="text-[9px] text-amber-400/80 font-medium mt-1">Requires Fulfillment</p>
                </div>

                {/* 5. Packed Orders */}
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-blue-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Packed Orders</span>
                    <Package className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-blue-300">{metrics.packedOrders}</h3>
                  <p className="text-[9px] text-blue-400/80 font-medium mt-1">Awaiting Pickup</p>
                </div>

                {/* 6. Shipped Orders */}
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-purple-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Shipped Orders</span>
                    <Truck className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-purple-300">{metrics.shippedOrders}</h3>
                  <p className="text-[9px] text-purple-400/80 font-medium mt-1">In Transit</p>
                </div>

                {/* 7. Delivered Orders */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-emerald-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-300">{metrics.deliveredOrders}</h3>
                  <p className="text-[9px] text-emerald-400/80 font-medium mt-1">Completed</p>
                </div>

                {/* 8. Cancelled Orders */}
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-rose-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cancelled</span>
                    <XCircle className="w-4 h-4 text-rose-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-rose-300">{metrics.cancelledOrders}</h3>
                  <p className="text-[9px] text-rose-400/80 font-medium mt-1">Refunded / Cancelled</p>
                </div>

                {/* 9. Low Stock Products */}
                <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-orange-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-orange-300">{metrics.lowStockCount}</h3>
                  <p className="text-[9px] text-orange-400/80 font-medium mt-1">&lt; 10 Units Remaining</p>
                </div>

                {/* 10. Out of Stock Products */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-rose-500/40 relative overflow-hidden group transition-all">
                  <div className="flex items-center justify-between text-rose-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                    <XCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-rose-400">{metrics.outOfStockCount}</h3>
                  <p className="text-[9px] text-rose-400/80 font-medium mt-1">Requires Re-stock</p>
                </div>
              </div>

              {/* SALES & REVENUE CHARTS WIDGET */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Sales Analytics Chart */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-amber-400" /> Weekly Sales Analytics
                      </h3>
                      <p className="text-[11px] text-slate-400">Order fulfillment volume by day of week</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      +28% vs last week
                    </span>
                  </div>

                  {/* Simulated Visual Bar Chart */}
                  <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80">
                    {[
                      { day: 'Mon', count: 12, height: '40%' },
                      { day: 'Tue', count: 18, height: '60%' },
                      { day: 'Wed', count: 15, height: '50%' },
                      { day: 'Thu', count: 24, height: '80%' },
                      { day: 'Fri', count: 30, height: '95%' },
                      { day: 'Sat', count: 22, height: '70%' },
                      { day: 'Sun', count: 16, height: '55%' }
                    ].map((col) => (
                      <div key={col.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.count}
                        </span>
                        <div
                          style={{ height: col.height }}
                          className="w-full bg-gradient-to-t from-orange-600 via-amber-500 to-amber-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 shadow-md shadow-amber-500/10"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">{col.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Growth Chart */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Growth Curve
                      </h3>
                      <p className="text-[11px] text-slate-400">Monthly gross turnover trajectory (INR)</p>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      ₹{(metrics.totalRev).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Simulated Visual Area Chart */}
                  <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800/80">
                    {[
                      { month: 'Apr', val: '₹45k', height: '35%' },
                      { month: 'May', val: '₹78k', height: '50%' },
                      { month: 'Jun', val: '₹120k', height: '70%' },
                      { month: 'Jul', val: '₹195k', height: '88%' },
                      { month: 'Aug (Est)', val: '₹240k', height: '100%' }
                    ].map((col) => (
                      <div key={col.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.val}
                        </span>
                        <div
                          style={{ height: col.height }}
                          className="w-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 shadow-md shadow-emerald-500/10"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">{col.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS & QUICK ACTIONS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Orders Widget */}
                <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-amber-400" /> Recent Incoming Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      View All Orders <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                  </div>

                  <div className="space-y-2 overflow-x-auto">
                    {orders.slice(0, 4).map((o) => (
                      <div
                        key={o.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">#{o.orderNumber}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${o.orderStatus === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : o.orderStatus === 'Shipped'
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    : o.orderStatus === 'Packed'
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                            >
                              {o.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{o.customerName} • {o.city} ({o.paymentMethod})</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-black text-white text-sm block">₹{o.grandTotal.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => generateGSTInvoice(o)}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 ml-auto cursor-pointer"
                          >
                            <Printer className="w-3 h-3" /> Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Zap className="w-4 h-4 text-amber-400" /> Admin Quick Actions
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveTab('products');
                        resetProductForm();
                        setIsAddingProduct(true);
                      }}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-400" /> Add New OEM Spare Part
                    </button>

                    <button
                      onClick={() => setIsBulkModalOpen(true)}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-blue-400" /> Bulk Product CSV Upload
                    </button>

                    <button
                      onClick={handleExportOrdersCSV}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Download Orders Report (.CSV)
                    </button>

                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Boxes className="w-4 h-4 text-orange-400" /> Review Low Stock Alerts ({metrics.lowStockCount})
                    </button>

                    <button
                      onClick={() => setActiveTab('coupons')}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 text-purple-400" /> Create Discount Coupon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: ORDERS MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">Order Management & Fulfillment</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Filter orders, update status, generate GST invoices, or refund payments</p>
                </div>
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Orders CSV
                </button>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Customer Name, Mobile Number, Email..."
                    className="w-full bg-slate-950 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {['ALL', 'Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${orderStatusFilter === st
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400">
                    <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-300">No orders found matching search filters</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-amber-400 text-sm">#{order.orderNumber}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300 font-bold mt-1">
                            {order.customerName} • <span className="text-amber-400">{order.mobile}</span> • {order.city}, {order.state} ({order.pincode})
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Address: {order.address}</p>
                        </div>

                        {/* Status Editor & Payment */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                            {order.paymentMethod} ({order.paymentStatus})
                          </span>

                          <select
                            value={order.orderStatus}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Cancelled') {
                                if (confirm(`Are you sure you want to cancel order #${order.orderNumber}?`)) {
                                  cancelOrder(order.id);
                                  triggerToast(`Cancelled order #${order.orderNumber}`);
                                }
                              } else {
                                updateOrderStatus(order.id, val as any);
                                triggerToast(`Order #${order.orderNumber} updated to ${val}`);
                              }
                            }}
                            className="bg-slate-950 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-500/40 focus:outline-none cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed (Pending)</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-10 h-10 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate">{item.product.name}</p>
                                <p className="text-[10px] text-slate-400">OEM #{item.product.oemNumber} | Brand: {item.product.brand}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold text-white">Qty: {item.quantity}</span>
                              <span className="block text-[11px] text-amber-400 font-mono">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                        <div className="text-slate-400 text-[11px]">
                          Grand Total: <span className="text-base font-black text-white font-mono">₹{order.grandTotal.toLocaleString('en-IN')}</span> (Incl. GST)
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => generateGSTInvoice(order)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" /> Invoice PDF
                          </button>

                          {order.orderStatus !== 'Cancelled' ? (
                            <>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to cancel order #${order.orderNumber}?`)) {
                                    cancelOrder(order.id);
                                    triggerToast(`Cancelled order #${order.orderNumber}`);
                                  }
                                }}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Cancel Order
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Process refund for order #${order.orderNumber}? Amount: ₹${order.grandTotal}`)) {
                                    refundOrder(order.id);
                                    triggerToast(`Refund processed for order #${order.orderNumber}`);
                                  }
                                }}
                                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Refund Order
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold rounded-xl text-[11px]">
                                Cancelled
                              </span>
                              {order.paymentStatus === 'Refunded' ? (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded-xl text-[11px]">
                                  ✓ Refunded (₹{order.grandTotal})
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (confirm(`Process refund for cancelled order #${order.orderNumber}? Amount: ₹${order.grandTotal}`)) {
                                      refundOrder(order.id);
                                      triggerToast(`Refund processed for order #${order.orderNumber}`);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold rounded-xl transition-all cursor-pointer text-xs"
                                >
                                  Process Refund (₹{order.grandTotal})
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: PRODUCTS CATALOG */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">OEM Spare Parts Catalog ({products.length})</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage products, update stock quantities, or upload new direct photos</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportProductsCSV}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Inventory
                  </button>
                  <button
                    onClick={() => {
                      resetProductForm();
                      setIsAddingProduct(!isAddingProduct);
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> {isAddingProduct ? 'Close Form' : 'Add New OEM Part'}
                  </button>
                </div>
              </div>

              {/* PRODUCT ADD / EDIT FORM MODAL / PANEL */}
              {isAddingProduct && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                      <Package className="w-4 h-4" /> {editingProductId ? 'Edit OEM Spare Part' : 'Add New OEM Part to Store'}
                    </h3>
                    <button onClick={resetProductForm} className="text-slate-500 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Part Name</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Rolon Brass Chain & Sprocket Kit"
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">OEM Part Number</label>
                        <input
                          type="text"
                          required
                          value={formOem}
                          onChange={(e) => setFormOem(e.target.value)}
                          placeholder="e.g. RAC00012/A"
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Brand</label>
                        <select
                          value={formBrand}
                          onChange={(e) => setFormBrand(e.target.value)}
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                        >
                          {brands.map((b) => (
                            <option key={b.name} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          required
                          value={formStock}
                          onChange={(e) => setFormStock(e.target.value)}
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Direct Photo Upload or Image URL */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>Product Image</span>
                        <span className="text-[10px] text-amber-400 font-normal">Upload photo directly or paste image URL</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div className="sm:col-span-1 h-24 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
                          {formImage ? (
                            <img src={formImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                          ) : (
                            <span className="text-slate-500 text-xs">No Photo</span>
                          )}
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                          <label className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4 text-amber-400" /> Upload Direct Photo From Device
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      setFormImage(reader.result);
                                      triggerToast('Direct photo uploaded!');
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          <input
                            type="text"
                            required
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-... or uploaded data URL"
                            className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                      >
                        {editingProductId ? 'Update Product' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Product Name / OEM</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Adjust</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 object-contain bg-slate-950 rounded-lg p-1 border border-slate-800 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-amber-400 font-mono">OEM #{p.oemNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-200">{p.brand}</td>
                        <td className="p-3 text-slate-400">{p.category}</td>
                        <td className="p-3 font-bold text-white font-mono">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                updateProductStock(p.id, p.stock - 1);
                                triggerToast(`Reduced stock for ${p.name}`);
                              }}
                              className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${p.stock <= 5 ? 'bg-rose-500/20 text-rose-400' : p.stock <= 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-950 text-white'
                              }`}>
                              {p.stock}
                            </span>
                            <button
                              onClick={() => {
                                updateProductStock(p.id, p.stock + 1);
                                triggerToast(`Increased stock for ${p.name}`);
                              }}
                              className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete part "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                  triggerToast(`Deleted ${p.name}`);
                                }
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
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
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 4: INVENTORY & STOCK ALERTS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">Stock & Inventory Controller</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Automated low-stock detection and quick bulk adjustments</p>
                </div>
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Bulk CSV Import
                </button>
              </div>

              {/* Low Stock Warning Banner */}
              {metrics.lowStockCount > 0 && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-between text-xs text-orange-300">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                    <div>
                      <p className="font-bold">{metrics.lowStockCount} Products Below Threshold (&lt; 10 Units)</p>
                      <p className="text-[11px] opacity-80">Update stock quantities below to avoid stockout delays.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Part Details</th>
                      <th className="p-3">OEM #</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3 font-mono text-amber-400">{p.oemNumber}</td>
                        <td className="p-3 font-mono font-bold text-sm text-white">{p.stock}</td>
                        <td className="p-3">
                          {p.stock === 0 ? (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                              OUT OF STOCK
                            </span>
                          ) : p.stock <= 10 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                              LOW STOCK ({p.stock})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              HEALTHY
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                updateProductStock(p.id, p.stock + 10);
                                triggerToast(`Added +10 units to ${p.name}`);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              +10 Units
                            </button>
                            <button
                              onClick={() => {
                                updateProductStock(p.id, p.stock + 50);
                                triggerToast(`Added +50 units to ${p.name}`);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              +50 Units
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 5: CATEGORIES MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white">Categories Directory</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage store categories and parts organization</p>
              </div>

              {/* Add Category Form */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-xs text-amber-400">Add New Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Category Name (e.g., Exhaust System)"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="Image URL"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!catName) return;
                      addCategory({
                        id: `cat-${Date.now()}`,
                        name: catName,
                        slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        icon: 'Wrench',
                        image: catImage,
                        itemCount: 0,
                        description: 'Genuine OEM components category.'
                      });
                      setCatName('');
                      triggerToast(`Added category "${catName}"`);
                    }}
                    className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-12 h-12 object-cover rounded-xl border border-slate-800" />
                      <div>
                        <h4 className="font-bold text-sm text-white">{c.name}</h4>
                        <span className="text-[10px] text-slate-400">{c.itemCount} Spare Parts</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        deleteCategory(c.id);
                        triggerToast(`Deleted category ${c.name}`);
                      }}
                      className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg cursor-pointer hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 6: BRANDS MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'brands' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white">Brand Partners & Manufacturers</h2>
                <p className="text-xs text-slate-400 mt-0.5">OEM suppliers and verified motorcycle brand logos</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-xs text-amber-400">Add New Brand Partner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={brandNameInput}
                    onChange={(e) => setBrandNameInput(e.target.value)}
                    placeholder="Brand Name (e.g. Brembo)"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={brandOriginInput}
                    onChange={(e) => setBrandOriginInput(e.target.value)}
                    placeholder="Country of Origin (e.g. Italy)"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!brandNameInput) return;
                      addBrand({
                        name: brandNameInput,
                        origin: brandOriginInput,
                        logo: brandLogoInput
                      });
                      setBrandNameInput('');
                      triggerToast(`Added brand ${brandNameInput}`);
                    }}
                    className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Add Brand
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {brands.map((b) => (
                  <div key={b.name} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-white">{b.name}</h4>
                      <p className="text-[10px] text-slate-400">{b.origin}</p>
                    </div>
                    <button
                      onClick={() => {
                        deleteBrand(b.name);
                        triggerToast(`Deleted brand ${b.name}`);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 7: CUSTOMERS DIRECTORY */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white">Customer Accounts & Directory ({customerList.length})</h2>
                <p className="text-xs text-slate-400 mt-0.5">Aggregated customer records from completed and active checkout orders</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Total Orders</th>
                      <th className="p-3 text-right">Lifetime Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {customerList.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-bold text-white">{c.name}</td>
                        <td className="p-3 font-mono text-amber-400">{c.mobile}</td>
                        <td className="p-3 text-slate-300">{c.city}</td>
                        <td className="p-3 font-bold">{c.ordersCount} Order(s)</td>
                        <td className="p-3 text-right font-black text-emerald-400 font-mono">
                          ₹{c.totalSpent.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 8: COUPONS & DISCOUNTS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white">Discounts & Promo Coupons</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage active promotional codes and checkout savings</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-xs text-amber-400">Create New Coupon Code</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="CODE (e.g. RIDE2026)"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none uppercase font-mono"
                  />
                  <input
                    type="number"
                    value={couponDiscountPercent}
                    onChange={(e) => setCouponDiscountPercent(e.target.value)}
                    placeholder="Discount %"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={couponMaxDiscount}
                    onChange={(e) => setCouponMaxDiscount(e.target.value)}
                    placeholder="Max Discount (₹)"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!couponCode) return;
                      addCoupon({
                        code: couponCode.toUpperCase(),
                        discountPercent: Number(couponDiscountPercent) || 10,
                        maxDiscount: Number(couponMaxDiscount) || 200,
                        minOrderValue: Number(couponMinOrder) || 500,
                        expiryDate: '2026-12-31',
                        description: `${couponDiscountPercent}% discount on OEM parts`,
                        active: true
                      });
                      setCouponCode('');
                      triggerToast(`Created coupon ${couponCode}`);
                    }}
                    className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Create Coupon
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coupons.map((cp) => (
                  <div key={cp.code} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-base text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {cp.code}
                      </span>
                      <button
                        onClick={() => toggleCouponStatus(cp.code)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${cp.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                      >
                        {cp.active ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 font-bold">{cp.discountPercent}% Off (Up to ₹{cp.maxDiscount})</p>
                    <p className="text-[11px] text-slate-400">Min Order: ₹{cp.minOrderValue}</p>
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => {
                          deleteCoupon(cp.code);
                          triggerToast(`Deleted coupon ${cp.code}`);
                        }}
                        className="text-xs text-rose-400 hover:underline cursor-pointer"
                      >
                        Delete Coupon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 9: REPORTS & TAX */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">Financial & Sales Tax Reports</h2>
                  <p className="text-xs text-slate-400 mt-0.5">GST breakdown, daily/monthly turnover metrics, and CSV downloads</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Download Full CSV Report
                  </button>
                </div>
              </div>

              {/* Reports Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Turnover</span>
                  <h3 className="text-2xl font-black text-white mt-1">₹{metrics.totalRev.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Includes all completed orders</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total GST Collected (18%)</span>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">
                    ₹{Math.round(metrics.totalRev * 0.18).toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">GSTIN: {storeSettings.gstin}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Average Order Value (AOV)</span>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">
                    ₹{metrics.totalOrdersCount > 0 ? Math.round(metrics.totalRev / metrics.totalOrdersCount).toLocaleString('en-IN') : 0}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Across {metrics.totalOrdersCount} orders</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 10: STORE BANNERS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'banners' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white">Storefront Hero Banners</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage promotional banners on the customer homepage</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-xs text-amber-400">Add New Hero Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="Banner Title"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    placeholder="Subtitle Offer"
                    className="bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="Banner Image URL"
                    className="sm:col-span-2 bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!bannerTitle) return;
                    addBanner({
                      id: `ban-${Date.now()}`,
                      title: bannerTitle,
                      subtitle: bannerSubtitle,
                      imageUrl: bannerImageUrl,
                      tag: bannerTag,
                      active: true
                    });
                    setBannerTitle('');
                    setBannerSubtitle('');
                    triggerToast(`Added banner "${bannerTitle}"`);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Save Banner
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {banners.map((b) => (
                  <div key={b.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-2 p-3">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-32 object-cover rounded-xl border border-slate-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-white">{b.title}</h4>
                        <p className="text-[11px] text-slate-400">{b.subtitle}</p>
                      </div>
                      <button
                        onClick={() => toggleBannerStatus(b.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${b.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}
                      >
                        {b.active ? 'VISIBLE' : 'HIDDEN'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 11: STORE SETTINGS & SECURITY */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white">Store & System Settings</h2>
                <p className="text-xs text-slate-400 mt-0.5">Store credentials, GSTIN, payment gateways, and admin password</p>
              </div>

              {/* MongoDB Connection & Diagnostics Status Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" /> MongoDB Atlas Database Diagnostics
                  </h3>
                  <button
                    onClick={checkDatabaseStatus}
                    disabled={checkingDb}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${checkingDb ? 'animate-spin' : ''}`} />
                    <span>Test Connection</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${dbStatus?.connected
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {dbStatus?.connected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-extrabold text-sm">
                        {dbStatus?.connected ? 'MongoDB Atlas Connected' : 'In-Memory / Local Mode Active'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {dbStatus?.message || 'Checking database status...'}
                    </p>
                    <div className="mt-3 text-[11px] font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 text-slate-400">
                      Database: <span className="text-amber-400 font-bold">{dbStatus?.database || 'msbullethub'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Managed Collections & Schemas
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> products</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> orders</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> categories</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> brands</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> coupons</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> garages</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> enquiries</div>
                      <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> banners</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Details Settings Form */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Building className="w-4 h-4 text-amber-400" /> General Store Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Store Name</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                      className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">GSTIN Tax Number</label>
                    <input
                      type="text"
                      value={storeSettings.gstin}
                      onChange={(e) => updateStoreSettings({ gstin: e.target.value })}
                      className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Support Phone</label>
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={(e) => updateStoreSettings({ phone: e.target.value })}
                      className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Support Email</label>
                    <input
                      type="text"
                      value={storeSettings.email}
                      onChange={(e) => updateStoreSettings({ email: e.target.value })}
                      className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Change Password Form */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                  <KeyRound className="w-4 h-4 text-amber-400" /> Change Master Admin Password
                </h3>

                <form onSubmit={handlePasswordChangeSubmit} className="space-y-3 max-w-md">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">New Master Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password..."
                      className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password..."
                      className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {passwordMessage && (
                    <p className={`text-xs p-2.5 rounded-xl border font-bold ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                      {passwordMessage.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* BULK CSV IMPORT MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Bulk Product Import
              </h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select or upload a CSV file with columns: <code className="text-amber-400">Name, OEM, Brand, Price, Stock</code>.
            </p>

            <button
              onClick={handleDemoBulkImport}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Import 2 Sample OEM Parts Immediately
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
