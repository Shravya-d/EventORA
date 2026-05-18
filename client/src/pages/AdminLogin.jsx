import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    
    const { adminLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminLogin(formData.email, formData.password);
            toast.success('Admin login successful!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err || 'Admin login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-6 flex flex-col items-center gap-3 text-sm">
                    <Link to="/forgot-password" className="text-indigo-600 hover:underline font-medium">
                        Forgot password?
                    </Link>
                    <span className="text-gray-500">
                        Need an admin account? <Link to="/admin/register" className="text-indigo-600 hover:underline font-medium">Register here</Link>
                    </span>
                    <span className="text-gray-500">
                        Not an admin? <Link to="/login" className="text-indigo-600 hover:underline font-medium">User Login</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
