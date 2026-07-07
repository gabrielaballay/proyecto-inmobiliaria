import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import { useAuth } from "../hooks/useAuth";

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
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark">

            <TopAppBar
                title="Iniciar Sesión"
                showBack
            />

            <div className="p-8 flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full animate-fade-in">

                <div className="size-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-5xl">
                        login
                    </span>
                </div>

                <h2 className="text-3xl font-black text-navy dark:text-white mb-2 text-center tracking-tight">
                    Bienvenido
                </h2>

                <p className="text-gray-400 font-bold text-center mb-8 text-[10px] uppercase tracking-widest">
                    Ingresa a Oriente Propiedades
                </p>

                <form
                    className="w-full space-y-5"
                    onSubmit={handleLogin}
                >

                    <div className="space-y-1.5">

                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Correo Electrónico
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="material-symbols-outlined text-lg">
                                    mail
                                </span>
                            </span>

                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="correo@oriente.com"
                                className="w-full h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-12 pr-5 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                            />

                        </div>

                    </div>

                    <div className="space-y-1.5">

                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Contraseña
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="material-symbols-outlined text-lg">
                                    lock
                                </span>
                            </span>

                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-12 pr-5 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                            />

                        </div>

                    </div>

                    {

                        error && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                                <p className="text-red-600 text-xs font-bold text-center">
                                    {error}
                                </p>
                            </div>
                        )

                    }

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-red-700 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] mt-4 flex items-center justify-center"
                    >

                        {
                            loading
                                ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                : "Entrar"
                        }
                    </button>
                </form>

                <p className="mt-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Acceso exclusivo para usuarios autorizados.
                </p>
            </div>
        </div>
    );
};

export default Login;