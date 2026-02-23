// context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ FIXED LOGIN (Form Data for OAuth2)
    const login = async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);   // IMPORTANT: must be "username"
            formData.append("password", password);

            const response = await api.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const token = response.data.access_token;

            localStorage.setItem("msl_token", token);

            // Load current user
            const me = await api.get("/auth/me");
            setUser(me.data);

            return true;
        } catch (err) {
            const message =
                err.response?.data?.detail || "Login failed";
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem("msl_token");
        setUser(null);
    };

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("msl_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

/* ---------- Role Helper ---------- */
export function hasRole(user, ...roles) {
    if (!user?.role?.name) return false;
    return roles.includes(user.role.name);
}