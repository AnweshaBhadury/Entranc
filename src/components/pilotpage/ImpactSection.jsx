import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import StatCounter from '../StatCounter';

const statsData = [
    {
        type: 'title',
        titleLine1: 'Impact',
        titleLine2: 'of EnTranC',
    },
    {
        type: 'stat',
        value: '3',
        label: 'Pilot Sites Launched',
    },
    {
        type: 'stat',
        value: '42',
        label: 'MWp Targeted By 2030',
    },
    {
        type: 'stat',
        value: '1000+',
        label: 'Cooperative Members',
    },
    {
        type: 'stat',
        value: '€45',
        label: 'Million Mobilised In Citizen Capital',
    },
];

const ImpactSection = () => {
    return (
        <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
            <div className="container mx-auto">
                <ScrollReveal>
                    <div className="text-center max-w-4xl mx-auto space-y-4">
                        <p className="font-bold text-m-primary">Our Values & Team</p>
                        <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">The How Behind Us</h2>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-5 shadow-lg rounded-xl overflow-hidden">
                        {statsData.map((item, index) => {
                            if (item.type === 'title') {
                                return (
                                    <div key={index} className="relative bg-m-primary text-white p-8 flex items-center justify-center text-center">
                                        <div className="absolute inset-0 bg-[url('/src/assets/hands.svg')] bg-center bg-contain bg-no-repeat opacity-10"></div>
                                        <h3 className="relative text-3xl font-bold leading-tight">{item.titleLine1}<br />{item.titleLine2}</h3>
                                    </div>
                                );
                            }
                            return (
                                <StatCounter
                                    key={index}
                                    value={item.value}
                                    label={item.label}
                                />
                            );
                        })}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default ImpactSection;