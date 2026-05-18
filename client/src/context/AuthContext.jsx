import React, { createContext, useState, useEffect } from "react";
import api from '../utils/axios.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const saveUser = (data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            saveUser(data);
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw {
                message: error.response?.data?.error || "Login failed",
                needsVerification: error.response?.data?.error?.includes("Account not verified")
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error.response?.data?.error || "Registration failed";
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            saveUser(data);
            return data;
        } catch (error) {
            console.error('OTP verification error:', error);
            throw error.response?.data?.error || "OTP Verification failed";
        }
    };

    // --- Admin Authentication ---

    const adminRegister = async (name, email, password, adminSecret) => {
        try {
            const { data } = await api.post('/auth/admin-register', { name, email, password, adminSecret });
            saveUser(data);
            return data;
        } catch (error) {
            throw error.response?.data?.error || "Admin registration failed";
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const { data } = await api.post('/auth/admin-login', { email, password });
            saveUser(data);
            return data;
        } catch (error) {
            throw error.response?.data?.error || "Admin login failed";
        }
    };

    // --- Forgot Password Flow ---

    const forgotPassword = async (email) => {
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            return data;
        } catch (error) {
            throw error.response?.data?.error || "Failed to send reset OTP";
        }
    };

    const verifyResetOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-reset-otp', { email, otp });
            return data;
        } catch (error) {
            throw error.response?.data?.error || "Invalid reset OTP";
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
            return data;
        } catch (error) {
            throw error.response?.data?.error || "Failed to reset password";
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout, 
            verifyOTP, 
            register,
            adminRegister,
            adminLogin,
            forgotPassword,
            verifyResetOTP,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};