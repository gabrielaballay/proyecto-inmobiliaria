import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TopAppBar from "../components/TopAppBar";
import ImageCropper from "../components/ImageCropper";
import {getProperty, saveProperty} from "../services/property.service";
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
    const [editingImageIndex, setEditingImageIndex] =
        useState<number | null>(null);

    const [newImages, setNewImages] =
        useState<{ id: string; file: File }[]>([]);

    const [removedImageIds, setRemovedImageIds] =
        useState<string[]>([]);

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

        if (isEditing && id) {
            loadProperty(id);
        }

    }, [id, user]);

    async function loadProperty(propertyId: string) {
        try {
            setLoading(true);

            const property =
                await getProperty(propertyId);

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

    function handleChange<K extends keyof Property>(
        field: K, value: Property[K]) 
    {
        setFormData(current => ({
            ...current,
            [field]: value
        }));
    }

    function handleImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        if (!event.target.files)
            return;

        const files = Array.from(event.target.files);

        const previews: PropertyImage[] =
            files.map((file, index) => ({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file),
                displayOrder:
                    formData.images.length + index,
                isPrimary:
                    formData.images.length === 0 &&
                    index === 0
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
            images: [
                ...current.images,
                ...previews
            ]
        }));
    }

    function removeImage(index: number) {
        const image = formData.images[index];

        const isPendingUpload =
            newImages.some(n => n.id === image.id);

        if (isPendingUpload) {
            setNewImages(current =>
                current.filter(n => n.id !== image.id)
            );
        } else {
            setRemovedImageIds(current => [
                ...current,
                image.id
            ]);
        }

        setFormData(current => ({
            ...current,
            images:
                current.images.filter((_, i) => i !== index)
        }));
    }

    function handleCropComplete(
        croppedImage: string
    ) {
        if (editingImageIndex === null)
            return;

        setFormData(current => {
            const images = [...current.images];
            images[editingImageIndex] = {
                ...images[editingImageIndex],
                url: croppedImage
            };

            return {
                ...current,
                images
            };
        });

        setEditingImageIndex(null);
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();
        try {
            setLoading(true);
            const property =
                await saveProperty(formData);

            if (removedImageIds.length > 0) {
                await Promise.all(
                    removedImageIds.map(imageId =>
                        deleteImage(imageId)
                    )
                );
            }

            if (newImages.length > 0) {
                await uploadImages(
                    property.id,
                    newImages.map(n => n.file)
                );
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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title={isEditing ? "Editar Propiedad" : "Nueva Propiedad"} showBack />

      <form onSubmit={handleSubmit} className="p-4 pb-24 max-w-2xl mx-auto w-full space-y-6 animate-fade-in">
        <section className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Información Básica</h3>
          <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Título del Anuncio</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ej: Casa Moderna con Piscina"
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Operación</label>
                <select 
                  value={formData.operation}
                  onChange={e => setFormData({...formData, operation: e.target.value as any})}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                >
                  <option value="VENTA">Venta</option>
                  <option value="ALQUILER">Alquiler</option>
                  <option value="TEMPORAL">Temporal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Tipo</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as PropertyType})}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                >
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Local">Local</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Precio</label>
              <input 
                type="text" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                placeholder="Ej: USD 120.000 o $450.000"
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Direccion</label>
              <input 
                type="text" 
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Ej: Av. Fundador 1973"
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Ciudad</label>
              <input 
                type="text" 
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="Ej: San Luis, Potrero, etc."
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Provincia</label>
              <input 
                type="text" 
                required
                value={formData.province}
                onChange={e => setFormData({...formData, province: e.target.value})}
                placeholder="Ej: San Luis, Mendoza, Etc."
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Codigo Postal</label>
              <input 
                type="text" 
                required
                value={formData.zipCode}
                onChange={e => setFormData({...formData, zipCode: e.target.value})}
                placeholder="Ej: 5700, 9001, etc."
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Fotos de la Propiedad</h3>
          <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3">
              {(formData.images ?? []).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
                  <img src={getImageUrl(img.url)} className="size-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setEditingImageIndex(idx)}
                      className="size-8 bg-white text-navy rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-sm">crop</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="size-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                <span className="text-[8px] font-black uppercase mt-1">Subir</span>
              </label>
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase text-center">Toca una foto para editarla o eliminarla</p>
          </div>
        </section>

        {editingImageIndex !== null && formData.images && (
          <ImageCropper 
            image={formData.images[editingImageIndex]} 
            onCropComplete={handleCropComplete}
            onCancel={() => setEditingImageIndex(null)}
          />
        )}

        <section className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Detalles Técnicos</h3>
          <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Dormitorios</label>
                <input 
                  type="number" 
                  value={formData.bedrooms}
                  onChange={e => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Baños</label>
                <input 
                  type="number" 
                  value={formData.bathrooms}
                  onChange={e => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Superficie</label>
                <input 
                  type="text" 
                  value={formData.coveredSurface}
                  onChange={e => setFormData({...formData, coveredSurface: parseInt(e.target.value) || 0})}
                  placeholder="Ej: 200 m²"
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Descripción</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe las características principales, entorno, comodidades, etc..."
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-medium dark:text-white resize-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-2">Amenidades / Características</h3>
          <div className="bg-white dark:bg-navy rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
            <div className="flex gap-2">
              <input 
                type="text" 
                id="feature-input"
                placeholder="Ej: Piscina, Parrilla, Cochera..."
                className="flex-1 h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !formData.features?.includes(val)) {
                      setFormData({...formData, features: [...(formData.features || []), val]});
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
                    setFormData({...formData, features: [...(formData.features || []), val]});
                    input.value = '';
                  }
                }}
                className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature, idx) => (
                <span key={idx} className="bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                  {feature}
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, features: formData.features?.filter((_, i) => i !== idx)})}
                    className="text-primary hover:text-red-700"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </span>
              ))}
              {(!formData.features || formData.features.length === 0) && (
                <p className="text-[10px] text-gray-400 italic font-medium">No has añadido amenidades aún.</p>
              )}
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-widest text-gray-500"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] bg-primary text-white h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            Publicar Ahora
          </button>
        </div>
      </form>
    </div>
  );

}
export default PropertyForm;