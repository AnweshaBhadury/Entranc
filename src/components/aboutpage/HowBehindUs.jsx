// src/components/HowBehindUs/HowBehindUs.jsx
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import handsFallback from '../../assets/hands.svg';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

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
  { key: 'core', title: 'Core Values of EnTranC', description: '', special: true, backgroundImageUrl: handsFallback },
  { key: 'participation', title: 'Participation', description: 'Every Member Has A Say In Project Decisions.', special: false },
  { key: 'sustainability', title: 'Sustainability', description: 'Balance Ecological, Social And Financial Outcomes.', special: false },
  { key: 'partnership', title: 'Partnership', description: 'Fair Contracts With Landowners, Local Governments And Partners.', special: false },
  { key: 'innovation', title: 'Innovation', description: 'Support Energy Sharing, Blockchain-Based Shares And Live KPIs.', special: false },
];

// Translations for English and German (du)
const translations = {
  en: {
    introLabel: '💡 Our Values & Team',
    heading: 'The How Behind Us',
    tiles: {
      core: { title: 'Core Values of EnTranC', description: '' },
      participation: { title: 'Participation', description: 'Every Member Has A Say In Project Decisions.' },
      sustainability: { title: 'Sustainability', description: 'Balance Ecological, Social And Financial Outcomes.' },
      partnership: { title: 'Partnership', description: 'Fair Contracts With Landowners, Local Governments And Partners.' },
      innovation: { title: 'Innovation', description: 'Support Energy Sharing, Blockchain-Based Shares And Live KPIs.' },
    },
  },
  du: {
    introLabel: '💡 Unsere Werte & Team',
    heading: 'Das Wie Hinter Uns',
    tiles: {
      core: { title: 'Kernwerte von EnTranC', description: '' },
      participation: { title: 'Beteiligung', description: 'Jedes Mitglied hat ein Mitspracherecht bei Projektentscheidungen.' },
      sustainability: { title: 'Nachhaltigkeit', description: 'Ausgewogene ökologische, soziale und finanzielle Ergebnisse.' },
      partnership: { title: 'Partnerschaft', description: 'Faire Verträge mit Grundeigentümern, Kommunen und Partnern.' },
      innovation: { title: 'Innovation', description: 'Unterstützung für Energiesharing, Blockchain-basierte Anteile und Live-KPIs.' },
    },
  },
};

const HowBehindUs = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();

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

  // simple translator with safe fallbacks to English
  const t = (path, fallback = '') => {
    try {
      const parts = path.split('.');
      let cur = translations[language] ?? translations.en;
      for (const p of parts) {
        cur = cur?.[p];
        if (cur === undefined) return fallback;
      }
      return cur ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Section-level fields: prefer Sanity values, fallback to translations
  const introLabel = section?.introLabel ?? t('introLabel', translations.en.introLabel);
  const heading = section?.heading ?? t('heading', translations.en.heading);

  // Build tiles: prefer Sanity tiles if present, otherwise fallbackTiles with translations
  const tilesFromSanity = Array.isArray(section?.tiles) && section.tiles.length ? section.tiles : null;

  const tiles = (tilesFromSanity ? tilesFromSanity.map((tile, idx) => {
    // Attempt to match to a fallback key by comparing normalized titles (best-effort),
    // otherwise use index-based fallback translation (if available).
    const normalizedTitle = (tile.title || '').toLowerCase().replace(/\s+/g, '');
    const matchKey = fallbackTiles.find(ft => ft.title.toLowerCase().replace(/\s+/g,'').includes(normalizedTitle))?.key;
    const transKey = matchKey || fallbackTiles[idx]?.key;

    const translated = transKey ? t(`tiles.${transKey}`, {}) : {};
    return {
      title: tile.title ?? translated.title ?? (fallbackTiles[idx]?.title ?? ''),
      description: tile.description ?? translated.description ?? (fallbackTiles[idx]?.description ?? ''),
      special: !!tile.special,
      backgroundImageUrl: tile.backgroundImageUrl ?? fallbackTiles[idx]?.backgroundImageUrl ?? handsFallback,
      _key: tile._key ?? `${transKey ?? idx}-${idx}`,
    };
  }) : fallbackTiles.map((ft) => {
    const translated = t(`tiles.${ft.key}`, {});
    return {
      title: translated.title ?? ft.title,
      description: translated.description ?? ft.description,
      special: !!ft.special,
      backgroundImageUrl: ft.backgroundImageUrl ?? handsFallback,
      _key: ft.key,
    };
  }));

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="w-full ">
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
                    key={t._key ?? i}
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
                  key={t._key ?? i}
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

        {loading && (
          <div className="mt-4 text-sm text-center text-gray-500">Loading...</div>
        )}

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
