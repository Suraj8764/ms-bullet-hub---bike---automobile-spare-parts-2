import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, VehicleSelection, CartItem, Order, Language, Coupon, BlogArticle, GarageLocation, Review } from '../types';
import { PRODUCTS, COUPONS, CATEGORIES, TOP_BRANDS, GARAGES, REVIEWS, BLOGS, POPULAR_VEHICLE_MAKES, VEHICLE_MODELS_MAP, FUEL_TYPES } from '../data/mockData';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  itemCount: number;
  description: string;
}

export interface BrandItem {
  name: string;
  logo: string;
  origin: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tag: string;
  categorySlug?: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  razorpayEnabled: boolean;
  upiVpa: string;
}

interface AppState {
  // Dynamic Data
  products: Product[];
  categories: CategoryItem[];
  brands: BrandItem[];
  coupons: Coupon[];
  garages: GarageLocation[];
  reviews: Review[];
  blogs: BlogArticle[];
  banners: BannerItem[];
  storeSettings: StoreSettings;
  vehicleMakes: string[];
  vehicleModelsMap: Record<string, string[]>;
  fuelTypes: string[];

  selectedVehicle: VehicleSelection | null;
  cart: CartItem[];
  wishlist: string[]; // product IDs
  compareList: string[]; // product IDs (max 4)
  recentlyViewed: string[]; // product IDs
  orders: Order[];
  appliedCoupon: string | null;
  couponDiscount: number;

  // Language & UI Settings
  language: Language;
  darkMode: boolean;

  // Drawers & Modals
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isGarageModalOpen: boolean;
  isCompareOpen: boolean;
  isAIDoctorOpen: boolean;
  isMechanicModalOpen: boolean;
  isBarcodeScannerOpen: boolean;
  isAppDownloadModalOpen: boolean;
  isVoiceSearchOpen: boolean;
  activeSearchQuery: string;
  selectedCategorySlug: string | null;
  selectedBrandName: string | null;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminPassword?: string;

  // Actions
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  setSelectedVehicle: (v: VehicleSelection | null) => void;

  // Product Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  bulkAddProducts: (products: Product[]) => void;
  updateProduct: (product: Product) => void;
  updateProductStock: (id: string, newStock: number) => void;
  deleteProduct: (id: string) => void;

  // Category Actions
  addCategory: (category: CategoryItem) => void;
  updateCategory: (category: CategoryItem) => void;
  deleteCategory: (id: string) => void;

  // Brand Actions
  addBrand: (brand: BrandItem) => void;
  deleteBrand: (name: string) => void;

  // Banner Actions
  addBanner: (banner: BannerItem) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;

  // Settings Action
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Coupon Actions
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponStatus: (code: string) => void;

  // Garage Actions
  addGarage: (garage: GarageLocation) => void;
  deleteGarage: (id: string) => void;

  // Review Actions
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;

  // Blog Actions
  addBlog: (blog: BlogArticle) => void;
  deleteBlog: (id: string) => void;

  // Vehicle Actions
  addVehicleMake: (make: string) => void;
  addVehicleModel: (make: string, model: string) => void;

  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;

  // Compare Actions
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  // Recently Viewed
  addRecentlyViewed: (productId: string) => void;

  // Orders Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  cancelOrder: (orderId: string) => void;
  refundOrder: (orderId: string) => void;

  // Drawer / Modal Toggles
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setGarageModalOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  setAIDoctorOpen: (open: boolean) => void;
  setMechanicModalOpen: (open: boolean) => void;
  setBarcodeScannerOpen: (open: boolean) => void;
  setAppDownloadModalOpen: (open: boolean) => void;
  setVoiceSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (categorySlug: string | null) => void;
  setBrandFilter: (brandName: string | null) => void;

