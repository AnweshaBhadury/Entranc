import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../utils/ScrollReveal";
import { FaArrowRight } from "react-icons/fa";

// Swiper imports for the mobile slider
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const cardData = [
    {
        id: 1,
        number: "1",
        title: "Community Engagement",
        content: "Organize local info sessions, co-op onboarding",
        partner: "Sonnensegler",
        containerClass: "bg-s2 text-primary",
        titleClass: "text-primary",
        numberClass: "text-primary/20",
        partnerClass: "text-primary",
    },
    {
        id: 2,
        number: "2",
        title: "Implementation Pilots",
        content: "Launch small-scale projects (solar rooftops, heat pumps)",
        partner: "Local Partners",
        containerClass: "bg-white border-2 border-s2",
        titleClass: "text-s2",
        numberClass: "text-s2/20",
        partnerClass: "text-s2",
    },
    {
        id: 3,
        number: "3",
        title: "Baselines for CO2",
        content: "Organize local info sessions, co-op onboarding",
        partner: "KLIMA³",
        containerClass: "bg-s2 text-primary",
        titleClass: "text-primary",
        numberClass: "text-primary/20",
        partnerClass: "text-primary",
    },
];

// Reusable Card component for consistency
const RoadmapCard = ({ card }) => (
    <div
        className={`w-full h-full p-8 rounded-3xl shadow-2xl flex flex-col justify-between text-left ${card.containerClass}`}
    >
        <div>
            <p className={`text-8xl font-extrabold ${card.numberClass}`}>
                {card.number}
            </p>
            <h3 className={`text-2xl md:text-4xl font-bold mt-4 ${card.titleClass}`}>
                {card.title}
            </h3>
            <p className="mt-4 text-lg">{card.content}</p>
        </div>
        <div>
            <p className="text-sm opacity-70">Organised By</p>
            <p className={`font-bold text-lg ${card.partnerClass}`}>{card.partner}</p>
        </div>
    </div>
);

const RoadmapSection = () => {
    // Dynamic State to hold cards
    const [cards, setCards] = useState(cardData);

    useEffect(() => {
        // Interval to rotate cards every 2 seconds (2000ms)
        const interval = setInterval(() => {
            setCards((prevCards) => {
                const newCards = [...prevCards];
                const last = newCards.pop();
                newCards.unshift(last);
                return newCards;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white overflow-hidden">
            <div className="container mx-auto text-center space-y-12">
                <ScrollReveal>
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
                            Work Package Roadmap
                        </h2>
                        <p className="text-dark-gray">
                            Our work is structured into focused work packages — each led by
                            expert partners across Europe. From citizen engagement to digital
                            tools, these packages outline the path to delivering community-led
                            energy transformation.
                        </p>
                        <button className="flex items-center gap-4 border-2 border-primary text-primary font-bold py-3 px-6 rounded-full hover:bg-primary hover:text-white transition-all duration-300 group mx-auto">
                            <span>Read Blogs</span>
                            <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>
                </ScrollReveal>

                {/* --- Desktop Perspective Carousel (hidden on mobile) --- */}
                <div
                    className="hidden md:flex h-[500px] justify-center items-center relative"
                    style={{ perspective: "1000px" }}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            className={`absolute w-80 h-[450px]`}
                            initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                            animate={{
                                scale: index === 1 ? 1 : 0.85,
                                x: `${(index - 1) * 80}%`,
                                y: 0,
                                opacity: 1,
                                rotateY: index === 1 ? 0 : index < 1 ? -35 : 35,
                                zIndex: index === 1 ? 3 : 1,
                            }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <RoadmapCard card={card} />
                        </motion.div>
                    ))}
                </div>

                {/* --- Mobile Swiper Slider (visible on mobile only) --- */}
                <div className="md:hidden">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        className="w-full h-[480px]"
                    >
                        {cardData.map((card) => (
                            <SwiperSlide key={card.id} className="h-full">
                                <RoadmapCard card={card} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;
