/**
 * Resuelve la URL final de una imagen de propiedad.
 *
 * El backend devuelve rutas relativas (ej: "/uploads/properties/xxx.jpg"),
 * por lo que hay que anteponerle el host del backend para que el
 * navegador la busque en el servidor correcto (no en el origen del front).
 *
 * Las URLs ya absolutas (http/https), blobs de preview (blob:) y
 * data URLs (data:, usadas por el cropper) se devuelven sin modificar.
 */
export function getImageUrl(url?: string | null): string {
    if (!url) {
        return "/images/no-image.jpg";
    }

    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("blob:") ||
        url.startsWith("data:")
    ) {
        return url;
    }

    const baseUrl = import.meta.env.VITE_API_URL ?? "";

    return `${baseUrl}${url}`;
}