// src/components/TransitionSection/TransitionSection.jsx
import React, { useEffect, useState } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { FaArrowRight, FaLightbulb } from 'react-icons/fa';
import powerGridFallback from '../../assets/homei2.png';
import client, { urlFor } from '../../lib/sanityClient'; // client.fetch + urlFor(image).width(...).url()

// GROQ: assumes `TransitionSection` is an object on the `home` document
const GROQ_QUERY = `*[_type == "home" && defined(TransitionSection)][0]{
  "transition": TransitionSection{
    label,
    heading,
    description,
    ctaText,
    ctaLink,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    "imageLqip": image.asset->metadata.lqip
  }
}`;

const isExternal = (url = '') => /^https?:\/\//i.test(url || '');

const TransitionSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setData(res?.transition ?? null);
      } catch (err) {
        console.error('Sanity fetch error (TransitionSection):', err);
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

  // content fallbacks
  const label = data?.label ?? 'EnTranC';
  const heading =
    data?.heading ??
    `Powering the\ntransition\n together.`; // keep breaks consistent with original
  const description =
    data?.description ??
    'A citizen-led cooperative model accelerating renewable energy across Europe — in sync with the EU’s LIFE and Green Deal goals.';
  const ctaText = data?.ctaText ?? 'Read Blogs';
  const ctaLink = data?.ctaLink ?? '';
  const imageAlt =
    data?.imageAlt ?? 'Illustration of a power grid in a green landscape';

  // Use urlFor if available to request a sized image, else fallback to asset url or local image
  let imageSrc = powerGridFallback;
  let lqip = null;
  if (data?.imageUrl) {
    try {
      // prefer using urlFor so we can request a reasonable width for different viewports
      // urlFor(image).width(800).auto('format').url()
      imageSrc = urlFor({ _ref: data.imageUrl }).width(1200).auto('format').url() ?? data.imageUrl;
    } catch {
      // If urlFor is not configured to accept the raw url, try direct asset url
      imageSrc = data.imageUrl;
    }
    lqip = data?.imageLqip ?? null;
  }

  const hasCta = !!ctaLink && ctaLink !== '#';

  return (
    <section className="relative bg-white" aria-labelledby="transition-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: text */}
          <ScrollReveal as="div" className="space-y-6" y={16} threshold={0.1}>
            <p className="font-bold inline-flex items-center gap-2 text-base md:text-lg">
              <FaLightbulb aria-hidden /> <span>{label}</span>
            </p>

            <h2
              id="transition-heading"
              className="font-bold leading-[1.05] text-[clamp(2rem,4vw+0.8rem,4rem)] text-[#22351f] whitespace-pre-line"
            >
              {heading}
            </h2>

            {/* description */}
            <p className="mt-4 text-base text-[#29411f] max-w-prose">{description}</p>

            {/* sliding button */}
            <div className="inline-flex items-center group select-none relative">
              <span
                className="
                  pointer-events-none flex h-12 w-12 items-center justify-center
                  rounded-xl border border-[#1a2a17] text-[#1a2a17] bg-white
                  transition-all duration-300 -mr-px
                  group-hover:opacity-0 group-hover:-translate-x-2
                "
                aria-hidden="true"
              >
                <span className="text-base leading-none">→</span>
              </span>

              <span className="relative inline-block h-12">
                {hasCta ? (
                  <a
                    href={ctaLink}
                    target={isExternal(ctaLink) ? '_blank' : undefined}
                    rel={isExternal(ctaLink) ? 'noopener noreferrer' : undefined}
                    aria-label={ctaText}
                    className="
                      relative inline-flex h-12 items-center justify-center
                      rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17]
                      px-6 font-semibold tracking-tight
                      transition-[transform,background-color,color,border-color] duration-300
                      group-hover:-translate-x-12
                      group-hover:bg-[#FFC21A] group-hover:text-[#0e1510] group-hover:border-[#FFC21A]
                    "
                  >
                    <span>{loading ? 'Loading...' : ctaText}</span>
                  </a>
                ) : (
                  <button
                    aria-label={ctaText}
                    disabled
                    className="
                      relative inline-flex h-12 items-center justify-center
                      rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17] opacity-70
                      px-6 font-semibold tracking-tight cursor-not-allowed select-none
                    "
                  >
                    <span>{loading ? 'Loading...' : ctaText}</span>
                  </button>
                )}

                <span
                  className="
                    pointer-events-none absolute top-0 right-0
                    flex h-12 w-12 items-center justify-center rounded-xl
                    border border-transparent bg-transparent text-[#0e1510]
                    transition-all duration-300 opacity-0 translate-x-2
                    group-hover:opacity-100 group-hover:translate-x-0
                    group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]
                  "
                  aria-hidden="true"
                >
                  <span className="text-base leading-none">→</span>
                </span>
              </span>
            </div>
          </ScrollReveal>

          {/* RIGHT: image + aside */}
          <ScrollReveal as="div" className="space-y-6" y={16} delay={120} threshold={0.1}>
            <div className="mx-auto lg:mx-0 max-w-[620px]">
              {/* if lqip exists, use it as inline background for a progressive blur-up effect */}
              <div
                className="w-full overflow-hidden rounded-lg"
                style={{
                  backgroundImage: lqip ? `url("${lqip}")` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                aria-hidden={!!lqip}
              >
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="block w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                  style={{
                    // when lqip present, transition from blurred bg to final image
                    transition: lqip ? 'opacity .45s ease-in-out' : undefined,
                  }}
                />
              </div>
            </div>

            <aside className="max-w-xl">
              <p className="font-semibold leading-relaxed text-primary">
                {description}
              </p>
              <p className="mt-3 text-xs font-bold tracking-wider text-gray-500">
                {data?.extraText ?? 'COMMUNITY ENERGY · EU SUPPORTED'}
              </p>
            </aside>
          </ScrollReveal>
        </div>

        {/* error / loading hints */}
        {loading && (
          <div className="mt-6 text-sm text-gray-500">Loading section content…</div>
        )}
        {error && (
          <div className="mt-6 text-sm text-red-500">
            Could not load section content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default TransitionSection;