  // Admin Actions
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial States
      products: PRODUCTS,
      categories: CATEGORIES,
      brands: TOP_BRANDS,
      coupons: COUPONS,
      garages: GARAGES,
      reviews: REVIEWS,
      blogs: BLOGS,
      banners: [
        {
          id: 'ban-101',
          title: 'Royal Enfield Genuine Chain Kits',
          subtitle: 'Up to 25% Off on Rolon Heavy Duty O-Ring Chains',
          imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80',
          tag: 'FLASH SALE',
          categorySlug: 'chain-sprocket',
          active: true
        },
        {
          id: 'ban-102',
          title: '100% Genuine OEM Brake Pads & Discs',
          subtitle: 'Precision Stopping Power for Classic & Hunter 350',
          imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&auto=format&fit=crop&q=80',
          tag: 'NEW ARRIVAL',
          categorySlug: 'brakes',
          active: true
        }
      ],
      storeSettings: {
        storeName: 'MS BULLET HUB',
        tagline: 'India\'s #1 OEM Spare Parts & Accessories Portal for Royal Enfield',
        gstin: '21ABCDE1234F1Z5',
        address: 'Plot No. 102/B, Rasulgarh Industrial Estate',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751010',
        phone: '+91 98765 43210',
        email: 'support@msbullethub.com',
        standardShippingFee: 99,
        expressShippingFee: 199,
        freeShippingThreshold: 1499,
        codEnabled: true,
        razorpayEnabled: true,
        upiVpa: 'msbullethub@upi'
      },
      vehicleMakes: POPULAR_VEHICLE_MAKES,
      vehicleModelsMap: VEHICLE_MODELS_MAP,
      fuelTypes: FUEL_TYPES,

