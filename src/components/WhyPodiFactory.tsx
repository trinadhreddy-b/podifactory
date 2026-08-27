import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen } from 'lucide-react';

export const WhyPodiFactory: React.FC = () => {
  const { setIsStoryModalOpen } = useStore();

  return (
    <section id="why-us-section" className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Text and Our Story Button */}
        <div className="space-y-4 max-w-xl">
          <h2
            id="why-us-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand tracking-tight"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Why The Podi Factory?
          </h2>

          <p
            className="text-base sm:text-lg text-brand-on-surface-variant font-sans-brand leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            We bring you the taste of tradition, made the old-fashioned way - for your healthy, flavorful meals.
          </p>

          <div className="pt-2">
            <button
              id="btn-our-story"
              onClick={() => setIsStoryModalOpen(true)}
              className="px-8 py-3.5 text-xs sm:text-sm font-label-brand font-bold tracking-widest uppercase text-white shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>OUR STORY</span>
            </button>
          </div>
        </div>

        {/* Artisanal Photography matching screenshot */}
        <div
          className="w-full relative aspect-square sm:aspect-16/9 rounded-2xl overflow-hidden shadow-sm bg-brand-surface-container border border-brand-outline-variant/30 group"
          style={{
            backgroundColor: 'var(--color-surface-container)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/trinadhreddy-b/assetsfortpf@main/footer_image.png"
            alt="Traditional Andhra Podi Craftsmanship"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-label-brand tracking-widest uppercase text-amber-300 font-bold">
                From Our Ancestral Kitchen
              </p>
              <p className="font-serif-brand text-lg sm:text-xl font-normal">
                Slow roasted in cast iron, crushed in granite stone
              </p>
            </div>
            <span className="text-xs opacity-80 backdrop-blur-xs bg-black/40 px-3 py-1 rounded-full w-fit">
              Guntur & Godavari Heritage
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
