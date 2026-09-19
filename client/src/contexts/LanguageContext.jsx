import { createContext } from 'react';
import { translations, languages } from '../translations';

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {}
});

export function useLanguage(language) {
  const t = (key) => {
    try {
      return translations[language]?.[key] || translations.en?.[key] || key;
    } catch {
      return key;
    }
  };

  return { t, languages };
}