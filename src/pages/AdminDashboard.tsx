import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import {
    getProperties,
    deleteProperty
} from "../services/property.service";
import { Property } from "../types/property";
import { useAuth } from "../hooks/useAuth";
import { getImageUrl } from "../utils/image";

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
            navigate("/login", {
                replace: true
            });

            return;
        }

        if (user.role !== "ADMIN") {
            navigate("/", {
                replace: true
            });

            return;
        }

        loadProperties();
    }, [user]);

    async function loadProperties() {
        try {
            const data = await getProperties();
            setProperties(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "¿Está seguro que desea eliminar esta propiedad?"
        );

        if (!confirmed)
            return;

        try {
            await deleteProperty(id);
            setProperties(current =>
                current.filter(p => p.id !== id)
            );
        }
        catch (error) {
            console.error(error);
            alert("No fue posible eliminar la propiedad.");
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
            <TopAppBar
                title="Gestión de Inmuebles"
                showBack
            />
            <div className="p-4 flex flex-col gap-6 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                        Tus Publicaciones
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">
                                group
                            </span>
                            Vendedores
                        </button>
                        <button
                            onClick={() => navigate("/admin/new")}
                            className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">
                                add
                            </span>
                            Nuevo Anuncio
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {
                        properties.length === 0 ? (
                            <div className="text-center py-20 opacity-30">
                                <span className="material-symbols-outlined text-6xl mb-4">
                                    inventory_2
                                </span>
                                <p className="font-bold">
                                    No hay propiedades publicadas
                                </p>
                            </div>

                        ) : (
                            properties.map(property => (
                                <div
                                    key={property.id}
                                    className="bg-white dark:bg-navy p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm"
                                >
                                    <div className="size-20 rounded-2xl overflow-hidden shrink-0">
                                        <img
                                            src={
                                                getImageUrl(
                                                    property.images.find(i => i.isPrimary)?.url ??
                                                    property.images[0]?.url
                                                )
                                            }
                                            alt={property.title}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm dark:text-white truncate">
                                            {property.title}
                                        </h4>
                                        <p className="text-primary font-bold text-xs">
                                            {formatPrice(property.price)}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1 truncate">
                                            {property.address}, {property.city}
                                        </p>

                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                {property.operation}
                                            </span>

                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                {property.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/edit/${property.id}`)}
                                            className="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center justify-center hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center justify-center hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;