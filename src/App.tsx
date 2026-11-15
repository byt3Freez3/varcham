import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from '@/context/ToastContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';

const ShopPage = lazy(() => import('@/pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const FestivalsPage = lazy(() => import('@/pages/FestivalsPage').then((m) => ({ default: m.FestivalsPage })));
const FestivalKitPage = lazy(() => import('@/pages/FestivalKitPage').then((m) => ({ default: m.FestivalKitPage })));
const ProductPage = lazy(() => import('@/pages/ProductPage').then((m) => ({ default: m.ProductPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const CartPage = lazy(() => import('@/pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const AccountPage = lazy(() => import('@/pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const GiftingPage = lazy(() => import('@/pages/GiftingPage').then((m) => ({ default: m.GiftingPage })));
const OurStoryPage = lazy(() => import('@/pages/OurStoryPage').then((m) => ({ default: m.OurStoryPage })));
const VisitStorePage = lazy(() => import('@/pages/InfoPages').then((m) => ({ default: m.VisitStorePage })));
const JournalListPage = lazy(() => import('@/pages/JournalPages').then((m) => ({ default: m.JournalListPage })));
const JournalArticlePage = lazy(() => import('@/pages/JournalPages').then((m) => ({ default: m.JournalArticlePage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('@/pages/InfoPages').then((m) => ({ default: m.FaqPage })));
const ShippingPolicyPage = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.ShippingPolicyPage })));
const ReturnsPolicyPage = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.ReturnsPolicyPage })));
const CancellationPolicyPage = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.CancellationPolicyPage })));
const PrivacyPolicyPage = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsPolicyPage = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.TermsPolicyPage })));
const PolicySlugRouter = lazy(() => import('@/pages/PolicyPages').then((m) => ({ default: m.PolicySlugRouter })));
const NotFoundPage = lazy(() => import('@/pages/InfoPages').then((m) => ({ default: m.NotFoundPage })));
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })));

function RouteFallback() {
  return (
    <div className="container py-20 text-center">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <AuthProvider>
                <BrowserRouter>
                  <Layout>
                    <Suspense fallback={<RouteFallback />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/collections/:slug" element={<ShopPage />} />
                        <Route path="/festivals" element={<FestivalsPage />} />
                        <Route path="/festivals/:slug" element={<FestivalKitPage />} />
                        <Route path="/product/:slug" element={<ProductPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order/success" element={<OrderSuccessPage />} />
                        <Route path="/order/:number/success" element={<OrderSuccessPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/track" element={<TrackOrderPage />} />
                        <Route path="/gifting" element={<GiftingPage />} />
                        <Route path="/our-story" element={<OurStoryPage />} />
                        <Route path="/visit" element={<VisitStorePage />} />
                        <Route path="/journal" element={<JournalListPage />} />
                        <Route path="/journal/:slug" element={<JournalArticlePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/policies/shipping" element={<ShippingPolicyPage />} />
                        <Route path="/policies/returns" element={<ReturnsPolicyPage />} />
                        <Route path="/policies/cancellation" element={<CancellationPolicyPage />} />
                        <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/policies/terms" element={<TermsPolicyPage />} />
                        <Route path="/policies/:slug" element={<PolicySlugRouter />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                </BrowserRouter>
              </AuthProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
