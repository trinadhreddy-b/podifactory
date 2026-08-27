import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, Heart, Sun, UtensilsCrossed, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OurStoryModal: React.FC = () => {
  const { isStoryModalOpen, setIsStoryModalOpen, settings } = useStore();

  if (!isStoryModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsStoryModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-brand-surface-card rounded-2xl shadow-2xl overflow-hidden z-10 border border-brand-outline-variant/40 max-h-[90vh] flex flex-col my-auto"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-brand-outline-variant/30 flex items-center justify-between bg-brand-surface-container/60">
            <div>
              <span className="text-xs font-label-brand font-bold uppercase tracking-widest text-brand-primary">
                Heritage & Roots
              </span>
              <h3 className="font-serif-brand text-2xl font-bold text-brand-on-surface">
                Our Story: Preserving Andhra's Soul
              </h3>
            </div>
            <button
              onClick={() => setIsStoryModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Story Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-brand-on-surface-variant font-sans-brand leading-relaxed">
            
            {/* Lead Image */}
            <div className="relative aspect-16/9 rounded-xl overflow-hidden shadow-xs border border-brand-outline-variant/30">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80"
                alt="Guntur Sun-Drying Spices and Stone Mortar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                  Slow-food philosophy
                </span>
                <p className="font-serif-brand text-lg">From Andhra Farms to Your Table</p>
              </div>
            </div>

            {/* Paragraph 1 */}
            <div className="space-y-2">
              <h4 className="font-serif-brand text-lg font-bold text-brand-on-surface">
                The Memory of Grandma’s Stone Mortar (Rolu-Rokali)
              </h4>
              <p>
                In every traditional Andhra household, the rhythm of morning cooking was accompanied by the steady, resonant thud of the <em>Rolu</em> (heavy stone mortar) and <em>Rokali</em> (wooden or brass pestle). 
                Unlike modern high-speed electric mixer-grinders that heat up the spices and burn away their delicate essential oils, stone pounding crushes the spices slowly at room temperature, releasing an intoxicating burst of natural aroma.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-brand-surface-container/60 rounded-xl border border-brand-outline-variant/30 space-y-1.5 text-center">
                <Sun className="w-6 h-6 mx-auto text-amber-600" />
                <h5 className="font-serif-brand font-bold text-brand-on-surface text-sm">Sun-Dried Under Andhra Skies</h5>
                <p className="text-xs text-brand-on-surface-variant">We naturally solar-dehydrate freshly harvested moringa & curry leaves for 3 days.</p>
              </div>

              <div className="p-3.5 bg-brand-surface-container/60 rounded-xl border border-brand-outline-variant/30 space-y-1.5 text-center">
                <UtensilsCrossed className="w-6 h-6 mx-auto text-brand-primary" />
                <h5 className="font-serif-brand font-bold text-brand-on-surface text-sm">Slow Cast-Iron Roasting</h5>
                <p className="text-xs text-brand-on-surface-variant">Country lentils and whole red chillies are roasted slowly on gentle wood fire.</p>
              </div>

              <div className="p-3.5 bg-brand-surface-container/60 rounded-xl border border-brand-outline-variant/30 space-y-1.5 text-center">
                <ShieldCheck className="w-6 h-6 mx-auto text-emerald-600" />
                <h5 className="font-serif-brand font-bold text-brand-on-surface text-sm">Zero Preservatives</h5>
                <p className="text-xs text-brand-on-surface-variant">Pure spices, natural cold-pressed oil droplets, and pink rock salt only.</p>
              </div>
            </div>

            {/* Paragraph 2 */}
            <div className="space-y-2 pt-2">
              <h4 className="font-serif-brand text-lg font-bold text-brand-on-surface">
                Small Batches, Maximum Freshness
              </h4>
              <p>
                At <strong>{settings.storeName}</strong>, we refuse industrial shortcuts. We roast in limited 5-kilogram batches every single week. Whether it's our flagship <strong>Munagaku Karam</strong> (Drumstick leaves) for iron-rich vitality, our <strong>Karivepaku Karam</strong> for hair and scalp wellness, or our wholesome <strong>Putnala Podi</strong> for hot ghee rice, each jar is a labor of domestic warmth and authentic nostalgia.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 sm:px-6 border-t border-brand-outline-variant/30 bg-brand-surface-card flex justify-between items-center">
            <span className="text-xs text-brand-muted">Fresh batch ready to ship</span>
            <button
              onClick={() => {
                setIsStoryModalOpen(false);
                const el = document.getElementById('our-podis-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2.5 font-label-brand text-xs font-bold uppercase tracking-wider text-white bg-brand-primary rounded-brand-btn flex items-center gap-1.5 shadow-xs cursor-pointer"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Explore Our Podis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
