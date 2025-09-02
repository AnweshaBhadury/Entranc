import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import ProjectCard from './ProjectCard';
import { FaWind } from 'react-icons/fa';
// ✅ import SVG as a React component
import PowerBattery from '../../assets/powerbattery.svg?react';

const projectsData = [
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
    // ✅ use the SVG component directly
    Icon: PowerBattery,
    // keep it green & white as in your mock
    customContainerClass: 'bg-m-primary text-white relative overflow-hidden',
    partnerBgClass: 'bg-white/10',
    buttonPrimaryClass: 'bg-white text-primary hover:bg-gray-200',
    buttonSecondaryClass:
      'border-2 border-white text-white hover:bg-white hover:text-primary',
    // optional: a class ProjectCard can use for watermark sizing/opacity
    iconClassName:
      'pointer-events-none absolute inset-0 mx-auto my-8 opacity-20 w-[280px] md:w-[420px]',
  },
];

const ProjectsSection = () => {
  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-gray-50">
      <div className="container mx-auto">
        <ScrollReveal>
          <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary mb-12">
            Projects
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsData.map((project, index) => (
            <div key={index} className={index === 2 ? 'md:col-span-2' : ''}>
              <ScrollReveal delay={index * 0.1}>
                <ProjectCard project={project} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
