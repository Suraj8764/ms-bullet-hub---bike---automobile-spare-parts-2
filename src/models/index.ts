import mongoose, { Schema, Document, Model } from 'mongoose';

// ==========================================
// 1. VEHICLE COMPATIBILITY & SPECIFICATION SCHEMAS
// ==========================================

export interface IVehicleCompatibility {
  make: string;
  model: string;
  years: number[];
  fuelType?: string;
  engine?: string;
}

const VehicleCompatibilitySchema = new Schema<IVehicleCompatibility>(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    years: { type: [Number], required: true },
    fuelType: { type: String, default: 'Petrol' },
    engine: { type: String }
  },
  { _id: false }
);

export interface ISpecification {
  label: string;
  value: string;
}

const SpecificationSchema = new Schema<ISpecification>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

// ==========================================
// 2. PRODUCT SCHEMA & MODEL
// ==========================================

export interface IProduct extends Document {
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
  specifications: ISpecification[];
  compatibleVehicles: IVehicleCompatibility[];
  images: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTodayDeal?: boolean;
  isTrending?: boolean;
  warranty: string;
  deliveryDays: number;
  hsnCode: string;
  gstRate: number;
  weightKg?: number;
  dimensionsCm?: string;
  countryOfOrigin?: string;
  inBoxContents?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    oemNumber: { type: String, required: true, index: true },
    partNumber: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    brandLogo: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    specifications: [SpecificationSchema],
    compatibleVehicles: [VehicleCompatibilitySchema],
    images: { type: [String], default: [] },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isTodayDeal: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    warranty: { type: String, default: '12 Months' },
    deliveryDays: { type: Number, default: 2 },
    hsnCode: { type: String, required: true },
    gstRate: { type: Number, default: 18 },
    weightKg: { type: Number },
    dimensionsCm: { type: String },
    countryOfOrigin: { type: String, default: 'India' },
    inBoxContents: { type: String }
  },
  {
    timestamps: true
  }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema, 'products');

// ==========================================
// 3. CUSTOMER SCHEMA & MODEL
// ==========================================

export interface ICustomer extends Document {
  customerId: string;
  fullName: string;
  mobile: string;
  email?: string;
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
  garageVehicles: Array<{
    make: string;
    model: string;
    year: number;
    fuelType: string;
    engine?: string;
    registrationNumber?: string;
  }>;
  totalOrdersCount: number;
  totalSpent: number;
  isActive: boolean;
}

const AddressSchema = new Schema(
  {
    id: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const GarageVehicleSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    fuelType: { type: String, default: 'Petrol' },
    engine: { type: String },
    registrationNumber: { type: String }
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    addresses: [AddressSchema],
    garageVehicles: [GarageVehicleSchema],
    totalOrdersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export const CustomerModel: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema, 'customers');

// ==========================================
// 4. ORDER SCHEMA & MODEL
// ==========================================

export interface IOrderItem {
  productId: string;
  productName: string;
  sku: string;
  oemNumber: string;
  price: number;
  quantity: number;
  subtotal: number;
  vehicleSelected?: string;
  image?: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    oemNumber: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    vehicleSelected: { type: String },
    image: { type: String }
  },
  { _id: false }
);

export interface IOrderTrackingStep {
  status: string;
  date: string;
  completed: boolean;
  description: string;
  location?: string;
}

const OrderTrackingStepSchema = new Schema<IOrderTrackingStep>(
  {
    status: { type: String, required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
    description: { type: String, required: true },
    location: { type: String }
  },
  { _id: false }
);

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  vehicleInfo?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  gst: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: 'Razorpay' | 'UPI' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  estimatedDelivery: string;
  courierName?: string;
  trackingNumber?: string;
  trackingSteps: IOrderTrackingStep[];
}

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, index: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true, index: true },
    email: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    vehicleInfo: { type: String },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    gst: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'UPI', 'COD'],
      required: true,
      default: 'UPI'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Confirmed'
    },
    estimatedDelivery: { type: String, required: true },
    courierName: { type: String, default: 'Delhivery Express' },
    trackingNumber: { type: String },
    trackingSteps: [OrderTrackingStepSchema]
  },
  {
    timestamps: true
  }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema, 'orders');
