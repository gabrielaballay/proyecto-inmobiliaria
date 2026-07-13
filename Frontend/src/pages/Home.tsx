import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../services/property.service';
import { Property } from "../types";
import { getImageUrl } from "../utils/image";
import TopAppBar from '../components/TopAppBar';
import { appConfig } from '../config/appConfig';
import AppFooter from '../components/AppFooter';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
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
          }, 6000);

          return () => clearInterval(timer);
        }
      }
      catch (error) {
        console.error("Error cargando imágenes:", error);
      }
      finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleWhatsAppGeneral = () => {
    window.open(`https://wa.me/${appConfig.whatsapp}?text=Hola!%20Quisiera%20hacer%20una%20consulta%20general%20sobre%20${appConfig.companyName}.`, '_blank');
  };

  const navegarConFiltro = (tipo: 'VENTA' | 'ALQUILER') => {
    navigate('/list', { state: { filtroInicial: tipo } });
  };

  const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
  const heroImage = randomPhotos[currentPhotoIndex] || fallbackImage;

  return (
    <div className="flex flex-col min-h-screen bg-surface-secondary text-app tracking-wider font-sans antialiased">

      <TopAppBar showBack={false} onRightClick={() => navigate('/settings')} rightIcon='account_circle'/>

      <div className="px-6 md:px-12 mt-4">
        <div className="relative w-full h-[45vh] overflow-hidden btn-primary-theme rounded-sm">
          <img
            src={heroImage}
            alt="Luxury Property"
            className="absolute inset-0 size-full object-cover object-center transition-all duration-1000 ease-in-out brightness-[0.6]"
          />

          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12 z-10">
            <span className="text-neutral-300 font-medium tracking-[0.6em] text-[9px] uppercase mb-2">
              ARGENTINA
            </span>
            <h1 className="text-white text-2xl sm:text-3xl font-light tracking-widest uppercase max-w-xl leading-relaxed">
              ARQUITECTURA <br />
              <span className="font-semibold text-neutral-100">Y ESPACIOS PREMIUM</span>
            </h1>

            <button
              onClick={() => navigate('/list')}
              className="mt-6 tracking-widest uppercase bg-surface text-neutral-950 text-[10px] font-medium py-3 px-8 hover:btn-primary-theme hover:text-white transition-all duration-400"
            >
              Ver Colección
            </button>
          </div>

          <div className="absolute bottom-6 right-8 flex gap-2 z-10">
            {randomPhotos.length > 0 && randomPhotos.map((_, i) => (
              <div
                key={i}
                className="h-[2px] transition-all duration-500"
                style={{ width: i === currentPhotoIndex ? '2rem' : '0.5rem', backgroundColor: i === currentPhotoIndex ? '#ffffff' : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="px-6 md:px-12 mt-16 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => navegarConFiltro('VENTA')}
          className="group relative h-40 w-full overflow-hidden btn-primary-theme text-white transition-all duration-500 border border-neutral-200/60 rounded-sm"
        >
          <img
            src={randomPhotos[0] || fallbackImage}
            className="absolute inset-0 size-full object-cover brightness-[0.5] group-hover:brightness-[0.7] group-hover:scale-105 transition-all duration-700"
            alt="Ventas"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 items-start text-left z-10">
            <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-300">
              01 / MERCADO
            </span>
            <div>
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-white">VENTAS</h4>
              <p className="text-neutral-300 text-[10px] tracking-wider uppercase mt-1 group-hover:text-white transition-colors">Propiedades Disponibles →</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navegarConFiltro('ALQUILER')}
          className="group relative h-40 w-full overflow-hidden btn-primary-theme text-white transition-all duration-500 border border-neutral-200/60 rounded-sm"
        >
          <img
            src={randomPhotos[1] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"}
            className="absolute inset-0 size-full object-cover brightness-[0.5] group-hover:brightness-[0.7] group-hover:scale-105 transition-all duration-700"
            alt="Alquileres"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 items-start text-left z-10">
            <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-300">
              02 / RESIDENCIAL
            </span>
            <div>
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-white">ALQUILER</h4>
              <p className="text-neutral-300 text-[10px] tracking-wider uppercase mt-1 group-hover:text-white transition-colors">Contratos Activos →</p>
            </div>
          </div>
        </button>
      </section>

      <section className="mt-16 px-6 md:px-12 w-full max-w-5xl mx-auto">
        <div className="border-t border-neutral-200 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-md">
            <h3 className="text-app font-medium text-xs tracking-[0.3em] uppercase mb-2">
              VALORACIÓN DE ACTIVOS
            </h3>
            <p className="text-neutral-500 text-xs font-light leading-relaxed">
              Analizamos el valor real de su inmueble bajo estándares actuales del mercado boutique.
            </p>
          </div>
          <button
            onClick={handleWhatsAppGeneral}
            className="tracking-widest uppercase btn-primary-theme text-white text-[10px] font-medium py-3.5 px-8 hover:bg-neutral-700 transition-all duration-300 self-stretch md:self-auto text-center"
          >
            Iniciar Tasación
          </button>
        </div>
      </section>

      {/* FOOTER */}      
      <AppFooter/>
    </div>
  );
};

export default Home;