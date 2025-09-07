// src/components/WhoWeAre/WhoWeAre.jsx
import React, { useState, useEffect } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import { FaLightbulb } from 'react-icons/fa';
import client from '../../lib/sanityClient';

const GROQ_QUERY = `*[_type == "about"][0].WhoWeAre{
  heading,
  content
}`;

const fallbackContent = {
  heading: 'Who We Are',
  content: [
    `At EnTranC, we believe in one simple idea: the energy transition must be fast, fair, and local. We are a community-driven cooperative dedicated to bringing renewable energy projects—wind, solar and agri-PV—into the hands of citizens, landowners and municipalities in Bavaria. Founded by a group of local climate advocates, our mission is to make the energy transition tangible and inclusive. By connecting people with purpose, capital with impact and technology with trust, EnTranC helps create energy communities that everyone can own.`,
    `This mission emphasises fairness, local ownership and democratic participation, which are hallmarks of cooperatives.`
  ]
};

const WhoWeAre = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSection() {
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

    fetchSection();
    return () => { mounted = false; };
  }, []);

  const heading = section?.heading ?? fallbackContent.heading;
  const content = section?.content?.length ? section.content : fallbackContent.content;

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <div className="space-y-6">
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">{heading}</h2>
            {content.map((paragraph, idx) => (
              <p key={idx} className="text-dark-gray leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </ScrollReveal>

        <div className="hidden md:flex justify-center items-center">
          <ScrollReveal delay={0.2}>
            <FaLightbulb className="text-9xl text-s2/20" />
          </ScrollReveal>
        </div>

        {error && (
          <div className="absolute bottom-4 left-4 text-red-500 text-sm">
            Unable to load Who We Are content from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default WhoWeAre;
