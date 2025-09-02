import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';

import b1 from '../../assets/comm1.jpg';
import b2 from '../../assets/comm2.jpeg';
import b3 from '../../assets/comm3.jpg';
import b4 from '../../assets/comm4.webp';

const cardData = [
    // Row 1
    {
        type: 'content',
        title: 'CO₂ & Benefit Calculator',
        description: "Estimate your project's environmental and economic impact.",
        btnText: 'Try Calculator',
        containerClass: 'bg-s2 text-primary',
        buttonClass: 'bg-bg-offwhite text-primary hover:bg-white',
    },
    { type: 'image', src: b1 },
    {
        type: 'content',
        title: 'EU LIFE Programme',
        description: 'Co-funded by the EU to accelerate clean energy across Europe.',
        btnText: 'Learn LIFE CET',
        containerClass: 'bg-m-s2 text-white',
        buttonClass: 'bg-yellow-800 text-white hover:bg-yellow-900',
    },
    // Row 2
    { type: 'image', src: b2 },
    {
        type: 'content',
        title: 'Toolbox Access',
        description: 'Everything your community needs to get started — from planning to implementation.',
        btnText: 'Open ToolBox',
        containerClass: 'bg-m-primary text-white',
        buttonClass: 'bg-green-400 text-white hover:bg-green-500',
    },
    { type: 'image', src: b3 },
    // Row 3
    {
        type: 'content',
        title: 'News & Updates',
        description: 'Follow key milestones, updates from pilot projects, and EU-wide progress.',
        btnText: 'Read the Blog',
        containerClass: 'bg-primary text-white',
        buttonClass: 'bg-m-primary text-white hover:bg-green-800',
    },
    { type: 'image', src: b4 },
    {
        type: 'content',
        title: 'Join the Community',
        description: 'Get involved, connect with peers, and share your story.',
        btnText: 'Join In',
        containerClass: 'bg-s1 text-white',
        buttonClass: 'bg-blue-500 text-white hover:bg-blue-600',
    },
];

const ResourcesSection = () => {
    return (
        <section className="py-20 px-phone md:px-tab lg:px-desktop bg-m-primary">
            <div className="container mx-auto">
                <ScrollReveal>
                    <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold leading-tight text-white text-center mb-12">
                        Community & Resources
                    </h2>
                </ScrollReveal>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cardData.map((card, index) => (
                        <ScrollReveal key={index} delay={(index % 3) * 0.1}>
                            <div className={`rounded-2xl overflow-hidden h-64 ${card.type === 'content' ? `${card.containerClass} p-8 flex flex-col justify-between` : ''}`}>
                                {card.type === 'image' ? (
                                    <img src={card.src} className="w-full h-full object-cover" alt="Community Resource" />
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="text-2xl font-bold">{card.title}</h3>
                                            <p className="mt-2 text-sm">{card.description}</p>
                                        </div>
                                        <button className={`mt-6 font-bold py-3 px-6 rounded-lg self-start w-full text-center transition-colors ${card.buttonClass}`}>
                                            {card.btnText}
                                        </button>
                                    </>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResourcesSection;