// src/components/WhyBehindUs/WhyBehindUs.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { motion } from 'framer-motion';
import client from '../../lib/sanityClient';
import a1Fallback from '../../assets/a1.jpeg';
import a2Fallback from '../../assets/a2.jpeg';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "about"][0].WhyBehindUs{
  label,
  heading,
  description,
  images[] { "url": coalesce(asset->url, url), alt },
  "highlights": cards[] {
    _key,
    localeText,
  }
}`;

const fallbackContent = {
  label: 'Community Energy Model',
  heading: 'The Why Behind Us',
  description:
    `In Germany, community energy cooperatives have become a backbone of the national energy transition—with thousands of citizens owning wind, solar, and bioenergy installations. EnTranC adapts and expands this model to fit diverse European contexts—from rural villages to urban neighborhoods.`,
  images: [
    { url: a1Fallback, alt: 'Solar Panels and Wind Turbine' },
    { url: a2Fallback, alt: 'Green Energy Concept' }
  ],
  highlights: [
    'EnTranC is a registered cooperative where each member owns part of the project and has a democratic voice—one member, one vote.',
    'Minimum investment: €250',
    'Democratic governance: 1 share = 1 vote',
    'Returns from real projects in your region',
    'Community decision-making and annual reporting',
    'EU Goal: 1 Renewable Energy Community per 10,000 citizens by 2025'
  ]
};

// Localized defaults (English + German)
const translations = {
  en: {
    label: fallbackContent.label,
    heading: fallbackContent.heading,
    description: fallbackContent.description,
    images: fallbackContent.images,
    highlights: fallbackContent.highlights,
  },
  du: {
    label: 'Modell der Energiegemeinschaft',
    heading: 'Das Warum Hinter Uns',
    description:
      `In Deutschland sind Energiegemeinschaften zu einer Säule der nationalen Energiewende geworden – mit tausenden Bürger:innen, die Wind-, Solar- und Bioenergieanlagen besitzen. EnTranC passt dieses Modell an und erweitert es für verschiedene europäische Kontexte – vom ländlichen Dorf bis zur städtischen Nachbarschaft.`,
    images: [
      { url: a1Fallback, alt: 'Solarmodule und Windkraftanlage' },
      { url: a2Fallback, alt: 'Konzept für grüne Energie' }
    ],
    highlights: [
      'EnTranC ist eine eingetragene Genossenschaft, in der jedes Mitglied einen Anteil am Projekt besitzt und demokratisch mitbestimmt – eine Stimme pro Mitglied.',
      'Mindestinvestition: 250 €',
      'Demokratische Governance: 1 Anteil = 1 Stimme',
      'Renditen aus realen Projekten in Ihrer Region',
      'Gemeinschaftliche Entscheidungsfindung und jährliche Berichterstattung',
      'EU-Ziel: 1 Energiegemeinschaft pro 10.000 Bürger bis 2025'
    ]
  }
};

// getLocale: extract best text for lang from many Sanity shapes
const getLocale = (node, lang) => {
  if (node == null) return null;

  // unwrap common wrapper keys (e.g. { localeText: {...} })
  if (typeof node === 'object' && !Array.isArray(node)) {
    const wrapperKeys = ['localeText', 'localeString', 'label', 'title', 'text', 'content', 'description'];
    for (const k of wrapperKeys) {
      if (node[k] != null) return getLocale(node[k], lang);
    }
  }

  if (typeof node === 'string') return node;

  if (Array.isArray(node) && node.length) {
    // portable text blocks: gather children.text
    const joined = node
      .map((blk) => {
        if (!blk) return '';
        if (typeof blk === 'string') return blk;
        if (blk.children && Array.isArray(blk.children)) {
          return blk.children.map(c => c?.text || '').join('');
        }
        // fallback to first string prop in block
        const s = Object.values(blk).find(v => typeof v === 'string');
        return s ?? '';
      })
      .filter(Boolean)
      .join('\n\n');
    if (joined) return joined;
  }

  if (typeof node === 'object') {
    if (node[lang]) return node[lang];
    if (node.en) return node.en;
    // fallback: first string-valued property
    const firstString = Object.values(node).find(v => typeof v === 'string');
    if (firstString) return firstString;
  }

  return null;
};

const WhyBehindUs = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage(); // 'en' | 'du'

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

  const t = (key) => (translations[language] && translations[language][key]) ?? translations.en[key];

  // label / heading / description (localized)
  const label = useMemo(() => {
    const l = getLocale(section?.label, language);
    return l ?? t('label') ?? fallbackContent.label;
  }, [section, language]);

  const heading = useMemo(() => {
    const h = getLocale(section?.heading, language);
    return h ?? t('heading') ?? fallbackContent.heading;
  }, [section, language]);

  const description = useMemo(() => {
    const d = getLocale(section?.description, language);
    return d ?? t('description') ?? fallbackContent.description;
  }, [section, language]);

  // main images (ensure at least 2)
  const images = useMemo(() => {
    // section.images might be array of { url, alt } (from our GROQ) or missing
    const sanityImages = Array.isArray(section?.images) ? section.images : null;
    const localizedImgs = t('images') ?? fallbackContent.images;

    if (!sanityImages || sanityImages.length === 0) {
      return [
        { url: localizedImgs[0]?.url ?? a1Fallback, alt: localizedImgs[0]?.alt ?? 'Image 1' },
        { url: localizedImgs[1]?.url ?? a2Fallback, alt: localizedImgs[1]?.alt ?? 'Image 2' }
      ];
    }

    // normalize and filter bad entries
    const mapped = sanityImages
      .map((it) => {
        const url = (it && (it.url || it.asset?.url)) ?? null;
        const alt = (it && (it.alt ?? it.caption ?? '')) ?? '';
        if (!url) return null;
        return { url, alt };
      })
      .filter(Boolean);

    // guarantee two images
    while (mapped.length < 2) {
      const idx = mapped.length;
      const src = localizedImgs[idx] ?? fallbackContent.images[idx];
      mapped.push({ url: src?.url ?? (idx === 0 ? a1Fallback : a2Fallback), alt: src?.alt ?? `Image ${idx + 1}` });
    }

    return mapped.slice(0, 2);
  }, [section, language]);

  // cards: accept either section.cards or section.highlights (some datasets return highlights as card-like objects)
  const cards = useMemo(() => {
    const rawFromCards = Array.isArray(section?.cards) ? section.cards : null;
    const rawFromHighlights = Array.isArray(section?.highlights) ? section.highlights : null;
    const raw = rawFromCards ?? rawFromHighlights ?? [];

    if (!raw.length) return [];

    return raw.map((c, idx) => {
      const key = c._key ?? `card-${idx}`;

      // title: prefer localeText or plain text
      const title = getLocale(c?.localeText ?? c, language) ?? `Card ${idx + 1}`;
      const desc = getLocale(c?.description, language) ?? '';

      // images: item.images may exist, or fall back to section.images or defaults
      const imgsRaw = Array.isArray(c?.images) && c.images.length ? c.images : Array.isArray(section?.images) && section.images.length ? section.images : [];
      const imgs = imgsRaw
        .map(i => {
          const url = (i && (i.url || i.asset?.url)) ?? null;
          const alt = (i && (i.alt ?? i.caption)) ?? title;
          if (!url) return null;
          return { url, alt };
        })
        .filter(Boolean);

      // ensure at least one image
      if (imgs.length === 0) {
        imgs.push({ url: a1Fallback, alt: title });
      }

      return {
        _key: key,
        title,
        description: desc,
        images: imgs,
      };
    });
  }, [section, language]);

  // highlights: prioritize section.highlights (string or localeText), else build from cards titles, else fallback translations
  const highlights = useMemo(() => {
    if (Array.isArray(section?.highlights) && section.highlights.length) {
      // map items to getLocale — handles nested {localeText: {...}} too
      return section.highlights
        .map(h => {
          // sometimes highlight item is string, sometimes object with localeText
          const resolved = getLocale(h, language) ?? (typeof h === 'string' ? h : null);
          return resolved;
        })
        .filter(Boolean);
    }

    if (cards.length) {
      return cards.map(c => c.title).filter(Boolean);
    }

    return t('highlights') ?? fallbackContent.highlights;
  }, [section, cards, language]);

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-bg-offwhite overflow-hidden">
      <div className="container mx-auto">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="font-bold text-m-primary">{label}</p>
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">{heading}</h2>
            <p className="text-dark-gray leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        </ScrollReveal>

        {/* Image & Highlights Grid */}
        <div className="mt-16 grid md:grid-cols-5 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            whileInView={{ opacity: 1, x: 0, rotate: -5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="md:col-span-2 rounded-2xl overflow-hidden shadow-2xl h-96"
          >
            <img
              src={images[0]?.url}
              className="w-full h-full object-cover"
              alt={images[0]?.alt ?? 'Image 1'}
            />
          </motion.div>

          <ScrollReveal y={0} delay={0.2} className="md:col-span-1">
            <div className="bg-m-primary text-white p-6 rounded-2xl shadow-lg text-sm space-y-3">
              <ul className="list-disc list-inside space-y-2">
                {highlights.map((item, idx) => (
                  <li key={`why-highlight-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            whileInView={{ opacity: 1, x: 0, rotate: 5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="md:col-span-2 rounded-2xl overflow-hidden shadow-2xl h-96"
          >
            <img
              src={images[1]?.url}
              className="w-full h-full object-cover"
              alt={images[1]?.alt ?? 'Image 2'}
            />
          </motion.div>
        </div>

  
        {loading && (
          <div className="mt-6 text-sm text-center text-gray-500">Loading...</div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            Unable to load Why Behind Us content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyBehindUs;
