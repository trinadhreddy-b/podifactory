import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, Camera, ShieldCheck, Palette, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    settings,
    getWhatsAppOrderUrl,
    getInstagramDmUrl,
    setIsStoryModalOpen,
    setIsContactModalOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    setIsAdminDashboardOpen,
    setIsThemeDrawerOpen,
  } = useStore();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToPodis = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('our-podis-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="pt-14 pb-12 px-4 sm:px-6 bg-brand-surface-container/80 border-t border-brand-outline-variant/40 transition-colors"
      style={{
        backgroundColor: 'var(--color-surface-container)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Brand & Subtitle matching screenshot */}
        <div className="space-y-2">
          <h3
            id="footer-brand-title"
            className="text-2xl sm:text-3xl font-serif-brand font-bold tracking-tight"
            style={{ color: 'var(--color-primary)' }}
          >
            {settings.storeName}
          </h3>
          <p
            className="text-sm text-brand-on-surface-variant font-sans-brand"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Traditional Andhra Podis made with love.
          </p>
        </div>

        {/* Quick Links Section matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <h4 className="text-xs font-label-brand font-bold tracking-widest uppercase text-brand-on-surface">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-on-surface-variant font-sans-brand">
              <li>
                <a
                  href="#home"
                  onClick={scrollToTop}
                  className="hover:text-brand-primary transition-colors cursor-pointer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#our-podis"
                  onClick={scrollToPodis}
                  className="hover:text-brand-primary transition-colors cursor-pointer"
                >
                  Our Podis
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="hover:text-brand-primary transition-colors cursor-pointer text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-brand-primary transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() =>
                    isAdminAuthenticated
                      ? setIsAdminDashboardOpen(true)
                      : setIsAdminModalOpen(true)
                  }
                  className="flex items-center gap-1 text-xs text-brand-primary font-semibold hover:underline cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Follow Us Section matching screenshot */}
          <div className="space-y-3">
            <h4 className="text-xs font-label-brand font-bold tracking-widest uppercase text-brand-on-surface">
              FOLLOW US
            </h4>
            <div className="flex items-center gap-3 pt-1">
              <a
                id="footer-whatsapp-link"
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-brand-surface-card hover:bg-brand-surface text-brand-on-surface hover:text-brand-primary border border-brand-outline-variant/40 shadow-xs transition cursor-pointer"
                style={{ color: 'var(--color-on-surface)' }}
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-5 h-5" strokeWidth={1.8} />
              </a>

              <a
                id="footer-instagram-link"
                href={getInstagramDmUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-brand-surface-card hover:bg-brand-surface text-brand-on-surface hover:text-brand-primary border border-brand-outline-variant/40 shadow-xs transition cursor-pointer"
                style={{ color: 'var(--color-on-surface)' }}
                aria-label="Instagram"
                title="Follow on Instagram"
              >
                <Camera className="w-5 h-5" strokeWidth={1.8} />
              </a>

              <button
                onClick={() => setIsThemeDrawerOpen(true)}
                className="p-2.5 rounded-full bg-brand-surface-card hover:bg-brand-surface text-brand-on-surface hover:text-brand-primary border border-brand-outline-variant/40 shadow-xs transition cursor-pointer ml-2"
                title="Change Website Theme"
              >
                <Palette className="w-5 h-5" strokeWidth={1.8} />
              </button>
            </div>
            <p className="text-xs text-brand-muted pt-1">
              Direct message us for bulk wedding favors, corporate gifting & international courier.
            </p>
          </div>
        </div>

        {/* Copyright notice matching screenshot */}
        <div className="pt-8 border-t border-brand-outline-variant/30 text-center text-xs text-brand-muted font-sans-brand flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 {settings.storeName}. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3 h-3 text-red-600 fill-current inline" /> in Andhra Pradesh
          </span>
        </div>

      </div>
    </footer>
  );
};
