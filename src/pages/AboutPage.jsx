import React from 'react';
import AboutHero from '../components/aboutpage/AboutHero';
import WhoWeAre from '../components/aboutpage/WhoWeAre';
import WhyBehindUs from '../components/aboutpage/WhyBehindUs';
import HowBehindUs from '../components/aboutpage/HowBehindUs';
import JoinJourney from '../components/pilotpage/JoinJourney';
import OurTeam from '../components/aboutpage/OurTeam';
import Footer from '../components/common/Footer';

const AboutPage = () => {
  return (
    <div>
      <AboutHero />
      <WhoWeAre />
      <WhyBehindUs />
      <HowBehindUs />
      <OurTeam />
      <JoinJourney />
      <Footer bgColor="bg-s1" textColor="text-white" />
    </div>
  );
};

export default AboutPage;