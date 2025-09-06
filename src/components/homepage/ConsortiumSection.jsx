import React, { useEffect, useRef } from "react";
import ScrollReveal from "../utils/ScrollReveal";
import { useRive } from "@rive-app/react-canvas";

const ConsortiumSection = () => {
    const { rive, RiveComponent } = useRive({
        src: "/animations/entranc.riv",
        autoplay: false, // 1. Disable autoplay
    });

    // 2. Create a ref to attach to the animation's container
    const riveContainerRef = useRef(null);

    useEffect(() => {
        // 3. Set up an observer to watch for when the animation is visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the component is on screen (is intersecting)
                if (entry.isIntersecting) {
                    rive && rive.play(); // Play the animation
                    observer.unobserve(entry.target); // Optional: Stop observing after it has played once
                }
            },
            {
                threshold: 0.5, // Trigger when 50% of the element is visible
            }
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
                                    Consortium
                                </h2>
                                <p className="text-dark-gray">
                                    Powered by a diverse consortium of innovators, cooperatives, and institutions — working together for a shared energy future.
                                </p>
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
                        <ScrollReveal delay={0}>
                            <div
                            ref = {riveContainerRef}
                            className=" bg-primary-dark rounded-[2rem] lg:rounded-tr-[0rem] lg:rounded-br-[0rem] flex-1 m-[10px] lg:m-0 h-[100%] aspect-[1/1] lg:aspect-auto w-auto">
                                <RiveComponent
                                    className="rive-wrapper min-h-[400px] !h-full w-full flex items-center justify-center"
                                    aria-label="Sample Rive Animation"
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
