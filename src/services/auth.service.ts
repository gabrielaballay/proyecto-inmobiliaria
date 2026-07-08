import { AuthUser } from "../types/auth";

import {
    getMe as getMeApi,
    updateProfile as updateProfileApi,
    changePassword as changePasswordApi,
    UpdateProfileRequest,
    ChangePasswordRequest
} from "../api/auth.api";

export async function getMe(): Promise<AuthUser> {
    return await getMeApi();
}

export async function updateProfile(
    data: UpdateProfileRequest
): Promise<AuthUser> {
    return await updateProfileApi(data);
}

export async function changePassword(
    data: ChangePasswordRequest
): Promise<void> {
    await changePasswordApi(data);
}