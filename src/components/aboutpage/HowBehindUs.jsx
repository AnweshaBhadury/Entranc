import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';
import hands from '../../assets/hands.svg';

const tiles = [
  { title: 'Core Values of EnTranC', description: '', special: true },
  { title: 'Participation',  description: 'Every Member Has A Say In Project Decisions.' },
  { title: 'Sustainability', description: 'Balance Ecological, Social And Financial Outcomes.' },
  { title: 'Partnership',    description: 'Fair Contracts With Landowners, Local Governments And Partners.' },
  { title: 'Innovation',     description: 'Support Energy Sharing, Blockchain-Based Shares And Live KPIs.' },
];

const HowBehindUs = () => {
  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white">
      <div className="container mx-auto">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto space-y-2">
            <p className="font-bold text-m-primary">💡 Our Values & Team</p>
            <h2 className="text-h2-phone md:text-h2-tab lg:text-h2-desktop font-bold text-primary">
              The How Behind Us
            </h2>
          </div>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.15}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden shadow-lg">
            {tiles.map((t, i) => {
              if (t.special) {
                // LEFT SPECIAL TILE
                return (
                  <div
                    key={i}
                    className="relative min-h-[260px] md:min-h-[320px] bg-s1 text-white"
                    style={{
                      backgroundImage: `url(${hands})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'left center'
                    }}
                  >
                    {/* subtle overlay to ensure text contrast */}
                    <div className="absolute inset-0 bg-s1/35" />
                    <div className="relative h-full flex items-center">
                      <div className="px-8 py-10">
                        <h3 className="font-bold leading-tight text-3xl md:text-4xl whitespace-pre-line">
                          {/* Force a nice two-line split like the mock */}
                          {'Core Values\nof EnTranC'}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              }

              // STANDARD WHITE TILES
              return (
                <div
                  key={i}
                  className="bg-white text-primary flex flex-col items-center justify-center text-center p-8 border-t md:border-t-0 md:border-l border-gray-200"
                >
                  <h3 className="font-bold text-xl md:text-2xl mb-3">{t.title}</h3>
                  <p className="text-sm leading-relaxed max-w-[18ch] md:max-w-[26ch]">
                    {t.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowBehindUs;
