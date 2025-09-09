import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const iconVariants = {
    start: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    start: {
      y: '50%',
      opacity: 0.5,
    },
    end: {
      y: '100%',
      opacity: 1,
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center"
    >
      <div className="w-48 text-center">
        <motion.div
          variants={iconVariants}
          initial="start"
          animate="end"
          className="flex justify-center items-end h-8 gap-1 mb-4"
        >
          <motion.span variants={dotVariants} transition={dotTransition} className="w-2 h-2 bg-white rounded-full" />
          <motion.span variants={dotVariants} transition={dotTransition} className="w-2 h-4 bg-white rounded-full" />
          <motion.span variants={dotVariants} transition={dotTransition} className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
        
        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="bg-white h-full"
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;