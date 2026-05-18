import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyResetOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { verifyResetOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyResetOTP(email, otp);
            toast.success('OTP verified successfully!');
            navigate('/reset-password', { state: { email, otp } });
        } catch (err) {
            toast.error(err || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
                <p className="text-sm text-gray-600 text-center mb-6">Enter the 6-digit OTP sent to <span className="font-semibold text-gray-800">{email}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">OTP</label>
                        <input 
                            type="text" 
                            required
                            maxLength="6"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest text-center text-xl" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyResetOTP;
