
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { getProperty } from '../services/property.service';
import { Property } from '../types/property';
import { getImageUrl } from '../utils/image';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // --- ESTADOS PARA EL LIGHTBOX (CUADRO FLOTANTE) ---
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProperty() {
        if (!id) return;
        try {
            const property = await getProperty(id);
            setProperty(property);
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

  // Función para abrir la galería en una foto específica
  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  if (!property) return (
    <div className="flex h-screen items-center justify-center dark:text-white">
      Cargando detalles de la propiedad...
    </div>
  );

  const handleWhatsApp = () => {
    const message = `Hola Oriente Propiedades! Estoy interesado en la propiedad "${property.title}" (${formatPrice(property.price)}) que vi en su web.`;
    window.open(`https://wa.me/542664657284?text=${encodeURIComponent(message)}`, '_blank');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);

    return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark pb-32">
      <TopAppBar title="Detalles" showBack rightIcon="favorite" />
      <p className="text-white font-bold mt-2">
        {property.address}, {property.city}, {property.province}
      </p>

      {/* Hero Carousel - Corregido y con Click para ampliar */}
      <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden bg-gray-100 dark:bg-navy/50 cursor-zoom-in">
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
                className="w-full h-full object-cover" 
                alt={`${property.title}`} 
              />
            </div>
          ))}
        </div>
        
        {/* Contador flotante */}
        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-lg text-white text-[11px] font-black px-4 py-2 rounded-full z-10 border border-white/10 shadow-xl">
          {activeImage + 1} / {property.images.length}
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
            <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase mb-2 inline-block shadow-lg">
                {property.operation} • {property.type}
            </span>
            <h1 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-md">{property.title}</h1>
        </div>
      </div>

      {/* --- CUADRO FLOTANTE (LIGHTBOX MODAL) --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          {/* Botón Cerrar */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Imagen Principal en Grande */}
          <div className="w-full h-full flex items-center justify-center p-2 md:p-10">
            <img 
              src={getImageUrl(property.images[selectedImage].url)}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              alt="Vista ampliada"
            />
          </div>

          {/* Miniaturas Inferiores del Lightbox */}
          <div className="absolute bottom-10 w-full overflow-x-auto flex justify-center gap-2 px-6 no-scrollbar pb-4">
            {(property.images ?? []).map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedImage === idx ? 'ring-4 ring-primary scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <img src={getImageUrl(img.url)} className="w-full h-full object-cover" alt="miniatura" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info de la propiedad */}
      <div className="max-w-4xl mx-auto w-full p-6">
        <div className="flex justify-between items-center mb-8">
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Precio</p>
                <h2 className="text-navy dark:text-white text-4xl font-black">{formatPrice(property.price)}</h2>
            </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy rounded-3xl border border-gray-100 dark:border-gray-800">
                <span className="material-symbols-outlined text-primary">bed</span>
                <span className="text-sm font-black dark:text-white">{property.bedrooms} Dorms</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy rounded-3xl border border-gray-100 dark:border-gray-800">
                <span className="material-symbols-outlined text-primary">bathtub</span>
                <span className="text-sm font-black dark:text-white">{property.bathrooms} Baños</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy rounded-3xl border border-gray-100 dark:border-gray-800">
                <span className="material-symbols-outlined text-primary">square_foot</span>
                <span className="text-sm font-black dark:text-white uppercase">{property.coveredSurface ?? property.totalSurface ?? "-"} m²</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy rounded-3xl border border-gray-100 dark:border-gray-800">
                <span className="material-symbols-outlined text-primary">directions_car</span>
                <span className="text-sm font-black dark:text-white">{property.garages} Cochera</span>
            </div>
        </div>

        <section className="mb-10">
            <h3 className="text-navy dark:text-white font-black text-xl uppercase mb-3">Descripción</h3>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-medium">{property.description}</p>
        </section>

        <section>
            <h3 className="text-navy dark:text-white font-black text-xl uppercase mb-5">Amenidades</h3>
            <div className="flex flex-wrap gap-3">
                {(property.features ?? []).map((f, i) => (
                    <span key={i} className="bg-white dark:bg-navy border border-gray-200 dark:border-gray-800 px-5 py-3 rounded-2xl text-[11px] font-black uppercase text-gray-600 dark:text-gray-300 flex items-center gap-2 shadow-sm transition-transform hover:scale-105">
                        <span className="material-symbols-outlined text-sm text-green-500">check_circle</span> {f}
                    </span>
                ))}
            </div>
        </section>
      </div>

      {/* Botones de Contacto */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-navy/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-4xl mx-auto flex gap-3">
            <button onClick={handleWhatsApp} className="flex-[2] bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 py-5 rounded-[1.5rem] font-black text-sm uppercase shadow-xl shadow-green-500/30 transition-all active:scale-95">
            <span className="material-symbols-outlined">chat</span> Contactar por WhatsApp
            </button>
            <button onClick={() => window.open('tel:+542664657284')} className="flex-1 bg-navy dark:bg-white text-white dark:text-navy flex items-center justify-center gap-2 py-5 rounded-[1.5rem] font-black text-sm uppercase shadow-xl transition-all active:scale-95">
            <span className="material-symbols-outlined">call</span> Llamar
            </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;