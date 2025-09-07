// src/components/Contact/ContactHero.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import client from '../../lib/sanityClient';
import heroFallback from '../../assets/abouthero.jpg';

const GROQ_QUERY = `*[_type == "contact"][0].ContactHero{
  heading,
  subheading,
  scrollIndicatorText,
  "backgroundImageUrl": backgroundImage.asset->url,
  "backgroundImageAlt": backgroundImage.alt
}`;

const ContactHero = () => {
  const [hero, setHero] = useState({
    heading: 'Get in Touch',
    subheading: '',
    scrollIndicatorText: 'Scroll',
    backgroundImageUrl: heroFallback,
    backgroundImageAlt: 'Contact Hero Background',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchHero() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        setHero({
          heading: data?.heading || hero.heading,
          subheading: data?.subheading || hero.subheading,
          scrollIndicatorText: data?.scrollIndicatorText || hero.scrollIndicatorText,
          backgroundImageUrl: data?.backgroundImageUrl || heroFallback,
          backgroundImageAlt: data?.backgroundImageAlt || 'Contact Hero Background',
        });
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchHero();
    return () => { mounted = false; };
  }, []);

  if (loading) return null;

  return (
    <section className="h-[90vh] w-full relative flex items-center justify-center text-white rounded-3xl overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        src={hero.backgroundImageUrl}
        alt={hero.backgroundImageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-20 text-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold"
        >
          {hero.heading}
        </motion.h1>

        {hero.subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="mt-4 text-md opacity-90"
          >
            {hero.subheading}
          </motion.p>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-24 left-10 z-20 flex flex-col items-center gap-2"
      >
        <div className="bg-black/50 p-2 rounded-full">
          <span className="font-semibold text-xs">{hero.scrollIndicatorText}</span>
          <FaArrowDown className="animate-bounce mt-1 mx-auto" />
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-4 left-4 text-red-300 text-sm z-30">
          Unable to load Contact Hero content from Sanity.
        </div>
      )}
    </section>
  );
};

export default ContactHero;
