import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../utils/axios.js";
import { AuthContext } from '../context/AuthContext.jsx';


const EventDetail = () => {

    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [successMsg, setSuccesMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccesMsg('');

        try {
            if (!showOtp) {
                await api.post('/bookings/send-otp');
                setShowOtp(true);
                setSuccesMsg('OTP sent to your email. Please enter it below to confirm your booking.');

            }
            else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccesMsg('Booking requested!Awaiting admin confirmation');
                setShowOtp(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        }
        finally {
            setBookingLoading(false);
        }
    };

    if (loading)
        return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
    if (error && !event) {
        return <div className="text-center py-20 text-red-500 text-xl font-semibold">{error}</div>;
    }
    const isSoldOut = event.availableSeats <= 0;




    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* 🖼 IMAGE */}
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-72 object-cover"
                />

                {/* 📦 CONTENT */}
                <div className="p-6">

                    {/* 🏷 TITLE */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                        {event.title}
                    </h1>

                    {/* 📍 LOCATION + DATE */}
                    <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
                        <span>📍 {event.location}</span>
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    </div>

                    {/* 📄 DESCRIPTION */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                        {event.description}
                    </p>

                    {/* 💰 PRICE + SEATS */}
                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <p className="text-lg font-semibold text-green-600">
                                ₹{event.ticketPrice}
                            </p>
                            <p className="text-sm text-gray-500">
                                {event.availableSeats} seats available
                            </p>
                        </div>

                        {/* 🔴 SOLD OUT */}
                        {isSoldOut && (
                            <span className="text-red-500 font-semibold">
                                Sold Out
                            </span>
                        )}
                    </div>

                    {/* ❌ ERROR */}
                    {error && (
                        <p className="text-red-500 mb-3 text-sm">
                            {error}
                        </p>
                    )}

                    {/* ✅ SUCCESS */}
                    {successMsg && (
                        <p className="text-green-600 mb-3 text-sm">
                            {successMsg}
                        </p>
                    )}

                    {/* 🔢 OTP INPUT */}
                    {showOtp && (
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center tracking-widest"
                        />
                    )}

                    {/* 🎟 BOOK BUTTON */}
                    <button
                        onClick={handleBooking}
                        disabled={bookingLoading || isSoldOut}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition ${isSoldOut
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                            }`}
                    >
                        {bookingLoading
                            ? "Processing..."
                            : showOtp
                                ? "Confirm Booking"
                                : "Book Now"}
                    </button>

                </div>
            </div>

        </div>
    );
}

export default EventDetail
