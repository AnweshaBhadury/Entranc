import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import teamIcons from '../../assets/aboutblogs.webp';

const teamMembers = [
  { name: 'Lisa Meier', role: 'Chairwoman of the Board', description: 'Energy policy specialist and cooperative founder. Leads strategy and community relations.' },
  { name: 'Max Becker', role: 'Technical Lead', description: 'Renewable energy engineer with over 10 years’ experience in solar and wind infrastructure. Oversees project execution.' },
  { name: 'Sarah Köhler', role: 'Community Engagement', description: 'Manages member onboarding, events and communications.' },
  { name: 'Dr. Jonas Weber', role: 'Impact Analyst', description: 'Environmental scientist focused on CO₂ metrics and regulatory compliance.' },
];

const OurTeam = () => {
  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">Our Team</h2>
          </div>
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="text-center bg-gray-50 p-8 rounded-2xl shadow-md h-full">
                <img
                  src={teamIcons}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-s1"
                />
                <h3 className="font-bold text-xl text-primary">{member.name}</h3>
                <p className="font-semibold text-m-primary mb-3">{member.role}</p>
                <p className="text-sm text-dark-gray">{member.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;