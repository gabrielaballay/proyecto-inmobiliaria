import { Property } from "../types";

import {
    getProperties as getPropertiesApi,
    getProperty as getPropertyApi,
    createProperty,
    updateProperty,
    deleteProperty as deletePropertyApi,
} from "../api/property.api";


export async function getProperties(): Promise<Property[]> {
    return await getPropertiesApi();
}

export async function getProperty(id: string): Promise<Property> {
    return await getPropertyApi(id);
}

export async function saveProperty(property: Property): Promise<Property> {
    if (property.id) {

        return await updateProperty(
            property.id,
            property
        );

    }

    return await createProperty(property);

}

export async function deleteProperty(id: string): Promise<void> {
    await deletePropertyApi(id);
}