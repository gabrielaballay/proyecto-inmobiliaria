import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  const userEmail = user?.email ?? 'Accede para gestionar tus datos';

  const getInitials = () => {
    if (!user) return 'IN';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const settingsGroups = [
    {
      title: "01 / Cuenta",
      items: [
        {
          icon: "person",
          label: "Mi Cuenta",
          description: isAuthenticated ? "Gestionar perfil" : "Acceder a tu cuenta",
          path: isAuthenticated ? "/profile" : "/login",
          isToggle: false
        },
        ...(user?.role === "ADMIN" ? [
          {
            icon: "dashboard",
            label: "Gestionar Propiedades",
            description: "Añadir o editar publicaciones",
            path: "/admin",
            isToggle: false
          },
          {
            icon: "group",
            label: "Gestionar Vendedores",
            description: "Crear y administrar usuarios",
            path: "/admin/users",
            isToggle: false
          }
        ] : []),
        { icon: "security", label: "Seguridad", description: "Cambiar contraseña", path: "/settings/security", isToggle: false },
      ]
    },
    {
      title: "02 / Preferencias",
      items: [
        { icon: "language", label: "Idioma", description: "Español (Argentina)", path: "/settings/language", isToggle: false },
        { icon: darkMode ? "light_mode" : "dark_mode", label: "Modo Visual", description: darkMode ? "Tema Oscuro" : "Tema Claro", isToggle: true },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 tracking-wider font-sans antialiased transition-colors duration-300">
      
      {}
      <nav className="sticky top-0 z-50 flex items-center bg-[#fafafa]/80 dark:bg-neutral-950/80 backdrop-blur-xl px-8 py-8 justify-between border-b border-neutral-200/30 dark:border-neutral-900/40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-2.5 bg-neutral-900 dark:bg-white rounded-none rotate-45" /> 
          <h2 className="text-neutral-900 dark:text-white text-[11px] font-semibold tracking-[0.4em] uppercase">
            ORIENTE <span className="font-light text-neutral-400 dark:text-neutral-500">/ STUDIO</span>
          </h2>
        </div>
        
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-neutral-900 dark:text-white text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300"
        >
          <span className="material-symbols-outlined font-light text-base transition-transform duration-300 group-hover:-translate-x-1">
            west
          </span>
          Volver
        </button>
      </nav>

      {}
      <div className="flex flex-col gap-14 p-8 md:p-12 pb-24 max-w-xl mx-auto w-full">
        
        {}
        <div className="flex items-center gap-6 bg-white dark:bg-neutral-900 p-8 rounded-none border border-neutral-200/40 dark:border-neutral-900/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="size-16 rounded-none bg-neutral-950 dark:bg-neutral-850 flex items-center justify-center text-white shrink-0 border border-neutral-800/10 dark:border-white/5">
            {isAuthenticated ? (
              <span className="text-xs font-light tracking-[0.2em]">{getInitials()}</span>
            ) : (
              <span className="material-symbols-outlined font-light text-xl">person</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-neutral-900 dark:text-white text-xs font-medium tracking-[0.2em] uppercase truncate">{fullName}</h3>
            <p className="text-neutral-400 dark:text-neutral-500 text-[10px] font-light tracking-wide truncate mt-1.5 uppercase">{userEmail}</p>
          </div>

          {!isAuthenticated && (
            <button 
              onClick={() => navigate('/login')}
              className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[9px] font-medium py-3 px-6 tracking-[0.2em] uppercase hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300 rounded-none border border-transparent"
            >
              Entrar
            </button>
          ) }
          
        </div>

        {}
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-5">
            <h4 className="text-neutral-400 dark:text-neutral-500 text-[9px] font-medium tracking-[0.35em] uppercase pl-1 border-b border-neutral-200/40 dark:border-neutral-900/40 pb-2">
              {group.title}
            </h4>
            
            <div className="flex flex-col">
              {group.items.map((item, iIdx) => (
                <div key={iIdx} className="border-b border-neutral-100 dark:border-neutral-900/30 last:border-none">
                  
                  {item.isToggle ? (                    
                    <button 
                      onClick={onToggleDarkMode}
                      className="w-full flex items-center justify-between p-4 px-5 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-sm hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[11px] text-neutral-900 dark:text-neutral-200 tracking-widest uppercase group-hover:text-neutral-500 transition-colors duration-200">{item.label}</p>
                          <p className="text-neutral-400 dark:text-neutral-500 text-[10px] font-light tracking-wide mt-1 uppercase">{item.description}</p>                        
                        </div>
                      </div>
                        <span className={`${darkMode ? 'translate-x-4 bg-white' : 'translate-x-0.5 bg-neutral-400'} inline-block size-4 transform rounded-none transition-transform duration-300`} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => item.path && navigate(item.path)}
                      className="w-full flex items-center justify-between p-4 px-5 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-sm hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0">
                          <span className="material-symbols-outlined font-light text-xl">{item.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[11px] text-neutral-900 dark:text-neutral-200 tracking-widest uppercase group-hover:text-neutral-500 transition-colors duration-200">{item.label}</p>
                          <p className="text-neutral-400 dark:text-neutral-500 text-[10px] font-light tracking-wide mt-1 uppercase">{item.description}</p>                        
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 text-lg font-light">chevron_right</span>
                    </button>
                  )}

                </div>
              ))}
            </div>
          </div>
        ))}

        {}
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className="mt-4 tracking-[0.25em] uppercase text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-[9px] font-medium py-4 px-8 transition-colors duration-300 text-center rounded-none border border-neutral-200 dark:border-neutral-900 bg-transparent"
          >
            Cerrar Sesión del Sistema
          </button>
        )}

        {}
        <div className="flex flex-col items-center mt-8 gap-4">
          <div className="w-8 h-[1px] bg-neutral-200 dark:bg-neutral-900" />
          <p className="text-center text-[8px] text-neutral-400 uppercase tracking-[0.3em] font-light">
            © 2026 ORIENTE STUDIO.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;