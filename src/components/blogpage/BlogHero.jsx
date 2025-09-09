import React from 'react';
import { motion } from 'framer-motion';
import hero4 from '../../assets/blogshero.avif';
import BlurZoomBg from '../common/BlurZoomBg';

const BlogHero = () => {
    return (
        <section className="h-[60vh] w-full relative flex items-center justify-center text-primary rounded-t-3xl overflow-hidden">
            <BlurZoomBg src={hero4} alt="Books on a shelf" />
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-20 text-h1-phone md:text-h1-tab lg:text-h1-desktop font-extrabold text-white"
            >
                Blogs
            </motion.h1>
        </section>
    );
};
export default BlogHero;