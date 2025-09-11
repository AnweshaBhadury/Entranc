import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useLanguage from '../../hook/useLanguage';

const allNavItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Pilot Project', path: '/pilot-project' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

const desktopNavVariants = {
  hidden: { width: 0, opacity: 0, transition: { duration: 0.4, ease: [0.36, 0, 0.66, -0.56], when: "afterChildren" } },
  visible: { width: 'auto', opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.05 } },
};

const desktopItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: 50, transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 } },
  visible: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.05 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Simple translations map for labels.
// Note: user requested language codes 'en' and 'du' (du used for German)
const translations = {
  en: {
    Home: 'Home',
    About: 'About',
    'Pilot Project': 'Pilot Project',
    Blogs: 'Blogs',
    Contact: 'Contact',
    English: 'English',
    Deutsch: 'Deutsch',
    Menu: 'Menu',
  },
  du: {
    Home: 'Startseite',
    About: 'Über',
    'Pilot Project': 'Pilotprojekt',
    Blogs: 'Blogs',
    Contact: 'Kontakt',
    English: 'Englisch',
    Deutsch: 'Deutsch',
    Menu: 'Menü',
  },
};

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // useLanguage returns [language, setHanguage]
  const [language, setHanguage] = useLanguage();

  const t = (key) => (translations[language] && translations[language][key]) || key;

  const activeItem = allNavItems.find(item => item.path === location.pathname);
  const otherItems = allNavItems.filter(item => item.path !== activeItem?.path);

  const toggleLanguage = () => {
    setHanguage(language === 'en' ? 'du' : 'en');
  };

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-lg">

        {/* Language button (toggles en <-> du) */}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          title={language === 'en' ? 'Switch to English' : 'Switch to Deutsch'}
          className="bg-s2 text-m-s2 px-5 py-2.5 rounded-lg font-semibold text-sm"
        >
          {language === 'en' ? t('Deutsch') : t('English')}
        </button>

        {/* Menu button - hover to open menu */}
        <button
          onMouseEnter={() => setIsOpen(true)}
          className="bg-white text-primary px-5 py-2.5 rounded-lg font-semibold text-sm"
        >
          {t('Menu')}
        </button>

        {/* Active item when menu is closed */}
        {activeItem && !isOpen && (
          <div className="bg-m-primary p-1 rounded-lg">
            <NavLink
              to={activeItem.path}
              className="block px-5 py-1.5 rounded-md text-sm font-semibold text-white whitespace-nowrap"
            >
              {t(activeItem.name)}
            </NavLink>
          </div>
        )}

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.nav
                variants={desktopNavVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="hidden md:flex items-center bg-m-primary p-1 rounded-lg overflow-hidden"
              >
                {activeItem && (
                  <motion.div variants={desktopItemVariants}>
                    <NavLink to={activeItem.path} className="block px-5 py-1.5 rounded-md text-sm font-semibold bg-primary text-white whitespace-nowrap">
                      {t(activeItem.name)}
                    </NavLink>
                  </motion.div>
                )}
                {otherItems.map((item) => (
                  <motion.div key={item.name} variants={desktopItemVariants}>
                    <NavLink to={item.path} className="block px-5 py-1.5 rounded-md text-sm font-semibold text-white hover:bg-primary/50 transition-colors duration-200 whitespace-nowrap">
                      {t(item.name)}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="md:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 flex flex-col gap-1"
              >
                {allNavItems.map(item => (
                  <motion.div key={item.name} variants={mobileItemVariants}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block w-full text-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-primary'
                        }`
                      }
                    >
                      {t(item.name)}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingNav;
