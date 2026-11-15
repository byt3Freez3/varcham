export type BadgeType = 'bestseller' | 'new' | 'festival-essential' | 'low-stock';

export type BrandName = 'Varcham' | 'Herbaa';

export type MaterialType =
  | 'brass'
  | 'marble'
  | 'clay'
  | 'ceramic'
  | 'sandalwood'
  | 'stone'
  | 'botanical'
  | 'fabric'
  | 'wood';

export interface ProductVariant {
  label: string;
  price: number; // INR integer
  compareAtPrice?: number;
  sku: string;
  stock: number;
  weightGrams?: number;
  isFragile?: boolean;
}

export interface FragranceNotes {
  family: 'Floral' | 'Woody' | 'Fresh' | 'Musky';
  top: string;
  heart: string;
  base: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  collection: string; // collection slug
  collectionName: string;
  subcategory: string;
  brand: BrandName;
  price: number; // default INR
  compareAtPrice?: number;
  variants: ProductVariant[];
  images: string[];
  badges: BadgeType[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  festivals: string[]; // festival slugs
  ritualUse: string;
  material: string;
  materialTags: MaterialType[];
  dimensionsOrWeight: string;
  careInstructions: string;
  description: string;
  fragranceNotes?: FragranceNotes;
  hsnCode?: string;
  gstRate?: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  headline: string;
  description: string;
  seoCopy: string;
  image: string;
  itemCount: number;
  subcategories: string[];
}

export interface FestivalKitItem {
  productId: string;
  variantSku?: string;
  qty: number;
  isOptional?: boolean;
  note?: string;
}

export interface Festival {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  date: string | null; // ISO date string or null for any-day pujas
  dateLabel: string;
  isPlaceholderDate?: boolean;
  shortStory: string;
  howToSteps: string[];
  heroImage: string;
  kitDiscountPercent: number;
  kitItems: FestivalKitItem[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  customerName: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  topic: string;
  readTime: string;
  date: string;
  excerpt: string;
  image: string;
  content: string[];
  relatedProductSlugs: string[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  nameHi: string;
  variantLabel: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  qty: number;
  maxStock: number;
}

export type FulfilmentType = 'pickup' | 'kolkata_same_day' | 'courier';

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for delivery'
  | 'Delivered'
  | 'Ready for pickup'
  | 'Picked up'
  | 'Cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  pincode: string;
  addressSummary: string;
  fulfilment: FulfilmentType;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  status: OrderStatus;
  items: {
    name: string;
    variantLabel: string;
    qty: number;
    unitPrice: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  giftWrapFee: number;
  total: number;
  giftMessage?: string;
  estimatedDelivery: string;
  awbCode?: string;
  timeline: OrderTimelineEvent[];
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface BulkEnquiry {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  quantity: number;
  budgetPerUnit: number;
  neededBy: string;
  gstin?: string;
  message: string;
  status: 'new' | 'quoted' | 'won' | 'lost';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
  createdAt: string;
}


