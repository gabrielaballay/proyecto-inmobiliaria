import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import { useAuth } from "../hooks/useAuth";
import {
    getUsers,
    createUser,
    changeUserStatus,
    deleteUser
} from "../services/user.service";
import { User } from "../types/user";
import { showConfirmDialog } from "../components/ConfirmDialog";
import { showApiError } from "../utils/showApiError";
import SectionHeader from "../components/SectionHeader";
import { appConfig } from "../config/appConfig";

const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    SELLER: "Vendedor"
};

const emptyForm = {
    firstName: "",
    lastName: "",
    role: "SELLER",
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
            showApiError(error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const newUser = await createUser(formData);

            setUsers(current => [...current, newUser].sort(
                (a, b) => a.firstName.localeCompare(b.firstName)
            ));

            setFormData(emptyForm);
            setShowForm(false);
        } catch (error: any) {
            showApiError(error);
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
           showApiError(error);
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDelete(id: string) {
        showConfirmDialog({
            title: "¿Confirmas la eliminación de este usuario?",
            description:
                "Esta acción eliminará el usuario definitivamente.",
            loadingText: "Eliminando usuario...",
            successText: "Usuario eliminado correctamente.",
            errorText: "No fue posible eliminar el usuario.",
            onConfirm: async () => {
                await deleteUser(id);
                setUsers(current =>
                    current.filter(u => u.id !== id)
                );
            }
        });
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-surface text-app tracking-[0.3em] font-sans antialiased uppercase text-xs">
                <span className="material-symbols-outlined text-3xl text-neutral-400 animate-spin mb-2">
                    autorenew
                </span>
                Cargando...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-surface-secondary text-app tracking-wider font-sans antialiased">
            <TopAppBar showBack />

            <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto w-full flex-1">
                <SectionHeader title = {appConfig.companyShortName}subtitle="VENDEDORES"/>
                <div className="flex justify-between items-center border-b border-neutral-200/50 pb-6 mb-6">
                    <h2 className="text-app font-medium text-xs uppercase tracking-[0.3em]">
                        Usuarios
                        <span className="text-neutral-400 font-light ml-1">({users.length})</span>
                    </h2>
                    <button
                        onClick={() => setShowForm(current => !current)}
                        className={`h-11 px-5 rounded-sm text-[10px] font-semibold uppercase tracking-[0.3em] transition-all flex items-center gap-2 shadow-sm border ${showForm
                            ? 'bg-surface text-neutral-500 border-neutral-200/60 hover:border-neutral-900 hover:text-app'
                            : 'btn-primary-theme text-white border-neutral-950 hover:bg-neutral-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">
                            {showForm ? "close" : "add"}
                        </span>
                        {showForm ? "Cancelar" : "Nuevo Vendedor"}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleCreate}
                        className="bg-surface border border-neutral-200/60 rounded-sm p-6 space-y-5 animate-fade-in mb-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Nombre</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    className="w-full h-12 bg-surface border border-neutral-200/60 rounded-sm px-4 text-xs font-medium tracking-wide focus:outline-none focus:border-neutral-900 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Apellido</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    className="w-full h-12 bg-surface border border-neutral-200/60 rounded-sm px-4 text-xs font-medium tracking-wide focus:outline-none focus:border-neutral-900 transition-all"
                                />
                            </div>
                        </div>

                        {user?.role === "ADMIN" && (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Rol</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full h-11 bg-surface border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                >
                                    <option value="SELLER">Vendedor</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full h-12 bg-surface border border-neutral-200/60 rounded-sm px-4 text-xs font-medium tracking-wide focus:outline-none focus:border-neutral-900 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-semibold uppercase text-neutral-400 tracking-[0.3em]">Contraseña</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full h-12 bg-surface border border-neutral-200/60 rounded-sm px-4 text-xs font-medium tracking-wide placeholder-neutral-300 focus:outline-none focus:border-neutral-900 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-12 rounded-sm btn-primary-theme text-white text-[10px] font-semibold uppercase tracking-[0.3em] hover:bg-neutral-700 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="material-symbols-outlined text-xl animate-spin">
                                    autorenew
                                </span>
                            ) : "Crear Vendedor"}
                        </button>
                    </form>
                )}

                <div className="grid gap-4">
                    {users.length === 0 ? (
                        <div className="py-24 text-center border border-dashed border-neutral-200 rounded-sm">
                            <span className="material-symbols-outlined text-5xl text-neutral-200 mb-4">
                                group
                            </span>
                            <p className="text-neutral-400 text-xs uppercase tracking-widest font-light">
                                No hay usuarios cargados.
                            </p>
                        </div>
                    ) : (
                        users.map(u => (
                            <div
                                key={u.id}
                                className="bg-surface border border-neutral-200/60 rounded-sm flex items-center gap-5 p-4 hover:border-neutral-900 transition-all duration-300"
                            >
                                <div className="size-12 rounded-sm bg-neutral-50 border border-neutral-200/40 flex items-center justify-center text-neutral-400 shrink-0">
                                    <span className="material-symbols-outlined text-xl">person</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-app font-medium text-sm uppercase tracking-wide truncate">
                                        {u.firstName} {u.lastName}
                                    </h4>
                                    <p className="text-neutral-400 text-xs font-light lowercase tracking-normal mt-0.5 truncate">
                                        {u.email}
                                    </p>

                                    <div className="flex gap-2 mt-2.5">
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 bg-neutral-50 border border-neutral-200/40 px-2 py-0.5 rounded-sm">
                                            {roleLabels[u.role] ?? u.role}
                                        </span>
                                        <span className={`text-[9px] font-semibold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${u.active
                                            ? "text-emerald-600 bg-emerald-50/50 border-emerald-200/40"
                                            : "text-neutral-400 bg-neutral-50 border-neutral-200/60"
                                            }`}>
                                            {u.active ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                </div>

                                {u.id !== user?.id && (
                                    <div className="border-l gap-2 border-neutral-100 pl-4 h-12 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(u.id)}
                                            className="size-9 rounded-sm border border-neutral-200/60 text-neutral-400 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                                            title="Eliminar"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                delete
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(u.id)}
                                            disabled={togglingId === u.id}
                                            className={`h-9 px-4 rounded-sm text-[9px] font-semibold uppercase tracking-[0.2em] border transition-colors disabled:opacity-50 ${u.active
                                                ? "bg-surface text-neutral-400 border-neutral-200/60 hover:text-red-500 hover:border-red-500"
                                                : "btn-primary-theme text-white border-neutral-950 hover:bg-neutral-700"
                                                }`}
                                        >
                                            {togglingId === u.id
                                                ? "..."
                                                : u.active ? "Desactivar" : "Activar"}
                                        </button>
                                    </div>
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