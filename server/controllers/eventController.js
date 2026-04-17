const Event = require('../models/Event.js');

exports.getEvents = async (req, res) => {
    try {

        const filters = {};
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createEvent = async (req, res) => {
    const {
        title,
        description,
        date,
        location,
        category,
        totalSeats,
        availableSeats,
        ticketPrice,
        imageUrl
    } = req.body;
    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl,
            createdBy: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: 'Invalid event data' });
        console.log(error);
    }
};

exports.updateEvent = async (req, res) => {
    const { title, description, date, location, category, ticketPrice, totalSeats, imageUrl } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl
        }, { new: true });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
