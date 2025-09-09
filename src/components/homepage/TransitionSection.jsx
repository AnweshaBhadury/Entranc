// src/components/Transition/TransitionSection.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import powerGridFallback from '../../assets/homei2.png';
import client, { urlFor } from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "home" && defined(TransitionSection)][0]{
  "transition": TransitionSection{
    label,
    heading,
    description,
    ctaText,
    ctaLink,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    "imageLqip": image.asset->metadata.lqip,
    extraText
  }
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const isExternal = (url = '') => /^https?:\/\//i.test(url || '');

function getSanityImageUrl(img, { width = 1200, autoFormat = true } = {}) {
  if (!img) return null;
  try {
    // If it's already a string URL, return it
    if (typeof img === 'string') {
      return img.trim() === '' ? null : img;
    }
    // otherwise assume it's a Sanity image object
    let builder = urlFor(img).width(width);
    if (autoFormat) builder = builder.auto('format');
    return builder.url();
  } catch {
    return null;
  }
}

// Localized fallback copy
const localized = {
  en: {
    label: 'EnTranC',
    heading: 'Powering the\ntransition\n together.',
    description:
      'A citizen-led cooperative model accelerating renewable energy across Europe — in sync with the EU’s LIFE and Green Deal goals.',
    ctaText: 'Read Blogs',
    ctaLink: '#',
    imageAlt: 'Illustration of a power grid in a green landscape',
    extraText: 'COMMUNITY ENERGY · EU SUPPORTED',
    loading: 'Loading...',
    loadingCta: 'Loading...',
  },
  du: {
    label: 'EnTranC',
    heading: 'Die Energiewende\ngemeinsam\nvorantreiben.',
    description:
      'Ein bürgergeleitetes Genossenschaftsmodell zur Beschleunigung erneuerbarer Energieprojekte in ganz Europa – im Einklang mit LIFE und dem Green Deal der EU.',
    ctaText: 'Blogs lesen',
    ctaLink: '#',
    imageAlt: 'Illustration eines Stromnetzes in einer grünen Landschaft',
    extraText: 'GEMEINSCHAFTSENERGIE · EU GEFÖRDERT',
    loading: 'Wird geladen…',
    loadingCta: 'Wird geladen…',
  },
};

const TransitionSection = () => {
  const [language] = useLanguage();
  const t = (key) => (localized[language] && localized[language][key]) || localized.en[key];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setData(res?.transition ?? null);
      } catch (err) {
        console.warn('TransitionSection fetch failed:', err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Derived values with precedence: Sanity -> localized fallback -> static fallback
  const label = data?.label ?? t('label');
  const heading = data?.heading ?? t('heading');
  const description = data?.description ?? t('description');
  const ctaText = data?.ctaText ?? t('ctaText');
  const ctaLink = data?.ctaLink ?? t('ctaLink');
  const imageAlt = data?.imageAlt ?? t('imageAlt');
  const extraText = data?.extraText ?? t('extraText');

  // image handling: prefer Sanity imageUrl string if present; otherwise use builder when image object is provided
  // original GROQ returns imageUrl (string) and imageLqip; but be defensive in case schemas differ
  const rawImageUrl = data?.imageUrl ?? null;
  const lqip = data?.imageLqip ?? null;

  // Try to build a proper src: if rawImageUrl is already a string use it; else fallback to powerGridFallback
  let imageSrc = powerGridFallback;
  try {
    if (rawImageUrl && typeof rawImageUrl === 'string') {
      imageSrc = rawImageUrl;
    } else if (data?.image && typeof data.image === 'object') {
      const built = getSanityImageUrl(data.image, { width: 1200 });
      if (built) imageSrc = built;
    }
  } catch {
    imageSrc = powerGridFallback;
  }

  const hasCta = !!ctaLink && ctaLink !== '#';

  return (
    <section className="relative bg-white" aria-labelledby="transition-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeSlide}
              className="font-bold inline-flex items-center gap-2 text-base md:text-lg"
            >
              <FaLightbulb aria-hidden /> <span>{label}</span>
            </motion.p>

            <motion.h2
              id="transition-heading"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeSlide}
              className="font-bold leading-[1.05] text-[clamp(2rem,4vw+0.8rem,4rem)] text-[#22351f] whitespace-pre-line"
            >
              {String(heading)}
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeSlide}
              className="mt-4 text-base text-[#29411f] max-w-prose"
            >
              {description}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeSlide}
              className="inline-flex items-center group select-none relative"
            >
              <span
                className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a2a17] text-[#1a2a17] bg-white transition-all duration-300 -mr-px group-hover:opacity-0 group-hover:-translate-x-2"
                aria-hidden="true"
              >
                <span className="text-base leading-none">→</span>
              </span>

              <span className="relative inline-block h-12">
                {hasCta ? (
                  <a
                    href={ctaLink}
                    target={isExternal(ctaLink) ? '_blank' : undefined}
                    rel={isExternal(ctaLink) ? 'noopener noreferrer' : undefined}
                    aria-label={ctaText}
                    className="relative inline-flex h-12 items-center justify-center rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17] px-6 font-semibold tracking-tight transition-[transform,background-color,color,border-color] duration-300 group-hover:-translate-x-12 group-hover:bg-[#FFC21A] group-hover:text-[#0e1510] group-hover:border-[#FFC21A]"
                  >
                    <span>{loading ? t('loadingCta') : ctaText}</span>
                  </a>
                ) : (
                  <button
                    aria-label={ctaText}
                    disabled
                    className="relative inline-flex h-12 items-center justify-center rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17] opacity-70 px-6 font-semibold tracking-tight cursor-not-allowed select-none"
                  >
                    <span>{loading ? t('loadingCta') : ctaText}</span>
                  </button>
                )}

                <span
                  className="pointer-events-none absolute top-0 right-0 flex h-12 w-12 items-center justify-center rounded-xl border border-transparent bg-transparent text-[#0e1510] transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]"
                  aria-hidden="true"
                >
                  <span className="text-base leading-none">→</span>
                </span>
              </span>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="mx-auto lg:mx-0 max-w-[620px]">
              <div
                className="w-full overflow-hidden rounded-lg"
                style={lqip ? { backgroundImage: `url("${lqip}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                aria-hidden={!!lqip}
              >
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="block w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                  style={lqip ? { transition: 'opacity .45s ease-in-out' } : undefined}
                />
              </div>
            </div>

            <motion.aside
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeSlide}
              className="max-w-xl"
            >
              <p className="font-semibold leading-relaxed text-primary">{description}</p>
              <p className="mt-3 text-xs font-bold tracking-wider text-gray-500">{extraText}</p>
            </motion.aside>
          </div>
        </div>

        {loading && <div className="mt-6 text-sm text-gray-500">{t('loading')}</div>}
        {error && <div className="mt-6 text-sm text-red-500">Could not load section content from Sanity.</div>}
      </div>
    </section>
  );
};

export default TransitionSection;
