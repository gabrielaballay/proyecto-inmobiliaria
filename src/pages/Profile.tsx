import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../hooks/useAuth';

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

  const roleLabel = user
    ? (roleLabels[user.role] ?? user.role)
    : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar 
        title="Mi Perfil" 
        showBack 
        rightIcon="edit" 
        onRightClick={() => navigate('/profile/edit')} 
      />
      
      <div className="flex flex-col items-center pt-8 pb-6 bg-white dark:bg-navy rounded-b-[3rem] shadow-sm">
        <div className="relative">
            <div className="size-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary border-4 border-white dark:border-navy shadow-xl overflow-hidden">
                <span className="material-symbols-outlined text-6xl">person</span>
            </div>
        </div>
        <h2 className="mt-4 text-2xl font-black dark:text-white">{fullName}</h2>
        <p className="text-gray-400 text-sm font-bold">{user?.email}</p>
        {roleLabel && (
          <span className="mt-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {roleLabel}
          </span>
        )}
      </div>

      <div className="p-4 space-y-4 -mt-4">
        <button 
          onClick={() => navigate('/settings')}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-navy rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800"
        >
            <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">settings</span>
                <span className="font-black text-sm dark:text-white uppercase tracking-widest">Ajustes de Cuenta</span>
            </div>
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
        </button>

        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => navigate('/admin/users')}
            className="w-full flex items-center justify-between p-5 bg-white dark:bg-navy rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800"
          >
              <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">group</span>
                  <span className="font-black text-sm dark:text-white uppercase tracking-widest">Gestionar Vendedores</span>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </button>
        )}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-5 text-primary font-black uppercase tracking-widest text-xs"
        >
            <span className="material-symbols-outlined text-sm">logout</span>
            Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;