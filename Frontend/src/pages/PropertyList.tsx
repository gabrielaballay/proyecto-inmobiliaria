import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { getProperties } from '../services/property.service';
import { Property, ViewMode } from '../types';
import { getImageUrl } from '../utils/image';

const statusLabels: Record<string, string> = {
  SOLD: 'Vendido',
  RENTED: 'Alquilado',
  RESERVED: 'Reservado',
};

const PropertyList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { filtroInicial?: string };

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Estados de los campos (lo que el usuario toca)
  const [searchQuery, setSearchQuery] = useState('');
  const [operationFilter, setOperationFilter] = useState(state?.filtroInicial || 'Cualquiera');
  const [typeFilter, setTypeFilter] = useState('Todo tipo');

  // Estados de la data
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadProperties() {
      const data = await getProperties();

      setAllProperties(data);

      if (state?.filtroInicial) {
        setFilteredProperties(
          data.filter(p => p.operation === state.filtroInicial)
        );
      } else {
        setFilteredProperties(data);
      }
    }
    loadProperties();
  }, []);

  // ESTA ES LA FUNCIÓN QUE "DISPARA" LA BÚSQUEDA
  const handleApplyFilters = () => {
    let result = allProperties;

    if (operationFilter !== 'Cualquiera') {
      result = result.filter(p => p.operation === operationFilter);
    }

    if (typeFilter !== 'Todo tipo') {
      result = result.filter(p => p.type === typeFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        `${p.address} ${p.city} ${p.province}`.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(result);
    setShowFilters(false); // Cerramos el panel para mostrar los resultados
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setOperationFilter('Cualquiera');
    setTypeFilter('Todo tipo');
    setFilteredProperties(allProperties);
    setShowFilters(false);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(price);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-neutral-900 tracking-wider font-sans antialiased">
      <TopAppBar showBack />

      {/* Barra de búsqueda y botón de filtro */}
      <div className="px-6 md:px-12 py-6 bg-[#fafafa] border-b border-neutral-200/50 sticky top-[64px] z-40">
        <div className="flex gap-3 max-w-5xl mx-auto w-full">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl">search</span>
            <input
              type="text"
              placeholder="Ej: Juana Koslay, Terrenos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white border border-neutral-200/60 rounded-sm pl-10 pr-4 text-xs tracking-wide focus:outline-none focus:border-neutral-900 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`size-12 rounded-sm flex items-center justify-center transition-all border ${showFilters ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-500 border-neutral-200/60 hover:border-neutral-900 hover:text-neutral-900'}`}
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>

        {/* Panel de Filtros Expandible */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-neutral-200/60 animate-fade-in space-y-5 max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Operación</label>
                <select
                  value={operationFilter}
                  onChange={(e) => setOperationFilter(e.target.value)}
                  className="w-full h-11 bg-white border border-neutral-200/60 rounded-sm text-xs font-medium tracking-wide px-3 focus:outline-none focus:border-neutral-900"
                >
                  <option value="Cualquiera">Cualquiera</option>
                  <option value="VENTA">Venta</option>
                  <option value="ALQUILER">Alquiler</option>
                  <option value="TEMPORAL">Temporal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-11 bg-white border border-neutral-200/60 rounded-sm text-xs font-medium tracking-wide px-3 focus:outline-none focus:border-neutral-900"
                >
                  <option value="Todo tipo">Todo tipo</option>
                  <option value="CASA">Casa</option>
                  <option value="DEPARTAMENTO">Departamento</option>
                  <option value="TERRENO">Terreno</option>
                  <option value="LOCAL">Local</option>
                  <option value="OFICINA">Oficina</option>
                  <option value="GALPON">Galpón</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 h-12 rounded-sm border border-neutral-200/60 text-[10px] font-semibold uppercase text-neutral-500 tracking-[0.3em] hover:border-neutral-900 hover:text-neutral-900 transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-[2] h-12 rounded-sm bg-neutral-950 text-white text-[10px] font-semibold uppercase tracking-[0.3em] hover:bg-neutral-700 transition-all"
              >
                Aplicar y Buscar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 max-w-5xl mx-auto w-full">
        {showFilters ? (
          /* PANTALLA EN BLANCO CUANDO EL FILTRO ESTÁ ABIERTO */
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="size-16 border border-neutral-200/60 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-neutral-400 animate-pulse">filter_alt</span>
            </div>
            <h3 className="text-neutral-900 font-medium text-sm uppercase tracking-[0.3em]">Configurando filtros</h3>
            <p className="text-neutral-400 text-xs font-light mt-2">Ajustá tus preferencias y dale a buscar.</p>
          </div>
        ) : (
          /* RESULTADOS (SOLO SE VEN SI NO ESTÁ EL FILTRO ABIERTO) */
          <>
            <div className="flex items-center justify-between px-6 md:px-12 pt-8 pb-2">
              <h3 className="text-neutral-900 font-medium text-xs uppercase tracking-[0.3em]">
                Resultados <span className="text-neutral-400 font-light ml-1">({filteredProperties.length})</span>
              </h3>
              <div className="flex border border-neutral-200/60 rounded-sm overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`size-8 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-neutral-950 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}>
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>
                <button onClick={() => setViewMode('list')} className={`size-8 flex items-center justify-center transition-colors border-l border-neutral-200/60 ${viewMode === 'list' ? 'bg-neutral-950 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}>
                  <span className="material-symbols-outlined text-lg">view_agenda</span>
                </button>
              </div>
            </div>

            <div className={`px-6 md:px-12 py-6 pb-28 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => {
                  const statusLabel = statusLabels[property.status];

                  return (
                    <div
                      key={property.id}
                      onClick={() => navigate(`/property/${property.id}`)}
                      className={`group bg-white border border-neutral-200/60 rounded-sm overflow-hidden cursor-pointer transition-all duration-500 hover:border-neutral-900 ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                    >
                      <div className={`${viewMode === 'list' ? 'h-48 sm:h-auto sm:w-2/5' : 'h-56'} relative overflow-hidden bg-neutral-900`}>
                        <img
                          src={
                            getImageUrl(
                              property.images.find(i => i.isPrimary)?.url ??
                              property.images[0]?.url
                            )
                          }
                          className="absolute inset-0 size-full object-cover brightness-[0.92] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                          alt={property.title}
                        />

                        {/* Destacada: estrella arriba a la izquierda */}
                        {property.featured && (
                          <div className="absolute top-3 left-3 z-20 size-7 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                            <span
                              className="material-symbols-outlined text-[15px] text-neutral-900"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          </div>
                        )}

                        {/* Estado: cartel diagonal arriba a la derecha */}
                        {statusLabel && (
                          <div className="absolute top-0 right-0 w-60 h-60 overflow-hidden z-20 pointer-events-none">
                            <div className="absolute top-[90px] right-[-58px] w-[365px] rotate-45 bg-neutral-950 text-white text-center py-1 text-[10px] font-semibold uppercase tracking-[0.3em] shadow-md">
                              {statusLabel}
                            </div>
                          </div>
                        )}

                        {/* Operación: etiqueta abajo a la izquierda sobre degradé */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <span className="absolute bottom-3 left-3 z-20 text-white text-[9px] font-semibold uppercase tracking-[0.3em]">
                          {property.operation}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className="text-neutral-900 font-medium text-sm uppercase tracking-wide line-clamp-1">{property.title}</h4>
                            <span className="text-neutral-900 font-semibold text-sm whitespace-nowrap">{formatPrice(property.price)}</span>
                          </div>
                          <p className="text-neutral-400 text-[10px] font-light uppercase tracking-wider mb-4 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">location_on</span> {property.address}, {property.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-neutral-500 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">bed</span>
                            <span className="text-[11px] font-medium">{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">bathtub</span>
                            <span className="text-[11px] font-medium">{property.bathrooms}</span>
                          </div>
                          {property.coveredSurface != null && (
                            <div className="flex items-center gap-1" title="Superficie cubierta">
                              <span className="material-symbols-outlined text-base">square_foot</span>
                              <span className="text-[11px] font-medium">{property.coveredSurface} m² cub.</span>
                            </div>
                          )}
                          {property.totalSurface != null && (
                            <div className="flex items-center gap-1" title="Superficie total">
                              <span className="material-symbols-outlined text-base">crop_free</span>
                              <span className="text-[11px] font-medium">{property.totalSurface} m² tot.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-24 text-center">
                  <span className="material-symbols-outlined text-5xl text-neutral-200 mb-4">search_off</span>
                  <p className="text-neutral-400 text-xs uppercase tracking-widest font-light">No hay propiedades que coincidan.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyList;