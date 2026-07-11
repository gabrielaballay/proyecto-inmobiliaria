import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../services/auth.service';
import SectionHeader from '../components/SectionHeader';
import TopAppBar from '../components/TopAppBar';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    role: user?.role
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const getInitials = () => {
    if (!user) return 'IN';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updated = await updateProfile(formData);
      if (updateUser) {
        updateUser(updated);
      }
      navigate('/profile');
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        'No fue posible guardar los cambios.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordData.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '' });
      alert('Contraseña actualizada correctamente.');
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message ??
        'No fue posible actualizar la contraseña.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 tracking-wider font-sans antialiased transition-colors duration-300">
      
      <TopAppBar showBack/>

      <div className="flex flex-col p-6 md:p-8 pb-20 max-w-xl mx-auto w-full">
        <SectionHeader title = "PERFIL" subtitle="ACTUALIZAR"/>
        <div className="flex items-center gap-6 bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-8">
          <div className="size-16 rounded-none bg-neutral-950 dark:bg-neutral-800 flex items-center justify-center text-white shrink-0">
            <span className="text-base font-medium tracking-widest">{getInitials()}</span>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">Fotografía de Cuenta</h4>
            <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light tracking-wide mt-1">Sincronizada con tu perfil corporativo.</p>
          </div>
        </div>

        <div className="space-y-12">
          
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div>
              <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 mb-4 pl-1">
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200/60 dark:border-neutral-800/60">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    Nombre
                  </label>
                  <input 
                    name="firstName"
                    type="text" 
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm p-3.5 text-xs tracking-wider text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    Apellido
                  </label>
                  <input 
                    name="lastName"
                    type="text" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm p-3.5 text-xs tracking-wider text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    Email Corporativo
                  </label>
                  <input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm p-3.5 text-xs tracking-wider text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 text-[10px] font-medium tracking-widest uppercase text-center">
                {error}
              </p>
            )}

            <div className="flex gap-4 mt-2">
              <button 
                type="button" 
                onClick={() => navigate('/profile')}
                className="flex-1 tracking-widest uppercase bg-transparent text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 text-[10px] font-medium py-4 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-300 text-center rounded-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] tracking-widest uppercase bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-medium py-4 px-4 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 text-center rounded-sm disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
            <div>
              <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 mb-4 pl-1">
                Seguridad
              </h3>
              <div className="flex flex-col gap-6 bg-white dark:bg-neutral-900 p-6 rounded-sm border border-neutral-200/60 dark:border-neutral-800/60">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    Contraseña Actual
                  </label>
                  <input 
                    name="currentPassword"
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm p-3.5 text-xs tracking-wider text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                    Nueva Contraseña
                  </label>
                  <input 
                    name="newPassword"
                    type="password" 
                    placeholder="MÍNIMO 8 CARACTERES"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm p-3.5 text-xs tracking-wider text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
                  />
                </div>
              </div>
            </div>

            {passwordError && (
              <p className="text-red-600 dark:text-red-400 text-[10px] font-medium tracking-widest uppercase text-center">
                {passwordError}
              </p>
            )}

            <button 
              type="submit"
              disabled={passwordLoading}
              className="mt-2 tracking-widest uppercase bg-transparent text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 text-[10px] font-medium py-4 px-8 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-300 text-center rounded-sm disabled:opacity-50"
            >
              {passwordLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>

        </div>

        <div className="flex flex-col items-center mt-16 gap-3">
          <div className="w-12 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <p className="text-center text-[9px] text-neutral-400 uppercase tracking-[0.25em] font-light">
            © 2026 ORIENTE ESTUDIO.
          </p>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;