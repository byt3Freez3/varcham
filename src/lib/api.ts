import { ARTICLES } from '@/data/articles';
import { COLLECTIONS } from '@/data/collections';
import { FESTIVALS } from '@/data/festivals';
import { PRODUCTS } from '@/data/products';
import { REVIEWS } from '@/data/reviews';
import { COUPONS, MOCK_BULK_ENQUIRIES, MOCK_ORDERS, STORE_INFO } from '@/data/store';
import {
  Article,
  BrandName,
  BulkEnquiry,
  Collection,
  ContactMessage,
  Festival,
  MaterialType,
  OrderRecord,
  Product,
  Review,
} from '@/types';

export interface ProductFilterOptions {
  collection?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: MaterialType[];
  festival?: string;
  brand?: BrandName;
  inStockOnly?: boolean;
  query?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export async function getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
  let list = [...PRODUCTS];

  if (filters) {
    if (filters.collection) {
      list = list.filter((p) => p.collection === filters.collection);
    }
    if (filters.subcategory) {
      list = list.filter((p) => p.subcategory === filters.subcategory);
    }
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.materials && filters.materials.length > 0) {
      list = list.filter((p) => p.materialTags.some((tag) => filters.materials!.includes(tag)));
    }
    if (filters.festival) {
      list = list.filter((p) => p.festivals.includes(filters.festival!));
    }
    if (filters.brand) {
      list = list.filter((p) => p.brand === filters.brand);
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameHi.toLowerCase().includes(q) ||
          p.collectionName.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    switch (filters.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => Number(b.badges.includes('new')) - Number(a.badges.includes('new')));
        break;
      case 'featured':
      default:
        list.sort(
          (a, b) =>
            Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
            Number(b.badges.includes('bestseller')) - Number(a.badges.includes('bestseller'))
        );
        break;
    }
  }

  return list;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.isFeatured || p.badges.includes('bestseller'));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.id === id);
}

export async function getRelatedLowPriceAddOns(excludeId?: string): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) => p.inStock && p.price <= 200 && p.id !== excludeId
  ).slice(0, 3);
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.collection === product.collection ||
        p.festivals.some((f) => product.festivals.includes(f)))
  ).slice(0, 4);
}

