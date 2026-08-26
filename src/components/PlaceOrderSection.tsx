import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, Camera } from 'lucide-react';

export const PlaceOrderSection: React.FC = () => {
  const { getWhatsAppOrderUrl, getInstagramDmUrl, setIsContactModalOpen } = useStore();

  return (
    <section id="place-order-section" className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-md sm:max-w-xl mx-auto text-left sm:text-center space-y-6 sm:space-y-8">
        
        {/* Headings matching screenshot */}
        <div className="space-y-3">
          <h2
            id="place-order-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand tracking-tight"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Place Your Order
          </h2>
          <p
            className="text-sm sm:text-base text-brand-on-surface-variant font-sans-brand"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Click on any product to order via WhatsApp or Instagram.
          </p>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="space-y-3 pt-2">
          {/* Order on WhatsApp */}
          <a
            id="btn-order-on-whatsapp"
            href={getWhatsAppOrderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 border border-brand-outline text-brand-on-surface font-label-brand text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-brand-surface-container active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2.5 shadow-2xs"
            style={{
              borderColor: 'var(--color-outline)',
              color: 'var(--color-on-surface)',
              borderRadius: 'var(--radius-btn)',
            }}
          >
            <MessageSquare className="w-4 h-4" />
            <span>ORDER ON WHATSAPP</span>
          </a>

          {/* DM on Instagram */}
          <a
            id="btn-dm-on-instagram"
            href={getInstagramDmUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 border border-brand-outline text-brand-on-surface font-label-brand text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-brand-surface-container active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2.5 shadow-2xs"
            style={{
              borderColor: 'var(--color-outline)',
              color: 'var(--color-on-surface)',
              borderRadius: 'var(--radius-btn)',
            }}
          >
            <Camera className="w-4 h-4" />
            <span>DM US ON INSTAGRAM</span>
          </a>
        </div>

        {/* Helpful Info Note */}
        <div className="pt-2 text-xs text-brand-muted flex items-center justify-center gap-4">
          <span>📦 All India Express Shipping</span>
          <span>•</span>
          <span>⚡ Same-day Fresh Packing</span>
        </div>

      </div>
    </section>
  );
};
