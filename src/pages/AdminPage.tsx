import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Sparkles,
  Users,
  Briefcase,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  Search,
  X,
} from 'lucide-react';
import { getAdminEnquiries, getAdminOrders, getCollections, getFestivals, getProducts } from '@/lib/api';
import { BulkEnquiry, Collection, Festival, OrderRecord, OrderStatus, Product } from '@/types';
import { formatINR, cn } from '@/lib/utils';
import { STORE_INFO, ANNOUNCEMENTS } from '@/data/store';
import { BrandLogo } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';

type AdminSection =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'collections'
  | 'festivals'
  | 'customers'
  | 'enquiries'
  | 'banners'
  | 'settings';

const STATUS_BADGE: Record<OrderStatus, string> = {
  Placed: 'bg-parchment text-walnut border border-hairline',
  Confirmed: 'bg-ivory text-gold border border-gold',
  Packed: 'bg-ivory text-gold border border-gold',
  Shipped: 'bg-ivory text-tulsi border border-tulsi',
  'Out for delivery': 'bg-ivory text-tulsi border border-tulsi',
  Delivered: 'bg-tulsi text-ivory',
  'Ready for pickup': 'bg-tulsi text-ivory',
  'Picked up': 'bg-tulsi text-ivory',
  Cancelled: 'bg-ivory text-sindoor border border-sindoor',
};

