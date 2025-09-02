import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const allNavItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Pilot Project', path: '/pilot-project' },
  // { name: 'Calculator', path: '/' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

const navContainerVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.36, 0, 0.66, -0.56], when: "afterChildren" }
  },
  visible: {
    width: 'auto',
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.98 },
  visible: { opacity: 1, x: 0, scale: 1 },
};

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const activeItem = allNavItems.find(item => item.path === location.pathname);
  const otherItems = allNavItems.filter(item => item.path !== location.pathname && item.name !== activeItem?.name);

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-lg">
        <button
          onMouseEnter={() => setIsOpen(true)}
          className="bg-white text-primary px-5 py-2.5 rounded-lg font-semibold text-sm"
        >
          Menu
        </button>

        {/* Always-visible Active Link */}
        {activeItem && !isOpen && (
          <div className="bg-m-primary p-1 rounded-lg">
            <NavLink
              to={activeItem.path}
              className="block px-5 py-1.5 rounded-md text-sm font-semibold text-white whitespace-nowrap"
            >
              {activeItem.name}
            </NavLink>
          </div>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center bg-m-primary p-1 rounded-lg overflow-hidden"
            >
              {activeItem && (
                <motion.div variants={navItemVariants}>
                  <NavLink to={activeItem.path} className="block px-5 py-1.5 rounded-md text-sm font-semibold bg-primary text-white whitespace-nowrap">
                    {activeItem.name}
                  </NavLink>
                </motion.div>
              )}
              {otherItems.map((item) => (
                <motion.div key={item.name} variants={navItemVariants}>
                  <NavLink
                    to={item.path}
                    className="block px-5 py-1.5 rounded-md text-sm font-semibold text-white hover:bg-primary/50 transition-colors duration-200 whitespace-nowrap"
                  >
                    {item.name}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingNav;