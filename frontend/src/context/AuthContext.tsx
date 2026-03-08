import { createContext, useContext, useState } from "react";
import { useLogin } from "../hooks/api/useLogin";
import { useRegister } from "../hooks/api/useRegister";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: any) {

    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const [user, setUser] = useState(null);

    const login = async (email: string, password: string) => {
        try {

            const res = await loginMutation.mutateAsync({ email, password });

            const token = res?.data?.token;
            const user = res?.data?.user;

            if (!token) throw new Error("Login failed: no token received");

            localStorage.setItem("token", token);

            setUser(user);

            return res;

        } catch (error: any) {

            const message =
                error?.response?.data?.message || "Login failed";

            throw new Error(message);
        }
    };

    const register = async (email: string, password: string) => {
        try {

            const res = await registerMutation.mutateAsync({
                email,
                password,
            });

            return res;

        } catch (error: any) {

            const message =
                error?.response?.data?.message || "Registration failed";

            throw new Error(message);
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}