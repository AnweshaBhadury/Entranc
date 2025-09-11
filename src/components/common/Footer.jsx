// src/components/Footer/Footer.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import LightningIcon from '../../assets/lightning.svg?react';
import client from '../../lib/sanityClient';
import footer1 from '../../assets/footer1.png';
import footer2 from '../../assets/footer2.png';
import footer3 from '../../assets/footer3.png';
import footer4 from '../../assets/footer4.png';
import useLanguage from '../../hook/useLanguage';

const partnerLogosFallback = [footer1, footer2, footer3];
const hoverSlide = 'inline-block transform transition-transform duration-500 ease-out hover:translate-x-2 no-underline';

const FooterNavLink = ({ to, children }) => (
  <Link to={to} className={`block text-4xl font-bold ${hoverSlide}`}>
    {children}
  </Link>
);

const footerQuery = `
*[_type == "Footer"][0]{
  "title": brandName,
  tagline,
  "poweredBy": poweredBy[]{
    "logoUrl": asset->url,
    "alt": alt
  },
  "coFundedBy": {
    "logoUrl": coFunded.asset->url,
    "text": coFunded.text
  },
  "contactEmail": email,
  "contactPhone": phone,
  "navLinks": navLinks[]{
    "label": title,
    "url": url
  },
  "legalLinks": legalLinks[]{
    "label": title,
    "url": url
  },
  copyright,
  "social": socialLinks[]{
    "platform": platform,
    "url": url
  }
}
`;

/* translations (unchanged) */
const translations = {
  en: {
    poweredByLabel: 'Powered By',
    coFundedByDefault: 'Co Funded by the European Union',
    joinText: "Join EnTranC's Journey:",
    contactEmailLabel: 'Email',
    contactPhoneLabel: 'Phone',
    copyright: 'Copyright © 2025. All rights reserved. EnTranC is an EU registered trademark.',
    instagramAria: 'Instagram (opens in new tab)',
    noPartners: 'Partners',
  },
  du: {
    poweredByLabel: 'Unterstützt von',
    coFundedByDefault: 'Mitfinanziert von der Europäischen Union',
    joinText: 'Begleiten Sie die Reise von EnTranC:',
    contactEmailLabel: 'E-Mail',
    contactPhoneLabel: 'Telefon',
    copyright: 'Copyright © 2025. Alle Rechte vorbehalten. EnTranC ist eine eingetragene EU-Marke.',
    instagramAria: 'Instagram (öffnet in neuem Tab)',
    noPartners: 'Partner',
  },
};

