import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 px-4">

            {/* 🔲 CARD */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">

                {/* ❌ ICON */}
                <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4 animate-pulse" />

                {/* 🏷 TITLE */}
                <h2 className="text-3xl font-bold text-white mb-2">
                    Payment Failed
                </h2>

                {/* 💬 MESSAGE */}
                <p className="text-gray-200 mb-6">
                    Oops! Something went wrong while processing your payment.
                    Please try again or contact support if the issue persists.
                </p>

                {/* 🔘 BUTTONS */}
                <div className="flex flex-col gap-3">

                    {/* 🔁 RETRY */}
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Try Again
                    </Link>

                    {/* 🏠 HOME */}
                    <Link
                        to="/"
                        className="text-white border border-white/40 py-2 rounded-lg hover:bg-white/20 transition"
                    >
                        Go to Home
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default PaymentFailed;