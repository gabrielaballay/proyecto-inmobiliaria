
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../services/property.service';
import { Property } from "../types";
import { getImageUrl } from "../utils/image";

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // --- LÓGICA DE FOTOS DINÁMICAS ---
  const [properties, setProperties] = useState<Property[]>([]); // Estado para almacenar las propiedades
  const [randomPhotos, setRandomPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      async function loadProperties() {
          try {
              const data = await getProperties();
              setProperties(data);
              const allImages = data.flatMap(property =>
                  property.images.map(image => getImageUrl(image.url))
              );

              const shuffled = [...allImages]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 6);

              setRandomPhotos(shuffled);

              if (shuffled.length > 1) {

                  const timer = setInterval(() => {

                      setCurrentPhotoIndex(prev =>
                          (prev + 1) % shuffled.length
                      );

                  }, 5000);

                  return () => clearInterval(timer);
              }
          }
          finally {
              setLoading(false);
          }
      }
      loadProperties();
  }, []);
  
  const handleWhatsAppGeneral = () => {
    window.open('https://wa.me/542664657284?text=Hola!%20Quisiera%20hacer%20una%20consulta%20general%20sobre%20propiedades%20en%20Oriente.', '_blank');
  };

  const navegarConFiltro = (tipo: 'VENTA' | 'ALQUILER') => {
    navigate('/list', { state: { filtroInicial: tipo } });
  };

  // Imagen por defecto si no hay propiedades cargadas aún
  const heroImage =
    randomPhotos[currentPhotoIndex] ??
    "/images/default-property.jpg";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar con LOGO */}
      <nav className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-navy/95 backdrop-blur-md p-4 border-b border-[#dbe0e6] dark:border-gray-800 justify-between">
        <div className="flex items-center gap-2">
          {/* Aquí va tu logo */}
          <img 
            src="./images/logo.png" 
            alt="Logo" 
            className="h-10 w-auto object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Si no existe el archivo, no rompe
          />
          <h2 className="text-[#111418] dark:text-white text-lg font-black leading-tight tracking-tight font-display uppercase italic">
            Oriente <span className="text-primary font-black">Propiedades</span>
          </h2>
        </div>
        
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => navigate('/notifications')}
            className="relative flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-white"></span>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-col">
        {/* Hero Dinámico con tus fotos reales */}
        <div className="px-0 sm:p-4">
          <div 
            className="relative flex min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat sm:rounded-3xl items-center justify-center p-6 shadow-2xl overflow-hidden transition-all duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%), url("${heroImage}")`
            }}
          >
            <div className="flex flex-col gap-3 text-center max-w-xl animate-fade-in z-10">
              <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full w-fit mx-auto">
                San Luis, Argentina
              </span>
              <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] sm:text-7xl drop-shadow-2xl">
                Encontrá tu <br/><span className="text-primary italic">lugar ideal.</span>
              </h1>
              <p className="text-white/90 text-sm font-semibold leading-normal sm:text-lg max-w-md mx-auto drop-shadow-md">
                No buscamos casas, encontramos hogares. Explorá nuestra selección exclusiva de propiedades.
              </p>
            </div>

            <div className="flex gap-3 mt-4 z-10">
              <button 
                onClick={() => navigate('/list')}
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-base font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Ver Catálogo
              </button>
              <button 
                onClick={handleWhatsAppGeneral}
                className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition-all animate-bounce"
              >
                <span className="material-symbols-outlined">chat</span>
              </button>
            </div>

            {/* Indicador de qué foto estás viendo (puntitos) */}
            <div className="absolute bottom-6 flex gap-2">
              {randomPhotos.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentPhotoIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Categorías con fotos de tus propiedades */}
        <section className="px-4 mt-8">
            <h3 className="text-navy dark:text-white font-black text-xl mb-4 uppercase tracking-tighter">¿Qué estás buscando?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navegarConFiltro('VENTA')} className="group relative h-40 rounded-3xl overflow-hidden shadow-lg active:scale-95 transition-transform">
                <img src={randomPhotos[0] || heroImage} className="absolute inset-0 size-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Ventas" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-90 flex flex-col justify-end p-5">
                  <span className="text-white font-black text-xl">VENTAS</span>
                  <p className="text-primary text-[10px] font-bold uppercase">Tu inversión segura</p>
                </div>
              </button>
              <button onClick={() => navegarConFiltro('ALQUILER')} className="group relative h-40 rounded-3xl overflow-hidden shadow-lg active:scale-95 transition-transform">
                <img src={randomPhotos[1] || heroImage} className="absolute inset-0 size-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Alquileres" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-90 flex flex-col justify-end p-5">
                  <span className="text-white font-black text-xl">ALQUILER</span>
                  <p className="text-primary text-[10px] font-bold uppercase">Mudate hoy mismo</p>
                </div>
              </button>
            </div>
        </section>

        {/* Tarjeta de contacto */}
        <section className="m-4 mt-8 p-8 bg-navy dark:bg-primary rounded-[2.5rem] text-white flex flex-col gap-4 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black leading-tight">¿Querés tasar <br/>tu propiedad?</h3>
            <p className="text-white/70 text-sm font-medium mt-2">Nuestro equipo de expertos te asesora de forma gratuita y profesional.</p>
            <button 
              onClick={handleWhatsAppGeneral}
              className="mt-6 bg-white text-navy px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
            >
              Consultar ahora
            </button>
          </div>
          <span className="material-symbols-outlined text-[150px] absolute -right-8 -bottom-8 opacity-10 rotate-12">sell</span>
        </section>

        <footer className="mt-12 bg-gray-50 dark:bg-navy/50 p-10 text-center border-t border-gray-100 dark:border-gray-800">
          <img 
            src="./images/logo.png" 
            alt="Logo Oriente" 
            className="h-16 mx-auto mb-4 opacity-80" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h2 className="text-navy dark:text-white font-black text-2xl tracking-tighter italic uppercase">Oriente Propiedades</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 mb-8">Gestión Inmobiliaria Integral</p>
          
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="text-navy dark:text-white hover:text-primary transition-colors"><span className="material-symbols-outlined">facebook</span></a>
            <a href="#" className="text-navy dark:text-white hover:text-primary transition-colors"><span className="material-symbols-outlined">camera</span></a>
            <a href="#" className="text-navy dark:text-white hover:text-primary transition-colors"><span className="material-symbols-outlined">mail</span></a>
          </div>
          
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Rawson 75, San Luis Capital</p>
          <p className="text-gray-500 text-[9px] uppercase font-medium mt-4">© 2026 ORIENTE PROPIEDADES. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;