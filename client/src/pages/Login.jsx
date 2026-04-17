import React from 'react'
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
            else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        }
        catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            }
            else {
                setError(err.response?.data?.error || err.message);
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-4">

            {/* 🔲 CARD */}
            <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">

                {/* 🏷 TITLE */}
                <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
                    {showOTP ? "Verify OTP 🔐" : "Welcome Back 👋"}
                </h2>

                {/* ❌ ERROR */}
                {error && (
                    <p className="text-red-300 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                {/* ✅ OTP MESSAGE */}
                {showOTP && (
                    <p className="text-green-200 text-sm text-center mb-4">
                        ✅ A new OTP has been sent to your email
                    </p>
                )}

                {/* 📄 FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* 📧 EMAIL */}
                    {!showOTP && (
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
                    {!showOTP && (
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

                    {/* 🔢 OTP FIELD */}
                    {showOTP && (
                        <div>
                            <label className="block text-sm text-white mb-1">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
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
                            : showOTP
                                ? "Verify OTP"
                                : "Login"}
                    </button>

                </form>

                {/* 🔗 REGISTER LINK */}
                {!showOTP && (
                    <p className="text-sm text-center text-gray-200 mt-6">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-yellow-300 cursor-pointer hover:underline"
                        >
                            Sign Up
                        </span>
                    </p>
                )}

            </div>
        </div>
    );
}

export default Login
