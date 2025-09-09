// src/components/Marquee/Marquee.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup } from 'react-icons/hi';
import bulbIcon from '../../assets/bulb.svg';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "home"][0].Marquee{
  items[] {
    text,
    iconType
  }
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// Localized fallback items
const localizedFallbacks = {
  en: [
    { text: 'Power to the People.', iconType: 'userGroup' },
    { text: 'Energy by the People.', iconType: 'bulb' },
    { text: 'Power to the People.', iconType: 'userGroup' },
    { text: 'Energy by the People.', iconType: 'bulb' },
  ],
  du: [
    { text: 'Macht für die Menschen.', iconType: 'userGroup' },
    { text: 'Energie von den Menschen.', iconType: 'bulb' },
    { text: 'Macht für die Menschen.', iconType: 'userGroup' },
    { text: 'Energie von den Menschen.', iconType: 'bulb' },
  ],
};

const Marquee = () => {
  const [language] = useLanguage();
  const fallbackItems = localizedFallbacks[language] ?? localizedFallbacks.en;

  const [items, setItems] = useState(() => [...fallbackItems]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper: ensure we have at least a few items and duplicate sequence for seamless marquee
  const ensureMarqueeArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return [...fallbackItems];
    // if length < 4, repeat until length >= 4 for visual effect
    const out = [...arr];
    while (out.length < 6) out.push(...arr);
    // duplicate whole sequence once more so CSS marquee has room (prevents visible gap)
    return [...out, ...out];
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        const fetched = Array.isArray(res?.items) && res.items.length ? res.items : null;

        if (fetched) {
          // Normalize items: ensure text & iconType
          const normalized = fetched.map((it, idx) => ({
            text: String(it?.text ?? '').trim() || fallbackItems[idx % fallbackItems.length].text,
            iconType: String(it?.iconType ?? '').trim() || fallbackItems[idx % fallbackItems.length].iconType,
            _key: it._key ?? `fetched-${idx}`,
          }));
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

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // re-run when language toggles to update fallbacks

  return (
    <motion.div
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 bg-gray-100 overflow-hidden whitespace-nowrap -mt-16 relative z-0"
      aria-hidden={false}
      role="region"
      aria-label="Site marquee"
    >
      <div className="animate-marquee-fast flex items-center">
        {loading && <p className="text-m-primary mx-12">{language === 'du' ? 'Wird geladen...' : 'Loading...'}</p>}
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
                  aria-hidden={false}
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
