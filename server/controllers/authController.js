const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../utils/email.js');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==========================================
// USER AUTHENTICATION
// ==========================================

exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide all fields' });
        }

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword, role: 'user' });

        const otp = generateOTP();
        await OTP.deleteMany({ email, action: "account_verification" });
        await OTP.create({ email, otp, action: "account_verification" });
        await sendOtpEmail(email, otp, "account_verification");

        return res.status(201).json({
            message: 'User registered. Please check your email for OTP to verify your account.',
            email: user.email
        });
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            const otp = generateOTP();
            await OTP.deleteMany({ email, action: "account_verification" });
            await OTP.create({ email, otp, action: "account_verification" });
            await sendOtpEmail(email, otp, "account_verification");
            return res.status(400).json({ error: 'Account not verified. A new OTP has been sent to your email.' });
        }

        res.json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const otpRecord = await OTP.findOne({ email, otp, action: "account_verification" });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        await OTP.deleteMany({ email, action: "account_verification" });
        
        res.json({
            message: 'OTP verified successfully, You can now login to your account.',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

exports.adminRegister = async (req, res, next) => {
    try {
        const { name, email, password, adminSecret } = req.body;

        if (!name || !email || !password || !adminSecret) {
            return res.status(400).json({ error: 'Please provide all fields' });
        }

        if (adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ error: 'Invalid admin secret key' });
        }

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role: 'admin', 
            isVerified: true // Admins bypass OTP verification on registration
        });

        res.status(201).json({
            message: 'Admin registered successfully',
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id, admin.role)
        });
    } catch (error) {
        next(error);
    }
};

exports.adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const admin = await User.findOne({ email });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Admin login successful',
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id, admin.role)
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// FORGOT PASSWORD FLOW (USER & ADMIN)
// ==========================================

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Please provide an email' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();
        await OTP.deleteMany({ email, action: "password_reset" });
        await OTP.create({ email, otp, action: "password_reset" });
        await sendOtpEmail(email, otp, "password_reset");

        res.json({ message: 'Password reset OTP sent to email' });
    } catch (error) {
        next(error);
    }
};

exports.verifyResetOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const otpRecord = await OTP.findOne({ email, otp, action: "password_reset" });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // OTP is valid. In a real app, you might generate a temporary token here.
        // For simplicity, we just confirm success and expect the frontend to call resetPassword immediately.
        res.json({ message: 'OTP verified successfully. You may now reset your password.' });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const otpRecord = await OTP.findOne({ email, otp, action: "password_reset" });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        await OTP.deleteMany({ email, action: "password_reset" });

        res.json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        next(error);
    }
};