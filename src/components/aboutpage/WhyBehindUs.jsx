// src/components/WhyBehindUs/WhyBehindUs.jsx
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { motion } from 'framer-motion';
import client from '../../lib/sanityClient';
import a1Fallback from '../../assets/a1.jpeg';
import a2Fallback from '../../assets/a2.jpeg';
import useLanguage from '../../hook/useLanguage';

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
    introLabel: 'Community Energy Model',
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
  },
  du: {
    introLabel: 'Modell der Energiegemeinschaft',
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

const WhyBehindUs = () => {
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
    return () => {
      mounted = false;
    };
  }, []);

  // Helper to get localized fallback for a key
  const localized = (key, fallback) => {
    try {
      return (translations[language] && translations[language][key]) ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Section-level values: prefer Sanity -> localized translations -> default fallback
  const introLabel = section?.introLabel ?? localized('introLabel', fallbackContent.introLabel);
  const heading = section?.heading ?? localized('heading', fallbackContent.heading);
  const description = section?.description ?? localized('description', fallbackContent.description);

  // Images: prefer Sanity images if array present; else localized images; else global fallbackContent.images
  const imagesFromSanity = Array.isArray(section?.images) && section.images.length ? section.images : null;
  const localizedImages = localized('images', fallbackContent.images);
  const images = imagesFromSanity
    ? [
        { url: imagesFromSanity[0]?.url ?? localizedImages[0]?.url ?? a1Fallback, alt: imagesFromSanity[0]?.alt ?? localizedImages[0]?.alt ?? 'Image 1' },
        { url: imagesFromSanity[1]?.url ?? localizedImages[1]?.url ?? a2Fallback, alt: imagesFromSanity[1]?.alt ?? localizedImages[1]?.alt ?? 'Image 2' }
      ]
    : [
        { url: localizedImages[0]?.url ?? a1Fallback, alt: localizedImages[0]?.alt ?? 'Image 1' },
        { url: localizedImages[1]?.url ?? a2Fallback, alt: localizedImages[1]?.alt ?? 'Image 2' }
      ];

  // Highlights: prefer Sanity -> localized -> fallback
  const highlightsFromSanity = Array.isArray(section?.highlights) && section.highlights.length ? section.highlights : null;
  const highlightsLocalized = localized('highlights', fallbackContent.highlights);
  const highlights = highlightsFromSanity ? highlightsFromSanity : highlightsLocalized ?? fallbackContent.highlights;

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
