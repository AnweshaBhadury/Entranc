// src/components/MakingEnergy/MakingEnergySection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../utils/ScrollReveal";
import { FaArrowRight, FaLightbulb } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import client from "../../lib/sanityClient";
import useLanguage from "../../hook/useLanguage";

import comm1 from "../../assets/comm1.jpg";
import comm2 from "../../assets/comm2.jpeg";
import comm5 from "../../assets/comm5.jpg";

const GROQ_QUERY = `*[_type == "home"][0].MakingEnergySection{
  title,
  subtitle,
  description,
  buttonText,
  cards[] {
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    texts,
    hasMarquee
  }
}`;

const fallbackCardsDefault = [
  { key: "c1", imageUrl: comm1, imageAlt: "Community image 1", texts: ["Making Energy"], hasMarquee: false },
  { key: "c2", imageUrl: comm2, imageAlt: "Community image 2", texts: ["Making Energy Communities", "Energy Communities Work...💡"], hasMarquee: true },
  { key: "c3", imageUrl: comm5, imageAlt: "Community image 3", texts: ["Communities Work..."], hasMarquee: false },
];

// localized fallbacks
const localizedFallbacks = {
  en: {
    title: "Making Energy Communities Work...",
    subtitle: "About EnTranC",
    description: "We believe the future of energy is local, inclusive, and cooperative...",
    buttonText: "Read Blogs",
    cards: fallbackCardsDefault,
    loadingText: "Loading..."
  },
  du: {
    title: "Energiegemeinschaften funktionieren...",
    subtitle: "Über EnTranC",
    description: "Wir glauben, die Zukunft der Energie ist lokal, inklusiv und genossenschaftlich...",
    buttonText: "Blogs lesen",
    cards: [
      { key: "c1", imageUrl: comm1, imageAlt: "Community Bild 1", texts: ["Energie machen"], hasMarquee: false },
      { key: "c2", imageUrl: comm2, imageAlt: "Community Bild 2", texts: ["Energiegemeinschaften", "Gemeinschaften funktionieren...💡"], hasMarquee: true },
      { key: "c3", imageUrl: comm5, imageAlt: "Community Bild 3", texts: ["Gemeinschaften funktionieren..."], hasMarquee: false },
    ],
    loadingText: "Wird geladen..."
  }
};

