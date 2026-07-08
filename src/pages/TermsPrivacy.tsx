
import React from 'react';
import TopAppBar from '../components/TopAppBar';

const TermsPrivacy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Marco Legal" showBack />
      
      <div className="p-6 overflow-y-auto flex-1">
        <div className="max-w-prose mx-auto space-y-8">
          <section>
            <h3 className="text-xl font-black dark:text-white mb-4 uppercase tracking-tighter">Términos de Servicio</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-loose font-medium">
              Bienvenido a la plataforma digital de <strong>Oriente Propiedades</strong>. Al utilizar nuestra aplicación, usted acepta cumplir con nuestros términos y condiciones. La información de las propiedades es proporcionada con fines informativos y puede estar sujeta a cambios sin previo aviso. Oriente Propiedades actúa como intermediario inmobiliario matriculado en la Provincia de San Luis, con domicilio legal en <strong>Rawson 75, San Luis Capital</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-black dark:text-white mb-4 uppercase tracking-tighter">Política de Privacidad</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-loose font-medium">
              Tu privacidad es fundamental para nosotros. Recopilamos información básica para mejorar tu experiencia de búsqueda y contactarte solo cuando lo solicites a través de nuestros canales oficiales. Los datos registrados son utilizados exclusivamente para la gestión inmobiliaria y nunca serán cedidos a terceros.
            </p>
          </section>

          <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-200 dark:border-gray-700">
            <h4 className="font-black dark:text-white text-xs mb-2 uppercase tracking-widest">Información de Contacto Legal</h4>
            <p className="text-xs text-gray-500 font-bold mb-1">Email: orientepropiedadessl@gmail.com</p>
            <p className="text-xs text-gray-500 font-bold mb-4">Dirección: Rawson 75, San Luis Capital</p>
            <p className="text-[10px] text-gray-400 italic">Este documento fue actualizado por última vez el 20 de Mayo de 2024.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;
