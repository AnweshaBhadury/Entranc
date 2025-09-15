// src/components/Stats/StatsSection.jsx
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight } from "react-icons/fa";
import { VscVmActive } from "react-icons/vsc";
import statsImg from "../../assets/home2.jpeg";
import { client, urlFor } from "../../lib/sanityClient";
import useLanguage from "../../hook/useLanguage";

gsap.registerPlugin(ScrollTrigger);

const GROQ_STATS = `*[_type == "home"][0].StatsSection{
  heading, description, buttonText, buttonLink, backgroundImage,
  cards[] { _key, title, tag, tagColor, iconImage, iconUrl, image, imageAlt, imageCaption, statValue, subText, ctaText, ctaLink }
}`;

function getSanityImageUrl(img, { width = 800, height, autoFormat = true } = {}) {
  if (!img) return null;
  try {
    // If string url passed directly, return as-is (trimmed)
    if (typeof img === "string") return img.trim() === "" ? null : img;
    let builder = urlFor(img).width(width);
    if (height) builder = builder.height(height);
    if (autoFormat) builder = builder.auto("format");
    return builder.url();
  } catch {
    return null;
  }
}

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// Localized fallback cards and section copy
const localizedFallbacks = {
  en: {
    heading: "Statistics that Speak For Itself",
    description: "Building trust, community, and measurable climate action.",
    buttonText: "Read Blogs",
    buttonLink: "#",
    cards: [
      { id: "f-1", tag: "Duration", tagColor: "bg-s1/20 text-s1", iconFallback: <VscVmActive size={20} />, statValue: "4 Years", subText: "2024–2027" },
      { id: "f-2", tag: "CO2 Emission Reduction", tagColor: "bg-s2/20 text-m-s2", subText: "Measureable climate action.", image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
      { id: "f-3", tag: "Community Growth", tagColor: "bg-green-200 text-green-800", subText: "Building trust and local ownership.", image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
      { id: "f-4", tag: "Financial Viability", tagColor: "bg-orange-200 text-orange-800", subText: "Shared ambition and sustainable returns.", image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
    ],
  },
  du: {
    heading: "Statistiken, die für sich sprechen",
    description: "Vertrauen, Gemeinschaft und messbare Klimaschutzmaßnahmen aufbauen.",
    buttonText: "Blogs lesen",
    buttonLink: "#",
    cards: [
      { id: "f-1", tag: "Dauer", tagColor: "bg-s1/20 text-s1", iconFallback: <VscVmActive size={20} />, statValue: "4 Jahre", subText: "2024–2027" },
      { id: "f-2", tag: "CO2-Reduktion", tagColor: "bg-s2/20 text-m-s2", subText: "Messbare Klimaschutzmaßnahmen.", image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
      { id: "f-3", tag: "Wachstum der Gemeinschaft", tagColor: "bg-green-200 text-green-800", subText: "Vertrauen und lokale Eigentümerschaft aufbauen.", image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
      { id: "f-4", tag: "Wirtschaftliche Tragfähigkeit", tagColor: "bg-orange-200 text-orange-800", subText: "Geteilte Ambitionen und nachhaltige Renditen.", image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
    ],
  },
};

export default function StatsSection() {
  const mainRef = useRef(null);
  const viewportRef = useRef(null);
  const railRef = useRef(null);

  const [section, setSection] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const fallback = localizedFallbacks[language] ?? localizedFallbacks.en;

  // Fetch section data
  useEffect(() => {
    let mounted = true;
    client
      .fetch(GROQ_STATS)
      .then((res) => {
        if (!mounted) return;
        if (res) {
          setSection(res);
          if (Array.isArray(res.cards) && res.cards.length > 0) {
            // normalize cards from Sanity
            const normalized = res.cards.map((c, idx) => ({
              id: c._key ?? `sanity-${idx}`,
              tag: c.tag?.[language]  ?? c.title?.[language]  ?? fallback.cards[idx % fallback.cards.length]?.tag,
              tagColor: c.tagColor ?? fallback.cards[idx % fallback.cards.length]?.tagColor,
              iconImage: c.iconImage ?? null,
              iconUrl: c.iconUrl ?? null,
              image: c.image ?? fallback.cards[idx % fallback.cards.length]?.image ?? null,
              imageAlt: c.imageAlt?.[language]  ?? fallback.cards[idx % fallback.cards.length]?.imageAlt ?? c.title ?? "",
              imageCaption: c.imageCaption?.[language]  ?? null,
              statValue: c.statValue?.[language] ?? fallback.cards[idx % fallback.cards.length]?.statValue ?? null,
              subText: c.subText ?? fallback.cards[idx % fallback.cards.length]?.subText ?? "",
              ctaText: c.ctaText?.[language]  ?? null,
              ctaLink: c.ctaLink ?? null,
              iconFallback: fallback.cards[idx % fallback.cards.length]?.iconFallback ?? null,
            }));
            setCards(normalized);
          } else {
            // use localized fallbacks
            setCards(fallback.cards);
          }
        } else {
          setSection(null);
          setCards(fallback.cards);
        }
      })
      .catch((err) => {
        console.warn("StatsSection fetch failed:", err);
        if (!mounted) return;
        setError(err);
        setSection(null);
        setCards(fallback.cards);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
    // re-run when language changes to reflect localized fallback copy
  }, [language]);

  // GSAP scroll pin + rail animation
  useLayoutEffect(() => {
    if (loading || !mainRef.current || !viewportRef.current || !railRef.current) return;
    const main = mainRef.current;
    const viewport = viewportRef.current;
    const rail = railRef.current;

    const ctx = gsap.context(() => {
      const railHeight = rail.scrollHeight;
      const viewportHeight = viewport.offsetHeight;
      const scrollDistance = railHeight - viewportHeight;
      if (scrollDistance <= 0) return;

      gsap.set(rail, { y: 0 });
      gsap.to(rail, {
        y: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: main,
          pin: main,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, main);

    return () => ctx.revert();
  }, [loading, cards]);

  const bgUrl = section?.backgroundImage ? getSanityImageUrl(section.backgroundImage, { width: 1600 }) : statsImg;
  const heading = section?.heading?.[language] ?? fallback.heading;
  const description = section?.description?.[language]  ?? fallback.description;
  const buttonText = section?.buttonText?.[language]  ?? fallback.buttonText;
  const buttonLink = section?.buttonLink ?? fallback.buttonLink;

  return (
    <section className="px-phone md:px-tab w-full lg:px-desktop">
      <div ref={mainRef} className="relative w-full h-[90vh] rounded-3xl overflow-hidden px-phone md:px-tab lg:px-desktop" role="region" aria-label="Statistics section">
        <div className="absolute inset-0">
          <img src={bgUrl} className="w-full h-full object-cover" alt={section?.backgroundImage ? section?.backgroundImage.alt ?? "background" : "background"} />
          <div className="absolute inset-0 bg-primary/40" />
        </div>

        <div className="relative z-10 h-full grid grid-cols-1 grid-rows-[1fr_1fr] md:grid-cols-2 md:grid-rows-1 gap-6 p-5 md:p-10">
          <div className="text-white space-y-4 md:space-y-6 flex flex-col justify-center">
            <motion.h2 variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              {heading}
            </motion.h2>

            <motion.p variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="text-lg sm:text-xl md:text-2xl max-w-3xl">
              {description}
            </motion.p>

            <motion.div variants={fadeSlide} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="inline-flex items-center group select-none relative">
              <span className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFC21A] text-[#0e1510] transition-all duration-300 -mr-px group-hover:opacity-0 group-hover:-translate-x-2" aria-hidden>
                <span className="text-base leading-none">→</span>
              </span>
              <span className="relative inline-block h-12">
                <a
                  href={buttonLink || "#"}
                  aria-label={buttonText}
                  className="relative inline-flex h-12 items-center justify-center rounded-xl bg-[#FFC21A] text-[#0e1510] px-6 font-semibold tracking-tight transition-[transform,background-color,color,border-color] duration-300 group-hover:-translate-x-12"
                >
                  {loading ? (language === "du" ? "Wird geladen..." : "Loading...") : buttonText}
                </a>
                <span className="pointer-events-none absolute top-0 right-0 flex h-12 w-12 items-center justify-center rounded-xl border border-transparent bg-transparent text-[#0e1510] transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]" aria-hidden>
                  <span className="text-base leading-none">→</span>
                </span>
              </span>
            </motion.div>
          </div>

          <div ref={viewportRef} className="relative h-full w-full overflow-hidden" aria-live="polite">
            <div ref={railRef} className="absolute top-0 left-0 w-full will-change-transform space-y-4">
              {(cards || []).map((card, index) => {
                // resolve possible Sanity images/urls
                const iconImg = getSanityImageUrl(card.iconImage, { width: 40, height: 40 }) || card.iconUrl || null;
                const cardImage = getSanityImageUrl(card.image, { width: 600 }) || (typeof card.image === "string" ? card.image : null);
                return (
                  <div key={card.id ?? `card-${index}`} className="h-[420px] flex items-center justify-center px-4">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full h-full flex flex-col">
                      <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full self-start ${card.tagColor || "bg-gray-200 text-gray-800"}`}>
                        {/* icon: prefer explicit iconFallback (jsx) if present, then iconImg (url), then nothing */}
                        {card.iconFallback ? (
                          <span aria-hidden>{card.iconFallback}</span>
                        ) : iconImg ? (
                          <img src={iconImg} alt={card.tag ?? "icon"} className="w-5 h-5" />
                        ) : null}
                        <span>{card.tag ?? card.title ?? "—"}</span>
                      </div>

                      <div className="flex-grow flex flex-col justify-center items-center text-center mt-4">
                        {cardImage ? (
                          <>
                            <img src={cardImage} alt={card.imageAlt ?? card.title ?? ""} className="max-h-[200px] w-auto mx-auto rounded-md object-contain mb-4" />
                            {card.imageCaption && <small className="text-sm -mt-2 mb-2">{card.imageCaption}</small>}
                          </>
                        ) : card.statValue ? (
                          <p className="font-bold text-6xl text-gray-800 my-4">{card.statValue}</p>
                        ) : null}

                        {card.subText && <p className="font-medium text-gray-600 max-w-xs">{card.subText}</p>}
                      </div>

                      {card.ctaText && (
                        <div className="mt-auto text-center">
                          <a
                            href={card.ctaLink || "#"}
                            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-primary rounded-lg text-white"
                            aria-label={card.ctaText}
                          >
                            <span>{card.ctaText}</span> <FaArrowRight />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* lightweight loading / error notice */}
      {loading && <div className="text-center mt-4 text-sm text-gray-500">{language === "du" ? "Wird geladen..." : "Loading..."}</div>}
      {error && <div className="text-center mt-4 text-sm text-red-500">Could not load stats data.</div>}
    </section>
  );
}
