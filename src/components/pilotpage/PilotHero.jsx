// src/components/PilotHero/PilotHero.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import pilotFallback from '../../assets/pilothero2.jpg';
import client from '../../lib/sanityClient';
import BlurZoomBg from '../common/BlurZoomBg';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "pilot"][0].PilotHero{
  heading,
  subheading,
  scrollIndicatorText,
  "backgroundImageUrl": backgroundImage.asset->url,
  "backgroundImageAlt": backgroundImage.alt
}`;

const translations = {
  en: {
    heading: 'Pilot Projects',
    subheading: '',
    scrollText: 'Scroll',
    bgAlt: 'Pilot Hero Background',
    loading: 'Loading...',
    error: 'Unable to load Pilot Hero content from Sanity.',
  },
  du: {
    heading: 'Pilotprojekte',
    subheading: '',
    scrollText: 'Scrollen',
    bgAlt: 'Pilot Held Hintergrund',
    loading: 'Wird geladen...',
    error: 'Pilot Hero-Inhalt konnte nicht aus Sanity geladen werden.',
  },
};

const PilotHero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();

  const t = (key) => (translations[language] && translations[language][key]) || translations.en[key];

  useEffect(() => {
    let mounted = true;

    async function fetchHero() {
      try {
        setLoading(true);
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setHero(data || null);
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);
        setHero(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchHero();
    return () => { mounted = false; };
  }, []);

  const bgImageUrl = hero?.backgroundImageUrl ?? pilotFallback;
  const bgAlt = hero?.backgroundImageAlt ?? t('bgAlt');

  const heading = hero?.heading?.[language] ?? t('heading');
  const subheading = hero?.subheading?.[language] ?? t('subheading');
  const scrollText = hero?.scrollIndicatorText?.[language] ?? t('scrollText');

  return (
    <section
      className="h-[90vh] w-full relative flex items-center justify-center text-white rounded-3xl overflow-hidden"
      role="region"
      aria-label="Pilot hero"
    >
      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />

      {/* background with blur-zoom */}
      <BlurZoomBg src={bgImageUrl} alt={bgAlt} />

      <div className="relative z-20 text-center p-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold leading-tight"
        >
          {String(heading).split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </motion.h1>

        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="mt-4 text-md opacity-90"
          >
            {subheading}
          </motion.p>
        )}

        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 text-sm text-white/80"
          >
            {t('loading')}
          </motion.p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-24 left-10 z-20"
      >
        <a
          href="#scroll-project"
          aria-label={scrollText}
          className="flex flex-col items-center gap-2"
        >
          <span className="bg-black/50 px-3 py-2 rounded-full text-xs font-semibold">{scrollText}</span>
          <FaArrowDown className="animate-bounce" />
        </a>
      </motion.div>

      {error && (
        <div className="absolute bottom-4 left-4 text-red-300 text-sm z-30" role="alert">
          {t('error')}
        </div>
      )}
    </section>
  );
};

export default PilotHero;
