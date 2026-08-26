import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Flame, MessageSquare, ShoppingBag, Check, Sparkles, UtensilsCrossed, HeartPulse, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedPodi,
    setSelectedPodi,
    addToCart,
    getWhatsAppOrderUrl,
    isAdminAuthenticated,
    setIsAdminDashboardOpen,
  } = useStore();

  const [selectedWeightIdx, setSelectedWeightIdx] = useState<number>(1);
  const [qty, setQty] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedPodi) return null;

  const currentWeight = selectedPodi.weights[selectedWeightIdx] || selectedPodi.weights[0];
  const currentPrice = currentWeight.price;
  const totalPrice = currentPrice * qty;

  const handleAddToCart = () => {
    addToCart(selectedPodi, currentWeight, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleWhatsAppOrder = () => {
    const url = getWhatsAppOrderUrl([
      {
        podi: selectedPodi,
        selectedWeight: currentWeight,
        quantity: qty,
      },
    ]);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPodi(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-brand-surface-card rounded-2xl shadow-2xl overflow-hidden z-10 border border-brand-outline-variant/40 max-h-[90vh] flex flex-col my-auto"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:px-6 border-b border-brand-outline-variant/30 sticky top-0 bg-brand-surface-card/95 backdrop-blur-md z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-label-brand font-bold uppercase tracking-widest text-brand-primary">
                Artisanal Blend
              </span>
              {selectedPodi.badge && (
                <span
                  className="px-2 py-0.5 text-[10px] font-bold text-white rounded"
                  style={{ backgroundColor: 'var(--color-primary-container)' }}
                >
                  {selectedPodi.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    setSelectedPodi(null);
                    setIsAdminDashboardOpen(true);
                  }}
                  className="p-1.5 text-xs font-semibold text-brand-primary flex items-center gap-1 hover:bg-brand-surface-container rounded cursor-pointer"
                  title="Edit in Admin Dashboard"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}

              <button
                id="close-podi-modal-btn"
                onClick={() => setSelectedPodi(null)}
                className="p-2 rounded-full hover:bg-brand-surface-container text-brand-on-surface transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Top row: Image and Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-surface-container border border-brand-outline-variant/30 shadow-xs">
                <img
                  src={selectedPodi.image}
                  alt={selectedPodi.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Spiciness level ribbon */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5 border border-white/20">
                  <Flame className={`w-3.5 h-3.5 ${selectedPodi.spiciness === 3 ? 'text-red-400' : selectedPodi.spiciness === 2 ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span>
                    Heat Level: {selectedPodi.spiciness === 3 ? '🔥🔥🔥 Andhra Fiery' : selectedPodi.spiciness === 2 ? '🔥🔥 Medium Pungent' : '🔥 Mild & Earthy'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {selectedPodi.teluguName && (
                  <p className="text-xs text-brand-primary font-semibold tracking-wide">
                    {selectedPodi.teluguName}
                  </p>
                )}
                
                <h3 className="text-2xl sm:text-3xl font-serif-brand text-brand-on-surface leading-tight">
                  {selectedPodi.name}
                </h3>

                <p className="text-xs sm:text-sm text-brand-on-surface-variant font-medium">
                  {selectedPodi.tagline}
                </p>

                {/* Price Display */}
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-serif-brand font-bold text-brand-primary">
                    ₹{totalPrice}
                  </span>
                  {selectedPodi.originalPrice && (
                    <span className="text-sm line-through text-brand-muted">
                      ₹{Math.round(selectedPodi.originalPrice * (currentWeight.grams / (selectedPodi.weights[1]?.grams || 200))) * qty}
                    </span>
                  )}
                  <span className="text-xs text-brand-muted uppercase font-label-brand">
                    ({currentWeight.label} × {qty})
                  </span>
                </div>

                {/* Pack Size Selector */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                    Select Pack Size:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPodi.weights.map((w, idx) => (
                      <button
                        key={w.grams}
                        type="button"
                        onClick={() => setSelectedWeightIdx(idx)}
                        className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                          selectedWeightIdx === idx
                            ? 'border-brand-primary bg-brand-surface-container font-bold text-brand-primary shadow-2xs'
                            : 'border-brand-outline-variant/60 bg-brand-surface-card hover:bg-brand-surface-container text-brand-on-surface-variant'
                        }`}
                      >
                        <div className="text-xs">{w.label}</div>
                        <div className="text-xs font-serif-brand font-bold text-brand-on-surface mt-0.5">
                          ₹{w.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-label-brand font-bold uppercase text-brand-on-surface">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-brand-outline-variant rounded-md overflow-hidden bg-brand-surface-card">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-sm font-bold hover:bg-brand-surface-container text-brand-on-surface cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-bold text-brand-on-surface min-w-[32px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="px-3 py-1 text-sm font-bold hover:bg-brand-surface-container text-brand-on-surface cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-brand-outline-variant/30">
              <h4 className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                About this Podi
              </h4>
              <p className="text-sm text-brand-on-surface-variant leading-relaxed">
                {selectedPodi.description}
              </p>
            </div>

            {/* Ingredients & Health Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Ingredients */}
              <div className="p-3.5 bg-brand-surface-container/60 rounded-xl border border-brand-outline-variant/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold font-label-brand uppercase text-brand-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pure Ingredients</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPodi.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-brand-surface-card px-2 py-0.5 rounded border border-brand-outline-variant/40 text-brand-on-surface"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Health Benefits */}
              <div className="p-3.5 bg-brand-surface-container/60 rounded-xl border border-brand-outline-variant/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold font-label-brand uppercase text-emerald-800">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Health Benefits</span>
                </div>
                <ul className="text-xs text-brand-on-surface-variant space-y-1 pt-1">
                  {selectedPodi.healthBenefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Serving Suggestions */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold font-label-brand uppercase text-amber-900">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>How to Enjoy (Traditional Pairings)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-amber-950 font-medium">
                {selectedPodi.servingSuggestions.map((sug, idx) => (
                  <div key={idx} className="bg-white/80 p-2 rounded border border-amber-200/40">
                    {sug}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Footer Bar */}
          <div className="p-4 sm:px-6 border-t border-brand-outline-variant/30 bg-brand-surface-card sticky bottom-0 z-20 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="modal-add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full sm:flex-1 py-3.5 px-4 font-label-brand text-xs font-bold tracking-widest uppercase text-white shadow-md active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>ADDED TO BOX!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO ORDER BOX (₹{totalPrice})</span>
                </>
              )}
            </button>

            <button
              id="modal-whatsapp-order-btn"
              onClick={handleWhatsAppOrder}
              className="w-full sm:w-auto py-3.5 px-6 font-label-brand text-xs font-bold tracking-widest uppercase border border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
              style={{ borderRadius: 'var(--radius-btn)' }}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>ORDER ON WHATSAPP</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
