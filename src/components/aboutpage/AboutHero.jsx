import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import hero2 from '../../assets/abouthero.jpg';

const AboutHero = () => {
  return (
    <section className="h-[90vh] w-full relative flex items-center justify-center text-white rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <motion.img
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          src={hero2}
          alt="Solar panels on a roof"
          className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-20 text-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold"
        >
          About EnTranC
        </motion.h1>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-24 left-10 z-20 flex flex-col items-center gap-2"
      >
        <div className="bg-black/50 p-2 rounded-full">
            <span className="font-semibold text-xs">Scroll</span>
            <FaArrowDown className="animate-bounce mt-1 mx-auto" />
        </div>
      </motion.div>
    </section>
  );
};

export default AboutHero;