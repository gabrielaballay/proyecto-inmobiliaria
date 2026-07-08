
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { getProperties } from '../services/property.service';
import { Property, ViewMode } from '../types';
import { getImageUrl } from '../utils/image';

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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Propiedades" showBack />

      {/* Barra de búsqueda y botón de filtro */}
      <div className="p-4 bg-white dark:bg-navy border-b border-gray-100 dark:border-gray-800 sticky top-[64px] z-40">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Ej: Juana Koslay, Terrenos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`size-12 rounded-2xl flex items-center justify-center transition-all ${showFilters ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {/* Panel de Filtros Expandible */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 animate-fade-in space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Operación</label>
                  <select
                      value={operationFilter}
                      onChange={(e) => setOperationFilter(e.target.value)}
                      className="w-full h-11 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold dark:text-white"
                  >
                      <option value="Cualquiera">Cualquiera</option>
                      <option value="VENTA">Venta</option>
                      <option value="ALQUILER">Alquiler</option>
                      <option value="TEMPORAL">Temporal</option>
                  </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tipo</label>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-11 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold dark:text-white"
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
            
            <div className="flex gap-2">
              <button 
                onClick={handleClearFilters}
                className="flex-1 h-12 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-black uppercase text-gray-500 tracking-widest hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
              <button 
                onClick={handleApplyFilters}
                className="flex-[2] h-12 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Aplicar y Buscar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <div className="flex-1">
        {showFilters ? (
          /* PANTALLA EN BLANCO CUANDO EL FILTRO ESTÁ ABIERTO */
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="size-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">filter_alt</span>
            </div>
            <h3 className="text-navy dark:text-white font-black text-xl">Configurando filtros...</h3>
            <p className="text-gray-400 text-sm">Ajusta tus preferencias y dale a buscar.</p>
          </div>
        ) : (
          /* RESULTADOS (SOLO SE VEN SI NO ESTÁ EL FILTRO ABIERTO) */
          <>
            <div className="flex items-center justify-between p-4 pb-0">
              <h3 className="text-navy dark:text-white font-black text-lg">
                Resultados <span className="text-gray-400 font-bold ml-1 text-sm">({filteredProperties.length})</span>
              </h3>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button onClick={() => setViewMode('grid')} className={`size-8 rounded-full flex items-center justify-center ${viewMode === 'grid' ? 'bg-white dark:bg-navy shadow-sm text-primary' : 'text-gray-400'}`}>
                  <span className="material-symbols-outlined text-xl">grid_view</span>
                </button>
                <button onClick={() => setViewMode('list')} className={`size-8 rounded-full flex items-center justify-center ${viewMode === 'list' ? 'bg-white dark:bg-navy shadow-sm text-primary' : 'text-gray-400'}`}>
                  <span className="material-symbols-outlined text-xl">view_agenda</span>
                </button>
              </div>
            </div>

            <div className={`p-4 pb-24 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <div 
                    key={property.id}
                    onClick={() => navigate(`/property/${property.id}`)}
                    className={`bg-white dark:bg-navy rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer transition-all hover:shadow-md ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                  >
                    <div className={`${viewMode === 'list' ? 'h-48 sm:h-auto sm:w-2/5' : 'h-56'} relative overflow-hidden`}>
                      <img src={
                            getImageUrl(
                                property.images.find(i => i.isPrimary)?.url ??
                                property.images[0]?.url
                            )
                        } className="size-full object-cover" alt={property.title} />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{property.operation}</span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="text-navy dark:text-white font-black text-base line-clamp-1">{property.title}</h4>
                          <span className="text-primary font-black text-lg whitespace-nowrap">{formatPrice(property.price)}</span>
                        </div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span> {property.address}, {property.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">bed</span>
                          <span className="text-xs font-bold">{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">bathtub</span>
                          <span className="text-xs font-bold">{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">square_foot</span>
                          <span className="text-xs font-bold">{property.coveredSurface ?? property.totalSurface ?? "-"} m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
                  <p className="text-gray-400 font-bold">No hay propiedades que coincidan.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <button className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-navy text-white px-8 py-4 rounded-full shadow-2xl font-black text-sm flex items-center gap-2 hover:bg-primary active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined">map</span>
        VER EN MAPA
      </button>
    </div>
  );
};

export default PropertyList;