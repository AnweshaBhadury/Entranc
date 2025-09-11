// src/components/WhoWeAre/WhoWeAre.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "about"][0].WhoWeAre{
  heading,
  "content": paragraphs
}`;

const fallbackContent = {
  heading: 'Who We Are',
  content: [
    `At EnTranC, we believe in one simple idea: the energy transition must be fast, fair, and local. We are a community-driven cooperative dedicated to bringing renewable energy projects—wind, solar and agri-PV—into the hands of citizens, landowners and municipalities in Bavaria. Founded by a group of local climate advocates, our mission is to make the energy transition tangible and inclusive. By connecting people with purpose, capital with impact and technology with trust, EnTranC helps create energy communities that everyone can own.`,
    `This mission emphasises fairness, local ownership and democratic participation, which are hallmarks of cooperatives.`
  ]
};

// Localized defaults (English + German)
const translations = {
  en: {
    heading: fallbackContent.heading,
    content: fallbackContent.content,
  },
  du: {
    heading: 'Wer wir sind',
    content: [
      `Bei EnTranC glauben wir an eine einfache Idee: die Energiewende muss schnell, gerecht und lokal sein. Wir sind eine gemeindebasierte Genossenschaft, die sich dafür einsetzt, Erneuerbare-Energien-Projekte — Wind, Solar und Agri-PV — in die Hände von Bürger:innen, Grundbesitzer:innen und Gemeinden in Bayern zu bringen. Gegründet von einer Gruppe lokaler Klimaaktivist:innen, besteht unsere Mission darin, die Energiewende greifbar und inklusiv zu machen. Indem wir Menschen mit Sinn, Kapital mit Wirkung und Technik mit Vertrauen verbinden, hilft EnTranC, Energiegemeinschaften zu schaffen, die alle besitzen können.`,
      `Diese Mission betont Gerechtigkeit, lokale Eigentümerschaft und demokratische Teilhabe — Kennzeichen von Genossenschaften.`
    ]
  }
};

const WhoWeAre = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage(); // assume returns e.g. 'en' or 'du'

  useEffect(() => {
    let mounted = true;

    async function fetchSection() {
      setLoading(true);
      setError(null);
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        // data may be null or an object
        setSection(data || null);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        setSection(null);
        // don't throw — we fallback in render
        // optional: console.error('Sanity fetch error:', err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchSection();
    return () => { mounted = false; };
  }, []);

  // translator with safe fallback to English translations/fallbackContent
  const t = (key) => {
    const cur = translations[language] ?? translations.en;
    return cur?.[key] ?? fallbackContent[key];
  };

  // derive localized heading and content from Sanity data when present,
  // otherwise use translations / fallback
  const heading = useMemo(() => {
    // sanity heading shape: { _type: 'localeString', en: '...', du: '...' }
    if (section?.heading && typeof section.heading === 'object') {
      return section.heading[language] ?? section.heading.en ?? t('heading');
    }
    return t('heading');
  }, [section, language]);

  const content = useMemo(() => {
    // sanity content shape example:
    // content: [
    //   { _key: '...', _type: 'localeText', en: '...', du: '...' },
    //   ...
    // ]
    if (Array.isArray(section?.content) && section.content.length) {
      // map each localeText to the chosen language, fallback to 'en' if missing
      const mapped = section.content
        .map((item) => {
          if (!item) return '';
          // item might be object with language fields (en/du) OR nested object like { en: 'text' }
          if (typeof item === 'string') return item;
          if (typeof item === 'object') {
            // if the locale text is nested like { en: '...', du: '...' }
            return item[language] ?? item.en ?? '';
          }
          return '';
        })
        .filter(Boolean);
      if (mapped.length) return mapped;
    }

    // fallback to translations if no content from Sanity
    return t('content');
  }, [section, language]);

  const fadeSlide = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white" id="scroll-about">
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <motion.h2
            variants={fadeSlide}
            className="text-h2-phone md:text-h2-tab font-bold text-primary"
          >
            {heading}
          </motion.h2>

          {content.map((paragraph, idx) => (
            <motion.p
              key={`whoweare-par-${idx}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.08 }}
              className="text-dark-gray leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        <div className="hidden md:flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <FaLightbulb className="text-9xl text-s2/20" />
          </motion.div>
        </div>

        {loading && (
          <div className="absolute bottom-4 left-4 text-sm text-gray-500">Loading...</div>
        )}

        {error && (
          <div className="absolute bottom-4 left-4 text-red-500 text-sm">
            Unable to load Who We Are content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default WhoWeAre;
