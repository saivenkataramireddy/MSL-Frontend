import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, restore user session from localStorage
    useEffect(() => {
        const token = localStorage.getItem('msl_token');
        const stored = localStorage.getItem('msl_user');
        if (token && stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);

        const { data } = await api.post('/auth/login', form, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        localStorage.setItem('msl_token', data.access_token);

        // Fetch profile
        const profile = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });

        localStorage.setItem('msl_user', JSON.stringify(profile.data));
        setUser(profile.data);
        return profile.data;
    };

    const logout = () => {
        localStorage.removeItem('msl_token');
        localStorage.removeItem('msl_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

// Role-based helper
export function hasRole(user, ...roles) {
    return roles.includes(user?.role?.name);
}
