import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { motion } from 'framer-motion';
import hero1 from '../../assets/hero1.jpg';
import comm5 from '../../assets/comm5.jpg';
import a1 from '../../assets/a1.jpeg';
import a2 from '../../assets/a2.jpeg';

const WhyBehindUs = () => {
  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-bg-offwhite overflow-hidden">
      <div className="container mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="font-bold text-m-primary">Community Energy Model</p>
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">The Why Behind Us</h2>
            <p className="text-dark-gray leading-relaxed">
              In Germany, community energy cooperatives have become a backbone of the national energy transition—with thousands of citizens owning wind, solar, and bioenergy installations. EnTranC adapts and expands this model to fit diverse European contexts—from rural villages to urban neighborhoods.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-16 grid md:grid-cols-5 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            whileInView={{ opacity: 1, x: 0, rotate: -5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="md:col-span-2 rounded-2xl overflow-hidden shadow-2xl h-96"
          >
            <img src={a1} className="w-full h-full object-cover" alt="Solar Panels and Wind Turbine" />
          </motion.div>
          <ScrollReveal y={0} delay={0.2} className="md:col-span-1">
            <div className="bg-m-primary text-white p-6 rounded-2xl shadow-lg text-sm space-y-3">
              <p>EnTranC is a registered cooperative where each member owns part of the project and has a democratic voice—one member, one vote.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Minimum investment: €250</li>
                <li>Democratic governance: 1 share = 1 vote</li>
                <li>Returns from real projects in your region</li>
                <li>Community decision-making and annual reporting</li>
                 <li>EU Goal: 1 Renewable Energy Community per 10,000 citizens by 2025</li>
              </ul>
            </div>
          </ScrollReveal>
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            whileInView={{ opacity: 1, x: 0, rotate: 5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="md:col-span-2 rounded-2xl overflow-hidden shadow-2xl h-96"
          >
            <img src={a2} className="w-full h-full object-cover" alt="Green Energy Concept" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyBehindUs;