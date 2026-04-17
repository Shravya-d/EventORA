const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.js');
const { createEvent, getEvents, getEventById, deleteEvent, updateEvent } = require('../controllers/eventController.js');


/* console.log(protect);
console.log(admin);
 */
//Get all events
router.get('/', getEvents);

//Get event by id
router.get('/:id', getEventById);

//Create Event (admin only)
router.post('/', protect, admin, createEvent);

//update event (admin only) - to be implemented
router.put('/:id', protect, admin, updateEvent);

//delete event (admin only) - to be implemented
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;