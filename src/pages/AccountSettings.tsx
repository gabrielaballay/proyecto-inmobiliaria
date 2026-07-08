import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../hooks/useAuth';

interface AccountSettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Invitado';

  const userEmail = user?.email ?? '';

  const settingsGroups = [
    {
      title: "Cuenta",
      items: [
        {
          icon: "person",
          label: "Mi Cuenta",
          description: isAuthenticated ? "Gestionar perfil" : "Acceder a tu cuenta",
          path: isAuthenticated ? "/profile" : "/login",
          color: "text-primary",
          isToggle: false
        },
        ...(user?.role === "ADMIN" ? [
          {
            icon: "dashboard",
            label: "Gestionar Propiedades",
            description: "Añadir o editar publicaciones",
            path: "/admin",
            isToggle: false,
            color: ""
          },
          {
            icon: "group",
            label: "Gestionar Vendedores",
            description: "Crear y administrar usuarios",
            path: "/admin/users",
            isToggle: false,
            color: ""
          }
        ] : []),
        { icon: "security", label: "Seguridad", description: "Cambiar contraseña", path: "/settings/security", isToggle: false, color: "" },
        { icon: "notifications", label: "Ajustes de Alertas", description: "Configurar notificaciones", path: "/settings/notifications", isToggle: false, color: "" },
      ]
    },
    {
      title: "Preferencias",
      items: [
        { icon: "language", label: "Idioma", description: "Español (Argentina)", path: "/settings/language", isToggle: false, color: "" },
        { icon: darkMode ? "light_mode" : "dark_mode", label: "Modo Visual", description: darkMode ? "Tema Oscuro" : "Tema Claro", isToggle: true },
        { icon: "star", label: "Favoritos", description: "Propiedades guardadas", path: "/list", isToggle: false, color: "" },
      ]
    },
    {
      title: "Institucional",
      items: [
        { icon: "help", label: "Contacto y Ayuda", description: "FAQ y soporte técnico", path: "/settings/help", isToggle: false, color: "" },
        { icon: "description", label: "Legal", description: "Rawson 75, San Luis", path: "/settings/terms", isToggle: false, color: "" },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <TopAppBar title="Configuración" showBack />

      <div className="flex flex-col gap-6 p-4 pb-12 max-w-2xl mx-auto w-full">
        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-white dark:bg-navy p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in">
          <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
            <span className="material-symbols-outlined text-4xl">person</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-navy dark:text-white text-xl font-black truncate tracking-tighter">{fullName}</h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase truncate tracking-widest">{userEmail}</p>
          </div>
          {!isAuthenticated ? (
            <button 
              onClick={() => navigate('/login')}
              className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all"
            >
              Entrar
            </button>
          ) : (
            <button 
              onClick={() => navigate('/profile')}
              className="bg-gray-50 dark:bg-gray-800 text-primary size-10 flex items-center justify-center rounded-2xl active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </div>

        {/* Groups */}
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-3">
            <h4 className="text-gray-400 text-[10px] font-black px-4 uppercase tracking-[0.3em]">
              {group.title}
            </h4>
            <div className="bg-white dark:bg-navy rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              {group.items.map((item, iIdx) => (
                <div key={iIdx} className={`${iIdx !== group.items.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                  {item.isToggle ? (
                    <div className="flex items-center gap-4 w-full p-5">
                      <div className="size-11 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-navy dark:text-white">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-navy dark:text-white font-black text-sm uppercase tracking-tighter">{item.label}</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{item.description}</p>
                      </div>
                      <button 
                        onClick={onToggleDarkMode}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <span className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300`} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => item.path && navigate(item.path)}
                      className="flex items-center gap-4 w-full p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className={`size-11 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${item.color || 'text-navy dark:text-white'}`}>
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-black text-sm uppercase tracking-tighter ${item.color || 'text-navy dark:text-white'}`}>{item.label}</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{item.description}</p>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors text-lg">chevron_right</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {isAuthenticated && (
            <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-5 mt-4 bg-white dark:bg-navy text-primary font-black rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-primary/5 transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
                <span className="material-symbols-outlined text-sm">logout</span>
                Cerrar Sesión
            </button>
        )}

        <p className="text-center text-[9px] text-gray-400 mt-6 uppercase tracking-[0.4em] font-black opacity-40">
          Oriente Propiedades • San Luis
        </p>
      </div>
    </div>
  );
};

export default AccountSettings;