export function AdminPage() {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [enquiries, setEnquiries] = useState<BulkEnquiry[]>([]);

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      getAdminOrders(),
      getProducts(),
      getCollections(),
      getFestivals(),
      getAdminEnquiries(),
    ]).then(([o, p, c, f, e]) => {
      setOrders(o);
      setProducts(p);
      setCollections(c);
      setFestivals(f);
      setEnquiries(e);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const pendingDispatchCount = orders.filter((o) =>
    ['Placed', 'Confirmed', 'Packed'].includes(o.status)
  ).length;
  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock <= 5)
  ).length;

  const updateOrderStatus = (orderNum: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNum
          ? {
              ...o,
              status: nextStatus,
              timeline: [
                ...o.timeline,
                { status: nextStatus, note: 'Updated from Store Admin', timestamp: 'Just now' },
              ],
            }
          : o
      )
    );
    setSelectedOrder((prev) =>
      prev && prev.orderNumber === orderNum ? { ...prev, status: nextStatus } : prev
    );
    showToast({ message: `Order ${orderNum} marked as ${nextStatus}` });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    showToast({ message: `Saved changes to ${editingProduct.name}` });
    setEditingProduct(null);
  };

  const filteredOrders =
    orderStatusFilter === 'ALL'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  const filteredProducts = products.filter(
    (p) =>
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameHi.toLowerCase().includes(productSearch.toLowerCase())
  );

  const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'festivals', label: 'Festivals & Kits', icon: Sparkles },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'enquiries', label: 'Bulk Enquiries', icon: Briefcase },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>Store Admin | Varcham India</title>
      </Helmet>

      <div className="min-h-screen bg-ivory text-sm flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-60 bg-parchment border-b lg:border-b-0 lg:border-r border-hairline flex flex-col shrink-0">
          <div className="p-4 border-b border-hairline flex items-center justify-between">
            <BrandLogo compact />
            <span className="px-2 py-0.5 rounded-sm bg-tulsi text-ivory text-[10px] font-cinzel uppercase tracking-wider">
              Admin
            </span>
          </div>

          <nav className="p-2 flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-sm text-left whitespace-nowrap transition-colors',
                    active
                      ? 'bg-tulsi text-ivory font-medium'
                      : 'text-espresso hover:bg-sandal'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-hairline hidden lg:block">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-tulsi hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to live storefront
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
            <div>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.25em] text-gold">
                PHOOLBAGAN OPERATIONS CONSOLE (MOCK DATA)
              </p>
              <h1 className="font-playfair text-2xl md:text-3xl text-espresso capitalize mt-0.5">
                {section === 'festivals' ? 'Festivals & Kits' : section}
              </h1>
            </div>
            <Link to="/" className="lg:hidden text-xs text-tulsi underline">
              ← Storefront
            </Link>
          </div>

          {/* KPI STRIP */}
          {(section === 'dashboard' || section === 'orders') && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Today's Revenue", value: formatINR(totalRevenue) },
                { label: 'Orders Today', value: String(orders.length) },
                { label: 'Avg Order Value', value: formatINR(avgOrderValue) },
                { label: 'Pending Dispatch', value: String(pendingDispatchCount) },
                { label: 'Low-Stock Items', value: String(lowStockCount), alert: lowStockCount > 0 },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-4 rounded-sm border border-hairline bg-white"
                >
                  <p className="text-xs text-walnut">{kpi.label}</p>
                  <p
                    className={cn(
                      'font-playfair text-2xl font-medium mt-1 font-tabular',
                      kpi.alert ? 'text-sindoor' : 'text-espresso'
                    )}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* DASHBOARD / ORDERS TABLE */}
          {(section === 'dashboard' || section === 'orders') && (
            <div className="rounded-sm border border-hairline bg-white overflow-hidden">
              <div className="p-4 bg-parchment/50 border-b border-hairline flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-playfair text-lg text-espresso">Recent Orders</h2>
                <div className="flex flex-wrap gap-1.5">
                  {['ALL', 'Placed', 'Packed', 'Out for delivery', 'Ready for pickup', 'Delivered'].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOrderStatusFilter(st)}
                        className={cn(
                          'px-2.5 py-1 rounded-sm text-xs border',
                          orderStatusFilter === st
                            ? 'bg-tulsi text-ivory border-tulsi'
                            : 'bg-ivory text-walnut border-hairline'
                        )}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-hairline text-xs uppercase text-walnut bg-parchment/25">
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Fulfilment</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {filteredOrders.map((ord) => (
                      <tr
                        key={ord.orderNumber}
                        onClick={() => setSelectedOrder(ord)}
                        className="hover:bg-parchment/30 cursor-pointer"
                      >
                        <td className="py-3 px-4 font-cinzel font-semibold text-espresso">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-espresso">{ord.customerName}</p>
                          <p className="text-xs text-walnut">{ord.city}</p>
                        </td>
                        <td className="py-3 px-4 capitalize text-walnut">
                          {ord.fulfilment.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 px-4 text-walnut">
                          {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium',
                              STATUS_BADGE[ord.status]
                            )}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold font-tabular">
                          {formatINR(ord.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TABLE */}
          {section === 'products' && (
            <div className="rounded-sm border border-hairline bg-white overflow-hidden">
              <div className="p-4 bg-parchment/50 border-b border-hairline flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-playfair text-lg text-espresso">
                  Catalog ({filteredProducts.length} products)
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Filter products..."
                    className="w-full h-9 rounded-sm border border-hairline bg-white pl-9 pr-3 text-xs"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-hairline text-xs uppercase text-walnut bg-parchment/25">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Collection</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {filteredProducts.map((prod) => {
                      const totalStock = prod.variants.reduce((s, v) => s + v.stock, 0);
                      return (
                        <tr key={prod.id} className="hover:bg-parchment/25">
                          <td className="py-2.5 px-4 flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-12 object-cover rounded-sm shrink-0 bg-parchment"
                            />
                            <div>
                              <p className="font-medium text-espresso">{prod.name}</p>
                              <p lang="hi" className="text-xs text-walnut">{prod.nameHi}</p>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-walnut">{prod.collectionName}</td>
                          <td className="py-2.5 px-4 font-tabular font-semibold">{formatINR(prod.price)}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={cn(
                                'text-xs font-medium',
                                totalStock === 0
                                  ? 'text-sindoor'
                                  : totalStock <= 5
                                  ? 'text-gold'
                                  : 'text-tulsi'
                              )}
                            >
                              {totalStock} units
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(JSON.parse(JSON.stringify(prod)))}
                              className="text-xs font-semibold text-tulsi hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COLLECTIONS */}
          {section === 'collections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map((c) => (
                <div key={c.id} className="p-4 rounded-sm border border-hairline bg-white flex items-center gap-4">
                  <img src={c.image} alt={c.name} className="w-16 h-20 object-cover rounded-sm shrink-0" />
                  <div>
                    <h3 className="font-playfair text-lg text-espresso">{c.name}</h3>
                    <p className="text-xs text-walnut">{c.nameHi} · {c.itemCount} catalog lines</p>
                    <p className="text-xs text-walnut mt-1">{c.subcategories.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FESTIVALS */}
          {section === 'festivals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {festivals.map((f) => (
                <div key={f.id} className="p-4 rounded-sm border border-hairline bg-white space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-playfair text-lg text-espresso">{f.name}</h3>
                    <span className="text-xs font-semibold text-tulsi">{f.kitDiscountPercent}% kit discount</span>
                  </div>
                  <p className="text-xs text-walnut">{f.dateLabel} · {f.kitItems.length} kit items</p>
                </div>
              ))}
            </div>
          )}

          {/* CUSTOMERS */}
          {section === 'customers' && (
            <div className="p-6 rounded-sm border border-hairline bg-white space-y-3">
              <h2 className="font-playfair text-lg text-espresso">Customer Directory (Demo)</h2>
              {orders.map((o) => (
                <div key={o.orderNumber} className="py-2 border-b border-hairline flex justify-between text-sm">
                  <span>{o.customerName} ({o.city})</span>
                  <span className="text-walnut">+91 {o.phone}</span>
                </div>
              ))}
            </div>
          )}

          {/* BULK ENQUIRIES */}
          {section === 'enquiries' && (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-4 rounded-sm border border-hairline bg-white flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-semibold text-espresso">
                      {enq.company} — {enq.name}
                    </p>
                    <p className="text-xs text-walnut">
                      {enq.quantity} boxes × {formatINR(enq.budgetPerUnit)} · Needed by {enq.neededBy}
                    </p>
                    <p className="text-xs text-walnut mt-1">{enq.message}</p>
                  </div>
                  <span className="px-2.5 py-1 h-fit rounded-sm bg-parchment text-xs uppercase font-cinzel text-gold">
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* BANNERS */}
          {section === 'banners' && (
            <div className="p-6 rounded-sm border border-hairline bg-white space-y-3">
              <h2 className="font-playfair text-lg text-espresso">Announcement Rotation</h2>
              {ANNOUNCEMENTS.map((msg, i) => (
                <div key={i} className="p-3 rounded-sm bg-parchment/50 border border-hairline text-sm">
                  {msg}
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div className="p-6 rounded-sm border border-hairline bg-white max-w-xl space-y-3">
              <h2 className="font-playfair text-lg text-espresso">Store Configuration</h2>
              <p><strong>Address:</strong> {STORE_INFO.fullAddress}</p>
              <p><strong>Free Kolkata Delivery Threshold:</strong> {formatINR(STORE_INFO.freeKolkataThreshold)}</p>
              <p><strong>Free Pan-India Threshold:</strong> {formatINR(STORE_INFO.freeIndiaThreshold)}</p>
              <p><strong>Same-day Cut-off:</strong> {STORE_INFO.sameDayCutoff}</p>
              <p><strong>COD Convenience Fee:</strong> {formatINR(STORE_INFO.codFee)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-espresso/40">
          <div className="w-full max-w-md bg-ivory h-full border-l border-hairline p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div>
                <p className="font-cinzel text-xs text-gold">{selectedOrder.orderNumber}</p>
                <h3 className="font-playfair text-xl text-espresso">{selectedOrder.customerName}</h3>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-walnut">
              <p><strong>Address:</strong> {selectedOrder.addressSummary}</p>
              <p><strong>Phone:</strong> +91 {selectedOrder.phone}</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentMethod.toUpperCase()} ({selectedOrder.paymentStatus})</p>
            </div>

            <div className="space-y-2 border-y border-hairline py-3">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{it.name} × {it.qty}</span>
                  <span className="font-tabular">{formatINR(it.unitPrice * it.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-hairline">
                <span>Total</span>
                <span className="font-tabular">{formatINR(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-walnut">
                Mark status as
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ['Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Ready for pickup', 'Delivered'] as OrderStatus[]
                ).map((st) => (
                  <Button
                    key={st}
                    size="sm"
                    variant={selectedOrder.status === st ? 'primary' : 'secondary'}
                    onClick={() => updateOrderStatus(selectedOrder.orderNumber, st)}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Drawer */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-espresso/40">
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-md bg-ivory h-full border-l border-hairline p-6 overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="font-playfair text-xl text-espresso">Edit Product</h3>
              <button type="button" onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <Input
              label="Product Name"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />
            <Input
              label="Hindi Name"
              value={editingProduct.nameHi}
              onChange={(e) => setEditingProduct({ ...editingProduct, nameHi: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (₹)"
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                    variants: editingProduct.variants.map((v, idx) =>
                      idx === 0 ? { ...v, price: Number(e.target.value) } : v
                    ),
                  })
                }
              />
              <Input
                label="Primary Stock"
                type="number"
                value={editingProduct.variants[0]?.stock ?? 0}
                onChange={(e) => {
                  const st = Number(e.target.value);
                  setEditingProduct({
                    ...editingProduct,
                    inStock: st > 0,
                    variants: editingProduct.variants.map((v, idx) =>
                      idx === 0 ? { ...v, stock: st } : v
                    ),
                  });
                }}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" className="flex-1">Save Changes</Button>
              <Button type="button" variant="secondary" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