export async function getCollections(): Promise<Collection[]> {
  return COLLECTIONS;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export async function getFestivals(): Promise<Festival[]> {
  return FESTIVALS;
}

export async function getFestivalBySlug(slug: string): Promise<Festival | undefined> {
  return FESTIVALS.find((f) => f.slug === slug);
}

export interface HydratedFestivalKit {
  festival: Festival;
  items: {
    product: Product;
    qty: number;
    isOptional: boolean;
    note?: string;
  }[];
  totalMrp: number;
  discountedTotal: number;
  savings: number;
}

export async function getFestivalKit(slug: string): Promise<HydratedFestivalKit | undefined> {
  const festival = FESTIVALS.find((f) => f.slug === slug);
  if (!festival) return undefined;

  const items = festival.kitItems
    .map((ki) => {
      const product = PRODUCTS.find((p) => p.id === ki.productId);
      if (!product) return null;
      return {
        product,
        qty: ki.qty,
        isOptional: Boolean(ki.isOptional),
        note: ki.note,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const totalMrp = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const savings = Math.round((totalMrp * festival.kitDiscountPercent) / 100);
  return {
    festival,
    items,
    totalMrp,
    discountedTotal: totalMrp - savings,
    savings,
  };
}

export async function getReviews(productId?: string): Promise<Review[]> {
  if (!productId) return REVIEWS;
  const matched = REVIEWS.filter((r) => r.productId === productId);
  return matched.length > 0 ? matched : REVIEWS.slice(0, 2);
}

export async function getArticles(): Promise<Article[]> {
  return ARTICLES;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return ARTICLES.find((a) => a.slug === slug);
}

export interface PincodeCheckResult {
  valid: boolean;
  serviceable: boolean;
  isKolkata: boolean;
  city: string;
  state: string;
  etaText: string;
  codAvailable: boolean;
  shippingFee: number;
  freeAbove: number;
}

export async function checkPincode(pincode: string): Promise<PincodeCheckResult> {
  const clean = pincode.trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      valid: false,
      serviceable: false,
      isKolkata: false,
      city: '',
      state: '',
      etaText: 'Enter a valid 6-digit Indian pincode.',
      codAvailable: false,
      shippingFee: STORE_INFO.panIndiaShippingFee,
      freeAbove: STORE_INFO.freeIndiaThreshold,
    };
  }

  if (clean.startsWith('700')) {
    return {
      valid: true,
      serviceable: true,
      isKolkata: true,
      city: 'Kolkata',
      state: 'West Bengal',
      etaText: 'Same-day delivery available (order before 2 pm) · Store pickup free',
      codAvailable: true,
      shippingFee: STORE_INFO.kolkataShippingFee,
      freeAbove: STORE_INFO.freeKolkataThreshold,
    };
  }

  if (clean.startsWith('7')) {
    return {
      valid: true,
      serviceable: true,
      isKolkata: false,
      city: 'Howrah / WB Region',
      state: 'West Bengal',
      etaText: 'Delivered in 2–4 days via reliable courier',
      codAvailable: true,
      shippingFee: STORE_INFO.panIndiaShippingFee,
      freeAbove: STORE_INFO.freeIndiaThreshold,
    };
  }

  const cityMap: Record<string, { city: string; state: string }> = {
    '1': { city: 'New Delhi', state: 'Delhi' },
    '4': { city: 'Mumbai', state: 'Maharashtra' },
    '5': { city: 'Bengaluru', state: 'Karnataka' },
    '6': { city: 'Chennai', state: 'Tamil Nadu' },
    '3': { city: 'Jaipur / Ahmedabad', state: 'Rajasthan / Gujarat' },
    '2': { city: 'Lucknow / Noida', state: 'Uttar Pradesh' },
    '8': { city: 'Patna / Ranchi', state: 'Bihar / Jharkhand' },
  };
  const region = cityMap[clean[0]] ?? { city: 'India', state: 'India' };

  return {
    valid: true,
    serviceable: true,
    isKolkata: false,
    city: region.city,
    state: region.state,
    etaText: 'Delivered in 3–6 days across India · COD available',
    codAvailable: true,
    shippingFee: STORE_INFO.panIndiaShippingFee,
    freeAbove: STORE_INFO.freeIndiaThreshold,
  };
}

export async function validateCoupon(
  rawCode: string,
  subtotal: number
): Promise<{ valid: boolean; discount: number; message: string; code: string }> {
  const code = rawCode.trim().toUpperCase();
  const found = COUPONS[code];
  if (!found) {
    return { valid: false, discount: 0, message: 'Coupon code not recognised. Try SHUBH10.', code };
  }
  if (subtotal < found.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Add ₹${found.minOrder - subtotal} more to apply ${code}.`,
      code,
    };
  }
  const discount =
    found.type === 'percent' ? Math.round((subtotal * found.value) / 100) : found.value;
  return {
    valid: true,
    discount,
    message: `${code} applied — ${found.label}`,
    code,
  };
}

export async function getOrderByNumberAndPhone(
  orderNumber: string,
  phone: string
): Promise<OrderRecord | undefined> {
  const storedRaw = localStorage.getItem('varcham_orders');
  const stored: OrderRecord[] = storedRaw ? JSON.parse(storedRaw) : [];
  const all = [...stored, ...MOCK_ORDERS];
  const cleanNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  return all.find(
    (o) =>
      o.orderNumber.toUpperCase() === cleanNum &&
      (!cleanPhone || o.phone.replace(/\D/g, '').slice(-10) === cleanPhone)
  );
}

export async function getAdminOrders(): Promise<OrderRecord[]> {
  const storedRaw = localStorage.getItem('varcham_orders');
  const stored: OrderRecord[] = storedRaw ? JSON.parse(storedRaw) : [];
  return [...stored, ...MOCK_ORDERS];
}

export async function getAdminEnquiries(): Promise<BulkEnquiry[]> {
  const storedRaw = localStorage.getItem('varcham_enquiries');
  const stored: BulkEnquiry[] = storedRaw ? JSON.parse(storedRaw) : [];
  return [...stored, ...MOCK_BULK_ENQUIRIES];
}

export async function submitBulkEnquiry(
  payload: Omit<BulkEnquiry, 'id' | 'status' | 'createdAt'>
): Promise<BulkEnquiry> {
  const entry: BulkEnquiry = {
    ...payload,
    id: `enq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const storedRaw = localStorage.getItem('varcham_enquiries');
  const existing: BulkEnquiry[] = storedRaw ? JSON.parse(storedRaw) : [];
  localStorage.setItem('varcham_enquiries', JSON.stringify([entry, ...existing]));
  return entry;
}

export async function getOrderStatus(
  orderNumber: string,
  phone?: string
): Promise<OrderRecord | undefined> {
  return getOrderByNumberAndPhone(orderNumber, phone || '');
}

export interface SendContactPayload {
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
}

export async function sendContactMessage(payload: SendContactPayload): Promise<{
  success: boolean;
  referenceId: string;
  message: string;
}> {
  const ref = `VARCHAM-${Math.floor(100000 + Math.random() * 900000)}`;
  const entry: ContactMessage = {
    id: ref,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim(),
    topic: payload.topic,
    message: payload.message.trim(),
    createdAt: new Date().toISOString(),
  };

  const storedRaw = localStorage.getItem('varcham_contact_messages');
  const existing: ContactMessage[] = storedRaw ? JSON.parse(storedRaw) : [];
  localStorage.setItem('varcham_contact_messages', JSON.stringify([entry, ...existing]));

  return {
    success: true,
    referenceId: ref,
    message: 'Message received — our Kolkata store team will reply within 2 working hours.',
  };
}


