import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import api from "../utils/axios.js";
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {

    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // Debounce API call by 400ms
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            {/* 🔥 HERO SECTION */}
            <section className="relative bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-white py-24 px-6 text-center overflow-hidden">

                {/* Background blur */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-pink-400 opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

                <div className="relative z-10">

                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                        <span className="block text-white">
                            Welcome to
                        </span>

                        <span className="block bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                            EventOra ✨
                        </span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed tracking-wide">
                        Discover amazing events, book tickets instantly, and create unforgettable memories.
                    </p>

                    {/* 🔍 SEARCH */}
                    <div className="mt-10 max-w-xl mx-auto flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg px-4 py-3 hover:scale-105 transition duration-300">
                        <FaSearch className="text-white mr-3" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-white placeholder-gray-200"
                        />
                    </div>

                </div>
            </section>


            {/* 🎟 EVENTS SECTION */}
            <section className="py-16 px-6">

                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight">
                    Explore Events 🎉
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500 animate-pulse">
                        Loading events...
                    </p>
                ) : events.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No events found 😔
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 overflow-hidden group"
                            >

                                {/* IMAGE */}
                                <div className="overflow-hidden">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="h-44 w-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="p-5">

                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                                        {event.title}
                                    </h3>

                                    <p className="flex items-center text-gray-500 text-sm mb-1">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                                        {event.location}
                                    </p>

                                    <p className="flex items-center text-gray-500 text-sm mb-1">
                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>

                                    <p className="flex items-center text-gray-500 text-sm mb-3">
                                        <FaRegClock className="mr-2 text-purple-500" />
                                        {event.category}
                                    </p>

                                    <p className="text-green-600 font-bold text-lg mb-4">
                                        ₹{event.ticketPrice}
                                    </p>

                                    <Link
                                        to={`/event/${event._id}`}
                                        className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
                                    >
                                        View Details
                                    </Link>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </section>


            {/* ⭐ WHY CHOOSE US */}
            <section className="bg-gray-100 py-16 px-6">

                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Why Choose EventOra? 🚀
                </h2>

                <div className="grid md:grid-cols-3 gap-10 text-center">

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
                        <FaTicketAlt className="text-blue-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Book tickets effortlessly with just a few clicks.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
                        <FaShieldAlt className="text-green-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Your data and payments are fully protected.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
                        <FaRegClock className="text-purple-500 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Stay updated with the latest events instantly.
                        </p>
                    </div>

                </div>
            </section>

            {/* 🔻 FOOTER */}
            <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-6 px-6 mt-auto">

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* 🏷 LOGO + NAME */}
                    <div className="flex items-center gap-2 text-lg font-semibold tracking-wide">
                        <FaTicketAlt className="text-yellow-400 text-xl" />
                        <span className="text-white">EventOra</span>
                    </div>

                    {/* 📄 COPYRIGHT */}
                    <p className="text-sm text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} EventOra Platform. All rights reserved.
                    </p>

                    {/* 🔗 OPTIONAL LINKS */}
                    <div className="flex gap-4 text-sm">
                        <span className="hover:text-white cursor-pointer transition">Privacy</span>
                        <span className="hover:text-white cursor-pointer transition">Terms</span>
                        <span className="hover:text-white cursor-pointer transition">Contact</span>
                    </div>

                </div>

            </footer>

        </div>
    );
};

export default Home;
