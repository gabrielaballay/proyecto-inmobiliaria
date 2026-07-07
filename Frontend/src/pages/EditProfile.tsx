import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../services/auth.service';

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
    email: user?.email ?? ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

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
      updateUser(updated);
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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Editar Perfil" showBack />

      <div className="p-6 max-w-2xl mx-auto w-full animate-fade-in space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="size-32 rounded-[3rem] bg-gray-100 dark:bg-navy flex items-center justify-center text-gray-300 border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
            <span className="material-symbols-outlined text-7xl">person</span>
          </div>
        </div>

        {/* Info Form */}
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Información Personal</h3>
            <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nombre</label>
                <input 
                  name="firstName"
                  type="text" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Apellido</label>
                <input 
                  name="lastName"
                  type="text" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Cuenta y Contacto</h3>
            <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Email</label>
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold px-2">{error}</p>
          )}

          <div className="pt-2 flex gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/profile')}
              className="flex-1 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-[0.2em] text-gray-500 active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-primary text-white h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>

        {/* Security Section - Password */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Seguridad</h3>
          <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Contraseña Actual</label>
              <input 
                name="currentPassword"
                type="password" 
                placeholder="••••••••" 
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nueva Contraseña</label>
              <input 
                name="newPassword"
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs font-bold">{passwordError}</p>
            )}

            <button 
              type="submit"
              disabled={passwordLoading}
              className="w-full h-12 rounded-xl border border-primary text-primary font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {passwordLoading ? (
                <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;