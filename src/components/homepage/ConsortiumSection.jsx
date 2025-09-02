import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';

const ConsortiumSection = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-phone md:px-tab lg:px-desktop">
                <div className="bg-[#EBF4F8] rounded-3xl p-8 md:p-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal>
                            <div className="space-y-6">
                                <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
                                    Consortium
                                </h2>
                                <p className="text-dark-gray">Powered by a diverse consortium of innovators, cooperatives, and institutions — working together for a shared energy future.</p>
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
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <img
                                src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                alt="Consortium logos"
                                className="w-full h-auto"
                            />
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ConsortiumSection;