import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HelpFAQ: React.FC = () => {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: "¿Cómo reservo una propiedad?", a: "Para reservar, debes contactarnos vía WhatsApp al 2664887159 o visitarnos en Rawson 00. Un asesor te guiará con la documentación." },
    { q: "¿Qué requisitos piden para alquilar?", a: "Generalmente solicitamos recibo de sueldo del inquilino y dos garantes con recibo de sueldo o una garantía propietaria." },
    { q: "¿Tienen oficina física?", a: "Sí, estamos ubicados en Rawson 00, San Luis Capital. Nuestro horario de atención es de Lunes a Viernes de 9:00 a 18:00 hs." },
    { q: "¿Cómo puedo tasar mi propiedad?", a: "Escríbenos a gabi@propiedades.com o por WhatsApp para coordinar una visita técnica y tasar tu propiedad sin compromiso." },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/542664887159?text=Hola!%20Necesito%20ayuda%20con%20la%20app%20de%20Oriente.', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 tracking-wider font-sans antialiased transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center bg-[#fafafa]/80 dark:bg-neutral-950/80 backdrop-blur-xl px-8 py-6 justify-between border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-3 bg-neutral-900 dark:bg-white rounded-none rotate-45" /> 
          <h2 className="text-neutral-900 dark:text-white text-xs font-semibold tracking-[0.4em] uppercase">
            ORIENTE <span className="font-light text-neutral-400 dark:text-neutral-500">/ STUDIO</span>
          </h2>
        </div>
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-neutral-900 dark:text-white hover:text-neutral-500 text-[10px] font-medium tracking-widest uppercase transition-colors"
        >
          <span className="material-symbols-outlined font-light text-lg">arrow_back</span>
          Volver
        </button>
      </nav>

      <div className="flex flex-col p-6 md:p-8 pb-20 max-w-2xl mx-auto w-full">
        
        {}
        <div className="mb-10">
          <h1 className="text-neutral-900 dark:text-white text-xl font-light tracking-widest uppercase">
            SOPORTE <span className="font-semibold">/ AYUDA</span>
          </h1>
          <div className="w-12 h-[1px] bg-neutral-950 dark:bg-white mt-4" />
        </div>

        {}
        <div className="flex flex-col items-center p-8 bg-white dark:bg-neutral-900 rounded-none border border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-12">
          <div className="size-12 bg-neutral-950 dark:bg-neutral-800 flex items-center justify-center text-white mb-4">
            <span className="material-symbols-outlined font-light text-xl">support_agent</span>
          </div>
          
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-white tracking-[0.25em] uppercase text-center">
            ¿Necesitas soporte?
          </h3>
          <p className="text-neutral-400 dark:text-neutral-500 text-[9px] font-light uppercase tracking-[0.2em] mt-2 mb-6 text-center">
            Atención personalizada inmediata
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <button 
              onClick={handleWhatsApp} 
              className="flex-1 tracking-widest uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-medium py-3 px-4 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all text-center rounded-none"
            >
              WhatsApp
            </button>
            <button 
              onClick={() => window.open('gabi@propiedades.com')} 
              className="flex-1 tracking-widest uppercase border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200 bg-transparent text-[10px] font-medium py-3 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all text-center rounded-none"
            >
              Email Directo
            </button>
          </div>
        </div>

        {}
        <section className="space-y-6">
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-white tracking-[0.3em] uppercase px-1">
            Preguntas Frecuentes
          </h3>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="border-b border-neutral-200 dark:border-neutral-800 transition-colors"
                >
                  <button 
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-200 tracking-wider group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors pr-4">
                      {faq.q}
                    </span>
                    <span className={`material-symbols-outlined font-light text-xl text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs font-light leading-relaxed max-w-xl px-1">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {}
        <div className="flex flex-col items-center mt-16 gap-3">
          <div className="w-12 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <p className="text-center text-[8px] text-neutral-400 uppercase tracking-[0.25em] font-light">
            Versión de la App: 2.1.0 • © 2026 ORIENTE ESTUDIO.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HelpFAQ;