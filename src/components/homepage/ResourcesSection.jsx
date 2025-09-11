// src/components/Resources/ResourcesSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import client from "../../lib/sanityClient";
import useLanguage from "../../hook/useLanguage";

import b1 from "../../assets/comm1.jpg";
import b2 from "../../assets/comm2.jpeg";
import b3 from "../../assets/comm3.jpg";
import b4 from "../../assets/comm4.webp";

const GROQ_QUERY = `*[_type=="home"][0].ResourceSection{
  heading,
  cards[] {
    type,
    title,
    description,
    btnText,
    btnLink,
    containerClass,
    buttonClass,
    image{asset->{url}, alt}
  }
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// localized fallback cards (EN / DU)
const fallbackCardsLocalized = {
  en: [
    {
      key: "c-co2",
      type: "content",
      title: "CO₂ & Benefit Calculator",
      description: "Estimate your project's environmental and economic impact.",
      btnText: "Try Calculator",
      btnLink: "#",
      containerClass: "bg-s2 text-primary",
      buttonClass: "bg-bg-offwhite text-primary hover:bg-white",
    },
    { key: "c-img-1", type: "image", image: { asset: { url: b1 }, alt: "Community image 1" } },
    {
      key: "c-life",
      type: "content",
      title: "EU LIFE Programme",
      description: "Co-funded by the EU to accelerate clean energy across Europe.",
      btnText: "Learn LIFE CET",
      btnLink: "#",
      containerClass: "bg-m-s2 text-white",
      buttonClass: "bg-yellow-800 text-white hover:bg-yellow-900",
    },
    { key: "c-img-2", type: "image", image: { asset: { url: b2 }, alt: "Community image 2" } },
    {
      key: "c-toolbox",
      type: "content",
      title: "Toolbox Access",
      description: "Everything your community needs to get started — from planning to implementation.",
      btnText: "Open Toolbox",
      btnLink: "#",
      containerClass: "bg-t-primary text-white",
      buttonClass: "bg-t1-primary text-white hover:bg-m-primary",
    },
    { key: "c-img-3", type: "image", image: { asset: { url: b3 }, alt: "Community image 3" } },
    {
      key: "c-news",
      type: "content",
      title: "News & Updates",
      description: "Follow key milestones, updates from pilot projects, and EU-wide progress.",
      btnText: "Read the Blog",
      btnLink: "/blogs",
      containerClass: "bg-primary text-white",
      buttonClass: "bg-m-primary text-white hover:bg-green-800",
    },
    { key: "c-img-4", type: "image", image: { asset: { url: b4 }, alt: "Community image 4" } },
    {
      key: "c-join",
      type: "content",
      title: "Join the Community",
      description: "Get involved, connect with peers, and share your story.",
      btnText: "Join In",
      btnLink: "/contact",
      containerClass: "bg-s1 text-white",
      buttonClass: "bg-blue-500 text-white hover:bg-blue-600",
    },
  ],
  du: [
    {
      key: "c-co2",
      type: "content",
      title: "CO₂- & Nutzenrechner",
      description: "Schätzen Sie die umwelt- und wirtschaftlichen Auswirkungen Ihres Projekts.",
      btnText: "Rechner ausprobieren",
      btnLink: "#",
      containerClass: "bg-s2 text-primary",
      buttonClass: "bg-bg-offwhite text-primary hover:bg-white",
    },
    { key: "c-img-1", type: "image", image: { asset: { url: b1 }, alt: "Community Bild 1" } },
    {
      key: "c-life",
      type: "content",
      title: "EU LIFE Programm",
      description: "Mitfinanziert von der EU zur Beschleunigung sauberer Energie in Europa.",
      btnText: "Mehr über LIFE CET",
      btnLink: "#",
      containerClass: "bg-m-s2 text-white",
      buttonClass: "bg-yellow-800 text-white hover:bg-yellow-900",
    },
    { key: "c-img-2", type: "image", image: { asset: { url: b2 }, alt: "Community Bild 2" } },
    {
      key: "c-toolbox",
      type: "content",
      title: "Toolbox-Zugang",
      description: "Alles, was Ihre Gemeinschaft zum Start benötigt — von Planung bis Umsetzung.",
      btnText: "Toolbox öffnen",
      btnLink: "#",
      containerClass: "bg-t-primary text-white",
      buttonClass: "bg-t1-primary text-white hover:bg-m-primary",
    },
    { key: "c-img-3", type: "image", image: { asset: { url: b3 }, alt: "Community Bild 3" } },
    {
      key: "c-news",
      type: "content",
      title: "News & Updates",
      description: "Verfolgen Sie wichtige Meilensteine, Pilotprojekt-Updates und EU-weite Entwicklungen.",
      btnText: "Blog lesen",
      btnLink: "/blogs",
      containerClass: "bg-primary text-white",
      buttonClass: "bg-m-primary text-white hover:bg-green-800",
    },
    { key: "c-img-4", type: "image", image: { asset: { url: b4 }, alt: "Community Bild 4" } },
    {
      key: "c-join",
      type: "content",
      title: "Werden Sie Teil der Gemeinschaft",
      description: "Engagieren Sie sich, vernetzen Sie sich mit Gleichgesinnten und teilen Sie Ihre Geschichte.",
      btnText: "Mitmachen",
      btnLink: "/contact",
      containerClass: "bg-s1 text-white",
      buttonClass: "bg-blue-500 text-white hover:bg-blue-600",
    },
  ],
};

const ResourcesSection = () => {
  const [language] = useLanguage();
  const fallbackCards = fallbackCardsLocalized[language] ?? fallbackCardsLocalized.en;

  const [sectionData, setSectionData] = useState(null);
  const [cards, setCards] = useState(fallbackCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        // Normalize Sanity cards, prefer Sanity -> localized fallback
        const fallback = fallbackCards;
        const sanityCards = Array.isArray(data?.cards) && data.cards.length
          ? data.cards.map((c, idx) => {
              const key = c._key ?? `sanity-${idx}`;
              const type = c.type ?? (c.image ? "image" : "content");
              if (type === "image") {
                return {
                  key,
                  type: "image",
                  image: {
                    asset: { url: c.image?.asset?.url ?? fallback[idx]?.image?.asset?.url ?? fallback[idx % fallback.length]?.image?.asset?.url },
                    alt: c.image?.alt ?? fallback[idx]?.image?.alt ?? `resource-image-${idx + 1}`
                  }
                };
              }
              return {
                key,
                type: "content",
                title: c.title?.[language] ?? fallback[idx]?.title ?? "Title",
                description: c.description?.[language] ?? fallback[idx]?.description ?? "",
                btnText: c.btnText?.[language] ?? fallback[idx]?.btnText ?? "Learn More",
                btnLink: c.btnLink?.[language] ?? fallback[idx]?.btnLink ?? "#",
                containerClass: c.containerClass ?? fallback[idx]?.containerClass ?? "",
                buttonClass: c.buttonClass ?? fallback[idx]?.buttonClass ?? "",
              };
            })
          : fallback;

        setSectionData({ heading: data?.heading?.[language] ?? (language === "du" ? "Ressourcen & Gemeinschaft" : "Community & Resources") });
        setCards(sanityCards);
      } catch (err) {
        console.warn("ResourcesSection fetch failed:", err);
        if (!mounted) return;
        setError(err);
        setSectionData({ heading: language === "du" ? "Ressourcen & Gemeinschaft" : "Community & Resources" });
        setCards(fallbackCards);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [language]);

  if (loading) return <p className="text-center py-20">{language === "du" ? "Wird geladen..." : "Loading..."}</p>;

  const heading = sectionData?.heading || (language === "du" ? "Ressourcen & Gemeinschaft" : "Community & Resources");

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-m-primary rounded-3xl" aria-labelledby="resources-heading">
      <div className="container mx-auto">
        <motion.h2
          id="resources-heading"
          variants={fadeSlide}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-white text-center mb-12"
        >
          {heading}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const key = card.key ?? `${index}-${card.type}`;
            // content card
            if (card.type === "content") {
              const containerClass = card.containerClass ?? "bg-s2 text-primary";
              const buttonClass = card.buttonClass ?? "bg-white text-primary";
              const btnLinkSafe = (() => {
                try {
                  if (!card.btnLink) return "#";
                  const u = new URL(card.btnLink, window.location.origin);
                  return u.href;
                } catch {
                  return "#";
                }
              })();
              return (
                <motion.div
                  key={key}
                  variants={fadeSlide}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: (index % 3) * 0.06 }}
                  className={`rounded-2xl overflow-hidden h-64 p-8 flex flex-col justify-between ${containerClass}`}
                >
                  <div>
                    <h3 className="text-2xl font-bold">{card.title ?? "Title"}</h3>
                    <p className="mt-2 text-sm">{card.description ?? ""}</p>
                  </div>

                  <div className="w-full">
                    <a
                      href={btnLinkSafe}
                      className={`mt-6 font-bold py-3 px-6 rounded-lg inline-flex items-center justify-center w-full text-center transition-colors ${buttonClass}`}
                      aria-label={card.btnText ?? (language === "du" ? "Mehr erfahren" : "Learn More")}
                    >
                      {card.btnText ?? (language === "du" ? "Mehr erfahren" : "Learn More")}
                    </a>
                  </div>
                </motion.div>
              );
            }

            // image card
            if (card.type === "image") {
              const imgUrl = card.image?.asset?.url ?? "";
              const alt = card.image?.alt ?? (language === "du" ? "Ressourcen-Bild" : "Community Resource");
              return (
                <motion.div
                  key={key}
                  variants={fadeSlide}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: (index % 3) * 0.06 }}
                  className="rounded-2xl overflow-hidden h-64"
                >
                  <img
                    src={imgUrl}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              );
            }

            // unknown card type fallback
            return (
              <motion.div
                key={key}
                variants={fadeSlide}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: (index % 3) * 0.06 }}
                className="rounded-2xl overflow-hidden h-64 bg-gray-100 p-6"
              >
                <h3 className="text-xl font-bold">Resource</h3>
              </motion.div>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 text-center text-red-500 text-sm">
            {language === "du" ? "Abschnitt konnte nicht geladen werden." : "Could not load section data."}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourcesSection;
