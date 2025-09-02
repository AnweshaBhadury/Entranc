import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { FaLightbulb } from 'react-icons/fa';

const WhoWeAre = () => {
  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <div className="space-y-6">
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">Who We Are</h2>
            <p className="text-dark-gray leading-relaxed">
              At EnTranC, we believe in one simple idea: the energy transition must be fast, fair, and local. We are a community-driven cooperative dedicated to bringing renewable energy projects—wind, solar and agri-PV—into the hands of citizens, landowners and municipalities in Bavaria. Founded by a group of local climate advocates, our mission is to make the energy transition tangible and inclusive. By connecting people with purpose, capital with impact and technology with trust, EnTranC helps create energy communities that everyone can own.
            </p>
            <p className="text-dark-gray leading-relaxed">
              This mission emphasises fairness, local ownership and democratic participation, which are hallmarks of cooperatives.
            </p>
          </div>
        </ScrollReveal>

        <div className="hidden md:flex justify-center items-center">
          <ScrollReveal delay={0.2}>
            <FaLightbulb className="text-9xl text-s2/20" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;