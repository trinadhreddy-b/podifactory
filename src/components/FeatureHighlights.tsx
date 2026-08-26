import React from 'react';
import { Utensils, Sun, Ban, Box } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      id: 'feature-hand-pounded',
      icon: Utensils,
      title: 'HAND-POUNDED FOR AUTHENTIC TASTE',
      description: 'Slow-crushed in granite stone mortars to preserve essential natural spice oils.',
    },
    {
      id: 'feature-sun-dried',
      icon: Sun,
      title: 'SUN-DRIED FOR RICH FLAVOUR',
      description: 'Naturally dehydrated under the scorching Andhra sun for deep, concentrated taste.',
    },
    {
      id: 'feature-no-preservatives',
      icon: Ban,
      title: 'NO PRESERVATIVES NO ADDITIVES',
      description: '100% natural, honest ingredients. Zero artificial colors, MSG, or stabilizers.',
    },
    {
      id: 'feature-small-batches',
      icon: Box,
      title: 'SMALL BATCHES MADE WITH CARE',
      description: 'Roasted and blended fresh weekly to ensure maximum aroma and crunchy freshness.',
    },
  ];

  return (
    <section
      id="features-section"
      className="py-12 sm:py-16 px-4 sm:px-6 bg-brand-surface-container/60 border-y border-brand-outline-variant/30 transition-colors"
      style={{
        backgroundColor: 'var(--color-surface-container)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="flex flex-col items-center text-center space-y-3 p-3 rounded-lg hover:bg-brand-surface/60 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-brand-on-surface"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                <h3
                  className="text-xs sm:text-xs font-label-brand font-bold tracking-widest leading-relaxed uppercase max-w-[170px]"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {feat.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
