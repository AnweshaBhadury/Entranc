import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BlogCard = ({ post, isHighlight = false, index = 0 }) => {
  // ✅ first card from left, second from right, alternate thereafter
  const isEven = index % 2 === 0;
  const initial = { opacity: 0, x: isEven ? -100 : 100 };
  const animate = { opacity: 1, x: 0 };
  const transition = { duration: 0.8, delay: 0.3, ease: 'easeOut' };

  if (isHighlight) {
    return (
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
        className="relative rounded-3xl overflow-hidden group h-[450px]"
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
            <h3 className="font-bold text-3xl mb-2">{post.title}</h3>
            <p className="text-white/90 text-sm mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between text-xs mt-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl" />
                <span>{post.author}</span>
              </div>
              <span className="bg-white/30 font-semibold px-3 py-1 rounded-full">{post.category}</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className="bg-white rounded-3xl shadow-lg overflow-hidden group h-full flex flex-col border border-gray-100"
    >
      <div className="overflow-hidden h-48">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-extrabold text-2xl text-primary leading-tight mb-2">{post.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{post.date}</p>
        <p className="text-dark-gray text-base mb-4 flex-grow">{post.excerpt}</p>
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
          <FaUserCircle className="text-2xl text-gray-400" />
          <span className="font-semibold text-sm text-primary">{post.author}</span>
        </div>
        <div className="mt-4">
          <span className="border-2 border-gray-300 text-gray-500 font-semibold px-4 py-1.5 rounded-full text-xs">
            {post.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
