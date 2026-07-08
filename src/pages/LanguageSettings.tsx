
import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';

const LanguageSettings: React.FC = () => {
  const [selected, setSelected] = useState(() => localStorage.getItem('app_lang') || 'es');
  
  const langs = [
    { code: 'es', label: 'Español', flag: '🇦🇷', desc: 'Localizado para Argentina' },
  ];

  const handleSelect = (code: string) => {
    setSelected(code);
    localStorage.setItem('app_lang', code);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Idioma de App" showBack />
      
      <div className="p-4 space-y-4">
        <header className="px-2">
            <p className="text-sm text-gray-500 font-medium">Selecciona el idioma para la interfaz y los reportes.</p>
        </header>

        <div className="bg-white dark:bg-navy rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {langs.map((lang, idx) => (
            <button 
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-5 p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${idx !== langs.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}
            >
              <span className="text-4xl shadow-sm rounded-full">{lang.flag}</span>
              <div className="flex-1 text-left">
                <h4 className="font-black text-sm dark:text-white uppercase tracking-tighter">{lang.label}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{lang.desc}</p>
              </div>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${selected === lang.code ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}>
                {selected === lang.code && <div className="size-3 bg-primary rounded-full animate-fade-in" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
