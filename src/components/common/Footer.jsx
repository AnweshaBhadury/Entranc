import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import LightningIcon from '../../assets/lightning.svg?react';
import client from "../../lib/sanityClient";
import footer1 from '../../assets/footer1.png';
import footer2 from '../../assets/footer2.png';
import footer3 from '../../assets/footer3.png';
import footer4 from '../../assets/footer4.png';

const partnerLogosFallback = [footer1, footer2, footer3];

const FooterNavLink = ({ to, children }) => (
    <Link
        to={to}
        className="block text-4xl font-bold transition-transform duration-300 ease-in-out hover:translate-x-4 hover:underline"
    >
        {children}
    </Link>
);

// Inline Sanity query
const footerQuery = `
*[_type == "footer"][0]{
  title,
  tagline,
  poweredBy[] { "logoUrl": logo.asset->url },
  coFundedBy { "logoUrl": logo.asset->url, text },
  contactEmail,
  contactPhone,
  navLinks[] { label, url },
  legalLinks[] { label, url },
  copyright,
  social { instagramUrl }
}
`;

const Footer = ({ bgColor = 'bg-m-primary', textColor = 'text-white' }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    client.fetch(footerQuery).then((res) => setData(res)).catch(() => setData(null));
  }, []);

  // 🔹 Fallback values
  const fallbackData = {
    title: "EnTranC",
    tagline: "From local land to local power...",
    poweredBy: partnerLogosFallback.map((logo) => ({ logoUrl: logo })),
    coFundedBy: {
      text: "Co Funded by the European Union",
      logoUrl: footer4
    },
    contactEmail: "placeholderemail@entranc.com",
    contactPhone: "+99 9999 9999",
    navLinks: [
      { label: "About", url: "/about" },
      { label: "Blogs", url: "/blogs" },
      { label: "Calculator", url: "/" },
      { label: "Pilot Project", url: "/pilot-project" },
      { label: "Contact", url: "/contact" },
    ],
    legalLinks: [
      { label: "Privacy Policy", url: "#" },
      { label: "Disclaimer", url: "#" },
      { label: "Cookies", url: "#" },
      { label: "Cookie Settings", url: "#" },
    ],
    copyright: "Copyright © 2025. All rights reserved. EnTranC is an EU registered trademark.",
    social: { instagramUrl: "#" }
  };

  const footerData = data || fallbackData;

  return (
    <footer className='mt-10'>
      <div className={`relative ${bgColor} ${textColor} rounded-3xl mx-4 lg:mx-8 pt-20 pb-20 px-phone md:px-tab lg:px-desktop overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center text-white z-0">
          <LightningIcon className="w-full h-full" />
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            
            {/* Left section */}
            <div className="flex flex-col space-y-6">
              <h3 className="text-6xl font-bold">{footerData.title}</h3>
              <p className="text-lg">{footerData.tagline}</p>
              
              {/* Powered By */}
              {footerData.poweredBy?.length > 0 && (
                <div className="space-y-2 pt-4">
                  <p className="font-bold text-lg">Powered By</p>
                  <div className="flex gap-2">
                    {footerData.poweredBy.map((partner, i) => (
                      <div key={i} className="bg-white flex items-center justify-center p-2 rounded-xl shadow h-16 w-24">
                        <img src={partner.logoUrl} className="h-12 object-contain" alt={`Partner logo ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Co-funded */}
              {footerData.coFundedBy && (
                <div className="space-y-2 pt-4">
                  <p className="font-bold text-lg">{footerData.coFundedBy.text}</p>
                  <div className="bg-white p-2 rounded-xl w-fit shadow">
                    <img src={footerData.coFundedBy.logoUrl} className="h-12 w-20 object-contain" alt="EU logo"/>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-col gap-2 pt-8">
                <div className="flex items-center gap-3"> <FaEnvelope /> <span>{footerData.contactEmail}</span> </div>
                <div className="flex items-center gap-3"> <FaPhoneAlt /> <span>{footerData.contactPhone}</span> </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                {footerData.navLinks?.map((link, i) => (
                  <FooterNavLink key={i} to={link.url}>{link.label}</FooterNavLink>
                ))}
              </div>
              <div className="space-y-3 pt-10">
                {footerData.legalLinks?.map((link, i) => (
                  <a key={i} href={link.url} className="block text-lg hover:underline">{link.label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-phone md:px-tab lg:px-desktop">
        <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center text-sm text-dark-gray">
          <p>{footerData.copyright}</p>
          {footerData.social?.instagramUrl && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <p className="font-semibold">Join EnTranC's Journey:</p>
              <a href={footerData.social.instagramUrl} target="_blank" rel="noopener noreferrer" className={`${bgColor} rounded-full p-2 hover:opacity-80 transition-opacity`}>
                <FaInstagram className={`text-xl ${textColor}`} />
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
