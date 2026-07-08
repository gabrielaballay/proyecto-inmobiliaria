import {
    createContext,
    ReactNode,
    useEffect,
    useState
} from "react";

import { login as loginApi } from "../api/auth.api";
import { AuthUser } from "../types/auth";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: AuthUser) => void;
}

export const AuthContext = createContext({} as AuthContextType);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {

        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

    }, []);

    async function login(email: string, password: string) {

        const response = await loginApi({
            email,
            password
        });

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        setToken(response.token);
        setUser(response.user);
    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    }

    function updateUser(updatedUser: AuthUser) {

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                updateUser,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}