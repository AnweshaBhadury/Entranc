// src/components/AboutHero/AboutHero.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import hero2Fallback from '../../assets/abouthero.jpg';
import client from '../../lib/sanityClient';

const GROQ_QUERY = `*[_type == "about"][0].AboutHero{
  heading,
  subheading,
  "backgroundImageUrl": backgroundImage.asset->url,
  "backgroundImageAlt": backgroundImage.alt,
  scrollIndicatorText
}`;

const AboutHero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchHero() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setHero(data || null);
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

  const bgImageUrl = hero?.backgroundImageUrl ?? hero2Fallback;
  const bgAlt = hero?.backgroundImageAlt ?? 'About Hero Background';
  const heading = hero?.heading ?? 'About EnTranC';
  const subheading = hero?.subheading ?? '';
  const scrollText = hero?.scrollIndicatorText ?? 'Scroll';

  return (
    <section className="h-[90vh] w-full relative flex items-center justify-center text-white rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <motion.img
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        src={bgImageUrl}
        alt={bgAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-20 text-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold"
        >
          {heading.split('\n').map((line, i) => (
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
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-24 left-10 z-20 flex flex-col items-center gap-2"
      >
        <div className="bg-black/50 p-2 rounded-full">
          <span className="font-semibold text-xs">{scrollText}</span>
          <FaArrowDown className="animate-bounce mt-1 mx-auto" />
        </div>
      </motion.div>

      {error && (
        <div className="absolute bottom-4 left-4 text-red-300 text-sm z-30">
          Unable to load About Hero content from Sanity.
        </div>
      )}
    </section>
  );
};

export default AboutHero;
