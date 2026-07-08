import api from "./axios";

import {
    LoginRequest,
    LoginResponse,
    AuthUser

} from "../types/auth";

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export async function login(
    data: LoginRequest
) {
    const response =
        await api.post<LoginResponse>(
            "/auth/login",
            data
        );

    return response.data;
}

export async function getMe(): Promise<AuthUser> {

    const response =
        await api.get<{ user: AuthUser }>("/auth/me");

    return response.data.user;

}

export async function updateProfile(
    data: UpdateProfileRequest
): Promise<AuthUser> {

    const response =
        await api.put<AuthUser>("/auth/me", data);

    return response.data;

}

export async function changePassword(
    data: ChangePasswordRequest
): Promise<void> {

    await api.patch("/auth/me/password", data);

}