// src/components/WhyBehindUs/WhyBehindUs.jsx
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { motion } from 'framer-motion';
import client from '../../lib/sanityClient';
import a1Fallback from '../../assets/a1.jpeg';
import a2Fallback from '../../assets/a2.jpeg';

const GROQ_QUERY = `*[_type == "about"][0].WhyBehindUs{
  introLabel,
  heading,
  description,
  images[] {
    "url": asset->url,
    alt
  },
  highlights[]
}`;

const fallbackContent = {
  introLabel: 'Community Energy Model',
  heading: 'The Why Behind Us',
  description: `In Germany, community energy cooperatives have become a backbone of the national energy transition—with thousands of citizens owning wind, solar, and bioenergy installations. EnTranC adapts and expands this model to fit diverse European contexts—from rural villages to urban neighborhoods.`,
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

const WhyBehindUs = () => {
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

  const introLabel = section?.introLabel ?? fallbackContent.introLabel;
  const heading = section?.heading ?? fallbackContent.heading;
  const description = section?.description ?? fallbackContent.description;
  const images = section?.images?.length ? section.images : fallbackContent.images;
  const highlights = section?.highlights?.length ? section.highlights : fallbackContent.highlights;

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-bg-offwhite overflow-hidden">
      <div className="container mx-auto">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="font-bold text-m-primary">{introLabel}</p>
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">{heading}</h2>
            <p className="text-dark-gray leading-relaxed">{description}</p>
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
            <img src={images[0]?.url} className="w-full h-full object-cover" alt={images[0]?.alt ?? 'Image 1'} />
          </motion.div>

          <ScrollReveal y={0} delay={0.2} className="md:col-span-1">
            <div className="bg-m-primary text-white p-6 rounded-2xl shadow-lg text-sm space-y-3">
              <ul className="list-disc list-inside space-y-2">
                {highlights.map((item, idx) => <li key={idx}>{item}</li>)}
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
            <img src={images[1]?.url} className="w-full h-full object-cover" alt={images[1]?.alt ?? 'Image 2'} />
          </motion.div>
        </div>

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
