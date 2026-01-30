"use client";
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => changeLanguage('mk')}
        className={`px-3 py-1 rounded border-2 text-sm font-semibold transition-all duration-150 ${i18n.language === 'mk' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:border-blue-400 hover:text-blue-600'}`}
        aria-label="Macedonian"
      >
        MK
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded border-2 text-sm font-semibold transition-all duration-150 ${i18n.language === 'en' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:border-blue-400 hover:text-blue-600'}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
