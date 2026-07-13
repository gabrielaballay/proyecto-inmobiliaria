import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import { useAuth } from "../hooks/useAuth";
import { appConfig } from "../config/appConfig";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login(
                formData.email,
                formData.password
            );
            navigate("/profile", {
                replace: true
            });
        } catch {
            setError("Correo electrónico o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface-secondary text-app tracking-wider font-sans antialiased">

            <TopAppBar showBack />

            <div className="px-6 flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full animate-fade-in pb-24">
                <div className="w-full bg-surface border border-neutral-200/80 p-8 sm:p-10 rounded-xl shadow-xs">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl btn-primary-theme text-white mb-4 shadow-sm">
                            <span className="material-symbols-outlined text-xl font-light">lock_open</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-app mb-1">
                            Ingreso al Sistema
                        </h2>
                        <p className="text-neutral-400 text-xs font-medium tracking-wide">
                            Gestioná tus propiedades en {appConfig.companyName}
                        </p>
                    </div>

                    <form className="w-full space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-700 tracking-wide block ml-0.5">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-lg font-light">mail</span>
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="correo@mail.com"
                                    className="w-full h-12 bg-surface border border-neutral-200 rounded-xl pl-12 pr-4 text-sm text-app placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-700 tracking-wide block ml-0.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-lg font-light">lock</span>
                                </span>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-12 bg-surface border border-neutral-200 rounded-xl pl-12 pr-4 text-sm text-app placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 transition-all duration-200"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="p-3 bg-neutral-50 border border-neutral-200 text-neutral-600 text-xs text-center rounded-xl font-medium">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 btn-primary-theme text-white text-[10px] font-medium uppercase tracking-[0.2em] rounded-xl shadow-sm hover:bg-neutral-800 transition-all duration-200 active:scale-[0.98] flex items-center justify-center pt-[2px]"
                        >
                            {loading ? (
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "ENTRAR AL SISTEMA"
                            )}
                        </button>
                    </form>

                    {/* Footer sutil */}
                    <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
                        <p className="text-[10px] text-neutral-400 tracking-widest uppercase font-medium">
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;