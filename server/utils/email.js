//use nodemailer to send email
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingEmail = async (userEmail, otp, eventName) => {
    try {
        const title = "Confirm Your Event Booking";
        const msg = `Please use the following OTP to confirm your booking for "${eventName}".`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">
                        ${msg}
                    </p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background-color: #f4f4f4; border-radius: 8px; width: fit-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">
                        This code expires in 5 minutes.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Booking OTP sent to ${userEmail} for event: ${eventName}`);
    } catch (error) {
        console.error("❌ Error sending booking OTP:", error.message);
    }
};

const sendOtpEmail = async (email, otp, type) => {
    try {
        let title = "Verify your Eventora Account";
        let msg = "Please use the following OTP to verify your new Eventora account.";

        if (type === "event_booking") {
            title = "Confirm your Event Booking";
            msg = "Please use the following OTP to verify and confirm your event booking.";
        } else if (type === "password_reset") {
            title = "Reset Your Password";
            msg = "You requested to reset your password. Use the following OTP to proceed. If you didn't request this, ignore this email.";
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">
                        ${msg}
                    </p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background-color: #f4f4f4; border-radius: 8px; width: fit-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">
                        This code expires in 5 minutes.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email} for ${type}`);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error.message);
    }
};

module.exports = {
    sendOtpEmail, sendBookingEmail
};