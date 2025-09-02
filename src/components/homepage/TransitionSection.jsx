import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { FaArrowRight, FaLightbulb } from 'react-icons/fa';
import powerGrid from '../../assets/homei2.png';



const TransitionSection = () => {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: text */}
          <ScrollReveal as="div" className="space-y-6" y={16} threshold={0.1}>
            <p className="font-bold inline-flex items-center gap-2 text-base md:text-lg">
              <FaLightbulb aria-hidden /> <span>EnTranC</span>
            </p>

            <h2 className="font-bold leading-[1.05] text-[clamp(2rem,4vw+0.8rem,4rem)] text-[#22351f]">
              Powering the
              <br /> transition
              <br /> together.
            </h2>


{/* sliding button */}
            <div className="inline-flex items-center group select-none relative">
              <span
                className="
      pointer-events-none flex h-12 w-12 items-center justify-center
      rounded-xl border border-[#1a2a17] text-[#1a2a17] bg-white
      transition-all duration-300 -mr-px
      group-hover:opacity-0 group-hover:-translate-x-2
    "
                aria-hidden
              >
                <span className="text-base leading-none">→</span>
              </span>

              <span className="relative inline-block h-12">
                <button
                  aria-label="Read Blogs"
                  className="
        relative inline-flex h-12 items-center justify-center
        rounded-xl border border-[#1a2a17] bg-white text-[#1a2a17]
        px-6 font-semibold tracking-tight
        transition-[transform,background-color,color,border-color] duration-300
        group-hover:-translate-x-12
        group-hover:bg-[#FFC21A] group-hover:text-[#0e1510] group-hover:border-[#FFC21A]
      "
                >
                  Read Blogs
                </button>

                <span
                  className="
        pointer-events-none absolute top-0 right-0
        flex h-12 w-12 items-center justify-center rounded-xl
        border border-transparent bg-transparent text-[#0e1510]
        transition-all duration-300 opacity-0 translate-x-2
        group-hover:opacity-100 group-hover:translate-x-0
        group-hover:bg-[#FFC21A] group-hover:border-[#FFC21A]
      "
                  aria-hidden
                >
                  <span className="text-base leading-none">→</span>
                </span>
              </span>
            </div>


          </ScrollReveal>

          <ScrollReveal as="div" className="space-y-6" y={16} delay={120} threshold={0.1}>
            <img
              src={powerGrid}
              alt="Illustration of a power grid in a green landscape"
              className="block w-full max-w-[620px] mx-auto lg:mx-0 h-auto object-contain"
              loading="lazy"
              decoding="async"
            />
            <aside className="max-w-xl">
              <p className="font-semibold leading-relaxed text-primary">
                A citizen-led cooperative model accelerating renewable energy across Europe — in sync
                with the EU’s LIFE and Green Deal goals.
              </p>
              <p className="mt-3 text-xs font-bold tracking-wider text-gray-500">
                COMMUNITY ENERGY · EU SUPPORTED
              </p>
            </aside>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TransitionSection;
