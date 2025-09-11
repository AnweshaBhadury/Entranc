'use client';

import React from 'react';
import BlogHero from '../components/blogpage/BlogHero';
import BlogList from '../components/blogpage/BlogList';
import Footer from '../components/common/Footer';

const BlogsPage = () => {
  return (
    <div className="bg-gray-50">
      <BlogHero />
      <BlogList />
      <Footer />
    </div>
  );
};

export default BlogsPage;