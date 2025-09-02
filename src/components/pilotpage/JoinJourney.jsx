import React from 'react';
import ScrollReveal from '../utils/ScrollReveal';

import lightningPattern from '../../assets/lightning.svg';
import MailIcon from '../../assets/email.svg?react';

const JoinJourney = () => {
  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop">
        <div className="relative container mx-auto bg-s1 text-white rounded-3xl overflow-hidden">
            
            <div 
                className="absolute inset-0 opacity-10 z-0" 
                style={{ backgroundImage: `url(${lightningPattern})`, backgroundSize: '100px' }}
            ></div>


            <div className="hidden md:block absolute -bottom-16 -right-16 z-0">
                <MailIcon className="w-[400px] h-[400px] text-blue-300 opacity-40" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
                <ScrollReveal>
                    <div className="space-y-6">
                        <h2 className="text-5xl font-bold">Join Our Journey</h2>
                        <p className="text-lg leading-relaxed">
                            Become part of the EnTranC movement. Whether you’re a citizen, local authority, farmer, or entrepreneur — you can help build the future of energy.
                        </p>
                        <p className="font-bold text-lg">Minimum investment: €250</p>
                        <form className="flex flex-col sm:flex-row gap-4 pt-4">
                          <input 
                            type="email" 
                            placeholder="Enter Your Email"
                            className="w-full flex-grow px-5 py-4 rounded-xl text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-s2"
                          />
                          <button 
                            type="submit"
                            className="bg-blue-400 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-500 transition-colors"
                          >
                            Submit
                          </button>
                        </form>
                    </div>
                </ScrollReveal>
                
                <div className="hidden md:block"></div>
            </div>
        </div>
    </section>
  );
};

export default JoinJourney;