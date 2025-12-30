const express = require('express');
const { createAdmin, getAdmins, createEvent, getEvents, sendAlert, updateEvent, deleteEvent } = require('../controllers/superAdminController');
const { superAdminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(superAdminAuth);

router.post('/create-admin', createAdmin);
router.get('/admins', getAdmins);
router.post('/create-event', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/events', getEvents);
router.post('/alerts/send', sendAlert);

module.exports = router;
