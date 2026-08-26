import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    titleLine1: 'Hand-pounded.',
    titleAccent: 'Sun-dried.',
    titleLine3: "Andhra's soul.",
    subtitle: 'Made in small batches using traditional methods and the finest ingredients.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Authentic stone grounded Andhra Podis and red chillies',
    tag: 'Batch #48 Fresh Harvest',
  },
  {
    id: 2,
    titleLine1: 'Pure Desi.',
    titleAccent: 'Zero Chemical.',
    titleLine3: 'Grandma’s Rolu.',
    subtitle: 'Slow pounded in traditional stone mortar (Rolu-Rokali) to preserve natural aromatic essential oils.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Sun-dried curry leaves and organic moringa leaves',
    tag: 'Rolu Stone Pounded',
  },
  {
    id: 3,
    titleLine1: 'Guntur Spice.',
    titleAccent: 'Pure Ghee Mate.',
    titleLine3: 'Every Grain Magic.',
    subtitle: 'Crisp hot idlis, steaming rice, and crunchy ghee roast dosas will never be the same again.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Podi with hot rice, ghee, and traditional South Indian tiffin',
    tag: '100% Preservative Free',
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setIsStoryModalOpen } = useStore();

  // Auto carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const scrollToPodis = () => {
    const el = document.getElementById('our-podis-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDifferences = () => {
    const el = document.getElementById('why-us-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-4 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex flex-col items-center text-left sm:text-center">
        
        {/* Main Hero Visual Card with Image & Decorative Fallback */}
        <div
          id="hero-image-container"
          className="w-full relative aspect-square sm:aspect-4/3 max-h-[460px] rounded-2xl overflow-hidden shadow-sm mb-8 sm:mb-10 bg-brand-surface-container flex items-center justify-center border border-brand-outline-variant/40 group"
          style={{
            backgroundColor: 'var(--color-surface-container)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />
              
              {/* Badge overlay on slide */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {slide.tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Artistic Frame Accent */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold tracking-widest text-brand-primary uppercase shadow-xs">
            <Flame className="w-3 h-3 text-red-600 animate-bounce" />
            <span>Andhra Craft</span>
          </div>
        </div>

        {/* Hero Headings */}
        <div className="w-full space-y-4 max-w-xl text-left sm:text-center">
          <h1
            id="hero-main-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-serif-brand font-normal tracking-tight leading-[1.15]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {slide.titleLine1}{' '}
            <span
              className="italic font-normal block sm:inline"
              style={{ color: 'var(--color-primary)' }}
            >
              {slide.titleAccent}
            </span>{' '}
            {slide.titleLine3}
          </h1>

          {/* Subtitle */}
          <p
            id="hero-subtitle"
            className="text-base sm:text-lg text-brand-on-surface-variant font-sans-brand leading-relaxed max-w-lg mx-auto"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {slide.subtitle}
          </p>

          {/* Hero Action Buttons matching screenshot */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full">
            <button
              id="hero-btn-our-podis"
              onClick={scrollToPodis}
              className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-label-brand font-bold tracking-widest uppercase text-white shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              <span>OUR PODIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-what-makes-diff"
              onClick={scrollToDifferences}
              className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-label-brand font-bold tracking-widest uppercase border border-current hover:bg-brand-surface-container active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center"
              style={{
                borderColor: 'var(--color-on-surface)',
                color: 'var(--color-on-surface)',
                backgroundColor: 'transparent',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              WHAT MAKES US DIFFERENT
            </button>
          </div>

          {/* Interactive Carousel Pagination Dots matching screenshot */}
          <div className="pt-4 flex items-center justify-center gap-2" id="hero-carousel-dots">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                id={`hero-dot-${idx}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-6 opacity-100' : 'opacity-35 hover:opacity-70'
                }`}
                style={{
                  backgroundColor:
                    currentSlide === idx ? 'var(--color-primary)' : 'var(--color-outline)',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
