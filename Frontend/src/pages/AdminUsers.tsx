import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import { useAuth } from "../hooks/useAuth";
import {
    getUsers,
    createUser,
    changeUserStatus
} from "../services/user.service";
import { User } from "../types/user";

const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    SELLER: "Vendedor"
};

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
};

const AdminUsers: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        if (user.role !== "ADMIN") {
            navigate("/", { replace: true });
            return;
        }

        loadUsers();
    }, [user]);

    async function loadUsers() {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        setSaving(true);

        try {
            const newUser = await createUser({
                ...formData,
                role: "SELLER"
            });

            setUsers(current => [...current, newUser].sort(
                (a, b) => a.firstName.localeCompare(b.firstName)
            ));

            setFormData(emptyForm);
            setShowForm(false);
        } catch (error: any) {
            setFormError(
                error.response?.data?.message ??
                "No fue posible crear el vendedor."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleStatus(id: string) {
        setTogglingId(id);

        try {
            const updated = await changeUserStatus(id);

            setUsers(current =>
                current.map(u => (u.id === id ? updated : u))
            );
        } catch (error) {
            console.error(error);
            alert("No fue posible cambiar el estado del usuario.");
        } finally {
            setTogglingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen dark:text-white">
                Cargando...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <TopAppBar title="Gestión de Vendedores" showBack />

            <div className="p-4 flex flex-col gap-6 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                        Usuarios
                    </h2>
                    <button
                        onClick={() => setShowForm(current => !current)}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">
                            {showForm ? "close" : "add"}
                        </span>
                        {showForm ? "Cancelar" : "Nuevo Vendedor"}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleCreate}
                        className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nombre</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
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
                                    className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Contraseña</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                            />
                        </div>

                        {formError && (
                            <p className="text-red-500 text-xs font-bold">{formError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : "Crear Vendedor"}
                        </button>
                    </form>
                )}

                <div className="grid gap-4">
                    {users.length === 0 ? (
                        <div className="text-center py-20 opacity-30">
                            <span className="material-symbols-outlined text-6xl mb-4">
                                group
                            </span>
                            <p className="font-bold">No hay usuarios cargados</p>
                        </div>
                    ) : (
                        users.map(u => (
                            <div
                                key={u.id}
                                className="bg-white dark:bg-navy p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm"
                            >
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">person</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-sm dark:text-white truncate">
                                        {u.firstName} {u.lastName}
                                    </h4>
                                    <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                            {roleLabels[u.role] ?? u.role}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                            u.active
                                                ? "text-green-600 bg-green-50 dark:bg-green-900/30"
                                                : "text-red-500 bg-red-50 dark:bg-red-900/30"
                                        }`}>
                                            {u.active ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                </div>

                                {u.id !== user?.id && (
                                    <button
                                        onClick={() => handleToggleStatus(u.id)}
                                        disabled={togglingId === u.id}
                                        className={`px-4 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
                                            u.active
                                                ? "bg-red-50 dark:bg-red-900/30 text-red-500"
                                                : "bg-green-50 dark:bg-green-900/30 text-green-600"
                                        }`}
                                    >
                                        {togglingId === u.id
                                            ? "..."
                                            : u.active ? "Desactivar" : "Activar"}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;