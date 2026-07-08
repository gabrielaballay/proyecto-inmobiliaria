import { User } from "../types/user";

import {
    getUsers as getUsersApi,
    createUser as createUserApi,
    updateUser as updateUserApi,
    changeUserStatus as changeUserStatusApi,
    CreateUserRequest,
    UpdateUserRequest
} from "../api/user.api";

export async function getUsers(): Promise<User[]> {
    return await getUsersApi();
}

export async function createUser(
    data: CreateUserRequest
): Promise<User> {
    return await createUserApi(data);
}

export async function updateUser(
    id: string,
    data: UpdateUserRequest
): Promise<User> {
    return await updateUserApi(id, data);
}

export async function changeUserStatus(id: string): Promise<User> {
    return await changeUserStatusApi(id);
}