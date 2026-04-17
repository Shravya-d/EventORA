import React, { useState, useEffect, useContext, use } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings', error);
        } finally {
            setLoading(false);
        }
    }

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to cancel booking');
            }
        }
    };
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            {/* 🏷 TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight">
                My Bookings 🎟
            </h1>

            <div className="max-w-5xl mx-auto">

                {bookings.length === 0 ? (
                    /* ❌ EMPTY STATE */
                    <div className="text-center bg-white p-10 rounded-2xl shadow">
                        <FaTicketAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                            You have no bookings yet.
                        </p>

                        <Link
                            to="/"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                        >
                            Discover Events 🔍
                        </Link>
                    </div>

                ) : (
                    /* 🎟 BOOKINGS LIST */
                    <div className="grid gap-6">

                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >

                                {/* 📄 DETAILS */}
                                <div>

                                    <h2 className="text-xl font-semibold mb-1">
                                        {booking.eventId?.title}
                                    </h2>

                                    <p className="text-gray-500 text-sm">
                                        📍 {booking.eventId?.location}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        📅 {new Date(booking.eventId?.date).toLocaleDateString()}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        💰 ₹{booking.amount}
                                    </p>

                                    {/* STATUS */}
                                    <p
                                        className={`mt-2 text-sm font-semibold ${booking.status === "confirmed"
                                            ? "text-green-600"
                                            : booking.status === "pending"
                                                ? "text-yellow-500"
                                                : "text-red-500"
                                            }`}
                                    >
                                        Status: {booking.status}
                                    </p>

                                </div>

                                {/* ACTIONS */}
                                <div className="flex flex-col gap-2">

                                    {/* CANCEL BUTTON */}
                                    {booking.status !== "cancelled" && (
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            <FaTimesCircle />
                                            Cancel
                                        </button>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
};
export default UserDashboard;