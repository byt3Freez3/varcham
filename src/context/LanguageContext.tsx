import React, { createContext, useContext, useEffect, useState } from 'react';

export type LanguageMode = 'en' | 'hi';

interface LanguageContextValue {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  toggleLang: () => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageMode>(() => {
    const saved = localStorage.getItem('varcham_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('varcham_lang', lang);
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  const setLang = (next: LanguageMode) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'hi' : 'en'));
  const t = (en: string, hi: string) => (lang === 'hi' ? hi : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