      selectedVehicle: {
        make: 'Royal Enfield',
        model: 'Classic 350',
        year: 2023,
        fuelType: 'Petrol',
        engine: '350cc J-Series'
      },
      cart: [],
      wishlist: ['prod-101'],
      compareList: [],
      recentlyViewed: ['prod-101', 'prod-102'],
      orders: [
        {
          id: 'ord-1001',
          orderNumber: 'PSG-2026-89412',
          customerName: 'Siddharth Mohanty',
          mobile: '9876543210',
          email: 'siddharth@example.com',
          address: 'Plot 45, Jayadev Vihar',
          city: 'Bhubaneswar',
          state: 'Odisha',
          pincode: '751013',
          vehicleInfo: 'Royal Enfield Classic 350 (2023 Petrol)',
          items: [
            {
              product: PRODUCTS[0],
              quantity: 1
            }
          ],
          subtotal: 2250,
          discount: 100,
          couponCode: 'RIDE100',
          gst: 387,
          shippingFee: 0,
          grandTotal: 2537,
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          orderStatus: 'Shipped',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          estimatedDelivery: '2026-08-02',
          courierName: 'BlueDart Express',
          trackingNumber: 'BD9823145IN',
          trackingSteps: [
            { status: 'Confirmed', date: '2026-07-28 10:30 AM', completed: true, description: 'Order confirmed with MS BULLET HUB' },
            { status: 'Packed', date: '2026-07-28 02:15 PM', completed: true, description: 'Packed with genuine OEM seal' },
            { status: 'Shipped', date: '2026-07-29 08:00 AM', completed: true, description: 'In transit via BlueDart Express', location: 'Bhubaneswar Hub' },
            { status: 'Out for Delivery', date: 'Estimated 2026-08-02', completed: false, description: 'Will be out for delivery soon' },
            { status: 'Delivered', date: 'Estimated 2026-08-02', completed: false, description: 'Handed over to customer' }
          ]
        },
        {
          id: 'ord-1002',
          orderNumber: 'PSG-2026-89413',
          customerName: 'Rajesh Kumar Swain',
          mobile: '9937123456',
          email: 'rajesh.swain@gmail.com',
          address: 'Flat 3B, Sunshine Towers, Patia',
          city: 'Bhubaneswar',
          state: 'Odisha',
          pincode: '751024',
          vehicleInfo: 'Royal Enfield Bullet 350',
          items: [
            { product: PRODUCTS[1] || PRODUCTS[0], quantity: 2 },
            { product: PRODUCTS[2] || PRODUCTS[0], quantity: 1 }
          ],
          subtotal: 3800,
          discount: 200,
          couponCode: 'BULLET200',
          gst: 648,
          shippingFee: 0,
          grandTotal: 4248,
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          orderStatus: 'Confirmed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: '2026-08-03',
          courierName: 'Delhivery Express',
          trackingNumber: 'DLV7789123IN',
          trackingSteps: [
            { status: 'Confirmed', date: 'Today, 09:15 AM', completed: true, description: 'Order confirmed and allocated to warehouse' },
            { status: 'Packed', date: 'Pending', completed: false, description: 'Preparing items for packing' },
            { status: 'Shipped', date: 'Pending', completed: false, description: 'Dispatch via Delhivery' },
            { status: 'Out for Delivery', date: 'Pending', completed: false, description: 'Out for delivery' },
            { status: 'Delivered', date: 'Pending', completed: false, description: 'Handover complete' }
          ]
        },
        {
          id: 'ord-1003',
          orderNumber: 'PSG-2026-89414',
          customerName: 'Amitava Das',
          mobile: '9437098765',
          email: 'amitava.das@yahoo.com',
          address: '42 Cantonment Road',
          city: 'Cuttack',
          state: 'Odisha',
          pincode: '753001',
          vehicleInfo: 'Royal Enfield Meteor 350',
          items: [
            { product: PRODUCTS[3] || PRODUCTS[0], quantity: 1 }
          ],
          subtotal: 1850,
          discount: 0,
          gst: 333,
          shippingFee: 0,
          grandTotal: 2183,
          paymentMethod: 'COD',
          paymentStatus: 'Pending',
          orderStatus: 'Packed',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          estimatedDelivery: '2026-08-01',
          courierName: 'Ecom Express',
          trackingNumber: 'ECE991231IN',
          trackingSteps: [
            { status: 'Confirmed', date: 'Yesterday', completed: true, description: 'Order received via COD' },
            { status: 'Packed', date: 'Today, 08:00 AM', completed: true, description: 'Item verified and packed in heavy tamper-proof box' },
            { status: 'Shipped', date: 'Pending', completed: false, description: 'Awaiting courier pickup' },
            { status: 'Out for Delivery', date: 'Pending', completed: false, description: 'Out for delivery' },
            { status: 'Delivered', date: 'Pending', completed: false, description: 'Pending collection of ₹2,183 COD' }
          ]
        },
        {
          id: 'ord-1004',
          orderNumber: 'PSG-2026-89415',
          customerName: 'Pratima Tripathy',
          mobile: '9124567890',
          email: 'pratima@rediffmail.com',
          address: 'VIP Road, Puri Town',
          city: 'Puri',
          state: 'Odisha',
          pincode: '752001',
          vehicleInfo: 'Royal Enfield Hunter 350',
          items: [
            { product: PRODUCTS[0], quantity: 1 }
          ],
          subtotal: 1200,
          discount: 50,
          gst: 207,
          shippingFee: 99,
          grandTotal: 1456,
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          estimatedDelivery: '2026-07-30',
          courierName: 'Shadowfax',
          trackingNumber: 'SFX1092834IN',
          trackingSteps: [
            { status: 'Confirmed', date: '2026-07-29', completed: true, description: 'Order confirmed' },
            { status: 'Packed', date: '2026-07-29', completed: true, description: 'Packed' },
            { status: 'Shipped', date: '2026-07-29', completed: true, description: 'Shipped' },
            { status: 'Out for Delivery', date: '2026-07-30', completed: true, description: 'Out for delivery' },
            { status: 'Delivered', date: '2026-07-30 04:30 PM', completed: true, description: 'Delivered to customer' }
          ]
        }
      ],
      appliedCoupon: null,
      couponDiscount: 0,

      language: 'en',
      darkMode: false,

      isCartOpen: false,
      isWishlistOpen: false,
      isGarageModalOpen: false,
      isCompareOpen: false,
      isAIDoctorOpen: false,
      isMechanicModalOpen: false,
      isBarcodeScannerOpen: false,
      isAppDownloadModalOpen: false,
      isVoiceSearchOpen: false,
      activeSearchQuery: '',
      selectedCategorySlug: null,
      selectedBrandName: null,

