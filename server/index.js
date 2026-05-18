const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const eventRoutes = require('./routes/events.js');
const bookingRoutes = require('./routes/bookings.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handler Middleware
app.use(errorHandler);

// ✅ Better DB connection with async/await
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(" MongoDB Connected");
        console.log("Connected DB:", mongoose.connection.name);
    } catch (error) {
        console.error(" MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

// Call DB connection
connectDB();

// Sample route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});