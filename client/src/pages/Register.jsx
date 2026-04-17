import React from 'react'
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!showOtp) {
                await register(name, email, password);
                setShowOtp(true);
                setError('');
            }
            else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-4">

            <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">

                {/* 🏷 TITLE */}
                <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
                    {showOtp ? "Verify OTP 🔐" : "Create Account 🚀"}
                </h2>

                {/* ❌ ERROR */}
                {error && (
                    <p className="text-red-300 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                {/* ✅ OTP SENT MESSAGE */}
                {showOtp && (
                    <p className="text-green-200 text-sm text-center mb-4">
                        ✅ An OTP has been sent to your email account
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* 👤 NAME */}
                    {!showOtp && (
                        <div>
                            <label className="block text-sm text-white mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    {/* 📧 EMAIL */}
                    {!showOtp && (
                        <div>
                            <label className="block text-sm text-white mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    {/* 🔐 PASSWORD */}
                    {!showOtp && (
                        <div>
                            <label className="block text-sm text-white mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                    )}

                    {/* 🔢 OTP INPUT */}
                    {showOtp && (
                        <div>
                            <label className="block text-sm text-white mb-1">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-white/80 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    )}

                    {/* 🔘 BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
                    >
                        {loading
                            ? "Processing..."
                            : showOtp
                                ? "Verify OTP"
                                : "Register"}
                    </button>

                </form>

                {/* 🔗 LOGIN LINK */}
                {!showOtp && (
                    <p className="text-sm text-center text-gray-200 mt-6">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-yellow-300 cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>
                )}

            </div>
        </div>
    );
}

export default Register
