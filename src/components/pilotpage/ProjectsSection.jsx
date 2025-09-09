// src/components/Projects/ProjectsSection.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { FaWind } from 'react-icons/fa';
import PowerBattery from '../../assets/powerbattery.svg?react';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "pilot"][0].ProjectsSection{
  heading,
  projects[] {
    _key,
    status,
    title,
    description,
    partners,
    iconType,
    "iconUrl": icon.asset->url,
    customContainerClass,
    partnerBgClass,
    buttonPrimaryClass,
    buttonSecondaryClass,
    readMoreUrl,
    getInvolvedUrl,
    mapUrl
  }
}`;

const fallbackProjectsData = [
  {
    id: 'f-1',
    status: 'IN PLANNING (START 2027)',
    title: 'Windpark Eichenau',
    description:
      'Citizen-led wind farm with 3 turbines (6 MW each). Power-purchase agreements will directly supply regional households.',
    partners: 'Sonnensegler eG; Municipality of Eichenau',
    Icon: FaWind,
    customContainerClass: 'bg-white text-primary',
    partnerBgClass: 'bg-yellow-50',
    buttonPrimaryClass: 'bg-m-primary text-white hover:bg-primary',
    buttonSecondaryClass:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    readMoreUrl: '#',
    getInvolvedUrl: '#',
    mapUrl: '#',
  },
  {
    id: 'f-2',
    status: 'PRE-APPROVAL',
    title: 'Agri-PV Jexhof',
    description:
      'Dual-use solar system integrated with biodiversity farming zones; balances agriculture and energy.',
    partners: 'EG Fünfseenland; local farmers’ union',
    Icon: null,
    customContainerClass: 'bg-m-primary text-white bg-grid-pattern bg-grid-size',
    partnerBgClass: 'bg-white/10',
    buttonPrimaryClass: 'bg-white text-primary hover:bg-gray-200',
    buttonSecondaryClass:
      'border-2 border-white text-white hover:bg-white hover:text-primary',
    readMoreUrl: '#',
    getInvolvedUrl: '#',
    mapUrl: '#',
  },
  {
    id: 'f-3',
    status: 'UNDER ENGINEERING REVIEW',
    title: 'Solarhub Gilching',
    description:
      '12 MW solar park with on-site battery storage; powers local businesses and light industrial zones.',
    partners: 'KLIMA³; Gilching Energy Department',
    Icon: PowerBattery,
    customContainerClass: 'bg-m-primary text-white relative overflow-hidden',
    partnerBgClass: 'bg-white/10',
    buttonPrimaryClass: 'bg-white text-primary hover:bg-gray-200',
    buttonSecondaryClass:
      'border-2 border-white text-white hover:bg-white hover:text-primary',
    readMoreUrl: '#',
    getInvolvedUrl: '#',
    mapUrl: '#',
    iconClassName:
      'pointer-events-none absolute inset-0 mx-auto my-8 opacity-20 w-[280px] md:w-[420px]',
  },
];

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ICON_MAP = {
  // keys should match the `iconType` values you store in Sanity
  FaWind,
  PowerBattery,
};

const safeText = (v) => (v === undefined || v === null ? '' : String(v));

const ProjectsSection = () => {
  const [language] = useLanguage();
  const [projectsSection, setProjectsSection] = useState({ heading: '', projects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // localized heading fallback
  const headingFallback = language === 'du' ? 'Projekte' : 'Projects';
  const loadingText = language === 'du' ? 'Lade Projekte...' : 'Loading Projects...';

  useEffect(() => {
    let mounted = true;

    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await client.fetch(GROQ_QUERY);

        if (!mounted) return;

        // Normalize Sanity projects
        const processedProjects =
          Array.isArray(data?.projects) && data.projects.length
            ? data.projects.map((p, idx) => {
                const id = p._key ?? `sanity-${idx}`;
                // Resolve Icon: if iconType maps to a known React component, use it.
                // Otherwise, if iconUrl provided, pass the URL string to ProjectCard (it will render <img>).
                let Icon = null;
                if (p.iconType && ICON_MAP[p.iconType]) {
                  Icon = ICON_MAP[p.iconType];
                }

                return {
                  id,
                  status: safeText(p.status) || 'COMING SOON',
                  title: safeText(p.title) || 'Untitled Project',
                  description: safeText(p.description) || 'Description not available.',
                  partners: safeText(p.partners) || 'No partners listed',
                  Icon: Icon ?? (p.iconUrl ? p.iconUrl : null),
                  iconUrl: p.iconUrl ?? null,
                  customContainerClass: safeText(p.customContainerClass) || 'bg-white text-primary',
                  partnerBgClass: safeText(p.partnerBgClass) || 'bg-gray-100',
                  buttonPrimaryClass:
                    safeText(p.buttonPrimaryClass) || 'bg-blue-500 text-white hover:bg-blue-600',
                  buttonSecondaryClass:
                    safeText(p.buttonSecondaryClass) ||
                    'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
                  readMoreUrl: safeText(p.readMoreUrl) || '#',
                  getInvolvedUrl: safeText(p.getInvolvedUrl) || '#',
                  mapUrl: safeText(p.mapUrl) || '#',
                };
              })
            : [];

        // If Sanity returned fewer items than fallbacks, fill with fallback items to keep layout consistent
        const finalProjects =
          processedProjects.length > 0
            ? [
                ...processedProjects,
                ...fallbackProjectsData.slice(Math.max(0, processedProjects.length)),
              ]
            : fallbackProjectsData;

        setProjectsSection({
          heading: safeText(data?.heading) || headingFallback,
          projects: finalProjects,
        });
      } catch (err) {
        console.warn('ProjectsSection fetch failed', err);
        if (!mounted) return;
        setError(err);
        setProjectsSection({
          heading: headingFallback,
          projects: fallbackProjectsData,
        });
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchProjects();
    return () => {
      mounted = false;
    };
  }, [language]);

  if (loading) return <p className="text-center py-12">{loadingText}</p>;

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-gray-50" id="scroll-project" aria-labelledby="projects-heading">
      <div className="w-full">
        <motion.h2
          id="projects-heading"
          variants={fadeSlide}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-h2-phone md:text-h2-tab font-bold text-primary mb-12"
        >
          {projectsSection?.heading || headingFallback}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsSection?.projects?.map((project, index) => (
            <motion.div
              key={project.id ?? `${index}-${project.title}`}
              variants={fadeSlide}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: (index % 2) * 0.08 }}
              className={index === 2 ? 'md:col-span-2' : ''}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center" role="status" aria-live="polite">
            {language === 'du'
              ? 'Projekte konnten nicht aus Sanity geladen werden. Fallback-Daten werden angezeigt.'
              : 'Unable to load Projects content from Sanity. Showing fallback data.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
