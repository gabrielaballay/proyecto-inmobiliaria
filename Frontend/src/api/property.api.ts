import api from "./axios";
import { Property } from "../types/property";

export type CreatePropertyRequest = Omit<
    Property,
    "id" | "images" | "createdAt" | "updatedAt"
>;

export async function getProperties(): Promise<Property[]> {

    const response = await api.get<Property[]>("/properties");

    return response.data;

}

export async function getProperty(id: string): Promise<Property> {

    const response = await api.get<Property>(`/properties/${id}`);

    return response.data;

}

export async function createProperty(
    data: CreatePropertyRequest
): Promise<Property> {

    const response = await api.post<Property>(
        "/properties",
        data
    );

    return response.data;

}

export async function updateProperty(
    id: string,
    data: Partial<CreatePropertyRequest>
): Promise<Property> {

    const response = await api.put<Property>(
        `/properties/${id}`,
        data
    );

    return response.data;

}

export async function deleteProperty(
    id: string
): Promise<void> {

    await api.delete(`/properties/${id}`);

}

export async function uploadImages(
    propertyId: string,
    files: File[]
): Promise<void> {

    const formData = new FormData();

    files.forEach(file =>
        formData.append("images", file)
    );

    await api.post(
        `/properties/${propertyId}/images`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

}

export async function deleteImage(
    imageId: string
): Promise<void> {
    await api.delete(`/properties/images/${imageId}`);
}