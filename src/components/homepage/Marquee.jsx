import React from 'react';
// Using the more accurate icon from the design
import { HiOutlineUserGroup } from 'react-icons/hi'; 

// Using the simple, reliable import method that you confirmed works
import bulbIcon from '../../assets/bulb.svg';

const Marquee = () => {
    return (
        // Added more vertical padding for the larger content
        <div className="py-20 bg-gray-100 overflow-hidden whitespace-nowrap -mt-16 relative z-0">
            {/* Using the faster animation class */}
            <div className="animate-marquee-fast flex items-center">
                
                {/* --- First Set --- */}
                {/* Using the huge, responsive text/icon sizes and correct color */}
                <HiOutlineUserGroup className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee text-m-primary mx-12" />
                <h2 className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee font-bold text-m-primary mx-12">
                    Power to the People.
                </h2>
                
                {/* USING THE IMG TAG as you requested, with huge responsive sizes */}
                <img src={bulbIcon} alt="Lightbulb icon" className="h-16 md:h-24 lg:h-32 w-auto mx-12" />
                
                <h2 className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee font-bold text-m-primary mx-12">
                    Energy by the People.
                </h2>

                {/* --- Second Set (for a seamless loop) --- */}
                <HiOutlineUserGroup className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee text-m-primary mx-12" />
                <h2 className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee font-bold text-m-primary mx-12">
                    Power to the People.
                </h2>
                <img src={bulbIcon} alt="Lightbulb icon" className="h-16 md:h-24 lg:h-32 w-auto mx-12" />
                <h2 className="text-h-marquee-phone md:text-h-marquee-tab lg:text-h-marquee font-bold text-m-primary mx-12">
                    Energy by the People.
                </h2>
            </div>
        </div>
    );
};

export default Marquee;