// src/components/StatsSection.jsx
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight } from "react-icons/fa";
import { VscVmActive } from "react-icons/vsc";
import statsImg from "../../assets/home2.jpeg";
import { client, urlFor } from "../../lib/sanityClient";
import { PortableText } from "@portabletext/react";

gsap.registerPlugin(ScrollTrigger);

// local fallback (keeps UI working while Sanity data isn't present)
const fallbackCards = [
    {
        tag: "Duration",
        tagColor: "bg-s1/20 text-s1",
        icon: <VscVmActive size={20} />,
        statValue: "4 Years",
        subText: "2024-2027",
        image: null,
        body: null,
    },
    {
        tag: "CO2 Emission Reduction",
        tagColor: "bg-s2/20 text-m-s2",
        icon: null,
        statValue: null,
        subText: "Measureable climate action.",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        body: null,
    },
    {
        tag: "Community Growth",
        tagColor: "bg-green-200 text-green-800",
        icon: null,
        statValue: null,
        subText: "Building trust and local ownership.",
        image: "",
        body: null,
    },
    {
        tag: "Financial Viability",
        tagColor: "bg-orange-200 text-orange-800",
        icon: null,
        statValue: null,
        subText: "Shared ambition and sustainable returns.",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        body: null,
    },
];

// Adjust GROQ if your StatsSection is nested differently
const GROQ_STATS = `*[_type == "home"][0].StatsSection{
  heading,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
  cards[] {
    title,
    tag,
    tagColor,
    iconImage,
    iconUrl,
    image,
    imageAlt,
    imageCaption,
    statValue,
    ctaText,
    ctaLink
  }
}`;

/**
 * Safely build a Sanity image URL for multiple possible shapes we may receive.
 * - accepts string URLs, Sanity image objects (with asset._ref), or minimal refs.
 * - returns null on failure.
 */
function getSanityImageUrl(img, { width = 800, height = undefined, autoFormat = true } = {}) {
    if (!img) return null;

    try {
        // string URL already
        if (typeof img === "string") {
            // small guard: empty string => null
            return img.trim() === "" ? null : img;
        }

        // shape: { asset: { _ref: 'image-...' } } or asset._id
        if (img.asset && (img.asset._ref || img.asset._id)) {
            let builder = urlFor(img).width(width);
            if (height) builder = builder.height(height);
            if (autoFormat) builder = builder.auto("format");
            const finalUrl = builder.url();
            // debug - remove in production
            // eslint-disable-next-line no-console
            console.log("[getSanityImageUrl] built from asset:", finalUrl, img);
            return finalUrl;
        }

        // sometimes image is a plain ref object: { _ref: 'image-...' } or { _id: '...' }
        if (img._ref || img._id) {
            const fake = { asset: { _ref: img._ref || img._id } };
            let builder = urlFor(fake).width(width);
            if (height) builder = builder.height(height);
            if (autoFormat) builder = builder.auto("format");
            const finalUrl = builder.url();
            // eslint-disable-next-line no-console
            console.log("[getSanityImageUrl] built from _ref/_id:", finalUrl, img);
            return finalUrl;
        }

        // fallback: try passing object directly to urlFor (urlFor handles many shapes)
        const fallback = urlFor(img).width(width).auto("format").url();
        // eslint-disable-next-line no-console
        console.log("[getSanityImageUrl] built with fallback:", fallback, img);
        return fallback;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[getSanityImageUrl] failed for", img, err);
        return null;
    }
}

// PortableText custom renderers
const PortableImage = ({ value }) => {
    const src = getSanityImageUrl(value, { width: 800 });
    if (!src) return null;
    return (
        <figure style={{ textAlign: "center" }}>
            <img src={src} alt={value.alt || value.caption || ""} style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }} />
            {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
    );
};

const portableComponents = {
    types: {
        image: PortableImage,
        // match the object name you used in schema ("codeBlock")
        codeBlock: ({ value }) => (
            <pre style={{ background: "#0b1020", color: "#fff", padding: 12, overflowX: "auto", borderRadius: 6 }}>
                <code>{value?.code}</code>
            </pre>
        ),
    },
};

