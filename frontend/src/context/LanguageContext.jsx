import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations.jsx';

// Create Language Context
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Function to toggle between English and Malayalam
  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ml' : 'en');
  };

  // Function to set specific language
  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ml') {
      setCurrentLanguage(lang);
    }
  };

  // Function to get translation for a key path (e.g., 'navbar.signUp')
  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let value = translations[currentLanguage];
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || keyPath; // Return the key itself if translation not found
  };

  // Function to get current language translations
  const getCurrentTranslations = () => {
    return translations[currentLanguage];
  };

  // Function to get language display name
  const getLanguageDisplayName = (lang) => {
    const displayNames = {
      en: { en: 'English', ml: 'English' },
      ml: { en: 'മലയാളം', ml: 'മലയാളം' }
    };
    return displayNames[lang]?.[currentLanguage] || lang;
  };

  // Function to get current language name for display
  const getCurrentLanguageName = () => {
    return getLanguageDisplayName(currentLanguage);
  };

  // Function to get next language name for button display
  const getNextLanguageName = () => {
    const nextLang = currentLanguage === 'en' ? 'ml' : 'en';
    return getLanguageDisplayName(nextLang);
  };

  // Function to get language direction (for future RTL support if needed)
  const getLanguageDirection = () => {
    return 'ltr'; // Both English and Malayalam are LTR
  };

  const value = {
    currentLanguage,
    toggleLanguage,
    setLanguage,
    t,
    getCurrentTranslations,
    getLanguageDisplayName,
    getCurrentLanguageName,
    getNextLanguageName,
    getLanguageDirection,
    isEnglish: currentLanguage === 'en',
    isMalayalam: currentLanguage === 'ml'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
