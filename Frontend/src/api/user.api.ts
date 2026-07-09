import api from "./axios";
import { User } from "../types/user";

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export async function getUsers(): Promise<User[]> {

    const response = await api.get<User[]>("/users");

    return response.data;

}

export async function createUser(
    data: CreateUserRequest
): Promise<User> {

    const response = await api.post<User>("/users", data);

    return response.data;

}

export async function updateUser(
    id: string,
    data: UpdateUserRequest
): Promise<User> {

    const response = await api.put<User>(`/users/${id}`, data);

    return response.data;

}

export async function changeUserStatus(
    id: string
): Promise<User> {

    const response = await api.patch<User>(`/users/${id}/status`);

    return response.data;

}

export async function deleteUser(
    id: string
): Promise<User> {

    const response = await api.delete<User>(`/users/${id}`);

    return response.data;

}