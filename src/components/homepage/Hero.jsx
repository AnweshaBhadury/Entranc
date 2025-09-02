import React from 'react';
import { motion } from 'framer-motion';
import hero1 from '../../assets/hero1.jpg';

const Hero = () => {
  return (
    <section className="h-[90vh] w-full relative flex items-center justify-center rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      <motion.img
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        src={hero1}
        alt="Wind turbine at sunset"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative z-20 text-center text-white p-4 leading-none">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold"
        >
          From local land to <br /> local power...
        </motion.h1>
        

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <motion.button
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="bg-m-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Join the Cooperative
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="border-2 border-s2 text-white font-bold py-3 px-8 rounded-lg hover:bg-s2 hover:text-m-s2 transition-colors duration-300"
          >
            Join the Cooperative
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Hero;