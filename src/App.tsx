/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PodisCatalog } from './components/PodisCatalog';
import { FeatureHighlights } from './components/FeatureHighlights';
import { WhyPodiFactory } from './components/WhyPodiFactory';
import { PlaceOrderSection } from './components/PlaceOrderSection';
import { Footer } from './components/Footer';

// Modals and Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { NavigationDrawer } from './components/NavigationDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ThemeCustomizerDrawer } from './components/ThemeCustomizerDrawer';
import { OurStoryModal } from './components/OurStoryModal';
import { ContactModal } from './components/ContactModal';

import { Palette, MessageSquare, ShoppingBag, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    setIsThemeDrawerOpen,
    getWhatsAppOrderUrl,
    setIsCartDrawerOpen,
    getCartCount,
    isAdminAuthenticated,
    setIsAdminDashboardOpen,
  } = useStore();

  const cartCount = getCartCount();

  return (
    <div
      id="app-root-container"
      className="min-h-screen flex flex-col bg-brand-surface text-brand-on-surface transition-colors selection:bg-amber-200 selection:text-amber-950 font-sans-brand"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
      }}
    >
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Primary Sticky Header */}
      <Header />

      {/* Main Page Flow mirroring screenshot */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Our Podis Catalog */}
        <PodisCatalog />

        {/* 4-Item Feature Badges */}
        <FeatureHighlights />

        {/* Why The Podi Factory Section */}
        <WhyPodiFactory />

        {/* Place Your Order Action Section */}
        <PlaceOrderSection />
      </main>

      {/* Main Footer */}
      <Footer />

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
        {/* Floating Theme Switcher */}
        <button
          id="floating-theme-trigger-btn"
          onClick={() => setIsThemeDrawerOpen(true)}
          className="p-3 rounded-full bg-brand-surface-card text-brand-on-surface hover:text-brand-primary border border-brand-outline-variant/60 shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center group"
          title="Change Theme (CSS Variables)"
        >
          <Palette className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
        </button>

        {/* Floating WhatsApp Direct Order */}
        <a
          id="floating-whatsapp-order-btn"
          href={getWhatsAppOrderUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          title="Direct WhatsApp Order"
        >
          <MessageSquare className="w-5 h-5" />
        </a>

        {/* Floating Cart Button (if items in cart) */}
        {cartCount > 0 && (
          <button
            id="floating-cart-btn"
            onClick={() => setIsCartDrawerOpen(true)}
            className="px-4 py-3 rounded-full bg-brand-primary text-white shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold font-label-brand tracking-wider uppercase">
              Order Box ({cartCount})
            </span>
          </button>
        )}
      </div>

      {/* Modals & Slide-in Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <NavigationDrawer />
      <AdminLoginModal />
      <AdminDashboard />
      <ThemeCustomizerDrawer />
      <OurStoryModal />
      <ContactModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
