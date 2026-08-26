import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    titleLine1: 'Bitter. Bold.',
    titleAccent: 'Naturally Good.',
    titleLine3: 'Kakara Karam.',
    subtitle:
      'A traditional Andhra podi made with bitter gourd, aromatic spices, and authentic home-style flavors.',
    image:
      'https://cdn.jsdelivr.net/gh/trinadhreddy-b/assetsfortpf@main/kakara_karam_podi.png',
    imageAlt: 'Kakara Karam Podi',
    tag: 'Traditional Andhra Recipe',
  },
  {
    id: 2,
    titleLine1: 'Aromatic.',
    titleAccent: 'Fresh & Earthy.',
    titleLine3: 'Karivepaku Karam.',
    subtitle:
      'Made with fragrant curry leaves and roasted spices for a delicious burst of traditional South Indian flavor.',
    image:
      'https://cdn.jsdelivr.net/gh/trinadhreddy-b/assetsfortpf@main/karivepaku_podi.png',
    imageAlt: 'Karivepaku Karam Podi',
    tag: 'Curry Leaf Goodness',
  },
  {
    id: 3,
    titleLine1: 'Green Goodness.',
    titleAccent: 'Traditionally Made.',
    titleLine3: 'Munaga Karam.',
    subtitle:
      'A flavorful podi crafted with nutrient-rich moringa leaves and carefully roasted traditional spices.',
    image:
      'https://cdn.jsdelivr.net/gh/trinadhreddy-b/assetsfortpf@main/munaga_karam_podi.png',
    imageAlt: 'Munaga Karam Podi',
    tag: 'Made with Moringa Leaves',
  },
  {
    id: 4,
    titleLine1: 'Roasted.',
    titleAccent: 'Nutty & Delicious.',
    titleLine3: 'Putnala Podi.',
    subtitle:
      'A wholesome roasted podi with a rich nutty flavor, perfect with hot rice, ghee, idli, dosa, and more.',
    image:
      'https://cdn.jsdelivr.net/gh/trinadhreddy-b/assetsfortpf@main/put_podi.png',
    imageAlt: 'Putnala Podi',
    tag: 'Roasted to Perfection',
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
          {/* Subtle Ambient Glow behind the product image */}
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full flex items-center justify-center p-3 sm:p-5"
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Badge overlay on slide */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/20 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {slide.tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Artistic Frame Accent */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold tracking-widest text-brand-primary uppercase shadow-xs">
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
