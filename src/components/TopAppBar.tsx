
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopAppBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightClick?: () => void;
  showHome?: boolean;
  transparent?: boolean;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ 
  title, 
  showBack = false, 
  onBack, 
  rightIcon, 
  onRightClick,
  showHome = true,
  transparent = false
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const goHome = () => navigate('/');

  return (
    <div className={`sticky top-0 z-50 flex items-center p-4 pb-2 justify-between border-b ${transparent ? 'bg-white/0 border-transparent' : 'bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-gray-200 dark:border-gray-800'}`}>
      <div className="flex size-12 shrink-0 items-center">
        {showBack ? (
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" aria-label="Volver">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
        ) : (
          <button onClick={goHome} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" aria-label="Inicio">
            <span className="material-symbols-outlined">home</span>
          </button>
        )}
      </div>
      
      <h2 
        onClick={goHome}
        className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display truncate px-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        {title}
      </h2>

      <div className="flex min-w-12 items-center justify-end gap-1">
        {showHome && showBack && (
          <button 
            onClick={goHome}
            className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Ir al inicio"
          >
            <span className="material-symbols-outlined">home</span>
          </button>
        )}
        {rightIcon ? (
          <button 
            onClick={onRightClick}
            className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">{rightIcon}</span>
          </button>
        ) : (
          !showHome && <div className="w-10" />
        )}
      </div>
    </div>
  );
};

export default TopAppBar;
