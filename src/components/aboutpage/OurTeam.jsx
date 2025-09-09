// src/components/OurTeam/OurTeam.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import teamFallback from '../../assets/aboutblogs.webp';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "about"][0].OurTeam{
  heading,
  members[]{
    name,
    role,
    description,
    "imageUrl": image.asset->url
  }
}`;

const fallbackMembers = [
  {
    key: 'lisa',
    name: 'Lisa Meier',
    role: 'Chairwoman of the Board',
    description: 'Energy policy specialist and cooperative founder. Leads strategy and community relations.',
    imageUrl: teamFallback,
  },
  {
    key: 'max',
    name: 'Max Becker',
    role: 'Technical Lead',
    description: 'Renewable energy engineer with over 10 years’ experience in solar and wind infrastructure. Oversees project execution.',
    imageUrl: teamFallback,
  },
  {
    key: 'sarah',
    name: 'Sarah Köhler',
    role: 'Community Engagement',
    description: 'Manages member onboarding, events and communications.',
    imageUrl: teamFallback,
  },
  {
    key: 'jonas',
    name: 'Dr. Jonas Weber',
    role: 'Impact Analyst',
    description: 'Environmental scientist focused on CO₂ metrics and regulatory compliance.',
    imageUrl: teamFallback,
  },
];

// Translations for English and German (du)
const translations = {
  en: {
    heading: 'Our Team',
    members: {
      lisa: {
        name: 'Lisa Meier',
        role: 'Chairwoman of the Board',
        description:
          'Energy policy specialist and cooperative founder. Leads strategy and community relations.',
      },
      max: {
        name: 'Max Becker',
        role: 'Technical Lead',
        description:
          'Renewable energy engineer with over 10 years’ experience in solar and wind infrastructure. Oversees project execution.',
      },
      sarah: {
        name: 'Sarah Köhler',
        role: 'Community Engagement',
        description: 'Manages member onboarding, events and communications.',
      },
      jonas: {
        name: 'Dr. Jonas Weber',
        role: 'Impact Analyst',
        description:
          'Environmental scientist focused on CO₂ metrics and regulatory compliance.',
      },
    },
  },
  du: {
    heading: 'Unser Team',
    members: {
      lisa: {
        name: 'Lisa Meier',
        role: 'Vorsitzende des Vorstands',
        description:
          'Expertin für Energiepolitik und Gründerin einer Genossenschaft. Leitet Strategie und Gemeinwesenarbeit.',
      },
      max: {
        name: 'Max Becker',
        role: 'Technischer Leiter',
        description:
          'Ingenieur für erneuerbare Energien mit über 10 Jahren Erfahrung in Solar- und Windinfrastruktur. Verantwortlich für Projektausführung.',
      },
      sarah: {
        name: 'Sarah Köhler',
        role: 'Community-Engagement',
        description: 'Verantwortlich für Mitglieder-Onboarding, Veranstaltungen und Kommunikation.',
      },
      jonas: {
        name: 'Dr. Jonas Weber',
        role: 'Impact-Analyst',
        description:
          'Umweltwissenschaftler mit Fokus auf CO₂-Metriken und regulatorische Compliance.',
      },
    },
  },
};

const OurTeam = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();

  useEffect(() => {
    let mounted = true;
    async function fetchTeam() {
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
    fetchTeam();
    return () => {
      mounted = false;
    };
  }, []);

  // simple translator with safe fallback to English content
  const t = (path, fallback = undefined) => {
    try {
      const parts = path.split('.');
      let cur = translations[language] ?? translations.en;
      for (const p of parts) {
        cur = cur?.[p];
        if (cur === undefined) return fallback;
      }
      return cur ?? fallback;
    } catch {
      return fallback;
    }
  };

  const heading = section?.heading ?? t('heading', translations.en.heading);

  // Build members: if Sanity provides members, merge them with translations/fallbacks.
  const membersFromSanity = Array.isArray(section?.members) && section.members.length ? section.members : null;

  const members = membersFromSanity
    ? membersFromSanity.map((mem, idx) => {
        // Try to match to a fallback key by name (best-effort)
        const nameNorm = (mem.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const foundKey = fallbackMembers.find((fm) =>
          fm.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(nameNorm)
        )?.key;

        // fallback to index-based fallback if matching not found
        const fallbackObj = fallbackMembers[idx] || fallbackMembers[0];
        const key = foundKey ?? fallbackObj.key;

        const translated = t(`members.${key}`, {});

        return {
          _key: mem._key ?? `${key}-${idx}`,
          name: mem.name ?? translated.name ?? fallbackObj.name,
          role: mem.role ?? translated.role ?? fallbackObj.role,
          description: mem.description ?? translated.description ?? fallbackObj.description,
          imageUrl: mem.imageUrl ?? fallbackObj.imageUrl ?? teamFallback,
        };
      })
    : fallbackMembers.map((fm) => {
        const translated = t(`members.${fm.key}`, {});
        return {
          _key: fm.key,
          name: translated.name ?? fm.name,
          role: translated.role ?? fm.role,
          description: translated.description ?? fm.description,
          imageUrl: fm.imageUrl ?? teamFallback,
        };
      });

  // Subtle right->left variants
  const fadeSlide = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="w-full">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-4xl mx-auto space-y-4"
        >
          <motion.h2 variants={fadeSlide} className="text-h2-phone md:text-h2-tab font-bold text-primary">
            {heading}
          </motion.h2>
        </motion.div>

        {/* Team Members */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member._key ?? index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
              className="text-center bg-gray-50 p-8 rounded-2xl shadow-md h-full"
              aria-label={`Team member ${member.name}`}
            >
              <img
                src={member.imageUrl ?? teamFallback}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-s1 object-cover"
              />
              <h3 className="font-bold text-xl text-primary">{member.name}</h3>
              <p className="font-semibold text-m-primary mb-3">{member.role}</p>
              <p className="text-sm text-dark-gray">{member.description}</p>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="mt-4 text-sm text-center text-gray-500">Loading...</div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">Unable to load Our Team content from Sanity.</div>
        )}
      </div>
    </section>
  );
};

export default OurTeam;
