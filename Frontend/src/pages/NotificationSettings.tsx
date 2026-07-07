
import React, { useState, useEffect } from 'react';
import TopAppBar from '../components/TopAppBar';

const NotificationSettings: React.FC = () => {
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('user_notif_prefs');
    return saved ? JSON.parse(saved) : {
      newProps: true,
      priceDrops: true,
      newsletter: false,
      offers: true
    };
  });

  useEffect(() => {
    localStorage.setItem('user_notif_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const toggles = [
    { key: 'newProps', label: 'Nuevas Propiedades', desc: 'Alertas cuando subimos casas que te gustan.' },
    { key: 'priceDrops', label: 'Bajas de Precio', desc: 'Avisos si una propiedad marcada baja su valor.' },
    { key: 'offers', label: 'Ofertas Exclusivas', desc: 'Promociones especiales para usuarios.' },
    { key: 'newsletter', label: 'Newsletter Semanal', desc: 'Resumen de noticias inmobiliarias en San Luis.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Notificaciones" showBack />
      
      <div className="p-4 space-y-6">
        <header className="px-2">
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Configura cómo deseas recibir novedades de Oriente Propiedades.</p>
        </header>
        
        <div className="bg-white dark:bg-navy rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {toggles.map((item, idx) => (
            <div key={item.key} className={`flex items-center gap-4 p-6 ${idx !== toggles.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
              <div className="flex-1">
                <h4 className="font-black text-sm dark:text-white uppercase tracking-tighter">{item.label}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
              </div>
              <button 
                onClick={() => setPrefs((prev: any) => ({...prev, [item.key]: !prev[item.key]}))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${prefs[item.key] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <span className={`${prefs[item.key] ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm`} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] text-center">Tus ajustes se sincronizan automáticamente</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
