import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TopAppBar from '../components/TopAppBar';
import SectionHeader from '../components/SectionHeader';

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  SELLER: 'Vendedor',
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
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 tracking-wider font-sans antialiased transition-colors duration-300">
      
      <TopAppBar showBack />
      <div className="flex flex-col p-6 md:p-8 pb-20 max-w-xl mx-auto w-full">        
        <SectionHeader title='MI CUENTA' subtitle='PERFIL'/>
        <div className="flex flex-col items-center p-8 bg-white dark:bg-neutral-900 rounded-sm border border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden">
          
          <div className="size-20 rounded-none bg-neutral-955 dark:bg-neutral-800 flex items-center justify-center text-white shrink-0 mb-4">
            <span className="text-lg font-medium tracking-widest">
              {getInitials()}
            </span>
          </div>

          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-widest uppercase text-center">{fullName}</h2>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light tracking-wide mt-1 text-center">{user?.email}</p>
          
          {roleLabel && (
            <span className="mt-4 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 text-[9px] font-medium uppercase tracking-[0.2em] px-4 py-1 rounded-none">
              {roleLabel}
            </span>
          )}
        </div>

        <div className="mt-8 space-y-3">

          <button 
            onClick={() => navigate('/profile/edit')}
            className="w-full flex items-center justify-between p-4 px-5 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-sm hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0">
                <span className="material-symbols-outlined font-light text-xl">edit</span>
              </div>
              <span className="font-medium text-xs text-neutral-900 dark:text-neutral-200 tracking-wider uppercase group-hover:text-neutral-500 transition-colors duration-200">Editar Perfil</span>
            </div>
            <span className="material-symbols-outlined text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 text-lg font-light">chevron_right</span>
          </button>
          
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full flex items-center justify-between p-4 px-5 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-sm hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0">
                  <span className="material-symbols-outlined font-light text-xl">group</span>
                </div>
                <span className="font-medium text-xs text-neutral-900 dark:text-neutral-200 tracking-wider uppercase group-hover:text-neutral-500 transition-colors duration-200">Gestionar Vendedores</span>
              </div>
              <span className="material-symbols-outlined text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 text-lg font-light">chevron_right</span>
            </button>
          )}

          <div className="pt-4">
            <button 
              onClick={handleLogout}
              className="w-full tracking-widest uppercase bg-neutral-955 text-white dark:bg-neutral-900 text-[10px] font-medium py-3.5 px-8 hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-all duration-300 text-center rounded-sm border border-transparent dark:border-neutral-800"
            >
              Cerrar Sesión del Sistema
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mt-12 gap-3">
          <div className="w-12 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <p className="text-center text-[9px] text-neutral-400 uppercase tracking-[0.25em] font-light">
            © 2026 ORIENTE ESTUDIO.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;