// src/components/OurTeam/OurTeam.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import teamFallback from '../../assets/aboutblogs.webp';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "about"][0].OurTeam{
  heading,
  members[] {
    _key,
    name,
    role,
    description,
    "imageUrl": coalesce(imageUrl, image.asset->url, image.url)
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

// Small helper to pick localized string-like shapes
const getLocale = (node, lang = 'en') => {
  if (node == null) return null;

  // unwrap common wrapper keys if present
  if (typeof node === 'object' && !Array.isArray(node)) {
    const wrapperKeys = ['localeText', 'localeString', 'content', 'text', 'description', 'role'];
    for (const k of wrapperKeys) {
      if (node[k] != null) return getLocale(node[k], lang);
    }
  }

  if (typeof node === 'string') return node;

  if (Array.isArray(node) && node.length) {
    // portable text blocks: join children text
    const joined = node
      .map((blk) => {
        if (!blk) return '';
        if (typeof blk === 'string') return blk;
        if (blk.children && Array.isArray(blk.children)) {
          return blk.children.map(c => c?.text || '').join('');
        }
        const s = Object.values(blk).find(v => typeof v === 'string');
        return s ?? '';
      })
      .filter(Boolean)
      .join('\n\n');
    if (joined) return joined;
  }

  if (typeof node === 'object') {
    if (node[lang]) return node[lang];
    if (node.en) return node.en;
    // fallback to first string property
    const firstString = Object.values(node).find(v => typeof v === 'string');
    if (firstString) return firstString;
  }

  return null;
};

const OurTeam = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage(); // 'en' | 'du'

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
        setSection(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    fetchTeam();
    return () => { mounted = false; };
  }, []);

  // translator with safe fallback to English content
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

  // localized heading
  const heading = useMemo(() => {
    const h = getLocale(section?.heading, language);
    return h ?? t('heading', translations.en.heading);
  }, [section, language]);

  // Build members: if Sanity provides members, merge them with translations/fallbacks.
  const membersFromSanity = Array.isArray(section?.members) && section.members.length ? section.members : null;

  const members = useMemo(() => {
    if (membersFromSanity) {
      return membersFromSanity.map((mem, idx) => {
        // Try to match to a fallback key by name (best-effort), otherwise use index-based fallback
        const nameNorm = (mem.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const foundKey = fallbackMembers.find((fm) =>
          fm.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(nameNorm)
        )?.key;

        const fallbackObj = fallbackMembers[idx] || fallbackMembers[0];
        const key = foundKey ?? fallbackObj.key;

        // localized fields
        const name = mem.name ?? t(`members.${key}.name`, fallbackObj.name);
        const role = getLocale(mem.role, language) ?? t(`members.${key}.role`, fallbackObj.role);
        const description = getLocale(mem.description, language) ?? t(`members.${key}.description`, fallbackObj.description);

        // imageUrl may be a plain string (imageUrl) per your provided output
        const imageUrl = mem.imageUrl ?? fallbackObj.imageUrl ?? teamFallback;

        return {
          _key: mem._key ?? `${key}-${idx}`,
          name,
          role,
          description,
          imageUrl,
        };
      });
    }

    // fallback members (localized translations)
    return fallbackMembers.map((fm) => {
      const translated = t(`members.${fm.key}`, {});
      return {
        _key: fm.key,
        name: translated.name ?? fm.name,
        role: translated.role ?? fm.role,
        description: translated.description ?? fm.description,
        imageUrl: fm.imageUrl ?? teamFallback,
      };
    });
  }, [membersFromSanity, language]);

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
              <p className="text-sm text-dark-gray whitespace-pre-line">{member.description}</p>
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
