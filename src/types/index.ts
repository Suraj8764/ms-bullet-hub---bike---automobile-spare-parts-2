export type Language = 'en' | 'hi' | 'or';

export interface VehicleCompatibility {
  make: string;      // e.g. "Royal Enfield", "Hero", "Honda", "TVS", "Bajaj", "Yamaha"
  model: string;     // e.g. "Classic 350", "Activa 6G", "Splendor Plus", "Pulsar 150", "R15 V4"
  years: number[];   // e.g. [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
  fuelType?: string; // "Petrol", "Electric"
  engine?: string;   // "350cc J-Series", "125cc eSP", "150cc DTS-i"
}

export interface Specification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  likes?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  oemNumber: string;
  partNumber: string;
  category: string;
  categorySlug: string;
  brand: string;
  brandLogo?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  specifications: Specification[];
  compatibleVehicles: VehicleCompatibility[];
  images: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTodayDeal?: boolean;
  isTrending?: boolean;
  warranty: string;
  deliveryDays: number;
  hsnCode: string;
  gstRate: number; // e.g. 18 for 18%
  weightKg?: number;
  dimensionsCm?: string;
  countryOfOrigin?: string;
  inBoxContents?: string;
}

export interface VehicleSelection {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  engine: string;
  vin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVehicle?: VehicleSelection | null;
}

export type OrderStatus = 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refund Processed';

export interface OrderTrackingStep {
  status: string;
  date: string;
  completed: boolean;
  description?: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. PSG-2026-89412
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  vehicleInfo?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  gst: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: 'Razorpay' | 'UPI' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Refund Pending' | 'Cancelled';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  courierName?: string;
  trackingNumber?: string;
  trackingSteps: OrderTrackingStep[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  expiryDate: string;
  description: string;
  active: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

export interface GarageLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  image: string;
  services: string[];
}
