import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, Camera, Menu, ShoppingBag, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    getWhatsAppOrderUrl,
    getInstagramDmUrl,
    getCartCount,
    setIsCartDrawerOpen,
    setIsMenuDrawerOpen,
    isAdminAuthenticated,
    setIsAdminDashboardOpen,
  } = useStore();

  const cartCount = getCartCount();

  return (
    <header
      id="main-header"
      className="relative bg-brand-surface border-b border-brand-outline-variant/30 transition-colors"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Title / Logo */}
        <a
          id="brand-logo-link"
          href="#home"
          className="h-full text-xl sm:text-3xl font-serif-brand font-bold tracking-tight text-brand-primary hover:opacity-90 transition-opacity flex items-center gap-2.5 sm:gap-3.5"
          style={{ color: 'var(--color-primary)' }}
        >
          <img
            id="brand-logo-img"
            src="/logo.png"
            alt="The Podi Factory Logo"
            className="h-[80%] sm:h-[88%] w-auto max-h-12 sm:max-h-16 object-contain rounded-md shrink-0"
            onError={(e) => {
              // Gracefully hide if logo.png is not yet placed
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <span>{settings.storeName}</span>
        </a>

        {/* Action Icons matching design screenshot */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Admin quick badge if logged in */}
          {isAdminAuthenticated && (
            <button
              id="header-admin-badge"
              onClick={() => setIsAdminDashboardOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-brand-primary-container text-white cursor-pointer hover:opacity-90 shadow-xs"
              style={{ backgroundColor: 'var(--color-primary-container)' }}
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Active</span>
            </button>
          )}

          {/* WhatsApp Direct Chat Icon */}
          <a
            id="header-whatsapp-btn"
            href={getWhatsAppOrderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 text-brand-on-surface hover:text-brand-primary rounded-full hover:bg-brand-surface-container transition-colors cursor-pointer"
            style={{ color: 'var(--color-on-surface)' }}
            aria-label="Order on WhatsApp"
            title="Chat & Order via WhatsApp"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
          </a>

          {/* Instagram Camera Icon */}
          <a
            id="header-instagram-btn"
            href={getInstagramDmUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 text-brand-on-surface hover:text-brand-primary rounded-full hover:bg-brand-surface-container transition-colors cursor-pointer"
            style={{ color: 'var(--color-on-surface)' }}
            aria-label="Follow & DM on Instagram"
            title="DM us on Instagram"
          >
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
          </a>

          {/* Shopping Bag / Cart */}
          <button
            id="header-cart-btn"
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 sm:p-2.5 text-brand-on-surface hover:text-brand-primary rounded-full hover:bg-brand-surface-container transition-colors cursor-pointer"
            style={{ color: 'var(--color-on-surface)' }}
            aria-label="View Order Bag"
            title="View Order Box"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs font-bold text-white rounded-full flex items-center justify-center animate-scale"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Icon */}
          <button
            id="header-menu-toggle-btn"
            onClick={() => setIsMenuDrawerOpen(true)}
            className="p-2 sm:p-2.5 text-brand-on-surface hover:text-brand-primary rounded-full hover:bg-brand-surface-container transition-colors cursor-pointer"
            style={{ color: 'var(--color-on-surface)' }}
            aria-label="Open Navigation Menu"
            title="Navigation Menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
};
