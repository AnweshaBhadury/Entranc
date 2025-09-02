import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../utils/ScrollReveal';
import { FaArrowRight, FaLightbulb } from 'react-icons/fa';

import comm1 from '../../assets/comm1.jpg';
import comm2 from '../../assets/comm2.jpeg';
import comm5 from '../../assets/comm5.jpg';

const cardData = [
  {
    id: 1,
    src: comm1,
    texts: ['Making Energy'],
  },
  {
    id: 2,
    src: comm2,
    texts: ['Making Energy Communities', 'Energy Communities Work...💡'],
    hasMarquee: true,
  },
  {
    id: 3,
    src: comm5,
    texts: ['Communities Work...'],
  },
];

// Reusable Card component for consistency within this section
const EnergyCard = ({ card }) => (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        <img src={card.src} className="w-full h-full object-cover" alt="Community image" />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-10"></div>
        
        <div className="absolute bottom-4 left-0 w-full overflow-hidden">
            <div className={card.hasMarquee ? 'animate-marquee whitespace-nowrap' : 'px-4'}>
                <p className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded">
                    {card.texts[0]}
                </p>
                {card.hasMarquee && (
                    <>
                        <p className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded ml-4">{card.texts[1]}</p>
                        <p className="inline-block font-bold text-lg bg-s2 text-primary px-2 py-1 rounded ml-4">{card.texts[0]}</p>
                    </>
                )}
            </div>
        </div>
    </div>
);

const MakingEnergySection = () => {
    return (
         <section className="relative slanted-divider py-20 px-phone md:px-tab lg:px-desktop bg-white">
            <div className="relative z-10 container mx-auto text-center space-y-12">
                 <ScrollReveal>
                    <div className="max-w-4xl mx-auto space-y-6">
                        <p className="font-bold text-m-primary inline-flex items-center gap-2"><FaLightbulb /> About EnTranC</p>
                        <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-primary">
                            Making Energy Communities Work...
                        </h2>
                        <p className="text-dark-gray max-w-3xl mx-auto">
                            We believe the future of energy is local, inclusive, and cooperative... (and so on)
                        </p>
                        <button className="flex items-center gap-2 bg-m-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary transition-all duration-300 group mx-auto">
                            <FaArrowRight />
                            <span>Read Blogs</span>
                        </button>
                    </div>
                </ScrollReveal>

                {/* --- Rebuilt 3D Perspective Carousel --- */}
                {/* This is the same animation logic from the Roadmap Section */}
                <div className="h-[400px] flex justify-center items-center relative" style={{ perspective: '1000px' }}>
                    {cardData.map((card, index) => (
                         <motion.div 
                            key={card.id}
                            className={`absolute w-72 h-96`}
                            initial={{ scale: 0, rotateY: 180 }}
                            whileInView={{ 
                                x: `${(index - 1) * 70}%`, 
                                scale: index === 1 ? 1 : 0.8, 
                                rotateY: index === 1 ? 0 : (index < 1 ? -45 : 45),
                                zIndex: index === 1 ? 3 : 1,
                            }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                         >
                            <EnergyCard card={card} />
                        </motion.div>
                    ))}
                </div>
             </div>
        </section>
    );
}

export default MakingEnergySection;