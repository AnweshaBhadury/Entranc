import React, { createContext, useContext, useCallback, useState } from 'react';

// Allowed language codes
const ALLOWED_LANGS = ['en', 'du']; // 'en' (English) and 'du' (German as requested)

const LanguageContext = createContext(null);

/**
 * LanguageProvider
 * - initial must be 'en' or 'du' (falls back to 'en' if invalid)
 */
export function LanguageProvider({ children, initial = 'en' }) {
  const safeInitial = ALLOWED_LANGS.includes(initial) ? initial : 'en';
  const [language, setLanguage] = useState(safeInitial);

  // exported name must be setHanguage per your request
  const setHanguage = useCallback((newLang) => {
    if (!ALLOWED_LANGS.includes(newLang)) {
      // ignore invalid values and warn (keeps previous language)
      // you can change this behavior to throw an error if you'd like
      // or automatically fallback to 'en' -> just change this block
      // e.g. setLanguage('en');
      // For now: do nothing and warn.
      // eslint-disable-next-line no-console
      console.warn(`setHanguage: ignored invalid language "${newLang}". Allowed: ${ALLOWED_LANGS.join(', ')}`);
      return;
    }
    setLanguage(newLang);
  }, []);

  const value = { language, setHanguage };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * useLanguage hook
 * Returns: [language, setHanguage]
 * - language: current language code ('en' | 'du')
 * - setHanguage: function to update language (only accepts 'en' or 'du')
 */
export default function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return [ctx.language, ctx.setHanguage];
}
