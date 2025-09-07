// src/components/OurTeam/OurTeam.jsx
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import teamFallback from '../../assets/aboutblogs.webp';
import client from '../../lib/sanityClient';

const GROQ_QUERY = `*[_type == "about"][0].OurTeam{
  heading,
  members[]{
    name,
    role,
    description,
    "imageUrl": image.asset->url
  }
}`;

const fallbackMembers = [
  { name: 'Lisa Meier', role: 'Chairwoman of the Board', description: 'Energy policy specialist and cooperative founder. Leads strategy and community relations.', imageUrl: teamFallback },
  { name: 'Max Becker', role: 'Technical Lead', description: 'Renewable energy engineer with over 10 years’ experience in solar and wind infrastructure. Oversees project execution.', imageUrl: teamFallback },
  { name: 'Sarah Köhler', role: 'Community Engagement', description: 'Manages member onboarding, events and communications.', imageUrl: teamFallback },
  { name: 'Dr. Jonas Weber', role: 'Impact Analyst', description: 'Environmental scientist focused on CO₂ metrics and regulatory compliance.', imageUrl: teamFallback },
];

const OurTeam = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTeam() {
      try {
        const data = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        setSection(data || null);
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchTeam();
    return () => { mounted = false; };
  }, []);

  const heading = section?.heading ?? 'Our Team';
  const members = section?.members?.length ? section.members : fallbackMembers;

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">{heading}</h2>
          </div>
        </ScrollReveal>

        {/* Team Members */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="text-center bg-gray-50 p-8 rounded-2xl shadow-md h-full">
                <img
                  src={member.imageUrl ?? teamFallback}
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

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            Unable to load Our Team content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeam;
