import React, { useEffect, useState } from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import lightningPattern from '../../assets/lightning.svg';
import MailIconFallback from '../../assets/email.svg?react';
import client from '../../lib/sanityClient';

const JoinJourney = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const GROQ_QUERY = `*[_type == "pilot"][0].JoinJourney{
    heading,
    description,
    investmentInfo,
    emailPlaceholder,
    buttonText,
    "backgroundPatternUrl": backgroundPattern.asset->url,
    "iconUrl": icon.asset->url
  }`;

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const sanityData = await client.fetch(GROQ_QUERY);

        if (!mounted) return;

        // Fallback values
        const fallbackData = {
          heading: "Join Our Journey",
          description: "Become part of the EnTranC movement. Whether you’re a citizen, local authority, farmer, or entrepreneur — you can help build the future of energy.",
          investmentInfo: "Minimum investment: €250",
          emailPlaceholder: "Enter Your Email",
          buttonText: "Submit",
          backgroundPatternUrl: lightningPattern,
          iconUrl: null,
        };

        setData({
          heading: sanityData?.heading || fallbackData.heading,
          description: sanityData?.description || fallbackData.description,
          investmentInfo: sanityData?.investmentInfo || fallbackData.investmentInfo,
          emailPlaceholder: sanityData?.emailPlaceholder || fallbackData.emailPlaceholder,
          buttonText: sanityData?.buttonText || fallbackData.buttonText,
          backgroundPatternUrl: sanityData?.backgroundPatternUrl || fallbackData.backgroundPatternUrl,
          iconUrl: sanityData?.iconUrl || fallbackData.iconUrl,
        });
      } catch (err) {
        console.error("Sanity fetch error:", err);
        setError(err);

        // use fallback on error
        setData({
          heading: "Join Our Journey",
          description: "Become part of the EnTranC movement. Whether you’re a citizen, local authority, farmer, or entrepreneur — you can help build the future of energy.",
          investmentInfo: "Minimum investment: €250",
          emailPlaceholder: "Enter Your Email",
          buttonText: "Submit",
          backgroundPatternUrl: lightningPattern,
          iconUrl: null,
        });
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (!data) return null; // optionally show a loader

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop">
      <div className="relative container mx-auto bg-s1 text-white rounded-3xl overflow-hidden">
        
        <div
          className="absolute inset-0 opacity-10 z-0"
          style={{ backgroundImage: `url(${data.backgroundPatternUrl})`, backgroundSize: '100px' }}
        ></div>

        {data.iconUrl ? (
          <div className="hidden md:block absolute -bottom-16 -right-16 z-0">
            <img
              src={data.iconUrl}
              alt="Decorative icon"
              className="w-[400px] h-[400px] opacity-40"
            />
          </div>
        ) : (
          <div className="hidden md:block absolute -bottom-16 -right-16 z-0">
            <MailIconFallback className="w-[400px] h-[400px] text-blue-300 opacity-40" />
          </div>
        )}

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
          <ScrollReveal>
            <div className="space-y-6">
              <h2 className="text-5xl font-bold">{data.heading}</h2>
              <p className="text-lg leading-relaxed">{data.description}</p>
              <p className="font-bold text-lg">{data.investmentInfo}</p>
              <form className="flex flex-col sm:flex-row gap-4 pt-4">
                <input
                  type="email"
                  placeholder={data.emailPlaceholder}
                  className="w-full flex-grow px-5 py-4 rounded-xl text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-s2"
                />
                <button
                  type="submit"
                  className="bg-blue-400 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-500 transition-colors"
                >
                  {data.buttonText}
                </button>
              </form>
            </div>
          </ScrollReveal>

          <div className="hidden md:block"></div>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">
          Unable to load JoinJourney section from Sanity.
        </div>
      )}
    </section>
  );
};

export default JoinJourney;
