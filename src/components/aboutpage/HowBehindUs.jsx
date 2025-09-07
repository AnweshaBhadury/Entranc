// src/components/HowBehindUs/HowBehindUs.jsx
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import handsFallback from '../../assets/hands.svg';
import client from '../../lib/sanityClient';

const GROQ_QUERY = `*[_type == "about"][0].HowBehindUs{
  introLabel,
  heading,
  tiles[]{
    title,
    description,
    special,
    "backgroundImageUrl": backgroundImage.asset->url
  }
}`;

const fallbackTiles = [
  { title: 'Core Values of EnTranC', description: '', special: true, backgroundImageUrl: handsFallback },
  { title: 'Participation', description: 'Every Member Has A Say In Project Decisions.', special: false },
  { title: 'Sustainability', description: 'Balance Ecological, Social And Financial Outcomes.', special: false },
  { title: 'Partnership', description: 'Fair Contracts With Landowners, Local Governments And Partners.', special: false },
  { title: 'Innovation', description: 'Support Energy Sharing, Blockchain-Based Shares And Live KPIs.', special: false },
];

const HowBehindUs = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSection() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setSection(data || null);
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchSection();
    return () => { mounted = false; };
  }, []);

  const introLabel = section?.introLabel ?? '💡 Our Values & Team';
  const heading = section?.heading ?? 'The How Behind Us';
  const tiles = section?.tiles?.length ? section.tiles : fallbackTiles;

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto">

        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-2">
            <p className="font-bold text-m-primary">{introLabel}</p>
            <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold text-primary">
              {heading}
            </h2>
          </div>
        </ScrollReveal>

        {/* Tiles */}
        <ScrollReveal delay={0.15}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden shadow-lg">
            {tiles.map((t, i) => {
              if (t.special) {
                return (
                  <div
                    key={i}
                    className="relative min-h-[260px] md:min-h-[320px] bg-s1 text-white"
                    style={{
                      backgroundImage: `url(${t.backgroundImageUrl ?? handsFallback})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'left center'
                    }}
                  >
                    <div className="absolute inset-0 bg-s1/35" />
                    <div className="relative h-full flex items-center">
                      <div className="px-8 py-10">
                        <h3 className="font-bold leading-tight text-3xl md:text-4xl whitespace-pre-line">
                          {t.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className="bg-white text-primary flex flex-col items-center justify-center text-center p-8 border-t md:border-t-0 md:border-l border-gray-200"
                >
                  <h3 className="font-bold text-xl md:text-2xl mb-3">{t.title}</h3>
                  <p className="text-sm leading-relaxed max-w-[18ch] md:max-w-[26ch]">
                    {t.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            Unable to load How Behind Us content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default HowBehindUs;
