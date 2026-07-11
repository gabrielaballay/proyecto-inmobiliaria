import React from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../config/appConfig";

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
    if (onBack)
      onBack();
    else
      navigate(-1);
  };

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-xl ${transparent
          ? "bg-transparent border-none"
          : "bg-[#fafafa]/80 dark:bg-neutral-950/80 border-b border-neutral-200/50 dark:border-neutral-800/50"
        }`}
    >
      {/* IZQUIERDA */}
      <div className="flex items-center gap-4">
        {showHome && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="size-3 bg-neutral-900 dark:bg-white rotate-45" />

            <h2 className="text-neutral-900 dark:text-white text-xs font-semibold tracking-[0.4em] uppercase">
              {appConfig.companyShortName}{" "}
              <span className="font-light text-neutral-400 dark:text-neutral-500">
                / STUDIO
              </span>
            </h2>
          </div>
        )}
      </div>
      {showBack && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-neutral-900 dark:text-white hover:text-neutral-500 text-[10px] font-medium tracking-widest uppercase transition-colors"
        >
          <span className="material-symbols-outlined text-lg">
            arrow_back
          </span>
          Volver
        </button>
      )}

      {/* DERECHA */}
      {rightIcon && (
        <button
          onClick={onRightClick}
          className="size-10 flex items-center justify-center rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className="material-symbols-outlined">
            {rightIcon}
          </span>
        </button>
      )}
    </nav>
  );
};

export default TopAppBar;