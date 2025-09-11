// src/components/Contact/ContactHero.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import client from '../../lib/sanityClient';
import heroFallback from '../../assets/abouthero.jpg';
import BlurZoomBg from '../common/BlurZoomBg';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "contact"][0].ContactHero{
  heading,
  subheading,
  scrollIndicatorText,
  "backgroundImageUrl": backgroundImage.asset->url,
  "backgroundImageAlt": backgroundImage.alt
}`;

const translations = {
  en: {
    heading: 'Get in Touch',
    subheading: '',
    scroll: 'Scroll',
    bgAlt: 'Contact Hero Background',
  },
  du: {
    heading: 'Kontakt aufnehmen',
    subheading: '',
    scroll: 'Scrollen',
    bgAlt: 'Kontakt Hero Hintergrund',
  },
};

const ContactHero = () => {
  const [heroRaw, setHeroRaw] = useState(null); // raw data from Sanity (or null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();

  useEffect(() => {
    let mounted = true;

    async function fetchHero() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setHeroRaw(data ?? null);
      } catch (err) {
        console.error('ContactHero fetch error:', err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchHero();
    return () => {
      mounted = false;
    };
  }, []);

  // translator with safe fallback to English
  const t = (key) => (translations[language] && translations[language][key]) || translations.en[key];

  // derive final displayed values: prefer Sanity -> localized translations -> static fallback constants
  const heading = heroRaw?.heading?.[language] ?? t('heading');
  const subheading = heroRaw?.subheading?.[language] ?? t('subheading');
  const scrollIndicatorText = heroRaw?.scrollIndicatorText?.[language] ?? t('scroll');
  const backgroundImageUrl = heroRaw?.backgroundImageUrl ?? heroFallback;
  const backgroundImageAlt = heroRaw?.backgroundImageAlt ?? t('bgAlt');

  return (
    <section className="h-[90vh] w-full relative flex items-center justify-center text-white rounded-3xl overflow-hidden">
      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />

      {/* background image with blur/zoom */}
      <BlurZoomBg src={backgroundImageUrl} alt={backgroundImageAlt} />

      {/* content */}
      <div className="relative z-20 text-center p-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold"
        >
          {heading}
        </motion.h1>

        {subheading ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="mt-4 text-md opacity-90"
          >
            {subheading}
          </motion.p>
        ) : null}
      </div>

      {/* Scroll indicator links to #scroll-contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-24 left-10 z-20"
      >
        <a
          href="#scroll-contact"
          aria-label="Scroll to Contact section"
          className="flex flex-col items-center gap-2"
        >
          <span className="bg-black/50 px-3 py-2 rounded-full text-xs font-semibold">
            {scrollIndicatorText}
          </span>
          <FaArrowDown className="animate-bounce" />
        </a>
      </motion.div>

      {/* Loading / error indicators */}
      {loading && (
        <div className="absolute top-6 right-6 z-30 text-sm text-gray-200 bg-black/30 px-3 py-1 rounded">
          Loading…
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 text-red-300 text-sm z-30">
          Unable to load Contact Hero content from Sanity.
        </div>
      )}
    </section>
  );
};

export default ContactHero;
