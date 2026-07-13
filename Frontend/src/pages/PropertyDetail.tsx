import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { getProperty } from '../services/property.service';
import { Property } from '../types/property';
import { getImageUrl } from '../utils/image';
import { appConfig } from '../config/appConfig';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // --- ESTADOS PARA EL LIGHTBOX ---
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProperty() {
      if (!id) return;
      try {
        const data = await getProperty(id);
        setProperty(data);
      }
      catch (error) {
        console.error(error);
      }
    }

    loadProperty();
  }, [id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, offsetWidth } = e.currentTarget;
    const index = Math.round(scrollLeft / offsetWidth);
    if (index !== activeImage) {
      setActiveImage(index);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(price);

  if (!property) return (
    <div className="flex flex-col items-center justify-center h-screen bg-surface dark:bg-background-dark text-app dark:text-neutral-100 tracking-[0.3em] font-sans antialiased uppercase text-xs">
      <span className="material-symbols-outlined text-3xl text-neutral-400 animate-spin mb-2">
        autorenew
      </span>
      Cargando detalles...
    </div>
  );

  const handleWhatsApp = () => {
    const message = `Hola ${appConfig.companyName}! Estoy interesado en la propiedad "${property.title}" (${formatPrice(property.price)}) que vi en su web.`;
    window.open(`https://wa.me/${appConfig.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-surface-secondary dark:bg-background-dark text-app dark:text-neutral-100 tracking-wider font-sans antialiased pb-36">
      <TopAppBar showBack />

      {/* Hero Carousel */}
      <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden bg-neutral-100 dark:bg-navy/30 cursor-zoom-in border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div
          className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
          onScroll={handleScroll}
          style={{ scrollBehavior: 'smooth' }}
        >
          {(property.images ?? []).map((img, idx) => (
            <div
              key={idx}
              className="w-full min-w-full h-full snap-start snap-always flex-shrink-0"
              onClick={() => openLightbox(idx)}
            >
              <img
                src={getImageUrl(img.url)}
                className="w-full h-full object-cover brightness-[0.92] dark:brightness-[0.85]"
                alt={`${property.title}`}
              />
            </div>
          ))}
        </div>

        {/* Contador flotante (Estilo minimalista) */}
        <div className="absolute top-6 right-6 btn-primary-theme/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm z-10 border border-white/10 shadow-sm">
          {activeImage + 1} / {property.images.length}
        </div>

        {/* Degradé inferior controlado */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent pointer-events-none"></div>

        {/* Textos sobre el carrusel */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-10 max-w-5xl mx-auto w-full">
          <span className="bg-surface/95 text-app text-[9px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-[0.2em] mb-3 inline-block shadow-sm">
            {property.operation} • {property.type}
          </span>
          <h1 className="text-white text-2xl md:text-4xl font-medium uppercase tracking-wide leading-tight drop-shadow-sm max-w-3xl">
            {property.title}
          </h1>
          <p className="text-neutral-300 text-[10px] font-light uppercase tracking-widest mt-2 flex items-center gap-1 drop-shadow-sm">
            <span className="material-symbols-outlined text-xs">location_on</span>
            {property.address}, {property.city}, {property.province}
          </p>
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] btn-primary-theme/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white bg-surface/5 hover:bg-surface/10 border border-white/10 p-3 rounded-sm transition-all z-[110]"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          <div className="w-full h-full flex items-center justify-center p-2 md:p-10">
            <img
              src={getImageUrl(property.images[selectedImage].url)}
              className="max-w-full max-h-full object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-300"
              alt="Vista ampliada"
            />
          </div>

          {/* Miniaturas Inferiores */}
          <div className="absolute bottom-10 w-full overflow-x-auto flex justify-center gap-2 px-6 no-scrollbar pb-4">
            {(property.images ?? []).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 border ${
                  selectedImage === idx 
                    ? 'border-white scale-105 ring-2 ring-white/20' 
                    : 'border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <img src={getImageUrl(img.url)} className="w-full h-full object-cover" alt="miniatura" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cuerpo de la Información */}
      <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-8 grid grid-cols-1 gap-8">
        
        {/* Sección de Precio */}
        <div className="border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
          <p className="text-neutral-400 dark:text-neutral-500 text-[9px] font-semibold uppercase tracking-[0.3em] mb-1">Valor de la propiedad</p>
          <h2 className="text-app dark:text-white text-3xl font-semibold tracking-wide">{formatPrice(property.price)}</h2>
        </div>

        {/* Specs Grid (Estilo PropertyList adaptado a Dark Mode) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-surface dark:bg-navy border border-neutral-200/60 dark:border-neutral-800 rounded-sm shadow-sm">
            <span className="material-symbols-outlined text-neutral-400 dark:text-neutral-500 text-xl">bed</span>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">{property.bedrooms} Dormitorios</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface dark:bg-navy border border-neutral-200/60 dark:border-neutral-800 rounded-sm shadow-sm">
            <span className="material-symbols-outlined text-neutral-400 dark:text-neutral-500 text-xl">bathtub</span>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">{property.bathrooms} Baños</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface dark:bg-navy border border-neutral-200/60 dark:border-neutral-800 rounded-sm shadow-sm">
            <span className="material-symbols-outlined text-neutral-400 dark:text-neutral-500 text-xl">directions_car</span>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">{property.garages} Cochera</span>
          </div>          
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">          
          <div className="flex items-center gap-3 p-4 bg-surface dark:bg-navy border border-neutral-200/60 dark:border-neutral-800 rounded-sm shadow-sm">
            <span className="material-symbols-outlined text-neutral-400 dark:text-neutral-500 text-xl">square_foot</span>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              {property.coveredsurface ?? "-"} m² Cub.
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface dark:bg-navy border border-neutral-200/60 dark:border-neutral-800 rounded-sm shadow-sm">
            <span className="material-symbols-outlined text-neutral-400 dark:text-neutral-500 text-xl">square</span>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              {property.totalsurface ?? "-"} m² Totales.
            </span>
          </div>
        </div>

        {/* Descripción */}
        <section className="mt-2">
          <h3 className="text-app dark:text-white font-medium text-xs uppercase tracking-[0.3em] mb-4">Descripción</h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-light whitespace-pre-line tracking-wide">
            {property.description}
          </p>
        </section>

        {/* Amenidades */}
        <section className="mt-2">
          <h3 className="text-app dark:text-white font-medium text-xs uppercase tracking-[0.3em] mb-4">Amenidades</h3>
          <div className="flex flex-wrap gap-2.5">
            {(property.features ?? []).map((f, i) => (
              <span 
                key={i} 
                className="bg-surface dark:bg-navy border border-neutral-200/60 dark:border-neutral-800 px-4 py-2.5 rounded-sm text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-300 flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm text-neutral-400 dark:text-neutral-500">done</span> 
                {f}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Barra Fija Inferior de Contacto (Respetando Dark Mode) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 dark:bg-navy/95 backdrop-blur-xl border-t border-neutral-200/60 dark:border-neutral-800/60 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex gap-3 px-2 md:px-8">
          <button 
            onClick={handleWhatsApp} 
            className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-sm text-[11px] font-semibold uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">chat</span> Contactar por WhatsApp
          </button>
          <button 
            onClick={() => window.open(`tel:+${appConfig.whatsapp}`)} 
            className="flex-1 h-14 btn-primary-theme dark:bg-surface text-white dark:text-neutral-950 flex items-center justify-center gap-2 rounded-sm text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-95 shadow-sm border border-neutral-950 dark:border-white"
          >
            <span className="material-symbols-outlined text-lg">call</span> Llamar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;