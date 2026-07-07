
import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';

const HelpFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: "¿Cómo reservo una propiedad?", a: "Para reservar, debes contactarnos vía WhatsApp al 2664657284 o visitarnos en Rawson 75. Un asesor te guiará con la documentación." },
    { q: "¿Qué requisitos piden para alquilar?", a: "Generalmente solicitamos recibo de sueldo del inquilino y dos garantes con recibo de sueldo o una garantía propietaria." },
    { q: "¿Tienen oficina física?", a: "Sí, estamos ubicados en Rawson 75, San Luis Capital. Nuestro horario de atención es de Lunes a Viernes de 9:00 a 18:00 hs." },
    { q: "¿Cómo puedo tasar mi propiedad?", a: "Escríbenos a orientepropiedadessl@gmail.com o por WhatsApp para coordinar una visita técnica y tasar tu propiedad sin compromiso." },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/542664657284?text=Hola!%20Necesito%20ayuda%20con%20la%20app%20de%20Oriente.', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Centro de Ayuda" showBack />
      
      <div className="p-4 space-y-6">
        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[2rem] border border-primary/20 text-center shadow-inner">
          <div className="size-16 bg-white dark:bg-navy rounded-3xl flex items-center justify-center text-primary shadow-sm mx-auto mb-4 border border-primary/10">
            <span className="material-symbols-outlined text-4xl">support_agent</span>
          </div>
          <h3 className="font-black dark:text-white text-lg">¿Necesitas soporte?</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6 leading-relaxed font-bold uppercase tracking-widest">Atención personalizada inmediata</p>
          <div className="flex gap-2">
            <button onClick={handleWhatsApp} className="flex-1 bg-green-500 text-white font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all">WhatsApp</button>
            <button onClick={() => window.open('mailto:orientepropiedadessl@gmail.com')} className="flex-1 bg-navy text-white font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Email</button>
          </div>
        </div>

        <section>
            <h3 className="text-lg font-black dark:text-white px-2 mb-4 uppercase tracking-tighter">Preguntas Frecuentes</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-navy rounded-[1.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-bold text-sm dark:text-white leading-tight pr-4">{faq.q}</span>
                    <span className={`material-symbols-outlined transition-transform text-primary ${openIdx === idx ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {openIdx === idx && (
                    <div className="px-5 pb-5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
        </section>

        <footer className="text-center py-4 opacity-50">
            <p className="text-[10px] font-black uppercase text-gray-400">Versión de la App: 2.1.0 • Oriente Propiedades</p>
        </footer>
      </div>
    </div>
  );
};

export default HelpFAQ;
