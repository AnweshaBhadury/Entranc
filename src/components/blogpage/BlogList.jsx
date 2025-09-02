import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import BlogCard from './BlogCard';
import { FaSearch } from 'react-icons/fa';
import hero1 from '../../assets/hero1.jpg';
import comm1 from '../../assets/comm1.jpg';

const allPosts = [
  {
    id: 1,
    title: 'Windpark Eichenau Enters Early Planning Phase',
    excerpt:
      "Our First Wind Pilot in Eichenau has Passed The Site Feasibility Stage. Here's What's Next...",
    author: 'Author Name',
    category: 'Pilot Projects',
    date: '06th Aug, 2025',
    image: hero1,
    isHighlight: true,
  },
  {
    id: 2,
    title: 'Community Stories: A New Beginning',
    excerpt:
      'How local ownership is transforming the energy landscape in rural Bavaria and beyond...',
    author: 'Jane Doe',
    category: 'Community',
    date: '15th Jul, 2025',
    image: comm1,
    isHighlight: true,
  },
  {
    id: 3,
    title: 'Understanding EU Green Deal Policy',
    excerpt:
      'A deep dive into the policies shaping the future of renewable energy in Europe.',
    author: 'Dr. Klaus',
    category: 'Policy',
    date: '28th Jun, 2025',
    image: comm1,
  },
  {
    id: 4,
    title: 'Solarhub Gilching: A Technical Overview',
    excerpt:
      'Exploring the 12 MW solar park with on-site battery storage and its community benefits.',
    author: 'Max Becker',
    category: 'Pilot Projects',
    date: '10th Jun, 2025',
    image: comm1,
  },
  {
    id: 5,
    title: 'The Power of Cooperative Models',
    excerpt:
      'Why the one-member, one-vote system is key to fair and rapid energy transition.',
    author: 'Lisa Meier',
    category: 'Community',
    date: '22nd May, 2025',
    image: comm1,
  },
  {
    id: 6,
    title: 'Navigating Regulatory Hurdles',
    excerpt:
      'A look at the challenges and solutions for new renewable energy projects.',
    author: 'Dr. Jonas Weber',
    category: 'Policy',
    date: '05th May, 2025',
    image: comm1,
  },
  {
    id: 7,
    title: 'Agri-PV Jexhof: Farming and Energy',
    excerpt:
      'How dual-use solar systems are creating synergy between agriculture and power generation.',
    author: 'Max Becker',
    category: 'Pilot Projects',
    date: '18th Apr, 2025',
    image: comm1,
  },
  {
    id: 8,
    title: 'Our First Annual Member Meeting',
    excerpt:
      'A recap of our community decisions, financial reporting, and future plans.',
    author: 'Sarah Köhler',
    category: 'Community',
    date: '30th Mar, 2025',
    image: comm1,
  },
  {
    id: 9,
    title: 'More Projects on the Horizon',
    excerpt:
      'An exciting look at what is coming next for EnTranC and our members.',
    author: 'Author Name',
    category: 'Pilot Projects',
    date: '12th Mar, 2025',
    image: comm1,
  },
  {
    id: 10,
    title: 'The Future is Bright',
    excerpt:
      'Final thoughts on the decade of renewable energy and our path forward.',
    author: 'Lisa Meier',
    category: 'Policy',
    date: '01st Mar, 2025',
    image: comm1,
  },
];

const categories = ['All', 'Pilot Projects', 'Community', 'Policy'];

const BlogList = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(8);

  useEffect(() => {
    const regular = allPosts.filter((p) => !p.isHighlight);
    if (activeCategory === 'All') {
      setFilteredPosts(regular);
    } else {
      setFilteredPosts(
        regular.filter((post) => post.category === activeCategory)
      );
    }
    setVisiblePosts(8);
  }, [activeCategory]);

  const highlighted = allPosts.filter((p) => p.isHighlight);

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-gray-50">
      <div className="container mx-auto">
        {/* HIGHLIGHT POSTS */}
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-primary mb-8 text-center">
            Highlight
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {highlighted.map((post, i) => (
              <BlogCard key={post.id} post={post} isHighlight index={i} />
            ))}
          </div>
        </ScrollReveal>

        {/* FILTER BAR */}
        <ScrollReveal>
          <div className="my-16 flex flex-col md:flex-row justify-between items-center gap-6 border-y-2 border-gray-200 py-4">
            <div className="flex items-center gap-6 font-semibold text-dark-gray">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-1 transition-all duration-300 ${
                    activeCategory === cat
                      ? 'text-primary border-b-2 border-primary'
                      : 'hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Search Here..."
                className="pl-4 pr-10 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-m-primary"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-2.5">
                <FaSearch />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* REGULAR POSTS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPosts.slice(0, visiblePosts).map((post, i) => (
            <ScrollReveal key={post.id} delay={(i % 4) * 0.1}>
              <BlogCard post={post} index={i} />
            </ScrollReveal>
          ))}
        </div>

        {/* LOAD MORE */}
        {visiblePosts < filteredPosts.length && (
          <ScrollReveal>
            <div className="text-center mt-16">
              <button
                onClick={() => setVisiblePosts((prev) => prev + 8)}
                className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-m-primary transition-colors"
              >
                Load More
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default BlogList;
