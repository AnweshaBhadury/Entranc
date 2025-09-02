import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaArrowRight, FaLeaf, FaUsers, FaChartLine } from 'react-icons/fa';
import { VscVmActive } from 'react-icons/vsc';
import statsImg from '../../assets/home2.jpeg';

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
    {
        tag: 'Duration',
        tagColor: 'bg-s1/20 text-s1',
        icon: <VscVmActive size={20} />,
        content: (
            <div className="text-center">
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle className="text-s1" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    </svg>
                    <div className="absolute"> <h3 className="text-3xl font-bold text-primary">4 Years</h3> </div>
                </div>
                <p className="font-semibold text-dark-gray mt-2">2024-2027</p>
            </div>
        )
    },
    {
        tag: 'CO2 Emission Reduction',
        tagColor: 'bg-s2/20 text-m-s2',
        icon: <FaLeaf size={20} />,
        content: (
            <div className="text-center p-4">
                <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="CO2 reduction icon" className="w-28 h-28 mx-auto" />
                <p className="mt-4 font-semibold text-dark-gray">Measureable climate action.</p>
            </div>
        )
    },
    {
        tag: 'Community Growth',
        tagColor: 'bg-green-200 text-green-800',
        icon: <FaUsers size={20} />,
        content: (
            <div className="text-center p-4">
                <img src="" alt="Community icon" className="w-28 h-28 mx-auto" />
                <p className="mt-4 font-semibold text-dark-gray">Building trust and local ownership.</p>
            </div>
        )
    },
    {
        tag: 'Financial Viability',
        tagColor: 'bg-orange-200 text-orange-800',
        icon: <FaChartLine size={20} />,
        content: (
            <div className="text-center p-4">
                <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Financial icon" className="w-28 h-28 mx-auto" />
                <p className="mt-4 font-semibold text-dark-gray">Shared ambition and sustainable returns.</p>
            </div>
        )
    },
];

const StatsSection = () => {
    const mainRef = useRef(null);
    const viewportRef = useRef(null);
    const cardsRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(cardsRef.current.children);

            gsap.timeline({
                scrollTrigger: {
                    trigger: mainRef.current,
                    pin: mainRef.current,
                    start: "top top",
                    end: () => "+=" + (cardsRef.current.scrollHeight - viewportRef.current.offsetHeight),
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            })

                .to(cardsRef.current, {
                    y: () => -(cardsRef.current.scrollHeight - viewportRef.current.offsetHeight),
                    ease: "none"
                });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-20 px-phone md:px-tab lg:px-desktop">
            <div ref={mainRef} className="relative container mx-auto rounded-3xl overflow-hidden">

                <div className="absolute inset-0">
                    <img src={statsImg} className="w-full h-full object-cover" alt="Lake with mountains" />
                    <div className="absolute inset-0 bg-primary/40"></div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-16">

                    <div className="text-white space-y-6">
                        <h2 className="text-h1-phone md:text-h1-tab font-bold leading-tight">
                            Statistics that Speaks For Itself
                        </h2>
                        <p className="text-lg">In just a few years, we’re building more than infrastructure — we’re building trust, community, and measurable climate action...</p>
                        {/* sliding button */}
                        <div className="inline-flex items-center group select-none relative">
                            <span
                                className="
      pointer-events-none flex h-12 w-12 items-center justify-center
      rounded-xl bg-[#FFC21A] text-[#0e1510] group-hover:border-[#FFC21A]
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
        rounded-xl bg-[#FFC21A] text-[#0e1510] group-hover:border-[#FFC21A]
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

                    <div ref={viewportRef} className="h-[450px] overflow-hidden">
                        <div ref={cardsRef}>
                            {cardsData.map((card, index) => (
                                <div key={index} className="h-[450px] flex items-center justify-center p-4">
                                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full">
                                        <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full ${card.tagColor}`}>
                                            {card.icon}
                                            <span>{card.tag}</span>
                                        </div>
                                        <div className="mt-4">
                                            {card.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;