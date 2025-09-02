import React from 'react';
import PilotHero from '../components/pilotpage/PilotHero';
import ProjectsSection from '../components/pilotpage/ProjectsSection';
import ImpactSection from '../components/pilotpage/ImpactSection';
import JoinJourney from '../components/pilotpage/JoinJourney';
import Footer from '../components/common/Footer';

const PilotProjectsPage = () => {
  return (
    <div>
      <PilotHero />
      <ProjectsSection />
      <ImpactSection />
      <JoinJourney />
      <Footer bgColor="bg-m-s2" textColor="text-white" />
    </div>
  );
};

export default PilotProjectsPage;