import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PodiItem } from '../types';
import { Flame, Eye, ShoppingBag, MessageSquare, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const PodisCatalog: React.FC = () => {
  const {
    podis,
    setSelectedPodi,
    addToCart,
    getWhatsAppOrderUrl,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', label: 'All Podis' },
    { id: 'leafy', label: '🌿 Leafy Superfoods' },
    { id: 'traditional', label: '🌶️ Traditional Karams' },
    { id: 'lentils', label: '🥜 Lentils & Seeds' },
    { id: 'combos', label: '🎁 Gift & Value Boxes' },
  ];

  const filteredPodis = podis.filter((podi) => {
    const matchesCat = activeCategory === 'all' || podi.category === activeCategory;
    const matchesSearch =
      podi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podi.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podi.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getWeightForPodi = (podi: PodiItem) => {
    const weightIdx = selectedWeights[podi.id] ?? 1;
    return podi.weights[weightIdx] || podi.weights[0];
  };

  const setWeightForPodi = (podiId: string, idx: number) => {
    setSelectedWeights((prev) => ({ ...prev, [podiId]: idx }));
  };

  return (
    <section
      id="our-podis-section"
      className="py-12 sm:py-16 px-4 sm:px-6 transition-colors"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header matching screenshot */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-2">
          <h2
            id="our-podis-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand tracking-tight"
            style={{ color: 'var(--color-primary)' }}
          >
            Our Podis
          </h2>
          <p
            className="text-sm sm:text-base text-brand-on-surface-variant font-sans-brand"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Big flavor. Small packs.
          </p>
        </div>

        {/* Search and Category Filter Chips */}
        <div className="mb-8 space-y-4">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted opacity-70" />
            <input
              id="podi-search-input"
              type="text"
              placeholder="Search podis, ingredients, or spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-brand-surface-card border border-brand-outline-variant/60 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-brand-on-surface shadow-2xs"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-muted hover:text-brand-primary"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'text-white shadow-xs'
                    : 'bg-brand-surface-container text-brand-on-surface hover:bg-brand-surface-container-high'
                }`}
                style={{
                  backgroundColor:
                    activeCategory === cat.id
                      ? 'var(--color-primary)'
                      : 'var(--color-surface-container)',
                  color: activeCategory === cat.id ? '#ffffff' : 'var(--color-on-surface)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid / Horizontal view matching screenshot */}
        {filteredPodis.length === 0 ? (
          <div className="text-center py-12 bg-brand-surface-container/40 rounded-xl p-8 max-w-md mx-auto border border-dashed border-brand-outline-variant">
            <Sparkles className="w-8 h-8 mx-auto text-brand-primary mb-2 opacity-60" />
            <h3 className="font-serif-brand text-lg text-brand-on-surface">No Podis Found</h3>
            <p className="text-xs text-brand-on-surface-variant mt-1">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-1.5 text-xs font-semibold bg-brand-primary text-white rounded cursor-pointer"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            id="podis-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6"
          >
            {filteredPodis.map((podi) => {
              const currentWeight = getWeightForPodi(podi);
              const currentPrice = currentWeight.price;

              return (
                <motion.div
                  layout
                  key={podi.id}
                  id={`podi-card-${podi.id}`}
                  className="bg-brand-surface-card rounded-brand-card p-4 sm:p-5 border border-brand-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    borderColor: 'var(--color-outline-variant)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  {/* Badge */}
                  {podi.badge && (
                    <div className="absolute top-6 left-6 z-10">
                      <span
                        className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded shadow-xs"
                        style={{ backgroundColor: 'var(--color-primary-container)' }}
                      >
                        {podi.badge}
                      </span>
                    </div>
                  )}

                  {/* Top Image Container matching screenshot placeholder/visual */}
                  <div>
                    <div
                      onClick={() => setSelectedPodi(podi)}
                      className="w-full aspect-square rounded-lg overflow-hidden bg-brand-surface-container mb-4 cursor-pointer relative flex items-center justify-center group-hover:opacity-95 transition-opacity border border-brand-outline-variant/20"
                      style={{ backgroundColor: 'var(--color-surface-container)' }}
                    >
                      <img
                        src={podi.image}
                        alt={podi.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Hover eye icon overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-xs text-brand-primary p-2 rounded-full shadow-md">
                          <Eye className="w-5 h-5" />
                        </span>
                      </div>

                      {/* Spiciness Indicator pill */}
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className={`w-3 h-3 ${podi.spiciness === 3 ? 'text-red-500' : podi.spiciness === 2 ? 'text-amber-400' : 'text-emerald-400'}`} />
                        <span>
                          {podi.spiciness === 3 ? 'Fiery' : podi.spiciness === 2 ? 'Medium' : 'Mild'}
                        </span>
                      </div>
                    </div>

                    {/* Product Name matching Caslon display typography */}
                    <div className="space-y-1 mb-3">
                      <h3
                        onClick={() => setSelectedPodi(podi)}
                        className="text-xl sm:text-2xl font-serif-brand font-normal text-brand-on-surface hover:text-brand-primary cursor-pointer line-clamp-1"
                        style={{ color: 'var(--color-on-surface)' }}
                        title={podi.name}
                      >
                        {podi.name}
                      </h3>
                      
                      {/* Subtitle / Tagline */}
                      <p
                        className="text-xs sm:text-sm text-brand-on-surface-variant font-sans-brand line-clamp-2 min-h-[36px]"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        {podi.tagline}
                      </p>
                    </div>

                    {/* Weight options selector tabs */}
                    {podi.weights.length > 1 && (
                      <div className="flex items-center gap-1.5 mb-3">
                        {podi.weights.map((w, idx) => {
                          const isSelected = (selectedWeights[podi.id] ?? 1) === idx;
                          return (
                            <button
                              key={w.grams}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setWeightForPodi(podi.id, idx);
                              }}
                              className={`text-[11px] font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-surface-container-high font-bold text-brand-primary border border-brand-primary/40'
                                  : 'bg-brand-surface-container text-brand-on-surface-variant hover:bg-brand-surface-container-high'
                              }`}
                              style={{
                                color: isSelected ? 'var(--color-primary)' : 'inherit',
                              }}
                            >
                              {w.label.split(' ')[0]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Price and VIEW DETAILS button matching screenshot */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-2xl sm:text-3xl font-serif-brand font-bold"
                          style={{ color: 'var(--color-on-surface)' }}
                        >
                          ₹{currentPrice}
                        </span>
                        {podi.originalPrice && (
                          <span className="text-xs line-through text-brand-muted opacity-60">
                            ₹{Math.round(podi.originalPrice * (currentWeight.grams / (podi.weights[1]?.grams || 200)))}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-brand-muted uppercase font-label-brand tracking-wider">
                        {currentWeight.label}
                      </span>
                    </div>

                    {/* VIEW DETAILS Action Button matching screenshot */}
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        id={`btn-view-details-${podi.id}`}
                        onClick={() => setSelectedPodi(podi)}
                        className="w-full py-3 text-xs font-label-brand font-bold tracking-widest uppercase text-white shadow-xs hover:opacity-95 active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-on-primary)',
                          borderRadius: 'var(--radius-btn)',
                        }}
                      >
                        VIEW DETAILS
                      </button>

                      {/* Quick Add / WhatsApp Bar */}
                      <div className="flex items-center gap-2">
                        <button
                          id={`quick-add-bag-${podi.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(podi, currentWeight, 1);
                          }}
                          className="flex-1 py-1.5 text-xs font-semibold border border-brand-outline-variant/80 hover:bg-brand-surface-container rounded-brand-btn text-brand-on-surface transition cursor-pointer flex items-center justify-center gap-1.5"
                          style={{ borderRadius: 'var(--radius-btn)' }}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Box</span>
                        </button>
                        
                        <a
                          id={`quick-whatsapp-order-${podi.id}`}
                          href={getWhatsAppOrderUrl([
                            { podi, selectedWeight: currentWeight, quantity: 1 },
                          ])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-brand-btn transition cursor-pointer"
                          style={{ borderRadius: 'var(--radius-btn)' }}
                          title="Instant WhatsApp Order for this Podi"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
