import { createContext, useContext, useState, type ReactNode } from 'react';
import { translate, type Language, type TranslationKey } from '../lib/i18n';

const LANGUAGE_KEY = 'toolkit:lang';

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

function persistLanguage(lang: Language): void {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Language switching still works for the session when storage is unavailable.
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  const setLang = (next: Language) => {
    setLangState(next);
    persistLanguage(next);
  };

  const toggleLang = () => setLang(lang === 'en' ? 'zh' : 'en');

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggleLang,
    t: (key) => translate(lang, key),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }
  return context;
}
