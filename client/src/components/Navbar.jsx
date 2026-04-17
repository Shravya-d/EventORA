import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">

                    {/* 🏷 LOGO */}
                    <Link
                        to="/"
                        className="text-white text-2xl font-bold flex items-center gap-2 tracking-wide"
                    >
                        <FaTicketAlt className="text-yellow-400" />
                        EventOra
                    </Link>

                    {/* 🔗 NAV LINKS */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">

                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition font-medium"
                        >
                            Events
                        </Link>

                        {/* 👤 USER LOGGED IN */}
                        {user ? (
                            <>
                                {/* 🧑 USER DASHBOARD */}
                                {user.role === 'user' && (
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-300 hover:text-white transition font-medium"
                                    >
                                        My Bookings
                                    </Link>
                                )}

                                {/* 👨‍💼 ADMIN PANEL */}
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="text-yellow-400 hover:text-yellow-300 font-semibold"
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                {/* 👤 USER EMAIL */}
                                <span className="text-gray-400 text-sm hidden sm:block">
                                    {user.email}
                                </span>

                                {/* 🔓 LOGOUT */}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition shadow-md"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* 🔐 LOGIN */}
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition font-medium"
                                >
                                    Login
                                </Link>

                                {/* 📝 REGISTER */}
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;