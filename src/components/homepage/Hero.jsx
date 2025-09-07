// src/components/Hero/Hero.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import hero1 from '../../assets/hero1.jpg';
import client from '../../lib/sanityClient'; // removed urlFor since query returns URL directly

const GROQ_QUERY = `*[_type == "home"][0].HeroSection{
  heading,
  subheading,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  "backgroundImageUrl": backgroundImage.asset->url,
  "backgroundImageAlt": backgroundImage.alt
}`;

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchHero() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        // data should be the HeroSection object (or null)
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

  // Use the backgroundImageUrl that the GROQ query returns
  const bgImageUrl = hero?.backgroundImageUrl ? hero.backgroundImageUrl : hero1;
  const bgAlt = hero?.backgroundImageAlt ?? 'Hero background';

  const heading = hero?.heading ?? 'From local land to local power...';
  const subheading = hero?.subheading ?? '';
  const primaryText = hero?.primaryButtonText ?? 'Join the Cooperative';
  const primaryLink = hero?.primaryButtonLink ?? '#';
  const secondaryText = hero?.secondaryButtonText ?? 'Learn More';
  const secondaryLink = hero?.secondaryButtonLink ?? '#';

  return (
    <section className="h-[90vh] w-full relative flex items-center justify-center rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <motion.img
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        src={bgImageUrl}
        alt={bgAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-20 text-center text-white p-4 leading-none max-w-4xl">
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

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <motion.a
            href={primaryLink}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className={`bg-m-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 inline-block text-center
              ${loading || error ? 'pointer-events-none opacity-60' : ''}`}
            aria-label="Primary action"
          >
            {loading ? 'Loading...' : primaryText}
          </motion.a>

          <motion.a
            href={secondaryLink}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="border-2 border-s2 text-white font-bold py-3 px-8 rounded-lg hover:bg-s2 hover:text-m-s2 transition-colors duration-300 inline-block text-center"
          >
            {loading ? '...' : secondaryText}
          </motion.a>
        </div>

        {error && (
          <div className="mt-4 text-red-300 text-sm">
            Unable to load hero content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
