const User = require('../models/User');
//const { sendOtpEmail } = require('../utils/email');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../utils/email.js');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({ name, email, password: hashedPassword, role: 'user' });


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({ email, otp, action: "account_verification" });
        try {
            await sendOtpEmail(email, otp, "account_verification");
        } catch (err) {
            console.error("Error sending OTP email:", err);
        }


        return res.status(201).json({
            message: 'User registered. Please check your email for OTP to verify your account.',
            email: user.email
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).json({ error: 'Server error' });
    }
};


//login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified && user.role === 'user') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({ email, action: "account_verification" });

            await OTP.create({ email, otp, action: "account_verification" });
            await sendOtpEmail(email, otp, "account_verification");
            return res.status(400).json({ error: 'Account not verified. OTP sent to email.' });
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
        res.status(400).json({ error: 'Server error' });

    }
};

//verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp, action: "account_verification" });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const user = await User.findOneAndUpdate({ email }, { isVerified: true });
        await OTP.deleteMany({ email, action: "account_verification" });
        res.json(
            {
                message: 'OTP verified successfully, You can now login to your account.',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            }
        );
    } catch (error) {
        res.status(400).json({ error: 'Server error' });
    }
};