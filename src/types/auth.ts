export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "SELLER";
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}