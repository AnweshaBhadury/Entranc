import React, { useEffect, useState } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import StatCounter from '../StatCounter';
import client from '../../lib/sanityClient';

const ImpactSection = () => {
  const [impactData, setImpactData] = useState(null);
  const [error, setError] = useState(null);

  const GROQ_QUERY = `*[_type == "pilot"][0].ImpactSection{
    introLabel,
    heading,
    items[] {
      type,
      titleLine1,
      titleLine2,
      value,
      label
    }
  }`;

  useEffect(() => {
    let mounted = true;

    async function fetchImpact() {
      try {
        const data = await client.fetch(GROQ_QUERY);

        if (!mounted) return;

        // fallback values
        const defaultData = {
          introLabel: "Our Values & Team",
          heading: "The How Behind Us",
          items: [
            { type: "title", titleLine1: "Impact", titleLine2: "of EnTranC" },
            { type: "stat", value: "3", label: "Pilot Sites Launched" },
            { type: "stat", value: "42", label: "MWp Targeted By 2030" },
            { type: "stat", value: "1000+", label: "Cooperative Members" },
            { type: "stat", value: "€45", label: "Million Mobilised In Citizen Capital" },
          ],
        };

        // merge fetched data with fallback
        setImpactData({
          introLabel: data?.introLabel || defaultData.introLabel,
          heading: data?.heading || defaultData.heading,
          items: data?.items?.length ? data.items.map((item, i) => ({
            type: item.type || defaultData.items[i]?.type,
            titleLine1: item.titleLine1 || defaultData.items[i]?.titleLine1,
            titleLine2: item.titleLine2 || defaultData.items[i]?.titleLine2,
            value: item.value || defaultData.items[i]?.value,
            label: item.label || defaultData.items[i]?.label,
          })) : defaultData.items,
        });

      } catch (err) {
        console.error("Sanity fetch error:", err);
        if (!mounted) return;
        setError(err);
        // use fallback if fetch fails
        setImpactData({
          introLabel: "Our Values & Team",
          heading: "The How Behind Us",
          items: [
            { type: "title", titleLine1: "Impact", titleLine2: "of EnTranC" },
            { type: "stat", value: "3", label: "Pilot Sites Launched" },
            { type: "stat", value: "42", label: "MWp Targeted By 2030" },
            { type: "stat", value: "1000+", label: "Cooperative Members" },
            { type: "stat", value: "€45", label: "Million Mobilised In Citizen Capital" },
          ],
        });
      }
    }

    fetchImpact();
    return () => { mounted = false; };
  }, []);

  if (!impactData) return null; // optionally show a loader

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="font-bold text-m-primary">{impactData.introLabel}</p>
            <h2 className="text-h2-phone md:text-h2-tab font-bold text-primary">
              {impactData.heading}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 shadow-lg rounded-xl overflow-hidden">
            {impactData.items.map((item, index) => {
              if (item.type === "title") {
                return (
                  <div
                    key={index}
                    className="relative bg-m-primary text-white p-8 flex items-center justify-center text-center"
                  >
                    <div className="absolute inset-0 bg-[url('/src/assets/hands.svg')] bg-center bg-contain bg-no-repeat opacity-10"></div>
                    <h3 className="relative text-3xl font-bold leading-tight">
                      {item.titleLine1}<br />
                      {item.titleLine2}
                    </h3>
                  </div>
                );
              }
              return (
                <StatCounter
                  key={index}
                  value={item.value}
                  label={item.label}
                />
              );
            })}
          </div>
        </ScrollReveal>

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            Unable to load Impact Section from Sanity.
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactSection;
