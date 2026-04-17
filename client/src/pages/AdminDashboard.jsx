import React, { useState, useEffect, useContext, use } from 'react';
import api from '../utils/axios.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        totalSeats: '',
        availableSeats: '',
        ticketPrice: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchEvents();
        fetchBookings();
    }, [user]);

    // 📡 Fetch events
    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };



    // 📡 Fetch bookings
    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ➕ Create Event
    const handleSubmit = async () => {
        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent._id}`, formData);
                alert("Event updated successfully");
            } else {
                await api.post('/events', formData);
                alert("Event created successfully");
            }
            console.log(formData);
            setEditingEvent(null);
            setShowEventForm(false);
            fetchEvents();
        } catch (error) {
            console.log("FORM DATA:", formData);
            alert("Error saving event");
        }

    };

    // ❌ Delete Event
    const deleteEvent = async (id) => {
        if (window.confirm("Delete this event?")) {
            await api.delete(`/events/${id}`);
            fetchEvents();
        }
    };

    // ✅ Approve Booking
    const confirmBooking = async (id) => {
        await api.put(`/bookings/${id}/confirm`, { paymentStatus: "paid" });
        fetchBookings();
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            description: event.description || '',
            date: event.date?.substring(0, 10) || '',
            location: event.location || '',
            category: event.category || '',
            totalSeats: event.totalSeats || '',
            availableSeats: event.availableSeats || '',
            ticketPrice: event.ticketPrice || '',
            imageUrl: event.imageUrl || ''
        });
        setShowEventForm(true);
    };

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-center mb-8">
                Admin Dashboard 👨‍💼
            </h1>

            <div className="max-w-6xl mx-auto">

                {/* CREATE BUTTON */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                        {showEventForm ? "Close" : "Create Event"}
                    </button>
                </div>

                {/* EVENT FORM */}
                {showEventForm && (
                    <div className="bg-white p-6 rounded-xl shadow mb-10 grid gap-3">
                        <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="border p-2 rounded" />
                        <input placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="border p-2 rounded" />
                        <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="border p-2 rounded" />
                        <input placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="border p-2 rounded" />
                        <input placeholder="Ticket Price" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} className="border p-2 rounded" />
                        <input placeholder="Total Seats" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} className="border p-2 rounded" />
                        <input placeholder="Available Seats" value={formData.availableSeats} onChange={e => setFormData({ ...formData, availableSeats: e.target.value })} className="border p-2 rounded" />
                        <input placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="border p-2 rounded" />
                        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="border p-2 rounded" />

                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            {editingEvent ? "Update Event" : "Create Event"}
                        </button>
                    </div>
                )}

                {/* EVENTS */}
                <h2 className="text-2xl font-semibold mb-4">Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {events.map(e => (
                        <div key={e._id} className="bg-white p-4 rounded shadow">
                            <h3 className="font-semibold">{e.title}</h3>
                            <p className="text-sm text-gray-500">{e.location}</p>
                            <button
                                onClick={() => deleteEvent(e._id)}
                                className="mt-2 text-red-500"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handleEdit(e)}
                                className="mt-2 text-blue-500"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>

                {/* BOOKINGS */}
                <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Event</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map(b => (
                                <tr key={b._id} className="border-t">
                                    <td className="p-3">{b.userId?.email}</td>
                                    <td className="p-3">{b.eventId?.title}</td>
                                    <td className="p-3">{b.status}</td>
                                    <td className="p-3">
                                        {b.status !== "confirmed" && (
                                            <button
                                                onClick={() => confirmBooking(b._id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;