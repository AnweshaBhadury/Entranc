import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import lightningPattern from '../../assets/lightning.svg';
import MailIconFallback from '../../assets/email.svg?react';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const GROQ_QUERY = `*[_type == "JoinJourney"][0]{
   buttonText,
   description,
   emailPlaceholder,
   heading,
   investmentInfo
}`;

const fadeSlide = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const localizedFallbacks = {
  en: {
    heading: "Join Our Journey",
    description: "Got a project idea or location? We’re always scouting for new rooftops, fields or local collaborators.",
    emailPlaceholder: "Enter your email",
    buttonText: "Contact Us",
    submitting: "Sending...",
    success: "Thanks — we'll be in touch!",
    invalidEmail: "Please enter a valid email address.",
    investmentInfo: "Interested in investing or collaborating? Tell us more.",
  },
  du: {
    heading: "Begleiten Sie unsere Reise",
    description: "Sie haben eine Projektidee oder einen Standort? Wir suchen ständig neue Dächer, Flächen und lokale Partner.",
    emailPlaceholder: "Ihre E-Mail eingeben",
    buttonText: "Kontaktieren",
    submitting: "Senden…",
    success: "Danke — wir melden uns bei Ihnen!",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    investmentInfo: "Interessiert an Investitionen oder Zusammenarbeit? Erzählen Sie uns mehr.",
  }
};

const isValidEmail = (email) => {
  if (!email) return false;
  // simple but practical RFC-inspired check
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const JoinJourney = () => {
  const [language] = useLanguage();
  const t = (key) => (localizedFallbacks[language] && localizedFallbacks[language][key]) || localizedFallbacks.en[key];

  const [data, setData] = useState({
    heading: t('heading'),
    description: t('description'),
    emailPlaceholder: t('emailPlaceholder'),
    buttonText: t('buttonText'),
    investmentInfo: t('investmentInfo'),
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // form states
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const getLocalized = (field, fallbackKey) => {
    if (!field) return t(fallbackKey);
    // If field is already a string, return it.
    if (typeof field === 'string') return field;
    // field is expected to be an object like { _type: 'localeString', en: '...', du: '...' }
    // prefer the requested language, then 'en', then any value present, then fallback
    return field[language] ?? field.en ?? Object.values(field).find(v => typeof v === 'string') ?? t(fallbackKey);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await client.fetch(GROQ_QUERY);
        if (!mounted) return;
        if (res) {
          setData({
            heading: getLocalized(res.heading, 'heading'),
            description: getLocalized(res.description, 'description'),
            emailPlaceholder: getLocalized(res.emailPlaceholder, 'emailPlaceholder'),
            buttonText: getLocalized(res.buttonText, 'buttonText'),
            investmentInfo: getLocalized(res.investmentInfo, 'investmentInfo'),
          });
        } else {
          // use localized fallbacks
          setData({
            heading: t('heading'),
            description: t('description'),
            emailPlaceholder: t('emailPlaceholder'),
            buttonText: t('buttonText'),
            investmentInfo: t('investmentInfo'),
          });
        }
      } catch (err) {
        console.warn('JoinJourney fetch failed:', err);
        if (!mounted) return;
        setFetchError(true);
        setData({
          heading: t('heading'),
          description: t('description'),
          emailPlaceholder: t('emailPlaceholder'),
          buttonText: t('buttonText'),
          investmentInfo: t('investmentInfo'),
        });
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [language]); // re-run when language changes so localized fallback updates

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!isValidEmail(email)) {
      setSubmitError(t('invalidEmail'));
      return;
    }

    setSubmitting(true);

    try {
      // NOTE: no Sanity write is performed here by default.
      // If you'd like to persist submissions, replace this block with a call to your
      // serverless endpoint or `submitContact(name, email, message)` helper.
      //
      // Example:
      // await submitContact({ email });
      //
      // For now we open the user's email client with a prefilled mailto as graceful fallback.
      const subject = encodeURIComponent('Join EnTranC - Project Interest');
      const body = encodeURIComponent(`Hello,\n\nI am interested in joining/better understanding EnTranC. Please contact me at ${email}.\n\nThanks.`);
      // eslint-disable-next-line no-undef
      window.location.href = `mailto:info@entranc.com?subject=${subject}&body=${body}`;

      // optimistic success UX:
      setSubmitSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('JoinJourney submit failed:', err);
      setSubmitError('Failed to submit. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // If you want to show a loader while fetching, replace with your loader component.
  if (loading) {
    return (
      <section className="py-20 px-phone md:px-tab lg:px-desktop w-full" aria-labelledby="join-journey-heading">
        <div className="relative w-full bg-s1 text-white rounded-3xl overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center p-8 md:p-16">
            <div className="md:col-span-7 space-y-6">
              <div className="h-10 w-3/4 bg-gray-600 rounded" />
              <div className="h-6 w-full bg-gray-600 rounded" />
              <div className="h-12 w-full bg-gray-600 rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop w-full" aria-labelledby="join-journey-heading">
      <div className="relative w-full bg-s1 text-white rounded-3xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 z-0 pointer-events-none"
          style={{ backgroundImage: `url(${lightningPattern})`, backgroundSize: '100px' }}
          aria-hidden="true"
        />

        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center p-8 md:p-16">
          <motion.div
            className="md:col-span-7 space-y-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2 variants={fadeSlide} id="join-journey-heading" className="text-5xl font-bold">
              {data.heading}
            </motion.h2>

            <motion.p variants={fadeSlide} className="text-lg leading-relaxed max-w-lg">
              {data.description}
            </motion.p>

            {/* show investment info if present */}
            {data.investmentInfo && (
              <motion.p variants={fadeSlide} className="text-sm leading-relaxed max-w-lg text-blue-100">
                {data.investmentInfo}
              </motion.p>
            )}

            <motion.form variants={fadeSlide} className="flex flex-col sm:flex-row gap-4 pt-4" onSubmit={handleSubmit} aria-describedby="join-journey-status">
              <label htmlFor="join-email" className="sr-only">Email</label>
              <input
                id="join-email"
                name="email"
                type="email"
                placeholder={data.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-auto flex-grow px-5 py-4 rounded-xl text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-s2"
                aria-invalid={submitError ? true : false}
                aria-required="true"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-400 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? t('submitting') : data.buttonText}
              </button>
            </motion.form>

            <div id="join-journey-status" className="pt-3" aria-live="polite">
              {submitError && <p className="text-yellow-100 text-sm">{submitError}</p>}
              {submitSuccess && <p className="text-green-200 text-sm">{t('success')}</p>}
              {fetchError && <p className="text-red-200 text-sm">Could not load section content from Sanity — using fallback copy.</p>}
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block md:col-span-5 h-full relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            aria-hidden="true"
          >
            <div className="absolute bottom-08 left-1/2 -translate-x-1/2 translate-y-8 z-0 pointer-events-none">
              {/* decorative svg */}
              <MailIconFallback className="w-[500px] h-[300px] text-blue-300 opacity-30" aria-hidden="true" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinJourney;
