import React, { useEffect, useState } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import ProjectCard from './ProjectCard';
import { FaWind } from 'react-icons/fa';
// ✅ import SVG as React component
import PowerBattery from '../../assets/powerbattery.svg?react';
import client from '../../lib/sanityClient';

// 🔹 Local fallback data
const fallbackProjectsData = [
  {
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
  },
  {
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
  },
  {
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
    iconClassName:
      'pointer-events-none absolute inset-0 mx-auto my-8 opacity-20 w-[280px] md:w-[420px]',
  },
];

const ProjectsSection = () => {
  const [projectsSection, setProjectsSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ICON_MAP = { FaWind, PowerBattery };

  useEffect(() => {
    let mounted = true;

    async function fetchProjects() {
      const GROQ_QUERY = `*[_type == "pilot"][0].ProjectsSection{
        heading,
        projects[] {
          status,
          title,
          description,
          partners,
          iconType,
          "iconUrl": icon.asset->url,
          customContainerClass,
          partnerBgClass,
          buttonPrimaryClass,
          buttonSecondaryClass
        }
      }`;

      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;

        const processedProjects =
          data?.projects?.map((p) => ({
            status: p.status || 'COMING SOON',
            title: p.title || 'Untitled Project',
            description: p.description || 'Description not available.',
            partners: p.partners || 'No partners listed',
            Icon: p.iconType ? ICON_MAP[p.iconType] : null,
            customContainerClass: p.customContainerClass || 'bg-white text-primary',
            partnerBgClass: p.partnerBgClass || 'bg-gray-100',
            buttonPrimaryClass:
              p.buttonPrimaryClass ||
              'bg-blue-500 text-white hover:bg-blue-600',
            buttonSecondaryClass:
              p.buttonSecondaryClass ||
              'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
          })) || [];

        // ✅ Merge with fallback projects (ensure at least 3)
        const finalProjects =
          processedProjects.length > 0
            ? [...processedProjects, ...fallbackProjectsData.slice(processedProjects.length)]
            : fallbackProjectsData;

        setProjectsSection({
          heading: data?.heading || 'Projects',
          projects: finalProjects,
        });
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);

        // ✅ If fetch fails, fall back entirely
        setProjectsSection({
          heading: 'Projects',
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
  }, []);

  if (loading) return <p>Loading Projects...</p>;

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-gray-50">
      <div className="container mx-auto">
        <ScrollReveal>
          <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary mb-12">
            {projectsSection?.heading || 'Projects'}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsSection?.projects?.map((project, index) => (
            <div key={index} className={index === 2 ? 'md:col-span-2' : ''}>
              <ScrollReveal delay={index * 0.1}>
                <ProjectCard project={project} />
              </ScrollReveal>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            Unable to load Projects content from Sanity. Showing fallback data.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
