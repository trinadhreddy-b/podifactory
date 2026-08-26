import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, MessageSquare, Camera, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCartTotal,
    getWhatsAppOrderUrl,
    getInstagramDmUrl,
    settings,
  } = useStore();

  const [deliveryNotes, setDeliveryNotes] = useState('');
  const total = getCartTotal();
  const isFreeDelivery = total >= 799;
  const deliveryCharge = isFreeDelivery || total === 0 ? 0 : 60;
  const grandTotal = total + deliveryCharge;

  if (!isCartDrawerOpen) return null;

  const handleWhatsAppCheckout = () => {
    const url = getWhatsAppOrderUrl(cart, deliveryNotes);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-brand-surface-card h-full shadow-2xl z-10 flex flex-col border-l border-brand-outline-variant/40"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-outline-variant/30 flex items-center justify-between bg-brand-surface-container/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-primary" />
              <h3 className="font-serif-brand text-lg text-brand-on-surface">Your Podi Order Box</h3>
              <span className="text-xs bg-brand-primary text-white font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-brand-surface-container flex items-center justify-center mx-auto text-brand-primary">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-serif-brand text-lg text-brand-on-surface">Your box is empty</h4>
                <p className="text-xs text-brand-on-surface-variant max-w-xs mx-auto">
                  Explore our authentic hand-pounded podis and build your flavorful spice box.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-2 px-6 py-2.5 text-xs font-label-brand font-bold uppercase tracking-wider bg-brand-primary text-white rounded-brand-btn"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Explore Podis
                </button>
              </div>
            ) : (
              <>
                {/* Free shipping progress bar */}
                <div className="p-3 bg-brand-surface-container/80 rounded-lg text-xs space-y-1.5 border border-brand-outline-variant/30">
                  <div className="flex justify-between font-semibold">
                    <span>
                      {isFreeDelivery ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> FREE India Delivery Unlocked!
                        </span>
                      ) : (
                        <span>Add ₹{799 - total} more for Free Delivery</span>
                      )}
                    </span>
                    <span>₹{total}/₹799</span>
                  </div>
                  <div className="w-full bg-brand-surface-dim h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-primary h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (total / 799) * 100)}%`,
                        backgroundColor: isFreeDelivery ? '#10b981' : 'var(--color-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.podi.id}-${item.selectedWeight.grams}`}
                      className="flex items-center gap-3 p-3 bg-brand-surface-container/40 rounded-xl border border-brand-outline-variant/30"
                    >
                      <img
                        src={item.podi.image}
                        alt={item.podi.name}
                        className="w-16 h-16 rounded-lg object-cover bg-brand-surface-container shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif-brand text-sm text-brand-on-surface truncate">
                          {item.podi.name}
                        </h5>
                        <p className="text-xs text-brand-on-surface-variant">
                          {item.selectedWeight.label} • ₹{item.selectedWeight.price}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty Counter */}
                          <div className="flex items-center border border-brand-outline-variant/60 rounded bg-brand-surface-card">
                            <button
                              onClick={() =>
                                updateCartQty(
                                  item.podi.id,
                                  item.selectedWeight.grams,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-0.5 text-xs font-bold hover:bg-brand-surface-container"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-bold text-center min-w-[20px]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQty(
                                  item.podi.id,
                                  item.selectedWeight.grams,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-0.5 text-xs font-bold hover:bg-brand-surface-container"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total */}
                          <span className="font-serif-brand text-sm font-bold text-brand-primary">
                            ₹{item.selectedWeight.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.podi.id, item.selectedWeight.grams)
                        }
                        className="p-1.5 text-brand-muted hover:text-red-600 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Notes / Pincode */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-label-brand font-bold uppercase text-brand-on-surface">
                    Delivery Address / Instructions:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter delivery city, pincode, or spice customization notes..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-brand-muted hover:text-red-600 transition cursor-pointer underline"
                  >
                    Clear entire box
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-outline-variant/30 bg-brand-surface-card space-y-3">
              <div className="space-y-1 text-xs text-brand-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-on-surface">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Express Shipping</span>
                  <span className="font-bold">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif-brand font-bold text-brand-on-surface pt-1 border-t border-brand-outline-variant/20">
                  <span>Grand Total</span>
                  <span className="text-brand-primary text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Order via WhatsApp */}
              <button
                id="cart-checkout-whatsapp-btn"
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 px-4 font-label-brand text-xs font-bold tracking-widest uppercase text-white shadow-md active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  borderRadius: 'var(--radius-btn)',
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>CONFIRM ORDER ON WHATSAPP (₹{grandTotal})</span>
              </button>

              {/* DM Instagram option */}
              <a
                href={getInstagramDmUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 font-label-brand text-xs font-bold tracking-widest uppercase border border-brand-outline text-brand-on-surface hover:bg-brand-surface-container active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
                style={{ borderRadius: 'var(--radius-btn)' }}
              >
                <Camera className="w-4 h-4" />
                <span>OR DM ON INSTAGRAM</span>
              </a>

              <div className="text-[10px] text-center text-brand-muted">
                🔒 Direct from batch kitchen • UPI / GPay / NetBanking accepted upon confirmation
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
