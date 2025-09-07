// src/components/contactpage/FaqSection.jsx
import React, { useEffect, useState } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import AccordionItem from './AccordionItem';
import client from '../../lib/sanityClient';

const fallbackData = {
  heading: 'Frequently Asked Questions',
  faqs: [
    { question: "How can I become a member?", answer: "You can join by investing €250 or more. Visit our Participation page for full details." },
    { question: "Do I have to live in the region to join?", answer: "No! While we focus on local development, members from across Germany can participate." },
    { question: "What kind of returns can I expect?", answer: "Our projects aim for sustainable returns between 3-5% annually, depending on project and energy prices." },
    { question: "How are projects selected?", answer: "Projects are selected based on community impact, ecological benefit, and financial viability, with member input being a key factor." },
    { question: "What happens if a project is delayed?", answer: "We keep all members informed through our dashboard and newsletter updates." },
  ],
};

// ✅ Correct GROQ query fetching the FaqSection from the "contact" document
const FAQ_QUERY = `*[_type=="contact"][0]{
  "heading": FaqSection.heading,
  "faqs": FaqSection.faqs
}`;

const FaqSection = () => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchFAQs() {
      try {
        const res = await client.fetch(FAQ_QUERY);
        if (!mounted) return;

        if (res?.faqs?.length) {
          setData(res);
        } else {
          setData(fallbackData);
        }
      } catch (err) {
        console.error('Sanity fetch error:', err);
        if (!mounted) return;
        setError(err);
        setData(fallbackData);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchFAQs();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">
              {data.heading}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div>
            {data.faqs.map((item, index) => (
              <AccordionItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </ScrollReveal>

        {error && (
          <p className="text-center mt-6 text-red-400">
            Unable to load FAQs from Sanity. Showing default content.
          </p>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
