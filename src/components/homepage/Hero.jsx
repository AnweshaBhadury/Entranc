// src/components/Hero/Hero.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import hero1 from "../../assets/hero1.jpg";
import client from "../../lib/sanityClient";
import useLanguage from "../../hook/useLanguage";

const GROQ_QUERY = `*[_type == "home"][0].HeroSection{
  heading,
  subheading,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  "backgroundImageUrl": backgroundImage.asset->url,
  "backgroundImageAlt": backgroundImage.alt
}`;

const translations = {
  en: {
    heading: "From local land to local power...",
    subheading: "",
    primaryText: "Join the Cooperative",
    primaryLink: "#",
    secondaryText: "Learn More",
    secondaryLink: "/pilot-project",
    bgAlt: "Hero background",
    loadingPrimary: "Loading...",
    loadingSecondary: "...",
    errorMsg: "Unable to load hero content from Sanity.",
  },
  du: {
    heading: "Von lokalem Land zur lokalen Energie...",
    subheading: "",
    primaryText: "Der Genossenschaft beitreten",
    primaryLink: "#",
    secondaryText: "Mehr erfahren",
    secondaryLink: "/pilot-project",
    bgAlt: "Hero Hintergrund",
    loadingPrimary: "Wird geladen...",
    loadingSecondary: "...",
    errorMsg: "Hero-Inhalt konnte nicht aus Sanity geladen werden.",
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

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgReady, setImgReady] = useState(false);
  const [language] = useLanguage();

  useEffect(() => {
    let mounted = true;
    async function fetchHero() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setHero(data || null);
      } catch (err) {
        console.error("Sanity fetch error:", err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    fetchHero();
    return () => {
      mounted = false;
    };
  }, []);

  const t = (key) =>
    (translations[language] && translations[language][key]) ||
    translations.en[key];

  const bgImageUrl = hero?.backgroundImageUrl ? hero.backgroundImageUrl : hero1;
  const bgAlt = hero?.backgroundImageAlt ?? t("bgAlt");

  const heading = hero?.heading?.[language] ?? t("heading");
  const subheading = hero?.subheading?.[language] ?? t("subheading");
  const primaryText = hero?.primaryButtonText?.[language] ?? t("primaryText");
  const primaryLink = safeHref(hero?.primaryButtonLink ?? t("primaryLink"));
  const secondaryText =
    hero?.secondaryButtonText?.[language] ?? t("secondaryText");
  const secondaryLink = safeHref(
    hero?.secondaryButtonLink ?? t("secondaryLink")
  );

  return (
    <section
      className="h-[90vh] w-full relative flex items-center justify-center rounded-3xl overflow-hidden"
      role="region"
      aria-label="Hero"
    >
      <div className="absolute inset-0 bg-black/25 z-10" aria-hidden="true" />

      <motion.img
        src={bgImageUrl}
        alt={bgAlt}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 2.5, filter: "blur(18px)" }}
        animate={
          imgReady
            ? { scale: 1, filter: "blur(0px)" }
            : { scale: 2.5, filter: "blur(18px)" }
        }
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        onLoad={() => setImgReady(true)}
        style={{ willChange: "transform, filter" }}
      />

      <div className="relative z-20 text-center text-white p-4 leading-none max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold"
        >
          {String(heading)
            .split("\n")
            .map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </motion.h1>

        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="mt-4 text-md opacity-90"
          >
            {subheading}
          </motion.p>
        )}

        <div className="mt-16 flex flex-col md:flex-row gap-4 justify-center">
          <motion.a
            href={primaryLink}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className={`min-w-[200px] text-center bg-m-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 inline-block
              ${loading || error ? "pointer-events-none opacity-60" : ""}`}
            aria-label="Primary action"
          >
            {loading ? t("loadingPrimary") : primaryText}
          </motion.a>

          <motion.a
            href={secondaryLink}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="min-w-[200px] text-center border-2 border-s2 text-white font-bold py-3 px-8 rounded-lg hover:bg-s2 hover:text-m-s2 transition-colors duration-300 inline-block"
            aria-label="Secondary action"
          >
            {loading ? t("loadingSecondary") : secondaryText}
          </motion.a>
        </div>

        {error && (
          <div className="mt-4 text-red-300 text-sm" role="alert">
            {t("errorMsg")}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
