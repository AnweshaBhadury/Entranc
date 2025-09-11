// src/components/HowBehindUs/HowBehindUs.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import handsFallback from '../../assets/hands.svg';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "about"][0].HowBehindUs{
  introLabel,
  heading,
  tiles[] {
    _key,
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
  const [language] = useLanguage(); // e.g. 'en' or 'du'

  useEffect(() => {
    let mounted = true;
    async function fetchSection() {
      setLoading(true);
      setError(null);
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setSection(data || null);
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);
        setSection(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchSection();
    return () => { mounted = false; };
  }, []);

  // helper: take a Sanity locale object like { _type: 'localeString', en: 'x', du: 'y' }
  // or { en: 'x', du: 'y' } or string, and return best match: [language] -> en -> any string
  const getLocale = (node, lang) => {
    if (node == null) return null;

    // if node is plain string
    if (typeof node === 'string') return node;

    // if node is object with language fields
    if (typeof node === 'object') {
      // common shapes: { en: 'x', du: 'y' } OR { _type: 'localeText', en: 'x' }
      if (node[lang]) return node[lang];
      if (node.en) return node.en;

      // sometimes localeText could be an array of blocks - try to extract plain text
      if (Array.isArray(node) && node.length) {
        // join plain strings or block children text if present
        const joined = node
          .map((item) => {
            if (!item) return '';
            if (typeof item === 'string') return item;
            // block type: { children: [{ text: '...' }, ...] }
            if (item.children && Array.isArray(item.children)) {
              return item.children.map(c => c?.text || '').join('');
            }
            // fallback to any string-valued property
            const vals = Object.values(item).filter(v => typeof v === 'string');
            return vals[0] ?? '';
          })
          .filter(Boolean)
          .join('\n\n');
        if (joined) return joined;
      }

      // fallback to first string property found
      const firstString = Object.values(node).find(v => typeof v === 'string');
      if (firstString) return firstString;
    }

    return null;
  };

  // small shorthand to get translation fallback
  const t = (path, defaultValue = '') => {
    try {
      const parts = path.split('.');
      let cur = translations[language] ?? translations.en;
      for (const p of parts) {
        cur = cur?.[p];
        if (cur === undefined) return defaultValue;
      }
      return cur ?? defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const introLabel = useMemo(() => {
    const sVal = getLocale(section?.introLabel, language);
    return sVal ?? t('introLabel', translations.en.introLabel);
  }, [section, language]);

  const heading = useMemo(() => {
    const sVal = getLocale(section?.heading, language);
    return sVal ?? t('heading', translations.en.heading);
  }, [section, language]);

  const tiles = useMemo(() => {
    const sanityTiles = Array.isArray(section?.tiles) ? section.tiles : null;

    if (!sanityTiles || sanityTiles.length === 0) {
      // use fallbackTiles with translations
      return fallbackTiles.map((ft) => {
        const trans = t(`tiles.${ft.key}`, {});
        return {
          _key: ft.key,
          title: trans.title ?? ft.title,
          description: trans.description ?? ft.description,
          special: !!ft.special,
          backgroundImageUrl: ft.backgroundImageUrl ?? handsFallback,
        };
      });
    }

    // Map each sanity tile to localized tile with safe fallbacks
    return sanityTiles.map((tile, idx) => {
      const title = getLocale(tile?.title, language) ?? (
        // try to match fallback by index key if available
        fallbackTiles[idx]?.title ?? ''
      );

      const description = getLocale(tile?.description, language) ?? (
        fallbackTiles[idx]?.description ?? ''
      );

      const backgroundImageUrl = tile?.backgroundImageUrl ?? fallbackTiles[idx]?.backgroundImageUrl ?? handsFallback;

      const special = !!tile?.special;

      const key = tile?._key ?? `howbehindus-${idx}`;

      return {
        _key: key,
        title,
        description,
        special,
        backgroundImageUrl,
      };
    });
  }, [section, language]);

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
                      backgroundImage: `url(${t.backgroundImageUrl})`,
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
