import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../hooks/useAuth';

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  SELLER: 'Asesor Comercial',
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Invitado';

  
  const getInitials = () => {
    if (!user) return 'IN';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const roleLabel = user
    ? (roleLabels[user.role] ?? user.role)
    : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0d1527] dark:to-background-dark antialiased">
      <TopAppBar 
        title="Mi Perfil" 
        showBack 
        rightIcon="edit" 
        onRightClick={() => navigate('/profile/edit')} 
      />
      
      {}
      <div className="max-w-md w-full mx-auto px-4 pt-6">
        <div className="flex flex-col items-center pt-10 pb-8 bg-white dark:bg-navy rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100/50 dark:border-gray-800/50 relative overflow-hidden group">
          {}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
          
          {}
          <div className="relative">
            <div className="size-28 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white border-4 border-white dark:border-navy shadow-2xl overflow-hidden transition-transform duration-500 hover:scale-105">
              <span className="text-3xl font-black tracking-wider drop-shadow-sm">
                {getInitials()}
              </span>
            </div>
            <div className="absolute bottom-1 right-1 size-5 bg-emerald-500 border-2 border-white dark:border-navy rounded-full animate-pulse" title="Conectado" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-900 dark:text-white tracking-tight">{fullName}</h2>
          <p className="text-gray-400 dark:text-gray-400 text-sm font-medium mt-1">{user?.email}</p>
          
          {roleLabel && (
            <span className="mt-3 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20">
              {roleLabel}
            </span>
          )}
        </div>
      </div>

      {}
      <div className="max-w-md w-full mx-auto p-4 mt-2 space-y-3.5">
        
        {}
        <button 
          onClick={() => navigate('/settings')}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-navy rounded-2xl shadow-md shadow-gray-100/50 dark:shadow-none border border-gray-100/80 dark:border-gray-800/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
              <span className="material-symbols-outlined flex items-center justify-center text-xl">settings</span>
            </div>
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wide">Ajustes de Cuenta</span>
          </div>
          <span className="material-symbols-outlined text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">chevron_right</span>
        </button>

        {}
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => navigate('/admin/users')}
            className="w-full flex items-center justify-between p-5 bg-white dark:bg-navy rounded-2xl shadow-md shadow-gray-100/50 dark:shadow-none border border-gray-100/80 dark:border-gray-800/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                <span className="material-symbols-outlined flex items-center justify-center text-xl">group</span>
              </div>
              <span className="font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wide">Gestionar Asesores</span>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">chevron_right</span>
          </button>
        )}

        {}
        <div className="pt-4">
          {}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 dark:text-rose-400 font-bold uppercase tracking-wider text-xs rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 hover:bg-rose-500/10 active:scale-[0.99] transition-all duration-300"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Cerrar Sesión del Sistema
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;              