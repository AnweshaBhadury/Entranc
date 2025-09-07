import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "../utils/ScrollReveal";
import { useRive } from "@rive-app/react-canvas";
import client from "../../lib/sanityClient";

// GROQ Query to fetch consortium section from Sanity
const GROQ_QUERY = `*[_type == "home"][0].ConsortiumSection{
  heading,
  description,
  buttonText,
  buttonLink,
  "riveFileUrl": riveAnimation.asset->url
}`;

const ConsortiumSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallbacks
  const heading = data?.heading ?? "Consortium";
  const description =
    data?.description ??
    "Powered by a diverse consortium of innovators, cooperatives, and institutions — working together for a shared energy future.";
  const buttonText = data?.buttonText ?? "Read Blogs";
  const buttonLink = data?.buttonLink ?? "#";
  const riveFileUrl = data?.riveFileUrl ?? "/animations/entranc.riv";

  // Load Rive animation
  const { rive, RiveComponent } = useRive({
    src: riveFileUrl,
    autoplay: false,
  });

  const riveContainerRef = useRef(null);

  // Fetch from Sanity
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setData(res || null);
      } catch (err) {
        console.error("Sanity fetch error:", err);
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

  // Play animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && rive) {
          rive.play();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    if (riveContainerRef.current) {
      observer.observe(riveContainerRef.current);
    }
    return () => {
      if (riveContainerRef.current) {
        observer.unobserve(riveContainerRef.current);
      }
    };
  }, [rive]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-phone md:px-tab lg:px-desktop">
        <div className="bg-[#EBF4F8] rounded-3xl p-8 md:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
                  {heading}
                </h2>
                <p className="text-dark-gray">{description}</p>

                <div className="inline-flex items-center group select-none relative">
                  <span
                    className="pointer-events-none flex h-12 w-12 items-center justify-center
                      rounded-xl border border-[#1a2a17] text-[#1a2a17] bg-white
                      transition-all duration-300 -mr-px
                      group-hover:opacity-0 group-hover:-translate-x-2"
                    aria-hidden
                  >
                    <span className="text-base leading-none">→</span>
                  </span>

                  <span className="relative inline-block h-12">
                    <a
                      href={buttonLink}
                      aria-label={buttonText}
                      className="relative inline-flex h-12 items-center justify-center
                        rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17]
                        px-6 font-semibold tracking-tight
                        transition-[transform,background-color,color,border-color] duration-300
                        group-hover:-translate-x-12
                        group-hover:bg-[#FFC21A] group-hover:text-[#0e1510] group-hover:border-[#FFC21A]"
                    >
                      {loading ? "Loading..." : buttonText}
                    </a>

                    <span
                      className="pointer-events-none absolute top-0 right-0
                        flex h-12 w-12 items-center justify-center rounded-xl
                        border border-transparent bg-transparent text-[#0e1510]
                        transition-all duration-300 opacity-0 translate-x-2
                        group-hover:opacity-100 group-hover:translate-x-0
                        group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]"
                      aria-hidden
                    >
                      <span className="text-base leading-none">→</span>
                    </span>
                  </span>
                </div>

                {error && (
                  <div className="mt-2 text-sm text-red-500">
                    Unable to load consortium content.
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0}>
              <div
                ref={riveContainerRef}
                className="bg-primary-dark rounded-[2rem] lg:rounded-tr-[0rem] lg:rounded-br-[0rem] flex-1 m-[10px] lg:m-0 h-[100%] aspect-[1/1] lg:aspect-auto w-auto"
              >
                <RiveComponent
                  className="rive-wrapper w-full flex items-center justify-center min-h-0 md:min-h-[400px] h-full"
                  aria-label="Consortium animation"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsortiumSection;
