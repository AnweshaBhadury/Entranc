import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import LightningIcon from '../../assets/lightning.svg?react';
import footer1 from '../../assets/footer1.png';
import footer2 from '../../assets/footer2.png';
import footer3 from '../../assets/footer3.png';
import footer4 from '../../assets/footer4.png';

const partnerLogos = [footer1, footer2, footer3];

const FooterNavLink = ({ to, children }) => (
    <Link
        to={to}
        className="block text-4xl font-bold transition-transform duration-300 ease-in-out hover:translate-x-4 hover:underline"
    >
        {children}
    </Link>
);

const Footer = ({ bgColor = 'bg-m-primary', textColor = 'text-white' }) => {
    return (
        <footer className='mt-10'>
            <div className={`relative ${bgColor} ${textColor} rounded-3xl mx-4 lg:mx-8 pt-20 pb-20 px-phone md:px-tab lg:px-desktop overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center text-white z-0">
                    <LightningIcon className="w-full h-full" />
                </div>

                <div className="relative z-10 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                        
                        <div className="flex flex-col space-y-6">
                            <h3 className="text-6xl font-bold">EnTranC</h3>
                            <p className="text-lg">From local land to local power...</p>
                            
                            <div className="space-y-2 pt-4">
                                <p className="font-bold text-lg">Powered By</p>
                                <div className="flex gap-2">
                                   {partnerLogos.map((logo, index) => (
                                       <div key={index} className="bg-white flex items-center justify-center p-2 rounded-xl shadow h-16 w-24">
                                           <img src={logo} className="h-12 object-contain" alt={`Partner logo ${index + 1}`} />
                                       </div>
                                   ))}
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <p className="font-bold text-lg">Co Funded by the European Union</p>
                                <div className="bg-white p-2 rounded-xl w-fit shadow">
                                    <img src={footer4} className="h-12 w-20 object-contain" alt="EU logo"/>
                                </div>
                            </div>
                            
                            <div className="flex-grow"></div>
                            
                            <div className="flex flex-col gap-2 pt-8">
                                <div className="flex items-center gap-3"> <FaEnvelope /> <span>placeholderemail@entrac.com</span> </div>
                                <div className="flex items-center gap-3"> <FaPhoneAlt /> <span>+99 9999 9999</span> </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="space-y-4">
                                <FooterNavLink to="/about">About</FooterNavLink>
                                <FooterNavLink to="/blogs">Blogs</FooterNavLink>
                                <FooterNavLink to="/">Calculator</FooterNavLink>
                                <FooterNavLink to="/pilot-project">Pilot Project</FooterNavLink>
                                <FooterNavLink to="/contact">Contact</FooterNavLink>
                            </div>
                            <div className="space-y-3 pt-10">
                                <a href="#" className="block text-lg hover:underline">Privacy Policy</a>
                                <a href="#" className="block text-lg hover:underline">Disclaimer</a>
                                <a href="#" className="block text-lg hover:underline">Cookies</a>
                                <a href="#" className="block text-lg hover:underline">Cookie Settings</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-phone md:px-tab lg:px-desktop">
                <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center text-sm text-dark-gray">
                    <p>Copyright © 2025. All rights reserved. EnTranC is an EU registered trademark.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <p className="font-semibold">Join EnTranC's Journey:</p>
                        <a href="#" className={`${bgColor} rounded-full p-2 hover:opacity-80 transition-opacity`}><FaInstagram className={`text-xl ${textColor}`} /></a>
                        <a href="#" className={`${bgColor} px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity ${textColor}`}>Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
