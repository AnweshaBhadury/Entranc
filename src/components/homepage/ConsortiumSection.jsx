// src/components/Consortium/ConsortiumSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRive } from "@rive-app/react-canvas";
import client from "../../lib/sanityClient";
import lightningPattern from "../../assets/lightning.svg";
import useLanguage from "../../hook/useLanguage";

const GROQ_QUERY = `*[_type == "home"][0].ConsortiumSection{
  heading,
  description,
  buttonText,
  buttonLink,
  "riveFileUrl": riveAnimation.asset->url
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Localized fallbacks
const translations = {
  en: {
    heading: "Consortium",
    description:
      "Powered by a diverse consortium of innovators, cooperatives, and institutions — working together for a shared energy future.",
    buttonText: "Read Blogs",
    buttonLink: "#",
    riveFallback: "/animations/entranc.riv",
  },
  du: {
    heading: "Konsortium",
    description:
      "Angetrieben von einem vielfältigen Konsortium aus Innovatoren, Genossenschaften und Institutionen — gemeinsam für eine gerechte, lokale Energiewende.",
    buttonText: "Blogs lesen",
    buttonLink: "#",
    riveFallback: "/animations/entranc.riv",
  },
};

const safeHref = (href) => {
  try {
    if (!href) return "#";
    const u = new URL(href, window.location.origin);
    return u.href;
  } catch {
    return "#";
  }
};

const ConsortiumSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();

  // fetch Sanity data
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setData(res || null);
      } catch (err) {
        console.error("ConsortiumSection fetch error:", err);
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

  // localized fallbacks
  const t = (key) => (translations[language] && translations[language][key]) || translations.en[key];

  // resolved values: prefer Sanity -> localized -> safe defaults
  const heading = data?.heading ?? t("heading");
  const description = data?.description ?? t("description");
  const buttonText = data?.buttonText ?? t("buttonText");
  const buttonLink = safeHref(data?.buttonLink ?? t("buttonLink"));
  const riveFileUrl = (data?.riveFileUrl ?? t("riveFallback")) || t("riveFallback");

  // rive setup (dynamic src)
  const { rive, RiveComponent } = useRive({
    src: riveFileUrl,
    autoplay: false,
  });

  const riveContainerRef = useRef(null);

  // IntersectionObserver to play rive when visible
  useEffect(() => {
    if (!riveContainerRef.current || !rive) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          try {
            rive.play();
          } catch (e) {
            // non-fatal
            console.warn("Rive play failed:", e);
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(riveContainerRef.current);
    return () => {
      if (riveContainerRef.current) observer.unobserve(riveContainerRef.current);
    };
  }, [rive]);

  return (
    <section className="relative w-full py-20 px-phone md:px-tab lg:px-desktop bg-s1 rounded-3xl mb-20 overflow-hidden" aria-labelledby="consortium-heading">
      {/* decorative lightning pattern (non-interactive) */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img src={lightningPattern} alt="" className="absolute top-10 left-0 w-72 h-32 opacity-100 " />
        <img src={lightningPattern} alt="" className="absolute bottom-40 left-0 w-[500px] h-40 opacity-100" />
        <img src={lightningPattern} alt="" className="absolute bottom-20 right-0 w-[496px] h-24 opacity-100 rotate-180" />
        <img src={lightningPattern} alt="" className="absolute bottom-8 right-8 w-[240px] h-24 opacity-80 rotate-180" />
      </div>

      <div className="relative z-10 p-8 md:p-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.h2
              id="consortium-heading"
              variants={fadeSlide}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary"
            >
              {heading}
            </motion.h2>

            <motion.p
              variants={fadeSlide}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="text-dark-gray"
            >
              {description}
            </motion.p>

            <motion.div
              variants={fadeSlide}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="inline-flex items-center group select-none relative"
              aria-hidden={false}
            >
              <span
                className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-xl border border-[#1a2a17] text-[#1a2a17] bg-white transition-all duration-300 -mr-px group-hover:opacity-0 group-hover:-translate-x-2"
                aria-hidden="true"
              >
                <span className="text-base leading-none">→</span>
              </span>

              <span className="relative inline-block h-12">
                <a
                  href={buttonLink}
                  aria-label={buttonText}
                  className="relative inline-flex h-12 items-center justify-center rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17] px-6 font-semibold tracking-tight transition-[transform,background-color,color,border-color] duration-300 group-hover:-translate-x-12 group-hover:bg-[#FFC21A] group-hover:text-[#0e1510] group-hover:border-[#FFC21A]"
                >
                  {loading ? "Loading..." : buttonText}
                </a>

                <span
                  className="pointer-events-none absolute top-0 right-0 flex h-12 w-12 items-center justify-center rounded-xl border border-transparent bg-transparent text-[#0e1510] transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]"
                  aria-hidden="true"
                >
                  <span className="text-base leading-none">→</span>
                </span>
              </span>
            </motion.div>

            {error && (
              <div className="mt-2 text-sm text-red-500" role="alert">
                Unable to load consortium content.
              </div>
            )}
          </div>

          <div
            ref={riveContainerRef}
            className="bg-primary-dark rounded-[2rem] lg:rounded-tr-[0rem] lg:rounded-br-[0rem] flex-1 h-full aspect-[1/1] lg:aspect-auto"
            aria-hidden={false}
          >
            {/* Rive animation component */}
            <RiveComponent
              className="rive-wrapper w-full flex items-center justify-center min-h-0 md:min-h-[400px] h-full"
              aria-label="Consortium animation"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsortiumSection;
