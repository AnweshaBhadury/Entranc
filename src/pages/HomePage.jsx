import React from 'react';
import Hero from '../components/homepage/Hero';
import TransitionSection from '../components/homepage/TransitionSection';
import StatsSection from '../components/homepage/StatsSection';
import RoadmapSection from '../components/homepage/RoadmapSection';
import ConsortiumSection from '../components/homepage/ConsortiumSection';
import ResourcesSection from '../components/homepage/ResourcesSection';
import CalculatorSection from '../components/homepage/CalculatorSection';
import MakingEnergySection from '../components/homepage/MakingEnergySection';
import Marquee from '../components/homepage/Marquee';
import Footer from '../components/common/Footer';

const HomePage = () => {
    return (
        <div>
            <Hero />
            <TransitionSection />
            <StatsSection />
            <RoadmapSection />
            <ConsortiumSection />
            <ResourcesSection />
            {/* <CalculatorSection /> */}
            <MakingEnergySection />
            <Marquee />
            <Footer />
        </div>
    );
};

export default HomePage;