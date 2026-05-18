const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    verifyOTP,
    adminRegister,
    adminLogin,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} = require('../controllers/authController');

// User Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

// Admin Auth
router.post('/admin-register', adminRegister);
router.post('/admin-login', adminLogin);

// Forgot Password Flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;