// src/components/Marquee/Marquee.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup } from 'react-icons/hi';
import bulbIcon from '../../assets/bulb.svg';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "home"][0].Marquee.items[]{
  _key,
  "localeText": localeText,
  "iconType": iconType
}`;

/**
 * animation variants
 */
const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Localized fallback items
const localizedFallbacks = {
  en: [
    { text: 'Power to the People.', iconType: 'userGroup' },
    { text: 'Energy by the People.', iconType: 'bulb' },
    { text: 'Clean energy for all.', iconType: 'bulb' },
  ],
  du: [
    { text: 'Macht für die Menschen.', iconType: 'userGroup' },
    { text: 'Energie von den Menschen.', iconType: 'bulb' },
    { text: 'Saubere Energie für alle.', iconType: 'bulb' },
  ],
};

const Marquee = () => {
  const [language] = useLanguage();
  const fallbackItems = localizedFallbacks[language] ?? localizedFallbacks.en;

  const [items, setItems] = useState(() => [...fallbackItems, ...fallbackItems]); // small initial set
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ensure a minimum number of items and duplicate for seamless marquee
  const ensureMarqueeArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return [...fallbackItems, ...fallbackItems];
    const out = [...arr];
    while (out.length < 6) out.push(...arr); // make it long enough for visual effect
    // duplicate sequence once for continuous scroll (avoids gap)
    return [...out, ...out];
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        // Sanity query returns an array of items (or undefined/null)
        const fetched = Array.isArray(res) && res.length ? res : null;

        if (fetched) {
          const normalized = fetched.map((it, idx) => {
            // Extract text from localeText object or string
            let text = '';
            const localeText = it?.localeText;
            if (typeof localeText === 'object' && localeText !== null) {
              // prefer exact language key then fall back to 'en' or any string found
              text = String(localeText[language] ?? localeText.en ?? Object.values(localeText)[0] ?? '').trim();
            } else if (typeof localeText === 'string') {
              text = localeText.trim();
            }

            // iconType may be an array or string; normalize to a single lowercase string
            let iconType = it?.iconType ?? '';
            if (Array.isArray(iconType)) {
              iconType = String(iconType[0] ?? '').trim();
            } else {
              iconType = String(iconType).trim();
            }

            // if any field missing, fall back to localized fallback at same index
            const fb = fallbackItems[idx % fallbackItems.length] || fallbackItems[0];

            return {
              _key: it._key ?? `fetched-${idx}`,
              text: text || fb.text,
              iconType: iconType || fb.iconType,
            };
          });

          setItems(ensureMarqueeArray(normalized));
        } else {
          setItems(ensureMarqueeArray(fallbackItems));
        }
      } catch (err) {
        console.warn('Marquee fetch failed', err);
        if (!mounted) return;
        setError(err);
        setItems(ensureMarqueeArray(fallbackItems));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // re-run when language changes so text picks correct locale fallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <motion.div
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 bg-gray-100 overflow-hidden whitespace-nowrap -mt-16 relative z-0"
      role="region"
      aria-label="Site marquee"
    >
      <div className="animate-marquee-fast flex items-center">
        {loading && (
          <p className="text-m-primary mx-12">{language === 'du' ? 'Wird geladen...' : 'Loading...'}</p>
        )}

        {items.map((item, index) => {
          const key = item._key ?? `${item.text}-${index}`;
          const iconType = (item.iconType || '').toLowerCase();
          const showUser = iconType.includes('user');
          const showBulb = iconType.includes('bulb');

          return (
            <React.Fragment key={key}>
              {showUser && (
                <HiOutlineUserGroup
                  className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee text-m-primary mx-12"
                  aria-hidden="true"
                />
              )}

              {showBulb && (
                <img
                  src={bulbIcon}
                  alt={item.text ? `Icon for ${item.text}` : 'Lightbulb icon'}
                  className="h-16 md:h-24 lg:h-32 w-auto mx-12"
                  loading="lazy"
                  aria-hidden="true"
                />
              )}

              <h2 className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee font-bold text-m-primary mx-12">
                {item.text}
              </h2>
            </React.Fragment>
          );
        })}
      </div>

      {error && <div className="mt-4 text-red-500 text-sm text-center">Could not load marquee items.</div>}
    </motion.div>
  );
};

export default Marquee;
