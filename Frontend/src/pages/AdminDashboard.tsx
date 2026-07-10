import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TopAppBar from "../components/TopAppBar";
import {
    getProperties,
    deleteProperty
} from "../services/property.service";
import { Property } from "../types/property";
import { useAuth } from "../hooks/useAuth";
import { getImageUrl } from "../utils/image";
import { showConfirmDialog } from "../components/ConfirmDialog";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(price);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        if (user.role !== "ADMIN") {
            navigate("/", { replace: true });
            return;
        }

        loadProperties();
    }, [user]);

    async function loadProperties() {
        try {
            const data = await getProperties();
            setProperties(data);
        } catch (error) {
            console.error(error);
            toast.error("Error de sistema", {
                description: "No fue posible recuperar el catálogo de propiedades."
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        showConfirmDialog({
            title: "¿Confirmas la eliminación de esta propiedad?",
            description:
                "Esta acción quitará el anuncio de forma permanente.",
            loadingText: "Eliminando propiedad...",
            successText: "Propiedad eliminada correctamente.",
            errorText: "No fue posible eliminar la propiedad.",
            onConfirm: async () => {

                await deleteProperty(id);

                setProperties(current =>
                    current.filter(p => p.id !== id)
                );
            }
        });
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa] text-neutral-900 tracking-[0.3em] font-sans antialiased uppercase text-xs">
                <span className="material-symbols-outlined text-3xl text-neutral-400 animate-spin mb-2">
                    autorenew
                </span>
                Cargando...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] text-neutral-900 tracking-wider font-sans antialiased">
            <TopAppBar showBack />

            <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto w-full flex-1">
                <div className="mb-10">
                    <h1 className="text-neutral-900 dark:text-white text-xl font-light tracking-widest uppercase">
                        GESTION <span className="font-semibold">/ PROPIEDADES</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-neutral-950 dark:bg-white mt-4" />
                </div>

                <div className="flex justify-between items-center border-b border-neutral-200/50 pb-6 mb-6">
                    <h2 className="text-neutral-900 font-medium text-xs uppercase tracking-[0.3em]">
                        Tus Publicaciones
                        <span className="text-neutral-400 font-light ml-1">({properties.length})</span>
                    </h2>
                    <button
                        onClick={() => navigate("/admin/new")}
                        className="h-11 bg-neutral-950 text-white px-5 rounded-sm text-[10px] font-semibold uppercase tracking-[0.3em] hover:bg-neutral-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-base">
                            add
                        </span>
                        Nuevo Anuncio
                    </button>
                </div>

                <div className="grid gap-4">
                    {properties.length === 0 ? (
                        <div className="py-24 text-center border border-dashed border-neutral-200 rounded-sm">
                            <span className="material-symbols-outlined text-5xl text-neutral-200 mb-4">
                                inventory_2
                            </span>
                            <p className="text-neutral-400 text-xs uppercase tracking-widest font-light">
                                No hay propiedades publicadas.
                            </p>
                        </div>
                    ) : (
                        properties.map(property => (
                            <div
                                key={property.id}
                                className="bg-white border border-neutral-200/60 rounded-sm flex items-center gap-5 p-4 hover:border-neutral-900 transition-all duration-300"
                            >
                                <div className="size-20 bg-neutral-900 rounded-sm overflow-hidden shrink-0 relative">
                                    <img
                                        src={
                                            getImageUrl(
                                                property.images.find(i => i.isPrimary)?.url ??
                                                property.images[0]?.url
                                            )
                                        }
                                        alt={property.title}
                                        className="size-full object-cover brightness-[0.95]"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h4 className="text-neutral-900 font-medium text-sm uppercase tracking-wide truncate">
                                            {property.title}
                                        </h4>
                                        <span className="text-neutral-900 font-semibold text-sm whitespace-nowrap">
                                            {formatPrice(property.price)}
                                        </span>
                                    </div>

                                    <p className="text-neutral-400 text-[10px] font-light uppercase tracking-wider mt-1 flex items-center gap-0.5 truncate">
                                        <span className="material-symbols-outlined text-xs">location_on</span>
                                        {property.address}, {property.city}
                                    </p>

                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 bg-neutral-50 border border-neutral-200/40 px-2 py-0.5 rounded-sm">
                                            {property.operation}
                                        </span>
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 bg-neutral-50 border border-neutral-200/40 px-2 py-0.5 rounded-sm">
                                            {property.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 border-l border-neutral-100 pl-4 h-12 items-center">
                                    <button
                                        onClick={() => navigate(`/admin/edit/${property.id}`)}
                                        className="size-9 rounded-sm border border-neutral-200/60 text-neutral-400 flex items-center justify-center hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                                        title="Editar"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            edit
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="size-9 rounded-sm border border-neutral-200/60 text-neutral-400 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                                        title="Eliminar"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;