import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../services/property.service';
import { Property } from "../types";
import { getImageUrl } from "../utils/image";

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
    window.open('https://wa.me/542664657284?text=Hola!%20Quisiera%20hacer%20una%20consulta%20general%20sobre%20propiedades%20en%20Oriente.', '_blank');
  };

  const navegarConFiltro = (tipo: 'VENTA' | 'ALQUILER') => {
    navigate('/list', { state: { filtroInicial: tipo } });
  };


  const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
  const heroImage = randomPhotos[currentPhotoIndex] || fallbackImage;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-neutral-900 tracking-wider font-sans antialiased">


      <nav className="sticky top-0 z-50 flex items-center bg-[#fafafa]/80 backdrop-blur-xl px-8 py-6 justify-between border-b border-neutral-200/50">
        <div className="flex items-center gap-3">
          <div className="size-3 bg-neutral-900 rounded-none rotate-45" />
          <h2 className="text-neutral-900 text-xs font-semibold tracking-[0.4em] uppercase">
            ORIENTE <span className="font-light text-neutral-400">/ STUDIO</span>
          </h2>
        </div>

        <div className="flex gap-6 items-center">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-center text-neutral-900 hover:text-neutral-400 transition-colors"
          >
            <span className="material-symbols-outlined font-light text-xl">account_circle</span>
          </button>
        </div>
      </nav>

      { }
      <div className="px-6 md:px-12 mt-4">
        <div className="relative w-full h-[45vh] overflow-hidden bg-neutral-900 rounded-sm">
          <img
            src={heroImage}
            alt="Oriente Luxury Property"
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
              className="mt-6 tracking-widest uppercase bg-white text-neutral-950 text-[10px] font-medium py-3 px-8 hover:bg-neutral-950 hover:text-white transition-all duration-400"
            >
              Ver Colección
            </button>
          </div>

          {/* Líneas de progreso sutiles abajo a la derecha */}
          <div className="absolute bottom-6 right-8 flex gap-2 z-10">
            {randomPhotos.length > 0 && randomPhotos.map((_, i) => (
              <div
                key={i}
                className={`h-[2px] transition-all duration-500 ${i === currentPhotoIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>

      { }
      <section className="px-6 md:px-12 mt-16 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bloque Ventas */}
        <button
          onClick={() => navegarConFiltro('VENTA')}
          className="group relative h-40 w-full overflow-hidden bg-neutral-900 text-white transition-all duration-500 border border-neutral-200/60 rounded-sm"
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

        { }
        <button
          onClick={() => navegarConFiltro('ALQUILER')}
          className="group relative h-40 w-full overflow-hidden bg-neutral-900 text-white transition-all duration-500 border border-neutral-200/60 rounded-sm"
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

      {/* FRANJA DE TASACIÓN - GEOMÉTRICA Y SUTIL */}
      <section className="mt-16 px-6 md:px-12 w-full max-w-5xl mx-auto">
        <div className="border-t border-neutral-200 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-md">
            <h3 className="text-neutral-900 font-medium text-xs tracking-[0.3em] uppercase mb-2">
              VALORACIÓN DE ACTIVOS
            </h3>
            <p className="text-neutral-500 text-xs font-light leading-relaxed">
              Analizamos el valor real de su inmueble bajo estándares actuales del mercado boutique.
            </p>
          </div>
          <button
            onClick={handleWhatsAppGeneral}
            className="tracking-widest uppercase bg-neutral-950 text-white text-[10px] font-medium py-3.5 px-8 hover:bg-neutral-700 transition-all duration-300 self-stretch md:self-auto text-center"
          >
            Iniciar Tasación
          </button>
        </div>
      </section>

      { }
      { }
      <footer className="bg-neutral-950 text-neutral-400 py-16 px-8 mt-24 border-t border-neutral-900 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">

          {/* Logo Principal */}
          <img
            src="./images/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain mb-3 brightness-0 invert opacity-90"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />

          { }
          <p className="text-neutral-400 text-[10px] font-light uppercase tracking-[0.3em] mb-8">
            Gestión Inmobiliaria Integral
          </p>

          { }
          <div className="flex justify-center items-center gap-10 mb-8 text-neutral-400">
            { }
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>

            { }
            <a
              href="https://wa.me/542664887159"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.85 1.5l.004.001c5.447 0 9.875-4.426 9.878-9.877.001-2.64-1.019-5.122-2.87-6.973-1.85-1.851-4.335-2.87-6.975-2.871-5.452 0-9.88 4.427-9.883 9.879-.001 1.73.475 3.41 1.374 4.89l-.224.82-.62 2.264 2.32-.608.855-.225zm13.111-6.143c-.244-.122-1.442-.712-1.666-.794-.223-.082-.385-.122-.547.122-.162.244-.627.794-.769.957-.142.163-.284.183-.528.061-.243-.122-.973-.359-1.854-1.144-.685-.611-1.148-1.366-1.282-1.59-.135-.223-.014-.344.108-.465.11-.11.244-.285.365-.426.122-.142.163-.244.244-.407.081-.162.041-.305-.02-.426-.062-.122-.547-1.32-.75-1.81-.197-.474-.398-.41-.547-.417-.141-.007-.304-.007-.466-.007-.163 0-.427.061-.65.305-.224.244-.853.834-.853 2.031 0 1.197.872 2.353.993 2.516.122.163 1.717 2.622 4.16 3.677.581.252 1.034.402 1.39.516.583.185 1.114.159 1.534.096.468-.07 1.442-.589 1.646-1.159.203-.57.203-1.057.142-1.159-.06-.101-.223-.162-.466-.284z" />
              </svg>
            </a>

            { }
            <a
              href="mailto:contacto@orientepropiedades.com"
              className="hover:text-white transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>

          { }
          <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-light mb-4">
            Rawson 75, San Luis Capital
          </p>

          { }
          <div className="w-16 h-[1px] bg-neutral-800 mb-4" />

          { }
          <p className="text-[#404040] text-[9px] uppercase tracking-widest font-light">
            © 2026 ORIENTE PROPIEDADES. Todos los derechos reservados.
          </p>

        </div>
      </footer>

    </div>
  );
};

export default Home;