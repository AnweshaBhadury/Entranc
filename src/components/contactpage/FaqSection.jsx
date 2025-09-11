// src/components/contactpage/FaqSection.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AccordionItem from './AccordionItem';
import client from '../../lib/sanityClient';
import useLanguage from '../../hook/useLanguage';

const FAQ_QUERY = `*[_type=="contact"][0]{
  "heading": FaqSection.heading,
  "faqs": FaqSection.faqs
}`;

// Localized fallback data (English + German)
const localizedFallbacks = {
  en: {
    heading: 'Frequently Asked Questions',
    faqs: [
      { question: "How can I become a member?", answer: "You can join by investing €250 or more. Visit our Participation page for full details." },
      { question: "Do I have to live in the region to join?", answer: "No! While we focus on local development, members from across Germany can participate." },
      { question: "What kind of returns can I expect?", answer: "Our projects aim for sustainable returns between 3-5% annually, depending on project and energy prices." },
      { question: "How are projects selected?", answer: "Projects are selected based on community impact, ecological benefit, and financial viability, with member input being a key factor." },
      { question: "What happens if a project is delayed?", answer: "We keep all members informed through our dashboard and newsletter updates." },
    ],
  },
  du: {
    heading: 'Häufig gestellte Fragen',
    faqs: [
      { question: "Wie kann ich Mitglied werden?", answer: "Sie können beitreten, indem Sie 250 € oder mehr investieren. Besuchen Sie unsere Seite zur Teilnahme für weitere Details." },
      { question: "Muss ich in der Region wohnen, um beitreten zu können?", answer: "Nein! Obwohl wir uns auf lokale Entwicklung konzentrieren, können Mitglieder aus ganz Deutschland teilnehmen." },
      { question: "Welche Renditen kann ich erwarten?", answer: "Unsere Projekte zielen auf nachhaltige Renditen zwischen 3–5 % jährlich ab, abhängig vom Projekt und den Energiepreisen." },
      { question: "Wie werden Projekte ausgewählt?", answer: "Projekte werden anhand der Gemeinschaftsauswirkung, des ökologischen Nutzens und der finanziellen Tragfähigkeit ausgewählt — die Mitwirkung der Mitglieder ist dabei entscheidend." },
      { question: "Was passiert, wenn ein Projekt verzögert wird?", answer: "Wir halten alle Mitglieder über unser Dashboard und Newsletter auf dem Laufenden." },
    ],
  }
};

const itemAnim = {
  hidden: { opacity: 0, x: 50 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const FaqSection = () => {
  const [language] = useLanguage();

  const tFallback = (key) => {
    const cur = localizedFallbacks[language] ?? localizedFallbacks.en;
    return cur[key];
  };

  // helper to extract localized string (handles strings or { en, du } objects)
  const extractLocale = (field, fallback = '') => {
    if (typeof field === 'string') return field;
    if (!field || typeof field !== 'object') return fallback;
    // Prefer exact language, then english, then any string value
    return (field[language] ?? field.en ?? Object.values(field).find(v => typeof v === 'string') ?? fallback);
  };

  // initial state - normalized to { heading: string, faqs: [{ _key, question, answer }] }
  const [data, setData] = useState(() => {
    const fallback = tFallback('faqs') ?? [];
    const heading = tFallback('heading') ?? 'FAQ';
    // ensure fallback faqs are in normalized shape
    const faqs = (fallback || []).map((f, i) => ({
      _key: f._key ?? `fb-${i}`,
      question: f.question ?? f.q ?? f.questionText ?? (f?.q ?? `Question ${i + 1}`),
      answer: f.answer ?? f.a ?? '',
    }));
    return { heading, faqs };
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await client.fetch(FAQ_QUERY);
        if (!mounted) return;

        // heading: could be localized object or string
        const headingRaw = res?.heading ?? null;
        const heading = extractLocale(headingRaw, tFallback('heading'));

        // faqs: normalize each entry into { _key, question: string, answer: string }
        let faqsRaw = Array.isArray(res?.faqs) && res.faqs.length ? res.faqs : tFallback('faqs');
        if (!Array.isArray(faqsRaw)) faqsRaw = [];

        const faqs = faqsRaw.map((it, idx) => {
          // Sanity may return question/answer as nested objects, or already as strings.
          const questionField = it?.question ?? it?.q ?? it?.questionText ?? '';
          const answerField = it?.answer ?? it?.a ?? it?.answerText ?? '';
          return {
            _key: it?._key ?? `faq-${idx}`,
            question: extractLocale(questionField, `Question ${idx + 1}`),
            answer: extractLocale(answerField, ''),
          };
        });

        setData({ heading, faqs });
      } catch (err) {
        if (!mounted) return;
        // Fallback to localized defaults
        const fallbackHeading = tFallback('heading');
        const fallbackFaqs = tFallback('faqs') ?? [];
        const normalized = (fallbackFaqs || []).map((f, i) => ({
          _key: f._key ?? `fb-${i}`,
          question: f.question ?? f.q ?? f.questionText ?? `Question ${i + 1}`,
          answer: f.answer ?? f.a ?? '',
        }));
        setData({ heading: fallbackHeading, faqs: normalized });
      }
    })();
    return () => { mounted = false; };
    // re-run when language changes so fallback updates
  }, [language]);

  return (
    <section className="py-20 px-phone md:px-tab lg:px-desktop bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          id="faq-heading"
          variants={itemAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3, margin: '0px 0px -10% 0px' }}
          className="text-h2-phone md:text-h2-tab font-bold text-primary text-center mb-12"
        >
          {data.heading}
        </motion.h2>

        <div>
          {(data.faqs || []).map((item, index) => {
            const q = item?.question ?? `Question ${index + 1}`;
            const a = item?.answer ?? '';
            return (
              <motion.div
                key={item?._key ?? `${q}-${index}`}
                variants={itemAnim}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35, margin: '0px 0px -12% 0px' }}
                transition={{ delay: Math.min(index * 0.06, 0.3) }}
              >
                <AccordionItem question={q} answer={a} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
