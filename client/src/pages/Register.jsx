import React from 'react'
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!showOtp) {
                await register(name, email, password);
                setShowOtp(true);
                toast.success('Registration successful! Please check your email for OTP.');
            }
            else {
                await verifyOTP(email, otp);
                toast.success('Account verified successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-4">
            <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">
                <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
                    {showOtp ? "Verify OTP 🔐" : "Create Account 🚀"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOtp && (
                        <>
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
                            <div>
                                <label className="block text-sm text-white mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                        </>
                    )}

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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : showOtp ? "Verify OTP" : "Register"}
                    </button>
                </form>

                {!showOtp && (
                    <div className="text-sm text-center text-gray-200 mt-6 space-y-2">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="text-yellow-300 hover:underline font-medium">
                                Login
                            </Link>
                        </p>
                        <p>
                            Are you an admin?{" "}
                            <Link to="/admin/register" className="text-yellow-300 hover:underline font-medium">
                                Register as Admin
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;
