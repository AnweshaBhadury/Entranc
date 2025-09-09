// src/components/Blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useLanguage from '../../hook/useLanguage';
import blogFallback from '../../assets/aboutblogs.webp';

const translations = {
  en: {
    readBlog: 'Read Blog',
    authorBy: 'By',
    categoryLabel: 'Category',
    untitled: 'Untitled',
  },
  du: {
    readBlog: 'Beitrag lesen',
    authorBy: 'Von',
    categoryLabel: 'Kategorie',
    untitled: 'Ohne Titel',
  },
};

const BlogCard = ({ post = {}, isHighlight = false, index = 0 }) => {
  const [language] = useLanguage();
  const t = (key) => (translations[language] && translations[language][key]) || translations.en[key];

  // Safe field fallbacks
  const id = post.id ?? post._id ?? '';
  const title = post.title ?? t('untitled');
  const image = post.image ?? blogFallback;
  const excerpt = post.excerpt ?? '';
  const author = post.author ?? 'EnTranC';
  const category = post.category ?? '';
  const date = post.date ?? '';
  // If you store ISO date in post.dateISO, prefer that for machine-readable datetime
  const dateTime = post.dateISO ?? post.date ?? '';

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
        className="relative rounded-3xl overflow-hidden group h-[450px] cursor-pointer"
        aria-label={`Highlight blog ${title}`}
      >
        <Link to={`/post/${id}`} className="block h-full" aria-label={`${t('readBlog')}: ${title}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
              <h3 className="font-bold text-3xl mb-2">{title}</h3>
              <p className="text-white/90 text-sm mb-4">{excerpt}</p>
              <div className="flex items-center justify-between text-xs mt-4">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-2xl" />
                  <span>{author}</span>
                </div>
                <span className="bg-white/30 font-semibold px-3 py-1 rounded-full">
                  {category}
                </span>
                <time dateTime={dateTime}>{date}</time>
              </div>

              {/* Read Blog button as real Link for accessibility */}
              <div className="mt-6 text-center">
                <Link
                  to={`/post/${id}`}
                  className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-m-primary transition-colors"
                  aria-label={`${t('readBlog')}: ${title}`}
                >
                  {t('readBlog')}
                </Link>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className="bg-white rounded-3xl shadow-lg overflow-hidden group h-full flex flex-col border border-gray-100 cursor-pointer"
      aria-label={`Blog card ${title}`}
    >
      <Link to={`/post/${id}`} className="flex flex-col h-full" aria-label={`${t('readBlog')}: ${title}`}>
        <div className="overflow-hidden h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="font-extrabold text-2xl text-primary leading-tight mb-2">{title}</h3>
          <p className="text-sm text-gray-400 mb-3">
            <time dateTime={dateTime}>{date}</time>
          </p>
          <p className="text-dark-gray text-base mb-4 flex-grow">{excerpt}</p>

          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
            <FaUserCircle className="text-2xl text-gray-400" />
            <span className="font-semibold text-sm text-primary">{author}</span>
          </div>

          <div className="mt-4 flex flex-col items-start gap-3">
            {category && (
              <span className="border-2 border-gray-300 text-gray-500 font-semibold px-4 py-1.5 rounded-full text-xs">
                {category}
              </span>
            )}

            {/* Read Blog button as real Link */}
            <Link
              to={`/post/${id}`}
              className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-m-primary transition-colors"
              aria-label={`${t('readBlog')}: ${title}`}
            >
              {t('readBlog')}
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
