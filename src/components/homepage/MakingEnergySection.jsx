// src/components/MakingEnergySection/MakingEnergySection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../utils/ScrollReveal";
import { FaArrowRight, FaLightbulb } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import client from "../../lib/sanityClient";

// Local fallback images
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

// Fallback cards
const fallbackCards = [
  {
    imageUrl: comm1,
    imageAlt: "Fallback card 1",
    texts: ["Making Energy"],
    hasMarquee: false,
  },
  {
    imageUrl: comm2,
    imageAlt: "Fallback card 2",
    texts: ["Making Energy Communities", "Energy Communities Work...💡"],
    hasMarquee: true,
  },
  {
    imageUrl: comm5,
    imageAlt: "Fallback card 3",
    texts: ["Communities Work..."],
    hasMarquee: false,
  },
];

// EnergyCard Component
const EnergyCard = ({ card }) => (
  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
    <img
      src={card.imageUrl}
      alt={card.imageAlt || "Community image"}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-10"></div>

    <div className="absolute bottom-4 left-0 w-full overflow-hidden">
      <div
        className={
          card.hasMarquee ? "animate-marquee whitespace-nowrap" : "px-4"
        }
      >
        <p className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded">
          {card.texts?.[0] ?? "Making Energy"}
        </p>
        {card.hasMarquee &&
          card.texts?.slice(1).map((t, i) => (
            <p
              key={i}
              className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded ml-4"
            >
              {t}
            </p>
          ))}
      </div>
    </div>
  </div>
);

const MakingEnergySection = () => {
  const [sectionData, setSectionData] = useState(null);
  const [cards, setCards] = useState(fallbackCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Sanity data
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        setSectionData(data || null);
        setCards(data?.cards?.length ? data.cards : fallbackCards);
      } catch (err) {
        console.error("Sanity fetch error:", err);
        if (!mounted) return;
        setError(err);
        setCards(fallbackCards); // fallback on error
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

  // Rotate cards every 2s (desktop carousel)
  useEffect(() => {
    if (cards.length > 0) {
      const interval = setInterval(() => {
        setCards((prev) => {
          const updated = [...prev];
          const last = updated.pop();
          updated.unshift(last);
          return updated;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [cards.length]);

  // Section-level fallbacks
  const title =
    sectionData?.title ?? "Making Energy Communities Work...";
  const subtitle =
    sectionData?.subtitle ?? "About EnTranC";
  const description =
    sectionData?.description ??
    "We believe the future of energy is local, inclusive, and cooperative...";
  const buttonText =
    sectionData?.buttonText ?? "Read Blogs";

  return (
    <section className="relative slanted-divider py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="relative z-10 container mx-auto text-center space-y-12">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="font-bold text-m-primary inline-flex items-center gap-2">
              <FaLightbulb /> {subtitle}
            </p>
            <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
              {title}
            </h2>
            <p className="text-dark-gray max-w-3xl mx-auto">{description}</p>
            <button className="flex items-center gap-2 bg-m-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary transition-all duration-300 group mx-auto">
              <FaArrowRight />
              <span>{loading ? "Loading..." : buttonText}</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Desktop carousel */}
        <div
          className="hidden h-[400px] md:flex justify-center items-center relative"
          style={{ perspective: "1000px" }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="absolute w-72 h-96"
              initial={{ scale: 0, rotateY: 180 }}
              animate={{
                scale: index === 1 ? 1 : 0.85,
                x: `${(index - 1) * 80}%`,
                rotateY: index === 1 ? 0 : index < 1 ? -35 : 35,
                zIndex: index === 1 ? 3 : 1,
              }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <EnergyCard card={card} />
            </motion.div>
          ))}
        </div>

        {/* Mobile swiper */}
        <div className="md:hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            className="w-full h-[480px]"
          >
            {cards.map((card, i) => (
              <SwiperSlide key={i} className="h-full">
                <EnergyCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-4">
            Could not load section data.
          </div>
        )}
      </div>
    </section>
  );
};

export default MakingEnergySection;
