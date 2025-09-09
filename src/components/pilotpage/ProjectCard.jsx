// src/components/ProjectCard/ProjectCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import windmill from '../../assets/windmill.svg';
import useLanguage from '../../hook/useLanguage';

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const translations = {
  en: {
    readMore: 'Read More',
    getInvolved: 'Get Involved',
    viewMap: 'View Map',
    partners: 'Partners',
    windAlt: 'Wind turbine icon',
  },
  du: {
    readMore: 'Mehr Lesen',
    getInvolved: 'Mitmachen',
    viewMap: 'Karte ansehen',
    partners: 'Partner',
    windAlt: 'Windturbinen-Symbol',
  },
};

const isExternal = (url = '') => /^https?:\/\//i.test(url || '');

const safeHref = (href = '') => {
  try {
    if (!href) return '#';
    const u = new URL(href, window.location.origin);
    return u.href;
  } catch {
    return '#';
  }
};

const ProjectCard = ({ project = {} }) => {
  const [language] = useLanguage();
  const t = (key) => (translations[language] && translations[language][key]) || translations.en[key];

  // Provide defaults for missing fields
  const {
    title = 'Project Title',
    description = 'Short description of the project will appear here.',
    status = 'Active',
    partners = 'Partner list',
    customContainerClass = 'bg-white',
    partnerBgClass = 'bg-gray-50',
    buttonPrimaryClass = 'bg-m-primary text-white hover:bg-primary',
    buttonSecondaryClass = 'bg-white text-primary border border-gray-100 hover:bg-gray-50',
    mapUrl,
    readMoreUrl,
    getInvolvedUrl,
    Icon, // can be React component or image URL string
  } = project;

  const mapHref = safeHref(mapUrl);
  const readMoreHref = safeHref(readMoreUrl);
  const getInvolvedHref = safeHref(getInvolvedUrl);

  // Render decorative icon: prefer React component, else if string use <img>, else fallback windmill
  const DecorativeIcon = () => {
    if (Icon && typeof Icon === 'function') {
      // Icon is a React component
      const IconComp = Icon;
      return (
        <div className="absolute inset-0 flex items-center justify-end text-white/10 -right-10 pointer-events-none" aria-hidden>
          <IconComp size={300} />
        </div>
      );
    }
    if (Icon && typeof Icon === 'string') {
      return (
        <div className="absolute inset-0 flex items-center justify-end -right-10 pointer-events-none" aria-hidden>
          <img src={Icon} alt="" className="opacity-10 w-[300px] h-auto object-contain" />
        </div>
      );
    }
    // fallback svg icon
    return (
      <div className="absolute inset-0 flex items-center justify-end text-white/10 -right-10 pointer-events-none" aria-hidden>
        <img src={windmill} alt="" className="opacity-10 w-[300px] h-auto object-contain" />
      </div>
    );
  };

  return (
    <motion.article
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={`relative rounded-2xl shadow-lg p-8 overflow-hidden ${customContainerClass}`}
      role="group"
      aria-labelledby={`project-${title.replace(/\s+/g, '-').toLowerCase()}-title`}
    >
      <DecorativeIcon />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span
            className="bg-s2 text-m-s2 font-bold text-xs px-3 py-1 rounded-full"
            aria-label={`Status: ${status}`}
            title={status}
          >
            {status}
          </span>

          <a
            href={mapHref}
            className="text-sm font-semibold underline"
            target={isExternal(mapHref) ? '_blank' : undefined}
            rel={isExternal(mapHref) ? 'noopener noreferrer' : undefined}
            aria-label={t('viewMap')}
          >
            {t('viewMap')}
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <h3 id={`project-${title.replace(/\s+/g, '-').toLowerCase()}-title`} className="text-3xl font-bold mb-2">
              {title}
            </h3>

            <p className="text-sm leading-relaxed mb-4">{description}</p>

            <div className={`text-sm p-4 rounded-lg ${partnerBgClass}`}>
              <p className="font-bold">{t('partners')}</p>
              <p>{partners}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center pt-4">
            <img
              src={windmill}
              alt={t('windAlt')}
              className="w-24 h-24 object-contain opacity-70"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a
            href={readMoreHref}
            className={`font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full text-center ${buttonPrimaryClass}`}
            target={isExternal(readMoreHref) ? '_blank' : undefined}
            rel={isExternal(readMoreHref) ? 'noopener noreferrer' : undefined}
            aria-label={t('readMore')}
          >
            {t('readMore')}
          </a>

          <a
            href={getInvolvedHref}
            className={`font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full text-center ${buttonSecondaryClass}`}
            target={isExternal(getInvolvedHref) ? '_blank' : undefined}
            rel={isExternal(getInvolvedHref) ? 'noopener noreferrer' : undefined}
            aria-label={t('getInvolved')}
          >
            {t('getInvolved')}
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
