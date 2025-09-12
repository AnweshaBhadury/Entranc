'use client';

import React from 'react';
import ContactHero from '../components/contactpage/ContactHero';
import ContactFormSection from '../components/contactpage/ContactFormSection';
import FaqSection from '../components/contactpage/FaqSection';
import Footer from '../components/common/Footer';

const ContactPage = () => {
  return (
    <div>
      <ContactHero />
      <ContactFormSection />
      <FaqSection />
      <Footer bgColor="bg-m-s2" textColor="text-white" />
    </div>
  );
};

export default ContactPage;