import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Home, ShoppingBag, BookOpen, Phone, Palette, ShieldCheck, LogOut, ArrowRight, MessageSquare, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NavigationDrawer: React.FC = () => {
  const {
    isMenuDrawerOpen,
    setIsMenuDrawerOpen,
    setIsStoryModalOpen,
    setIsContactModalOpen,
    setIsThemeDrawerOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    setIsAdminDashboardOpen,
    getWhatsAppOrderUrl,
    getInstagramDmUrl,
    settings,
  } = useStore();

  if (!isMenuDrawerOpen) return null;

  const handleNavClick = (sectionId?: string) => {
    setIsMenuDrawerOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-sm bg-brand-surface-card h-full shadow-2xl z-10 flex flex-col border-l border-brand-outline-variant/40"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-outline-variant/30 flex items-center justify-between bg-brand-surface-container/60">
            <div>
              <h3 className="font-serif-brand text-xl text-brand-primary font-bold">
                {settings.storeName}
              </h3>
              <p className="text-[11px] text-brand-on-surface-variant">Traditional Andhra Podis</p>
            </div>
            <button
              onClick={() => setIsMenuDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-label-brand font-bold uppercase tracking-widest text-brand-muted px-3">
                Navigation
              </span>
              
              <button
                onClick={() => handleNavClick('home')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-surface-container text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
              >
                <Home className="w-4 h-4 text-brand-primary" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNavClick('our-podis-section')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-surface-container text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
              >
                <ShoppingBag className="w-4 h-4 text-brand-primary" />
                <span>Our Podis Catalog</span>
              </button>

              <button
                onClick={() => handleNavClick('features-section')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-surface-container text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
              >
                <ArrowRight className="w-4 h-4 text-brand-primary" />
                <span>What Makes Us Different</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  setIsStoryModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-surface-container text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
              >
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <span>Our Heritage Story</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-surface-container text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
              >
                <Phone className="w-4 h-4 text-brand-primary" />
                <span>Contact & Inquiries</span>
              </button>
            </div>

            {/* Customizer & Styling */}
            <div className="space-y-1 pt-2 border-t border-brand-outline-variant/30">
              <span className="text-[10px] font-label-brand font-bold uppercase tracking-widest text-brand-muted px-3">
                Theme & Customization
              </span>

              <button
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  setIsThemeDrawerOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-brand-surface-container text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-amber-700" />
                  <span>Personalize Colors & Theme</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                  Live
                </span>
              </button>
            </div>

            {/* Admin Portal Section */}
            <div className="space-y-2 pt-2 border-t border-brand-outline-variant/30">
              <span className="text-[10px] font-label-brand font-bold uppercase tracking-widest text-brand-muted px-3">
                Administration Portal
              </span>

              {isAdminAuthenticated ? (
                <div className="p-3 bg-brand-surface-container rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-brand-on-surface">
                        {adminUser?.name || 'Admin'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                      Logged In
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      setIsAdminDashboardOpen(true);
                    }}
                    className="w-full py-2 text-xs font-bold bg-brand-primary text-white rounded-brand-btn transition cursor-pointer flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <span>Open Admin Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      logoutAdmin();
                      setIsMenuDrawerOpen(false);
                    }}
                    className="w-full py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Admin</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    setIsAdminModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-brand-surface-container hover:bg-brand-surface-container-high text-brand-on-surface text-sm font-medium transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                    <span>Admin Login & Dashboard</span>
                  </div>
                  <span className="text-[10px] text-brand-muted">Secure</span>
                </button>
              )}
            </div>

            {/* Social Direct Links */}
            <div className="pt-4 border-t border-brand-outline-variant/30 space-y-2">
              <span className="text-[10px] font-label-brand font-bold uppercase tracking-widest text-brand-muted px-3">
                Direct Channels
              </span>
              <div className="grid grid-cols-2 gap-2 px-1">
                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={getInstagramDmUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-brand-outline-variant/30 text-center text-xs text-brand-muted bg-brand-surface-container/30">
            Hand-pounded with love • Guntur & Hyderabad
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