const Footer = ({ bgColor = 'bg-m-primary', textColor = 'text-white' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language] = useLanguage(); // language is now available here (e.g. 'en' or 'du')
  const lang = typeof language === 'string' ? language : 'en';
  const t = (key) => (translations[lang] && translations[lang][key]) || translations.en[key];

  useEffect(() => {
    let mounted = true;
    client
      .fetch(footerQuery)
      .then((res) => {
        if (!mounted) return;
        setData(res);
        setLoading(false);
        console.debug('Footer fetched:', res);
      })
      .catch((err) => {
        console.warn('Footer fetch failed, using fallback', err);
        if (!mounted) return;
        setData(null);
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // fallbackData: language-specific fallbacks
  const fallbackData = {
    en: {
      title: "EnTranC",
      tagline: "From local land to local power...",
      poweredBy: partnerLogosFallback.map((logo, i) => ({ logoUrl: logo, alt: `partner-${i + 1}` })),
      coFundedBy: { text: translations.en.coFundedByDefault, logoUrl: footer4 },
      contactEmail: "placeholderemail@entranc.com",
      contactPhone: "+99 9999 9999",
      navLinks: [
        { label: "About", url: "/about" },
        { label: "Blogs", url: "/blogs" },
        { label: "Pilot Project", url: "/pilot-project" },
        { label: "Contact", url: "/contact" },
      ],
      legalLinks: [
        { label: "Privacy Policy", url: "#" },
        { label: "Disclaimer", url: "#" },
        { label: "Cookies", url: "#" },
        { label: "Cookie Settings", url: "#" },
      ],
      copyright: translations.en.copyright,
      social: { instagramUrl: "#" }
    },
    du: {
      title: "EnTranC",
      tagline: "Vom lokalen Land zur lokalen Energie...",
      poweredBy: partnerLogosFallback.map((logo, i) => ({ logoUrl: logo, alt: `partner-${i + 1}` })),
      coFundedBy: { text: translations.du.coFundedByDefault, logoUrl: footer4 },
      contactEmail: "platzhalter@entranc.com",
      contactPhone: "+49 9999 9999",
      navLinks: [
        { label: "Über uns", url: "/about" },
        { label: "Blogs", url: "/blogs" },
        { label: "Pilotprojekt", url: "/pilot-project" },
        { label: "Kontakt", url: "/contact" },
      ],
      legalLinks: [
        { label: "Datenschutz", url: "#" },
        { label: "Haftungsausschluss", url: "#" },
        { label: "Cookies", url: "#" },
        { label: "Cookie-Einstellungen", url: "#" },
      ],
      copyright: translations.du.copyright,
      social: { instagramUrl: "#" }
    }
  };

  // --- helpers to read localeString shapes or plain strings ---
  function getLocaleString(val, langCode, defaultStr = '') {
    if (val === null || val === undefined) return defaultStr;

    // plain string
    if (typeof val === 'string') return val;

    // object like { en: 'text', du: 'text' } or other shapes
    if (typeof val === 'object') {
      // prefer exact language
      if (typeof val[langCode] === 'string' && val[langCode] !== '') return val[langCode];
      // fallback to english if present
      if (typeof val.en === 'string' && val.en !== '') return val.en;
      // return the first available string property
      for (const k of Object.keys(val)) {
        if (typeof val[k] === 'string' && val[k] !== '') return val[k];
      }
    }

    return defaultStr;
  }

  function normalizeLinksArray(maybeArr, fallbackArr = []) {
    const src = Array.isArray(maybeArr) && maybeArr.length ? maybeArr : fallbackArr;
    return src.map((item) => {
      const label = getLocaleString(item?.label ?? item?.title ?? item?.name, lang, '');
      const url = typeof item?.url === 'string' && item.url ? item.url : '#';
      return { label, url, raw: item };
    });
  }

  // Merge fetched + fallback, extracting localized fields using `lang`
  const mergeFooter = (fetched = {}, fallbackAll = {}, langCode = 'en') => {
    const fallback = fallbackAll[langCode] ?? fallbackAll.en;

    const title = getLocaleString(fetched.title ?? fallback.title, langCode, fallback.title);
    const tagline = getLocaleString(fetched.tagline ?? fallback.tagline, langCode, fallback.tagline);

    const poweredBy =
      Array.isArray(fetched.poweredBy) && fetched.poweredBy.length
        ? fetched.poweredBy.map((p, idx) => ({
            logoUrl: p.logoUrl ?? fallback.poweredBy[idx]?.logoUrl ?? '',
            alt: p.alt ?? fallback.poweredBy[idx]?.alt ?? `partner-${idx + 1}`,
          }))
        : fallback.poweredBy ?? [];

    const coFundedBy =
      fetched.coFundedBy && (fetched.coFundedBy.logoUrl || fetched.coFundedBy.text)
        ? {
            text: getLocaleString(fetched.coFundedBy.text ?? fallback.coFundedBy.text, langCode, fallback.coFundedBy.text),
            logoUrl: fetched.coFundedBy.logoUrl ?? fallback.coFundedBy.logoUrl,
          }
        : {
            text: getLocaleString(fallback.coFundedBy.text, langCode, fallback.coFundedBy.text),
            logoUrl: fallback.coFundedBy.logoUrl,
          };

    const contactEmail = fetched.contactEmail ?? fallback.contactEmail;
    const contactPhone = fetched.contactPhone ?? fallback.contactPhone;

    const navLinks = normalizeLinksArray(fetched.navLinks, fallback.navLinks);
    const legalLinks = normalizeLinksArray(fetched.legalLinks, fallback.legalLinks);

    const copyright =
      typeof fetched.copyright === 'string'
        ? fetched.copyright
        : getLocaleString(fetched.copyright ?? fallback.copyright, langCode, fallback.copyright);

    // Social handling: fetched.social expected as array of {platform, url}
    let instagramUrl = fallback.social?.instagramUrl ?? '#';
    const socialArr = Array.isArray(fetched.social) ? fetched.social : Array.isArray(fetched.socialLinks) ? fetched.socialLinks : null;
    if (socialArr && socialArr.length) {
      // normalize and try to find instagram
      const normalized = socialArr
        .map((s) => ({
          platform: getLocaleString(s?.platform ?? s?.title, langCode, ''),
          url: typeof s?.url === 'string' ? s.url : null,
          raw: s,
        }))
        .filter(Boolean);
      const ig = normalized.find((s) => {
        if (!s) return false;
        if (s.platform && s.platform.toLowerCase().includes('instagram')) return true;
        if (s.url && s.url.toLowerCase().includes('instagram.com')) return true;
        return false;
      });
      if (ig?.url) instagramUrl = ig.url;
    } else if (fetched.social && typeof fetched.social === 'object') {
      // shape like { instagramUrl: '...' } or plain object
      instagramUrl = fetched.social.instagramUrl ?? fetched.social.url ?? instagramUrl;
    } else if (typeof fetched.social === 'string') {
      instagramUrl = fetched.social || instagramUrl;
    }

    return {
      title,
      tagline,
      poweredBy,
      coFundedBy,
      contactEmail,
      contactPhone,
      navLinks,
      legalLinks,
      copyright,
      social: { instagramUrl },
    };
  };

  // compute footerData memoized so it changes when `data` or `language` changes
  const footerData = useMemo(() => mergeFooter(data ?? {}, fallbackData, lang), [data, lang]);

  const fadeSlide = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <footer className="mt-10" role="contentinfo">
      <div className={`relative ${bgColor} ${textColor} rounded-3xl mx-4 lg:mx-8 pt-20 pb-20 px-phone md:px-tab lg:px-desktop overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center text-white z-0 pointer-events-none">
          <LightningIcon className="w-full h-full opacity-10" aria-hidden="true" />
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col space-y-6"
            >
              <motion.h3 variants={fadeSlide} className="text-6xl font-bold">
                {footerData.title}
              </motion.h3>
              <motion.p variants={fadeSlide} className="text-lg">
                {footerData.tagline}
              </motion.p>

              {footerData.poweredBy?.length > 0 && (
                <motion.div variants={fadeSlide} className="space-y-2 pt-4">
                  <p className="font-bold text-lg">{t('poweredByLabel')}</p>
                  <div className="flex gap-2 flex-wrap">
                    {footerData.poweredBy.map((partner, i) => (
                      <div key={partner.logoUrl ?? `partner-${i}`} className="bg-white flex items-center justify-center p-2 rounded-xl shadow h-16 w-24">
                        <img
                          src={partner.logoUrl}
                          className="h-12 object-contain"
                          alt={partner.alt ?? `Partner logo ${i + 1}`}
                        />
                      </div>
                    ))}
                    {footerData.poweredBy.length === 0 && (
                      <div className="text-sm text-white/80">{t('noPartners')}</div>
                    )}
                  </div>
                </motion.div>
              )}

              {footerData.coFundedBy && (
                <motion.div variants={fadeSlide} className="space-y-2 pt-4">
                  <p className="font-bold text-lg">{footerData.coFundedBy.text ?? t('coFundedByDefault')}</p>
                  {footerData.coFundedBy.logoUrl && (
                    <div className="bg-white p-2 rounded-xl w-fit shadow">
                      <img src={footerData.coFundedBy.logoUrl} className="h-12 w-20 object-contain" alt="Co-funded logo" />
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div variants={fadeSlide} className="flex flex-col gap-2 pt-8">
                <a
                  href={`mailto:${footerData.contactEmail}`}
                  className={`flex items-center gap-3 ${hoverSlide}`}
                  aria-label={`${t('contactEmailLabel')}: ${footerData.contactEmail}`}
                >
                  <FaEnvelope /><span>{footerData.contactEmail}</span>
                </a>
                <a
                  href={`tel:${(footerData.contactPhone || '').replace(/\s+/g, '')}`}
                  className={`flex items-center gap-3 ${hoverSlide}`}
                  aria-label={`${t('contactPhoneLabel')}: ${footerData.contactPhone}`}
                >
                  <FaPhoneAlt /><span>{footerData.contactPhone}</span>
                </a>
              </motion.div>
            </motion.div>

            <div className="flex flex-col justify-between">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                className="space-y-4"
              >
                {(footerData.navLinks || []).map((link, i) => (
                  <motion.div key={`${link.url ?? link.label ?? i}`} variants={fadeSlide}>
                    {/* If it's an internal link (starts with /) use Link, else anchor */}
                    {link.url && link.url.startsWith('/') ? (
                      <FooterNavLink to={link.url}>{link.label}</FooterNavLink>
                    ) : (
                      <a href={link.url ?? '#'} className={`block text-4xl font-bold ${hoverSlide}`} rel="noopener noreferrer">
                        {link.label}
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                className="space-y-3 pt-10"
              >
                {(footerData.legalLinks || []).map((link, i) => (
                  <motion.div key={`${link.url ?? link.label ?? i}`} variants={fadeSlide}>
                    <a href={link.url ?? '#'} className={`block text-lg ${hoverSlide}`} rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-phone md:px-tab lg:px-desktop">
        <div className="container mx-auto py-6 pb-safe-bottom-nav flex flex-col md:flex-row justify-between items-center text-sm text-dark-gray">
          <p>{footerData.copyright ?? translations.en.copyright}</p>

          {footerData.social?.instagramUrl && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <p className="font-semibold">{t('joinText')}</p>
              <a
                href={footerData.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bgColor} rounded-full p-2 hover:opacity-80 transition-opacity ${hoverSlide}`}
                aria-label={t('instagramAria')}
              >
                <FaInstagram className={`text-xl ${textColor}`} />
              </a>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-sm text-gray-400">Loading footer…</div>
      )}
    </footer>
  );
};

export default Footer;