const EnergyCard = ({ card }) => (
  <article className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl" role="group" aria-label={card.ariaLabel ?? card.texts?.[0] ?? "Community card"}>
    <img
      src={card.imageUrl}
      alt={card.imageAlt || (card.texts?.[0] ?? "Community image")}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-black/20" />
    <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-10" />
    <div className="absolute bottom-4 left-0 w-full overflow-hidden">
      <div className={card.hasMarquee ? "animate-marquee whitespace-nowrap" : "px-4"}>
        <p className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded">
          {card.texts?.[0] ?? "Making Energy"}
        </p>
        {card.hasMarquee && card.texts?.slice(1).map((t, i) => (
          <p key={i} className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded ml-4">
            {t}
          </p>
        ))}
      </div>
    </div>
  </article>
);

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const MakingEnergySection = () => {
  const [language] = useLanguage();
  const t = (key) => (localizedFallbacks[language] && localizedFallbacks[language][key]) || localizedFallbacks.en[key];

  const [sectionData, setSectionData] = useState(null);
  const [cards, setCards] = useState(() => t('cards'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // keep a stable ref for cards so interval uses latest state
  const cardsRef = useRef(cards);
  useEffect(() => { cardsRef.current = cards; }, [cards]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        const fallback = localizedFallbacks[language] ?? localizedFallbacks.en;
        const final = {
          title: data?.title ?? fallback.title,
          subtitle: data?.subtitle ?? fallback.subtitle,
          description: data?.description ?? fallback.description,
          buttonText: data?.buttonText ?? fallback.buttonText,
        };

        // map sanity cards (if any) to normalized shape
        const sanityCards = Array.isArray(data?.cards) && data.cards.length
          ? data.cards.map((c, idx) => ({
              key: c._key ?? `sanity-${idx}`,
              imageUrl: c.imageUrl ?? (fallback.cards[idx]?.imageUrl),
              imageAlt: c.imageAlt ?? (fallback.cards[idx]?.imageAlt ?? `card-${idx + 1}`),
              texts: Array.isArray(c.texts) && c.texts.length ? c.texts : (fallback.cards[idx]?.texts ?? ["Making Energy"]),
              hasMarquee: !!c.hasMarquee,
            }))
          : fallback.cards;

        setSectionData(final);
        setCards(sanityCards);
      } catch (err) {
        console.warn("MakingEnergySection fetch failed:", err);
        if (!mounted) return;
        setError(err);
        setSectionData({
          title: t('title'),
          subtitle: t('subtitle'),
          description: t('description'),
          buttonText: t('buttonText'),
        });
        setCards(t('cards'));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [language]); // refetch when language changes to update localized fallbacks

  // rotate cards periodically (visual carousel effect)
  useEffect(() => {
    if (!cards || cards.length <= 1) return undefined;
    const id = setInterval(() => {
      setCards((prev) => {
        if (!prev || prev.length <= 1) return prev;
        const next = [...prev];
        const last = next.pop();
        next.unshift(last);
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [cards.length]);

  const title = sectionData?.title?.[language] ?? t('title');
  const subtitle = sectionData?.subtitle?.[language] ?? t('subtitle');
  const description = sectionData?.description?.[language] ?? t('description');
  const buttonText = sectionData?.buttonText?.[language] ?? t('buttonText');

  return (
    <section className="relative slanted-divider py-20 px-phone md:px-tab lg:px-desktop bg-white" aria-labelledby="making-energy-heading">
      <div className="relative z-10 container mx-auto text-center space-y-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.p variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="font-bold text-m-primary inline-flex items-center gap-2">
            <FaLightbulb /> {subtitle}
          </motion.p>

          <motion.h2 variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} id="making-energy-heading" className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
            {title}
          </motion.h2>

          <motion.p variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-dark-gray max-w-3xl mx-auto">
            {description}
          </motion.p>

          <motion.button variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex items-center gap-2 bg-m-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary transition-all duration-300 group mx-auto" aria-label={buttonText}>
            <FaArrowRight />
            <span>{loading ? t('loadingText') : buttonText}</span>
          </motion.button>
        </div>

        {/* Desktop 3D stacked cards */}
        <div className="hidden h-[400px] md:flex justify-center items-center relative" style={{ perspective: "1000px" }} aria-hidden={false}>
          {cards.map((card, index) => {
            // center card is index 1 (visual), but we handle dynamic lengths by centering around middle
            const displayIndex = index; // already arranged by rotation effect
            const centerIndex = Math.floor(cards.length / 2);
            const offsetFromCenter = displayIndex - centerIndex;
            const scale = displayIndex === centerIndex ? 1 : 0.85;
            const rotateY = displayIndex === centerIndex ? 0 : (offsetFromCenter < 0 ? -30 : 30);
            const zIndex = displayIndex === centerIndex ? 3 : 1;
            const x = `${offsetFromCenter * 60}%`;

            return (
              <motion.div
                key={card.key ?? `${index}-${card.imageUrl}`}
                className="absolute w-72 h-96"
                initial={{ scale: 0, rotateY: 180 }}
                animate={{
                  scale,
                  x,
                  rotateY,
                  zIndex,
                }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <EnergyCard card={card} />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Swiper carousel */}
        <div className="md:hidden">
          <Swiper spaceBetween={20} slidesPerView={1.05} centeredSlides className="w-full h-[480px]">
            {cards.map((card) => (
              <SwiperSlide key={card.key ?? card.imageUrl} className="h-full">
                <EnergyCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {error && <div className="text-red-500 text-sm mt-4">Could not load section data.</div>}
      </div>
    </section>
  );
};

export default MakingEnergySection;
