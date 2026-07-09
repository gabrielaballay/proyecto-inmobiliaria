import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TopAppBar from "../components/TopAppBar";
import ImageCropper from "../components/ImageCropper";
import { getProperty, saveProperty } from "../services/property.service";
import { uploadImages, deleteImage } from "../api/property.api";

import {
    Property,
    PropertyImage,
    PropertyOperation,
    PropertyType,
    PropertyStatus
} from "../types/property";

import { useAuth } from "../hooks/useAuth";
import { getImageUrl } from "../utils/image";

const PropertyForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

    const [newImages, setNewImages] = useState<{ id: string; file: File }[]>([]);
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const [formData, setFormData] = useState<Property>({
        id: "",
        title: "",
        description: "",
        price: 0,
        operation: "VENTA",
        type: PropertyType.CASA,
        status: "AVAILABLE" as PropertyStatus,
        address: "",
        city: "",
        province: "",
        zipCode: "",
        bedrooms: 0,
        bathrooms: 0,
        garages: 0,
        coveredSurface: 0,
        totalSurface: 0,
        featured: false,
        published: true,
        features: [],
        images: [],
        createdAt: "",
        updatedAt: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        if (user.role !== "ADMIN") {
            navigate("/", { replace: true });
            return;
        }

        if (isEditing && id) {
            loadProperty(id);
        }
    }, [id, user]);

    async function loadProperty(propertyId: string) {
        try {
            setLoading(true);
            const property = await getProperty(propertyId);
            setFormData(property);
            setNewImages([]);
            setRemovedImageIds([]);
        }
        catch (error) {
            console.error(error);
            alert("No fue posible cargar la propiedad.");
        }
        finally {
            setLoading(false);
        }
    }

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;

        const files = Array.from(event.target.files);
        const previews: PropertyImage[] = files.map((file, index) => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            displayOrder: formData.images.length + index,
            isPrimary: formData.images.length === 0 && index === 0
        }));

        setNewImages(current => [
            ...current,
            ...previews.map((preview, index) => ({
                id: preview.id,
                file: files[index]
            }))
        ]);

        setFormData(current => ({
            ...current,
            images: [...current.images, ...previews]
        }));
    }

    function removeImage(index: number) {
        const image = formData.images[index];
        const isPendingUpload = newImages.some(n => n.id === image.id);

        if (isPendingUpload) {
            setNewImages(current => current.filter(n => n.id !== image.id));
        } else {
            setRemovedImageIds(current => [...current, image.id]);
        }

        setFormData(current => ({
            ...current,
            images: current.images.filter((_, i) => i !== index)
        }));
    }

    function handleCropComplete(croppedImage: string) {
        if (editingImageIndex === null) return;

        setFormData(current => {
            const images = [...current.images];
            images[editingImageIndex] = {
                ...images[editingImageIndex],
                url: croppedImage
            };
            return { ...current, images };
        });

        setEditingImageIndex(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            const property = await saveProperty(formData);

            if (removedImageIds.length > 0) {
                await Promise.all(removedImageIds.map(imageId => deleteImage(imageId)));
            }

            if (newImages.length > 0) {
                await uploadImages(property.id, newImages.map(n => n.file));
            }

            navigate("/admin");
        }
        catch (error) {
            console.error(error);
            alert("No fue posible guardar la propiedad.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] text-neutral-900 tracking-wider font-sans antialiased">
            <TopAppBar showBack />

            <form onSubmit={handleSubmit} className="px-6 py-12 max-w-3xl mx-auto w-full space-y-12 animate-fade-in pb-32">
                <div className="mb-10">
                    <h1 className="text-neutral-900 dark:text-white text-xl font-light tracking-widest uppercase">
                        PROPIEDAD <span className="font-semibold">/ {isEditing ? "EDITAR" : "NUEVA"}</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-neutral-950 dark:bg-white mt-4" />
                </div>

                {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                <section className="space-y-6">
                    <div className="border-b border-neutral-200 pb-2">
                        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.3em]">01 / INFORMACIÓN BÁSICA</h3>
                    </div>

                    <div className="space-y-5 bg-white border border-neutral-200/60 p-6 rounded-sm shadow-2xs">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Título del Anuncio</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej: Residencia Minimalista en Potrero"
                                className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Operación</label>
                                <select
                                    value={formData.operation}
                                    onChange={e => setFormData({ ...formData, operation: e.target.value as any })}
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                >
                                    <option value="VENTA">Venta</option>
                                    <option value="ALQUILER">Alquiler</option>
                                    <option value="TEMPORAL">Temporal</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Tipo de Inmueble</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as PropertyType })}
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                >
                                    <option value="CASA">Casa</option>
                                    <option value="DEPARTAMENTO">Departamento</option>
                                    <option value="TERRENO">Terreno</option>
                                    <option value="LOCAL">Local</option>
                                    <option value="OFICINA">Oficna</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Valor de Comercialización</label>
                            <input
                                type="text"
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                placeholder="Ej: 120000"
                                className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 2: UBICACIÓN REORDENADA */}
                <section className="space-y-6">
                    <div className="border-b border-neutral-200 pb-2">
                        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.3em]">02 / UBICACIÓN GEOGRÁFICA</h3>
                    </div>

                    <div className="space-y-5 bg-white border border-neutral-200/60 p-6 rounded-sm shadow-2xs">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Dirección y Altura</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Ej: Av. Illia 450"
                                className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Ciudad</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Ej: Juana Koslay"
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Provincia</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.province}
                                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                                    placeholder="Ej: San Luis"
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Código Postal</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.zipCode}
                                    onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                                    placeholder="Ej: 5700"
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 3: GALERÍA */}
                <section className="space-y-6">
                    <div className="border-b border-neutral-200 pb-2">
                        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.3em]">03 / ARCHIVOS MULTIMEDIA</h3>
                    </div>

                    <div className="bg-white border border-neutral-200/60 p-6 rounded-sm shadow-2xs space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {(formData.images ?? []).map((img, idx) => (
                                <div key={idx} className="relative aspect-square border border-neutral-200 overflow-hidden group rounded-xs">
                                    <img src={getImageUrl(img.url)} className="size-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" alt="Preview" />
                                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingImageIndex(idx)}
                                            className="size-7 bg-white text-neutral-950 flex items-center justify-center shadow-md active:scale-90 transition-transform"
                                        >
                                            <span className="material-symbols-outlined text-xs">crop</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="size-7 bg-neutral-900 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                                        >
                                            <span className="material-symbols-outlined text-xs">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <label className="aspect-square border border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 cursor-pointer hover:bg-neutral-50 hover:border-neutral-950 transition-colors rounded-xs">
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                <span className="material-symbols-outlined text-lg font-light">add_a_photo</span>
                                <span className="text-[8px] tracking-widest uppercase mt-1.5 font-medium">Añadir Foto</span>
                            </label>
                        </div>
                        <p className="text-[8px] text-neutral-400 tracking-wider uppercase text-center">Pase el cursor sobre la imagen para gestionar encuadre o remoción.</p>
                    </div>
                </section>

                {/* MODAL DE ENCUADRE */}
                {editingImageIndex !== null && formData.images && (
                    <ImageCropper
                        image={formData.images[editingImageIndex]}
                        onCropComplete={handleCropComplete}
                        onCancel={() => setEditingImageIndex(null)}
                    />
                )}

                {/* SECCIÓN 4: DETALLES TÉCNICOS INTEGRADOS */}
                <section className="space-y-6">
                    <div className="border-b border-neutral-200 pb-2">
                        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.3em]">04 / ESPECIFICACIONES TÉCNICAS</h3>
                    </div>

                    <div className="space-y-5 bg-white border border-neutral-200/60 p-6 rounded-sm shadow-2xs">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Dormitorios</label>
                                <input
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={e => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Baños</label>
                                <input
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={e => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Cocheras</label>
                                <input
                                    type="number"
                                    value={formData.garages}
                                    onChange={e => setFormData({ ...formData, garages: parseInt(e.target.value) })}
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Sup. Cubierta (m²)</label>
                                <input
                                    type="number"
                                    value={formData.coveredSurface}
                                    onChange={e => setFormData({ ...formData, coveredSurface: parseInt(e.target.value) || 0 })}
                                    placeholder="Ej: 140"
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Sup. Total (m²)</label>
                                <input
                                    type="number"
                                    value={formData.totalSurface}
                                    onChange={e => setFormData({ ...formData, totalSurface: parseInt(e.target.value) || 0 })}
                                    placeholder="Ej: 300"
                                    className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Descripcion de la propiedad</label>
                            <textarea
                                rows={5}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Detalles de diseño arquitectónico, materialidad y entorno..."
                                className="w-full bg-[#fafafa] border border-neutral-200 rounded-sm p-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 5: AJUSTE DE PROPIEDADES */}
                <section className="space-y-6">
                    <div className="border-b border-neutral-200 pb-2">
                        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.3em]">05 / AJUSTE DE PROPIEDAD</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Estado de Inmueble</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                                className="w-full h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                            >
                                <option value="RENTED">Alquilada</option>
                                <option value="SOLD">Vendida</option>
                                <option value="RESERVED">Reservada</option>
                                <option value="AVAILABLE">Disponible</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Propiedad destacada</label>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <label className="text-[9px] font-medium uppercase text-neutral-500 tracking-widest">Destacar propiedad?</label>

                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={e => setFormData({ ...formData, featured: !formData.featured })}
                                    className="text-neutral-400 hover:text-neutral-950 flex items-center"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 6: AMENIDADES */}
                <section className="space-y-6">
                    <div className="border-b border-neutral-200 pb-2">
                        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.3em]">06 / AMENIDADES Y ATRIBUTOS</h3>
                    </div>

                    <div className="space-y-5 bg-white border border-neutral-200/60 p-6 rounded-sm shadow-2xs">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="feature-input"
                                placeholder="Ej: Piscina infinita, Calefacción central, Cochera doble"
                                className="flex-1 h-11 bg-[#fafafa] border border-neutral-200 rounded-sm px-4 text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val && !formData.features?.includes(val)) {
                                            setFormData({ ...formData, features: [...(formData.features || []), val] });
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const input = document.getElementById('feature-input') as HTMLInputElement;
                                    const val = input.value.trim();
                                    if (val && !formData.features?.includes(val)) {
                                        setFormData({ ...formData, features: [...(formData.features || []), val] });
                                        input.value = '';
                                    }
                                }}
                                className="h-11 px-5 bg-neutral-950 text-white text-xs font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-sm"
                            >
                                Añadir
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {formData.features?.map((feature, idx) => (
                                <span key={idx} className="bg-[#fafafa] border border-neutral-200 px-3 py-1.5 rounded-none text-[9px] font-medium uppercase tracking-wider text-neutral-600 flex items-center gap-2">
                                    {feature}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, features: formData.features?.filter((_, i) => i !== idx) })}
                                        className="text-neutral-400 hover:text-neutral-950 flex items-center"
                                    >
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </span>
                            ))}
                            {(!formData.features || formData.features.length === 0) && (
                                <p className="text-[10px] text-neutral-400 italic font-light">Sin características adicionales cargadas.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* BOTONES ACCIÓN INFERIORES */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="h-12 border border-neutral-200 text-neutral-500 text-[10px] font-medium uppercase tracking-widest hover:bg-neutral-100 transition-colors w-full sm:flex-1 rounded-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-12 bg-neutral-950 text-white text-[10px] font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors w-full sm:flex-[2] rounded-sm shadow-sm"
                    >
                        {loading ? "PROCESANDO..." : "PUBLICAR ACTIVO"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;