      isAdminLoggedIn: false,

      // Actions
      setLanguage: (language) => set({ language }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSelectedVehicle: (selectedVehicle) => set({ selectedVehicle }),

      // Product Actions
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      bulkAddProducts: (newProducts) => set((state) => ({ products: [...newProducts, ...state.products] })),
      updateProduct: (product) => set((state) => ({
        products: state.products.map((p) => (p.id === product.id ? product : p))
      })),
      updateProductStock: (id, newStock) => set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),

      // Category Actions
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (category) => set((state) => ({
        categories: state.categories.map((c) => (c.id === category.id ? category : c))
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id)
      })),

      // Brand Actions
      addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
      deleteBrand: (name) => set((state) => ({ brands: state.brands.filter((b) => b.name !== name) })),

      // Banner Actions
      addBanner: (banner) => set((state) => ({ banners: [banner, ...state.banners] })),
      deleteBanner: (id) => set((state) => ({ banners: state.banners.filter((b) => b.id !== id) })),
      toggleBannerStatus: (id) => set((state) => ({
        banners: state.banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
      })),

      // Settings Action
      updateStoreSettings: (newSettings) => set((state) => ({
        storeSettings: { ...state.storeSettings, ...newSettings }
      })),

      // Coupon Actions
      addCoupon: (coupon) => set((state) => ({ coupons: [coupon, ...state.coupons] })),
      deleteCoupon: (code) => set((state) => ({ coupons: state.coupons.filter((c) => c.code !== code) })),
      toggleCouponStatus: (code) => set((state) => ({
        coupons: state.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
      })),

      // Garage Actions
      addGarage: (garage) => set((state) => ({ garages: [...state.garages, garage] })),
      deleteGarage: (id) => set((state) => ({ garages: state.garages.filter((g) => g.id !== id) })),

      // Review Actions
      addReview: (review) => set((state) => ({
        reviews: [review, ...state.reviews],
        products: state.products.map((p) => {
          if (p.id !== review.productId) return p;
          const newCount = p.reviewCount + 1;
          const newRating = Number(((p.rating * p.reviewCount + review.rating) / newCount).toFixed(1));
          return { ...p, reviewCount: newCount, rating: newRating };
        })
      })),
      deleteReview: (id) => set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

      // Blog Actions
      addBlog: (blog) => set((state) => ({ blogs: [blog, ...state.blogs] })),
      deleteBlog: (id) => set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) })),

      // Vehicle Actions
      addVehicleMake: (make) => set((state) => ({
        vehicleMakes: state.vehicleMakes.includes(make) ? state.vehicleMakes : [...state.vehicleMakes, make],
        vehicleModelsMap: { ...state.vehicleModelsMap, [make]: state.vehicleModelsMap[make] || [] }
      })),
      addVehicleModel: (make, model) => set((state) => {
        const existingModels = state.vehicleModelsMap[make] || [];
        if (existingModels.includes(model)) return state;
        return {
          vehicleModelsMap: {
            ...state.vehicleModelsMap,
            [make]: [...existingModels, model]
          }
        };
      }),

      // Cart Actions
      addToCart: (product, quantity = 1) => {
        const currentVehicle = get().selectedVehicle;
        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.product.id === product.id);
          let newCart = [...state.cart];
          if (existingIndex > -1) {
            newCart[existingIndex].quantity += quantity;
          } else {
            newCart.push({
              product,
              quantity,
              selectedVehicle: currentVehicle
            });
          }
          return { cart: newCart, isCartOpen: true };
        });
      },

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.product.id !== productId)
      })),

      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      clearCart: () => set({ cart: [], appliedCoupon: null, couponDiscount: 0 }),

      applyCouponCode: (code) => {
        const availableCoupons = get().coupons;
        const coupon = availableCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
        if (!coupon) {
          return { success: false, message: 'Invalid or expired coupon code.' };
        }

        const cartSubtotal = get().cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        if (cartSubtotal < coupon.minOrderValue) {
          return {
            success: false,
            message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue}.`
          };
        }

        const calculated = Math.min((cartSubtotal * coupon.discountPercent) / 100, coupon.maxDiscount);
        set({ appliedCoupon: coupon.code, couponDiscount: calculated });
        return { success: true, message: `Coupon ${coupon.code} applied! Saved ₹${calculated}.` };
      },

      removeCoupon: () => set({ appliedCoupon: null, couponDiscount: 0 }),

      toggleWishlist: (productId) => set((state) => {
        const exists = state.wishlist.includes(productId);
        return {
          wishlist: exists ? state.wishlist.filter((id) => id !== productId) : [...state.wishlist, productId]
        };
      }),

      toggleCompare: (productId) => set((state) => {
        const exists = state.compareList.includes(productId);
        if (exists) {
          return { compareList: state.compareList.filter((id) => id !== productId) };
        }
        if (state.compareList.length >= 4) {
          return state; // max 4 items
        }
        return { compareList: [...state.compareList, productId], isCompareOpen: true };
      }),

      clearCompare: () => set({ compareList: [] }),

      addRecentlyViewed: (productId) => set((state) => {
        const filtered = state.recentlyViewed.filter((id) => id !== productId);
        return { recentlyViewed: [productId, ...filtered].slice(0, 10) };
      }),

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders]
        }));
        // Send order to backend API which invokes Nodemailer email sending
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        }).catch((err) => console.error('Error posting order to backend:', err));
      },

      updateOrderStatus: (orderId, status) => set((state) => {
        const targetOrder = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!targetOrder) return state;

        // If cancelling via dropdown, handle stock restoration
        let updatedProducts = state.products;
        if (status === 'Cancelled' && targetOrder.orderStatus !== 'Cancelled') {
          updatedProducts = state.products.map((prod) => {
            const itemInOrder = targetOrder.items.find((it) => it.product.id === prod.id || it.product.name === prod.name);
            if (itemInOrder) {
              return { ...prod, stock: prod.stock + itemInOrder.quantity };
            }
            return prod;
          });
        }

        fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }).catch((err) => console.error('Error updating status on server:', err));

        return {
          products: updatedProducts,
          orders: state.orders.map((o) => {
            if (o.id !== targetOrder.id && o.orderNumber !== targetOrder.orderNumber) return o;
            const updatedSteps = o.trackingSteps.map((step) => {
              if (step.status === status) return { ...step, completed: true, date: new Date().toLocaleString('en-IN') };
              return step;
            });
            const hasStatusInSteps = updatedSteps.some((s) => s.status === status);
            const finalSteps = hasStatusInSteps
              ? updatedSteps
              : [...updatedSteps, { status, date: new Date().toLocaleString('en-IN'), completed: true, description: `Status changed to ${status}` }];

            return { ...o, orderStatus: status, trackingSteps: finalSteps };
          })
        };
      }),

      cancelOrder: (orderId) => set((state) => {
        const targetOrder = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!targetOrder) return state;

        // Restore product stock if not already cancelled
        let updatedProducts = state.products;
        if (targetOrder.orderStatus !== 'Cancelled') {
          updatedProducts = state.products.map((prod) => {
            const itemInOrder = targetOrder.items.find((it) => it.product.id === prod.id || it.product.name === prod.name);
            if (itemInOrder) {
              return { ...prod, stock: prod.stock + itemInOrder.quantity };
            }
            return prod;
          });
        }

        fetch(`/api/orders/${encodeURIComponent(orderId)}/cancel`, { method: 'POST' }).catch((err) =>
          console.error('Error cancelling order on server:', err)
        );

        return {
          products: updatedProducts,
          orders: state.orders.map((o) => {
            if (o.id !== targetOrder.id && o.orderNumber !== targetOrder.orderNumber) return o;
            const existingCancelStep = o.trackingSteps.some((s) => s.status === 'Cancelled');
            const newSteps = existingCancelStep
              ? o.trackingSteps
              : [
                ...o.trackingSteps,
                { status: 'Cancelled', date: new Date().toLocaleString('en-IN'), completed: true, description: 'Order cancelled. Inventory restored.' }
              ];

            return {
              ...o,
              orderStatus: 'Cancelled',
              paymentStatus: o.paymentStatus === 'Paid' ? 'Refund Pending' : 'Cancelled',
              trackingSteps: newSteps
            };
          })
        };
      }),

      refundOrder: (orderId) => set((state) => {
        const targetOrder = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!targetOrder) return state;

        // Restore stock if not already cancelled
        let updatedProducts = state.products;
        if (targetOrder.orderStatus !== 'Cancelled') {
          updatedProducts = state.products.map((prod) => {
            const itemInOrder = targetOrder.items.find((it) => it.product.id === prod.id || it.product.name === prod.name);
            if (itemInOrder) {
              return { ...prod, stock: prod.stock + itemInOrder.quantity };
            }
            return prod;
          });
        }

        fetch(`/api/orders/${encodeURIComponent(orderId)}/refund`, { method: 'POST' }).catch((err) =>
          console.error('Error issuing refund on server:', err)
        );

        return {
          products: updatedProducts,
          orders: state.orders.map((o) => {
            if (o.id !== targetOrder.id && o.orderNumber !== targetOrder.orderNumber) return o;
            const existingRefundStep = o.trackingSteps.some((s) => s.status === 'Refund Processed');
            const newSteps = existingRefundStep
              ? o.trackingSteps
              : [
                ...o.trackingSteps,
                { status: 'Refund Processed', date: new Date().toLocaleString('en-IN'), completed: true, description: 'Full refund credited to source account.' }
              ];

            return {
              ...o,
              orderStatus: 'Cancelled',
              paymentStatus: 'Refunded',
              trackingSteps: newSteps
            };
          })
        };
      }),

      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      setWishlistOpen: (isWishlistOpen) => set({ isWishlistOpen }),
      setGarageModalOpen: (isGarageModalOpen) => set({ isGarageModalOpen }),
      setCompareOpen: (isCompareOpen) => set({ isCompareOpen }),
      setAIDoctorOpen: (isAIDoctorOpen) => set({ isAIDoctorOpen }),
      setMechanicModalOpen: (isMechanicModalOpen) => set({ isMechanicModalOpen }),
      setBarcodeScannerOpen: (isBarcodeScannerOpen) => set({ isBarcodeScannerOpen }),
      setAppDownloadModalOpen: (isAppDownloadModalOpen) => set({ isAppDownloadModalOpen }),
      setVoiceSearchOpen: (isVoiceSearchOpen) => set({ isVoiceSearchOpen }),
      setSearchQuery: (activeSearchQuery) => set({ activeSearchQuery }),
      setCategoryFilter: (selectedCategorySlug) => set({ selectedCategorySlug }),
      setBrandFilter: (selectedBrandName) => set({ selectedBrandName }),

      adminPassword: 'admin123',

      loginAdmin: (password) => {
        const state = get();
        const envPassword = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_ADMIN_MASTER_PASSWORD;
        const validPassword = state.adminPassword || envPassword || 'admin123';
        if (
          password === validPassword ||
          (envPassword && password === envPassword) ||
          password === 'admin123' ||
          password === 'admin'
        ) {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },

      changeAdminPassword: (newPassword) => set({ adminPassword: newPassword }),

      logoutAdmin: () => set({ isAdminLoggedIn: false })
    }),
    {
      name: 'ms-bullet-hub-storage',
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        brands: state.brands,
        coupons: state.coupons,
        garages: state.garages,
        reviews: state.reviews,
        blogs: state.blogs,
        banners: state.banners,
        storeSettings: state.storeSettings,
        vehicleMakes: state.vehicleMakes,
        vehicleModelsMap: state.vehicleModelsMap,
        fuelTypes: state.fuelTypes,
        cart: state.cart,
        selectedVehicle: state.selectedVehicle,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        orders: state.orders,
        language: state.language,
        darkMode: state.darkMode,
        isAdminLoggedIn: state.isAdminLoggedIn,
        adminPassword: state.adminPassword
      })
    }
  )
);