export default function StatsSection() {
    const mainRef = useRef(null);
    const viewportRef = useRef(null);
    const cardsRef = useRef(null);

    const [section, setSection] = useState(null);
    const [cards, setCards] = useState(fallbackCards);
    const [loading, setLoading] = useState(true);

    // fetch Sanity data
    useEffect(() => {
        let mounted = true;
        client
            .fetch(GROQ_STATS)
            .then((res) => {
                if (!mounted) return;
                if (res) {
                    setSection(res);
                    if (Array.isArray(res.cards) && res.cards.length > 0) {
                        const mapped = res.cards.map((c) => ({
                            title: c.title || null,
                            tag: c.tag || null,
                            tagColor: c.tagColor || "",
                            iconImage: c.iconImage || null,
                            iconUrl: c.iconUrl || null,
                            image: c.image || null,
                            imageAlt: c.imageAlt || c.title || "",
                            imageCaption: c.imageCaption || "",
                            imagePosition: c.imagePosition || "left",
                            statValue: c.statValue || null,
                            ctaText: c.ctaText || null,
                            ctaLink: c.ctaLink || null,
                            body: c.body || null,
                        }));
                        setCards(mapped);
                    } else {
                        // keep fallback if no cards returned
                        setCards(fallbackCards);
                    }
                } else {
                    setCards(fallbackCards);
                }
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error("[StatsSection] Sanity fetch error:", err);
                setCards(fallbackCards);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    // GSAP scroll pin + vertical scroll of cards
    useLayoutEffect(() => {
        const hasDom = mainRef.current && viewportRef.current && cardsRef.current;
        if (!hasDom) return;

        // wait for children to exist
        const children = cardsRef.current.children;
        if (!children || children.length === 0) return;

        const ctx = gsap.context(() => {
            const cardsEl = cardsRef.current;
            const viewportEl = viewportRef.current;

            // kill existing triggers (safety)
            ScrollTrigger.getAll().forEach((t) => t.kill());

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: mainRef.current,
                    pin: mainRef.current,
                    start: "top top",
                    end: () => "+=" + (cardsEl.scrollHeight - viewportEl.offsetHeight),
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            tl.to(cardsEl, {
                y: () => -(cardsEl.scrollHeight - viewportEl.offsetHeight),
                ease: "none",
            });
        }, mainRef);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, [cards, loading]);

    const bgUrl = section?.backgroundImage ? getSanityImageUrl(section.backgroundImage, { width: 1600 }) : null;

    return (
        <section className="py-20 px-phone md:px-tab lg:px-desktop">
            <div ref={mainRef} className="relative container mx-auto rounded-3xl overflow-hidden">
                <div className="absolute inset-0">
                    {/* fallback to local image when Sanity background isn't available */}
                    <img src={bgUrl || statsImg} className="w-full h-full object-cover" alt="background" />
                    <div className="absolute inset-0 bg-primary/40"></div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-16">
                    {/* Left column */}
                    <div className="text-white space-y-6">
                        <h2 className="text-h1-phone md:text-h1-tab font-bold leading-tight">
                            {section?.heading || "Statistics that Speaks For Itself"}
                        </h2>

                        <p className="text-lg">
                            {section?.description ||
                                "In just a few years, we’re building more than infrastructure — we’re building trust, community, and measurable climate action..."}
                        </p>

                        {/* sliding button */}
                        <div className="inline-flex items-center group select-none relative">
                            <span
                                className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFC21A] text-[#0e1510] group-hover:border-[#FFC21A] transition-all duration-300 -mr-px group-hover:opacity-0 group-hover:-translate-x-2"
                                aria-hidden
                            >
                                <span className="text-base leading-none">→</span>
                            </span>

                            <span className="relative inline-block h-12">
                                <a
                                    href={section?.buttonLink || "#"}
                                    aria-label={section?.buttonText || "Read Blogs"}
                                    className="relative inline-flex h-12 items-center justify-center rounded-xl bg-[#FFC21A] text-[#0e1510] px-6 font-semibold tracking-tight transition-[transform,background-color,color,border-color] duration-300 group-hover:-translate-x-12"
                                >
                                    {section?.buttonText || "Read Blogs"}
                                </a>

                                <span className="pointer-events-none absolute top-0 right-0 flex h-12 w-12 items-center justify-center rounded-xl border border-transparent bg-transparent text-[#0e1510] transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]" aria-hidden>
                                    <span className="text-base leading-none">→</span>
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Right column: vertical scroller with cards */}
                    <div ref={viewportRef} className="h-[450px] overflow-hidden">
                        <div ref={cardsRef}>
                            {(cards || fallbackCards).map((card, index) => {
                                const iconImg = getSanityImageUrl(card.iconImage, { width: 64, height: 64 }) || card.iconUrl || null;
                                const cardImage = getSanityImageUrl(card.image, { width: 800 }) || (typeof card.image === "string" ? card.image : null);

                                return (
                                    <div key={index} className="h-[450px] flex items-center justify-center p-4">
                                        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full">
                                            <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full ${card.tagColor || ""}`}>
                                                {card.icon ? (
                                                    card.icon
                                                ) : iconImg ? (
                                                    <img src={iconImg} alt={card.tag || "icon"} style={{ width: 20, height: 20 }} />
                                                ) : null}
                                                <span>{card.tag || card.title || "—"}</span>
                                            </div>

                                            <div className="mt-4">

                                                <>
                                                    {cardImage ? (
                                                        <div className="mb-4">
                                                            <img src={cardImage} alt={card.imageAlt || card.title || ""} className="h-[200px] w-auto mx-auto rounded-md" />
                                                            {card.imageCaption && <small className="text-sm">{card.imageCaption}</small>}
                                                            {card.statValue && <p className="text-center mt-4 font-semibold text-dark-gray">{card.statValue}</p> }
                                                        </div>
                                                    ) : null}

                                                
                                                </>


                                                {card.ctaText && (
                                                    <div className="mt-6">
                                                        <a href={card.ctaLink || "#"} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-primary rounded-lg text-white">
                                                            <span>{card.ctaText}</span>
                                                            <FaArrowRight />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
