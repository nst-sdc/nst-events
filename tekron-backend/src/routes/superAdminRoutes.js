const express = require('express');
const { createAdmin, getAdmins, createEvent, getEvents, sendAlert } = require('../controllers/superAdminController');
const { superAdminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(superAdminAuth);

router.post('/create-admin', createAdmin);
router.get('/admins', getAdmins);
router.post('/create-event', createEvent);
router.get('/events', getEvents);
router.post('/alerts/send', sendAlert);

module.exports = router;
