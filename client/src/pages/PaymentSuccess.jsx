import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 px-4">

            {/* 🔲 CARD */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">

                {/* ✅ ICON */}
                <FaCheckCircle className="text-green-300 text-6xl mx-auto mb-4 animate-bounce" />

                {/* 🏷 TITLE */}
                <h2 className="text-3xl font-bold text-white mb-2">
                    Payment Successful 🎉
                </h2>

                {/* 💬 MESSAGE */}
                <p className="text-gray-200 mb-6 leading-relaxed">
                    Your booking has been confirmed successfully.
                    Get ready to enjoy your event!
                </p>

                {/* 🔘 BUTTONS */}
                <div className="flex flex-col gap-3">

                    {/* 🎟 VIEW TICKETS */}
                    <Link
                        to="/my-bookings"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        View My Tickets 🎟
                    </Link>

                    {/* 🔍 DISCOVER EVENTS */}
                    <Link
                        to="/"
                        className="text-white border border-white/40 py-2 rounded-lg hover:bg-white/20 transition"
                    >
                        Discover More Events 🔍
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default PaymentSuccess;