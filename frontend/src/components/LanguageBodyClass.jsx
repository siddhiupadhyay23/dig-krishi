import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageBodyClass = () => {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Remove any existing language classes
    document.body.classList.remove('english', 'malayalam');
    
    // Add the appropriate language class
    const languageClass = currentLanguage === 'ml' ? 'malayalam' : 'english';
    document.body.classList.add(languageClass);

    // Also set the lang attribute on html element for accessibility
    document.documentElement.lang = currentLanguage;

    return () => {
      // Cleanup on unmount
      document.body.classList.remove('english', 'malayalam');
    };
  }, [currentLanguage]);

  return null; // This component doesn't render anything
};

export default LanguageBodyClass;
