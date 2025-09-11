import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PilotProjectsPage from './pages/PilotProjectsPage';
import BlogsPage from './pages/BlogsPage';
import ContactPage from './pages/ContactPage';
import FloatingNav from './components/common/FloatingNav';
import Header from './components/common/Header';
import BlogPost from './pages/BlogPost';


const App = () => {
  return (
    <Router>
      <div className="p-4 md:p-8">
        <div className="relative max-w-screen-3xl mx-auto bg-white overflow-hidden">
          <Header />
          <main>
            <Routes>
              {/* ... routes ... */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pilot-project" element={<PilotProjectsPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/post/:id" element={<BlogPost/>} />
            </Routes>
          </main>
        </div>
      </div>
      <FloatingNav />
    </Router>
  );
};

export default App;