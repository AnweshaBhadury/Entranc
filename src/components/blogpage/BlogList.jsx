// src/components/Blog/BlogList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../utils/ScrollReveal';
import BlogCard from './BlogCard';
import { FaSearch } from 'react-icons/fa';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const CATEGORY_KEYS = ['All', 'Pilot Projects', 'Community', 'Policy'];

// GROQ query: fetch posts in frontend-friendly shape
const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  excerpt,
  "author": coalesce(primaryAuthor->name, authors[0]->name),
  category,
  "date": coalesce(date, string(publishedAt)),
  "dateISO": publishedAt,
  "image": featuredImage.asset->url,
  isHighlight,
  "slug": slug.current
}`;

// Translations
const translations = {
  en: {
    highlightTitle: 'Highlight',
    loadingHighlights: 'Loading highlights…',
    loadingPosts: 'Loading posts…',
    readBlog: 'Read Blog',
    searchPlaceholder: 'Search Here...',
    loadMore: 'Load More',
    unknownAuthor: 'Unknown',
    noHighlights: 'No highlights available.',
    categories: {
      'All': 'All',
      'Pilot Projects': 'Pilot Projects',
      'Community': 'Community',
      'Policy': 'Policy'
    }
  },
  du: {
    highlightTitle: 'Highlights',
    loadingHighlights: 'Highlights werden geladen…',
    loadingPosts: 'Beiträge werden geladen…',
    readBlog: 'Beitrag lesen',
    searchPlaceholder: 'Hier suchen...',
    loadMore: 'Mehr laden',
    unknownAuthor: 'Unbekannt',
    noHighlights: 'Keine Highlights verfügbar.',
    categories: {
      'All': 'Alle',
      'Pilot Projects': 'Pilotprojekte',
      'Community': 'Gemeinschaft',
      'Policy': 'Politik'
    }
  }
};

// Format human friendly date respecting locale (language)
function formatDateHuman(dateStr, locale) {
  if (!dateStr) return '';
  // if it's already a natural language string (contains letters) return as-is
  if (/[A-Za-z]/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  } catch {
    // fallback to manual formatting
    const day = d.getDate();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  }
}

const BlogList = () => {
  const [language] = useLanguage();
  const t = (keyPath) => {
    const parts = keyPath.split('.');
    let cur = translations[language] ?? translations.en;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return undefined;
    }
    return cur;
  };

  const [activeCategory, setActiveCategory] = useState('All');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(8);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from Sanity
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    client.fetch(POSTS_QUERY)
      .then((res) => {
        if (!mounted) return;
        const mapped = (res || []).map((p) => ({
          id: p._id,
          title: p.title ?? '',
          excerpt: p.excerpt ?? '',
          author: p.author ?? t('unknownAuthor') ?? 'Unknown',
          category: p.category ?? 'Community',
          date: formatDateHuman(p.date, language === 'du' ? 'de-DE' : 'en-US'),
          dateISO: p.dateISO ?? '',
          image: p.image || '', // string URL
          isHighlight: !!p.isHighlight,
          slug: p.slug || '',
        }));
        setAllPosts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching posts', err);
        if (!mounted) return;
        setError('Failed to load posts');
        setLoading(false);
      });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // re-run when language changes so date/localized author fallback updates

  // Apply category + search filters
  useEffect(() => {
    const pool = allPosts;

    const byCategory = activeCategory === 'All'
      ? pool
      : pool.filter((post) => post.category === activeCategory);

    const q = search.trim().toLowerCase();
    const bySearch = q
      ? byCategory.filter(
          (post) =>
            (post.title || '').toLowerCase().includes(q) ||
            (post.excerpt || '').toLowerCase().includes(q) ||
            (post.author || '').toLowerCase().includes(q)
        )
      : byCategory;

    setFilteredPosts(bySearch);
    setVisiblePosts(8);
  }, [allPosts, activeCategory, search]);

  const highlighted = useMemo(() => allPosts.filter((p) => p.isHighlight), [allPosts]);

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-gray-50">
      <div className="w-full">
        {/* HIGHLIGHT POSTS */}
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-primary mb-8 text-center">{t('highlightTitle')}</h2>
          {loading ? (
            <div className="text-center py-12">{t('loadingHighlights')}</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : highlighted.length === 0 ? (
            <div className="text-center py-12 text-gray-600">{t('noHighlights')}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {highlighted.map((post, i) => (
                <div key={post.id || `${i}-highlight`} className="flex flex-col">
                  <BlogCard post={post} isHighlight index={i} />
                  {/* Read Blog button for highlight — keep it keyboard-accessible */}
                  <div className="mt-4 text-center">
                    <Link
                      to={`/post/${post.slug || post.id}`}
                      className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-m-primary transition-colors"
                      aria-label={`${t('readBlog')}: ${post.title}`}
                    >
                      {t('readBlog')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* FILTER BAR */}
        <ScrollReveal>
          <div className="my-16 flex flex-col md:flex-row justify-between items-center gap-6 border-y-2 border-gray-200 py-4">
            <div className="flex items-center gap-6 font-semibold text-dark-gray flex-wrap">
              {CATEGORY_KEYS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-1 transition-all duration-300 ${
                    activeCategory === cat ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'
                  }`}
                  aria-pressed={activeCategory === cat}
                >
                  {t(`categories.${cat}`) ?? cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-auto">
              <input
                type="search"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-10 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-m-primary w-full md:w-[320px]"
                aria-label="Search posts"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-2.5">
                <FaSearch />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* REGULAR POSTS (now shows ALL posts including highlights) */}
        {loading ? (
          <div className="text-center py-12">{t('loadingPosts')}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPosts.slice(0, visiblePosts).map((post, i) => (
              <ScrollReveal key={post.id || `post-${i}`} delay={(i % 4) * 0.1}>
                <div className="flex flex-col">
                  <BlogCard post={post} index={i} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        {!loading && visiblePosts < filteredPosts.length && (
          <ScrollReveal>
            <div className="text-center mt-16">
              <button
                onClick={() => setVisiblePosts((prev) => prev + 8)}
                className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-m-primary transition-colors"
              >
                {t('loadMore')}
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default BlogList;
