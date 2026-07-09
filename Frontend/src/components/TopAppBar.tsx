
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopAppBarProps {
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightClick?: () => void;
  showHome?: boolean;
  transparent?: boolean;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ 
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
     <nav className="sticky top-0 z-50 flex items-center bg-[#fafafa]/80 dark:bg-neutral-950/80 backdrop-blur-xl px-8 py-6 justify-between border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-3 bg-neutral-900 dark:bg-white rounded-none rotate-45" /> 
          <h2 className="text-neutral-900 dark:text-white text-xs font-semibold tracking-[0.4em] uppercase">
            ORIENTE <span className="font-light text-neutral-400 dark:text-neutral-500">/ STUDIO</span>
          </h2>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-neutral-900 dark:text-white hover:text-neutral-500 text-[10px] font-medium tracking-widest uppercase transition-colors"
        >
          <span className="material-symbols-outlined font-light text-lg">arrow_back</span>
          Volver
        </button>
      </nav>
  );
};

export default TopAppBar;
