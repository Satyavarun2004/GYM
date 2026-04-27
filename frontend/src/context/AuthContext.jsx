import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext: Initializing...');
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                console.log('AuthContext: Found stored user');
                setUser(JSON.parse(storedUser));
            } else {
                console.log('AuthContext: No stored user found');
            }
        } catch (error) {
            console.error('AuthContext: Failed to parse user from localStorage', error);
            localStorage.removeItem('user');
        } finally {
            console.log('AuthContext: Loading finished');
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/users/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/users', userData);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
