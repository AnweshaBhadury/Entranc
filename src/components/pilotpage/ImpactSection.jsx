// src/components/Impact/ImpactSection.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StatCounter from '../StatCounter';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

/**
 * Notes:
 * - Prefers Sanity -> localized fallback (en/du).
 * - Normalizes items to avoid undefined access.
 * - Keeps visual layout and StatCounter usage.
 */

const GROQ_QUERY = `*[_type == "pilot"][0].ImpactSection{
  introLabel,
  heading,
  items[] {
    type,
    titleLine1,
    titleLine2,
    value,
    label
  }
}`;

const translations = {
  en: {
    introLabel: 'Our Values & Team',
    heading: 'The How Behind Us',
    items: [
      { type: 'title', titleLine1: 'Impact', titleLine2: 'of EnTranC' },
      { type: 'stat', value: '3', label: 'Pilot Sites Launched' },
      { type: 'stat', value: '42', label: 'MWp Targeted By 2030' },
      { type: 'stat', value: '1000+', label: 'Cooperative Members' },
      { type: 'stat', value: '€45', label: 'Million Mobilised In Citizen Capital' },
    ],
    loading: 'Loading impact data...',
    fetchError: 'Unable to load Impact Section from Sanity.',
  },
  du: {
    introLabel: 'Unsere Werte & Team',
    heading: 'Wie Wir Dahinterstehen',
    items: [
      { type: 'title', titleLine1: 'Auswirkungen', titleLine2: 'von EnTranC' },
      { type: 'stat', value: '3', label: 'Pilotstandorte gestartet' },
      { type: 'stat', value: '42', label: 'MWp bis 2030 geplant' },
      { type: 'stat', value: '1000+', label: 'Genossenschaftsmitglieder' },
      { type: 'stat', value: '€45', label: 'Millionen Bürgerkapital mobilisiert' },
    ],
    loading: 'Lade Impact-Daten...',
    fetchError: 'Impact-Bereich konnte nicht aus Sanity geladen werden.',
  },
};

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * localize(field, language, fallback)
 * - field can be:
 *   - null/undefined -> return fallback
 *   - a plain string -> return it
 *   - an object like { _type: 'localeString', en: '...', du: '...' } -> pick language -> en -> first string
 */
const localize = (field, language, fallback = '') => {
  if (field == null) return fallback;

  // already a plain string
  if (typeof field === 'string') return field;

  // prefer requested language
  if (language && typeof field[language] === 'string' && field[language].length) return field[language];

  // fallback to english
  if (typeof field.en === 'string' && field.en.length) return field.en;

  // pick first available string value, ignoring keys that start with '_'
  for (const [k, v] of Object.entries(field)) {
    if (k.startsWith('_')) continue;
    if (typeof v === 'string' && v.length) return v;
  }

  return fallback;
};

const ImpactSection = () => {
  const [language] = useLanguage();
  const localized = translations[language] ?? translations.en;

  const [impactData, setImpactData] = useState({
    introLabel: localized.introLabel,
    heading: localized.heading,
    items: localized.items,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchImpact() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        const fallback = localized;

        // If Sanity returned a shape, normalize it; otherwise use fallback localized items
        const items = Array.isArray(data?.items) && data.items.length
          ? data.items.map((item, i) => {
              // item.* may be localized objects or strings or null
              const fallbackItem = fallback.items?.[i] ?? {};
              return {
                type: item?.type ?? fallbackItem.type ?? 'stat',
                titleLine1: localize(item?.titleLine1, language, localize(fallbackItem.titleLine1, language, '')),
                titleLine2: localize(item?.titleLine2, language, localize(fallbackItem.titleLine2, language, '')),
                value: localize(item?.value, language, localize(fallbackItem.value, language, '')),
                label: localize(item?.label, language, localize(fallbackItem.label, language, '')),
              };
            })
          : // map fallback items through localize (they might be plain strings/objects)
            (fallback.items || []).map((it) => ({
              type: it.type ?? 'stat',
              titleLine1: localize(it.titleLine1 ?? '', language, ''),
              titleLine2: localize(it.titleLine2 ?? '', language, ''),
              value: localize(it.value ?? '', language, ''),
              label: localize(it.label ?? '', language, ''),
            }));

        setImpactData({
          introLabel: localize(data?.introLabel, language, fallback.introLabel),
          heading: localize(data?.heading, language, fallback.heading),
          items,
        });
      } catch (err) {
        console.error('Impact fetch error:', err);
        if (!mounted) return;
        setError(err);
        // fallback to localized copy on error
        setImpactData({
          introLabel: localized.introLabel,
          heading: localized.heading,
          items: localized.items.map((it) => ({
            type: it.type ?? 'stat',
            titleLine1: localize(it.titleLine1 ?? '', language, ''),
            titleLine2: localize(it.titleLine2 ?? '', language, ''),
            value: localize(it.value ?? '', language, ''),
            label: localize(it.label ?? '', language, ''),
          })),
        });
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchImpact();
    return () => { mounted = false; };
    // re-run when language changes so localized fallback updates automatically
  }, [language]);

  if (loading) {
    return (
      <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
        <div className="w-full text-center py-12">
          <p className="text-m-primary font-semibold">{localized.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white" aria-labelledby="impact-heading">
      <div className="w-full">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.p
            variants={fadeSlide}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="font-bold text-m-primary"
          >
            {impactData.introLabel}
          </motion.p>
          <motion.h2
            id="impact-heading"
            variants={fadeSlide}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-h2-phone md:text-h2-tab font-bold text-primary"
          >
            {impactData.heading}
          </motion.h2>
        </div>

        <motion.div
          variants={fadeSlide}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-5 shadow-lg rounded-xl overflow-hidden"
        >
          {(impactData.items || []).map((item, index) => {
            // Title / hero tile
            if (item.type === 'title') {
              const title1 = String(item.titleLine1 || '').trim();
              const title2 = String(item.titleLine2 || '').trim();
              return (
                <div
                  key={title1 ? `title-${title1}` : `title-${index}`}
                  className="relative bg-m-primary text-white p-8 flex items-center justify-center text-center"
                >
                  <div className="absolute inset-0 bg-[url('/src/assets/hands.svg')] bg-center bg-contain bg-no-repeat opacity-10" aria-hidden />
                  <h3 className="relative text-3xl font-bold leading-tight">
                    {title1}
                    {title2 ? <><br />{title2}</> : null}
                  </h3>
                </div>
              );
            }

            // Stat tile: use StatCounter for consistent animation/formatting
            return (
              <StatCounter
                key={item.label ? `stat-${item.label}` : `stat-${index}`}
                value={String(item.value ?? '')}
                label={String(item.label ?? '')}
              />
            );
          })}
        </motion.div>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {localized.fetchError}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactSection;
