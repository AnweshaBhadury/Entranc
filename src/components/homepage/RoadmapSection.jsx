// src/components/Roadmap/RoadmapSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import client from "../../lib/sanityClient";
import useLanguage from "../../hook/useLanguage";

const GROQ_QUERY = `*[_type == "home"][0].RoadmapSection{
  title,
  description,
  buttonText,
  buttonLink,
  cards[] {
    _key,
    number,
    title,
    content,
    partner,
    containerClass,
    titleClass,
    numberClass,
    partnerClass
  }
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// Localized fallback content (EN + DE)
const localizedFallbacks = {
  en: {
    title: "Work Package Roadmap",
    description:
      "Our work is structured into focused work packages — each led by expert partners across Europe. From citizen engagement to digital tools, these packages outline the path to delivering community-led energy transformation.",
    buttonText: "Read Blogs",
    buttonLink: "#",
    cards: [
      {
        id: "r-1",
        number: "1",
        title: "Community Engagement",
        content: "Organize local info sessions, co-op onboarding",
        partner: "Sonnensegler",
        containerClass: "bg-s2 text-primary",
        titleClass: "text-primary",
        numberClass: "text-primary/20",
        partnerClass: "text-primary",
      },
      {
        id: "r-2",
        number: "2",
        title: "Implementation Pilots",
        content: "Launch small-scale projects (solar rooftops, heat pumps)",
        partner: "Local Partners",
        containerClass: "bg-white border-2 border-s2",
        titleClass: "text-s2",
        numberClass: "text-s2/20",
        partnerClass: "text-s2",
      },
      {
        id: "r-3",
        number: "3",
        title: "Baselines for CO2",
        content: "Define measuring baselines and reporting processes",
        partner: "KLIMA³",
        containerClass: "bg-s2 text-primary",
        titleClass: "text-primary",
        numberClass: "text-primary/20",
        partnerClass: "text-primary",
      },
    ],
  },
  du: {
    title: "Roadmap der Arbeitspakete",
    description:
      "Unsere Arbeit ist in fokussierte Arbeitspakete gegliedert — jedes geführt von Expert:innen und Partnern in Europa. Von Bürgerbeteiligung bis zu digitalen Tools zeigen diese Pakete den Weg zur gemeinschaftsgeführten Energiewende.",
    buttonText: "Blogs lesen",
    buttonLink: "#",
    cards: [
      {
        id: "r-1",
        number: "1",
        title: "Bürgerbeteiligung",
        content: "Organisieren Sie lokale Infoveranstaltungen und Genossenschafts-Onboarding",
        partner: "Sonnensegler",
        containerClass: "bg-s2 text-primary",
        titleClass: "text-primary",
        numberClass: "text-primary/20",
        partnerClass: "text-primary",
      },
      {
        id: "r-2",
        number: "2",
        title: "Pilotprojekte",
        content: "Starten Sie Kleinprojekte (Solardächer, Wärmepumpen)",
        partner: "Lokale Partner",
        containerClass: "bg-white border-2 border-s2",
        titleClass: "text-s2",
        numberClass: "text-s2/20",
        partnerClass: "text-s2",
      },
      {
        id: "r-3",
        number: "3",
        title: "CO2-Baselines",
        content: "Definition von Messbaselines und Berichtsprozessen",
        partner: "KLIMA³",
        containerClass: "bg-s2 text-primary",
        titleClass: "text-primary",
        numberClass: "text-primary/20",
        partnerClass: "text-primary",
      },
    ],
  },
};

const RoadmapCard = ({ card }) => (
  <article
    className={`w-full h-full p-8 rounded-3xl shadow-2xl flex flex-col justify-between text-left ${card.containerClass}`}
    aria-labelledby={`roadmap-card-${card.id}-title`}
    role="group"
  >
    <div>
      <p className={`text-8xl font-extrabold ${card.numberClass}`}>{card.number}</p>
      <h3 id={`roadmap-card-${card.id}-title`} className={`text-2xl md:text-4xl font-bold mt-4 ${card.titleClass}`}>{card.title}</h3>
      <p className="mt-4 text-lg">{card.content}</p>
    </div>
    <div>
      <p className="text-sm opacity-70">Organised By</p>
      <p className={`font-bold text-lg ${card.partnerClass}`}>{card.partner}</p>
    </div>
  </article>
);

const safeHref = (href) => {
  try {
    if (!href) return "#";
    const u = new URL(href, window.location.origin);
    return u.href;
  } catch {
    return "#";
  }
};

const RoadmapSection = () => {
  const [language] = useLanguage();
  const fallback = localizedFallbacks[language] ?? localizedFallbacks.en;

  const [cards, setCards] = useState(fallback.cards);
  const [sectionData, setSectionData] = useState({ title: fallback.title, description: fallback.description, buttonText: fallback.buttonText, buttonLink: fallback.buttonLink });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // keep ref to cards for interval stability
  const cardsRef = useRef(cards);
  useEffect(() => { cardsRef.current = cards; }, [cards]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        const finalSection = {
          title: data?.title ?? fallback.title,
          description: data?.description ?? fallback.description,
          buttonText: data?.buttonText ?? fallback.buttonText,
          buttonLink: data?.buttonLink ?? fallback.buttonLink,
        };

        const sanityCards = Array.isArray(data?.cards) && data.cards.length
          ? data.cards.map((c, idx) => ({
              id: c._key ?? `sanity-${idx}`,
              number: c.number ?? String(idx + 1),
              title: c.title ?? (fallback.cards[idx % fallback.cards.length]?.title ?? `Step ${idx + 1}`),
              content: c.content ?? (fallback.cards[idx % fallback.cards.length]?.content ?? ""),
              partner: c.partner ?? (fallback.cards[idx % fallback.cards.length]?.partner ?? ""),
              containerClass: c.containerClass ?? (fallback.cards[idx % fallback.cards.length]?.containerClass ?? ""),
              titleClass: c.titleClass ?? (fallback.cards[idx % fallback.cards.length]?.titleClass ?? ""),
              numberClass: c.numberClass ?? (fallback.cards[idx % fallback.cards.length]?.numberClass ?? ""),
              partnerClass: c.partnerClass ?? (fallback.cards[idx % fallback.cards.length]?.partnerClass ?? ""),
            }))
          : fallback.cards;

        setSectionData(finalSection);
        setCards(sanityCards);
      } catch (err) {
        console.warn("RoadmapSection fetch failed:", err);
        if (!mounted) return;
        setError(err);
        setSectionData({ title: fallback.title, description: fallback.description, buttonText: fallback.buttonText, buttonLink: fallback.buttonLink });
        setCards(fallback.cards);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [language]);

  // rotate cards periodically for the stacked visual
  useEffect(() => {
    if (!cards || cards.length <= 1) return;
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

  const title = sectionData?.title ?? fallback.title;
  const description = sectionData?.description ?? fallback.description;
  const buttonText = sectionData?.buttonText ?? fallback.buttonText;
  const buttonLink = safeHref(sectionData?.buttonLink ?? fallback.buttonLink);

  // determine visual center index for stacked layout
  const centerIndex = Math.floor(cards.length / 2);

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white overflow-hidden" aria-labelledby="roadmap-heading">
      <div className="container mx-auto text-center space-y-12">
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.h2 variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} id="roadmap-heading" className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
            {title}
          </motion.h2>

          <motion.p variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-dark-gray">
            {description}
          </motion.p>

          <motion.a
            href={buttonLink}
            aria-label={buttonText}
            variants={fadeSlide}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="inline-flex items-center gap-2 bg-m-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary transition-all duration-300 group mx-auto"
          >
            <FaArrowRight />
            <span>{loading ? (language === "du" ? "Wird geladen..." : "Loading...") : buttonText}</span>
          </motion.a>

          {error && <p className="text-red-500 text-sm mt-2">Could not load section data.</p>}
        </div>

        {/* Desktop stacked 3D cards */}
        <div className="hidden md:flex h-[500px] justify-center items-center relative" style={{ perspective: "1000px" }} aria-hidden={false}>
          {cards.map((card, index) => {
            const displayIndex = index;
            // offset relative to center
            const offsetFromCenter = displayIndex - centerIndex;
            const scale = displayIndex === centerIndex ? 1 : 0.85;
            const rotateY = displayIndex === centerIndex ? 0 : (offsetFromCenter < 0 ? -35 : 35);
            const zIndex = displayIndex === centerIndex ? 3 : 1;
            const x = `${offsetFromCenter * 80}%`;

            return (
              <motion.div
                key={card.id ?? `${index}-${card.number}`}
                className="absolute w-80 h-[450px]"
                initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                animate={{
                  scale,
                  x,
                  y: 0,
                  opacity: 1,
                  rotateY,
                  zIndex,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <RoadmapCard card={card} />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Swiper */}
        <div className="md:hidden">
          <Swiper spaceBetween={20} slidesPerView={1.2} centeredSlides={true} className="w-full h-[480px]">
            {cards.map((card) => (
              <SwiperSlide key={card.id ?? card.number} className="h-full">
                <RoadmapCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
