import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        adminSecret: ''
    });
    const [loading, setLoading] = useState(false);
    
    const { adminRegister } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminRegister(formData.name, formData.email, formData.password, formData.adminSecret);
            toast.success('Admin registered successfully!');
            navigate('/admin/dashboard'); 
        } catch (err) {
            toast.error(err || 'Admin registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Registration</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            required
                            minLength="6"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Admin Secret Key</label>
                        <input 
                            type="password" 
                            name="adminSecret" 
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={formData.adminSecret} 
                            onChange={handleChange} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Registering...' : 'Register as Admin'}
                    </button>
                </form>
                <div className="mt-6 flex flex-col items-center gap-2 text-sm text-gray-600">
                    <p>Already an admin? <Link to="/admin/login" className="text-indigo-600 hover:underline font-medium">Login here</Link></p>
                    <p>Not an admin? <Link to="/register" className="text-indigo-600 hover:underline font-medium">User Registration</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
