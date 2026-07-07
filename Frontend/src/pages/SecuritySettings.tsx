
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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Seguridad" showBack />
      
      <div className="p-4 space-y-6">
        <div className="bg-white dark:bg-navy rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="size-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <h3 className="font-bold dark:text-white">Cuenta Protegida</h3>
            <p className="text-xs text-gray-500">Tu nivel de seguridad es óptimo.</p>
          </div>
        </div>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Cambiar Contraseña</h4>
          <form onSubmit={handleUpdatePassword} className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Contraseña Actual</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nueva Contraseña</label>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center ${success ? 'bg-green-500' : 'bg-primary shadow-lg shadow-primary/20'}`}
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : success ? (
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Actualizada</span>
              ) : 'Actualizar Contraseña'}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Opciones de Acceso</h4>
          <div className="bg-white dark:bg-navy rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <button className="w-full p-5 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-gray-400">devices</span>
                    <div className="text-left">
                        <p className="text-sm font-bold dark:text-white">Dispositivos Activos</p>
                        <p className="text-[10px] text-gray-400 uppercase">2 sesiones iniciadas</p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </button>
            <button className="w-full p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-gray-400">verified_user</span>
                    <div className="text-left">
                        <p className="text-sm font-bold dark:text-white">Doble Factor (2FA)</p>
                        <p className="text-[10px] text-gray-400 uppercase text-primary">Recomendado</p>
                    </div>
                </div>
                <div className="h-6 w-11 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center px-1">
                    <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecuritySettings;
