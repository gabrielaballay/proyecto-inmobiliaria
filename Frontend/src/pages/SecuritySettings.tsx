import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';

const SecuritySettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-secondary text-app tracking-wider font-sans antialiased">
      <TopAppBar showBack />
      
      <div className="px-6 md:px-12 py-8 max-w-2xl mx-auto w-full space-y-8 flex-1">
        
        {/* Banner de Estado de Cuenta */}
        <div className="bg-surface border border-neutral-200/60 rounded-sm p-5 flex items-center gap-4">
          <div className="size-10 rounded-sm bg-neutral-50 border border-neutral-200/40 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
          <div>
            <h3 className="font-medium text-xs uppercase tracking-wider text-app">Cuenta Protegida</h3>
            <p className="text-[11px] font-light text-neutral-400 mt-0.5">Tu nivel de seguridad es óptimo.</p>
          </div>
        </div>

        {/* Sección: Cambiar Contraseña */}
        <section className="space-y-3">
          <h4 className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em] px-1">
            Cambiar Contraseña
          </h4>
          <form 
            onSubmit={handleUpdatePassword} 
            className="bg-surface border border-neutral-200/60 rounded-sm p-6 space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">
                Contraseña Actual
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-12 bg-surface border border-neutral-200/60 rounded-sm px-4 text-xs font-medium tracking-wide focus:outline-none focus:border-neutral-900 transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">
                Nueva Contraseña
              </label>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                className="w-full h-12 bg-surface border border-neutral-200/60 rounded-sm px-4 text-xs font-medium tracking-wide placeholder-neutral-300 focus:outline-none focus:border-neutral-900 transition-all"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-sm text-[10px] font-semibold uppercase tracking-[0.3em] transition-all flex items-center justify-center border ${
                success 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200/40' 
                  : 'btn-primary-theme text-white border-neutral-950 hover:bg-neutral-700'
              }`}
            >
              {loading ? (
                <span className="material-symbols-outlined text-xl animate-spin">
                  autorenew
                </span>
              ) : success ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check</span> 
                  Actualizada
                </span>
              ) : 'Actualizar Contraseña'}
            </button>
          </form>
        </section>

        {/* Sección: Opciones de Acceso */}
        <section className="space-y-3">
          <h4 className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em] px-1">
            Opciones de Acceso
          </h4>
          <div className="bg-surface border border-neutral-200/60 rounded-sm overflow-hidden">
            
            {/* Opción 1: Dispositivos */}
            <button className="w-full p-5 flex items-center justify-between border-b border-neutral-200/60 hover:bg-neutral-50/50 transition-colors group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-neutral-400 group-hover:text-app transition-colors">
                  devices
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-app uppercase tracking-wide">
                    Dispositivos Activos
                  </p>
                  <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-[0.15em] mt-0.5">
                    2 sesiones iniciadas
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-neutral-300 group-hover:text-app transition-colors">
                chevron_right
              </span>
            </button>
            
            {/* Opción 2: Doble Factor */}
            <div className="w-full p-5 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-neutral-400">
                  verified_user
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-app uppercase tracking-wide">
                    Doble Factor (2FA)
                  </p>
                  <p className="text-[9px] font-semibold text-neutral-500 bg-neutral-50 border border-neutral-200/40 px-1.5 py-0.5 rounded-sm uppercase tracking-[0.15em] mt-1 inline-block">
                    Recomendado
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch Minimalista y Recto */}
              <button className="h-5 w-10 bg-neutral-200 rounded-sm flex items-center px-0.5 cursor-pointer hover:bg-neutral-300 transition-colors">
                <div className="h-4 w-4 bg-surface rounded-sm shadow-sm" />
              </button>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default SecuritySettings;