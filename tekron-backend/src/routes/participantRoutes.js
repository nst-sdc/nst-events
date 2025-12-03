const express = require('express');
const { getMe, getParticipantStatus, getParticipantQR, getUnapprovedMap, getEvents, getAlerts } = require('../controllers/participantController');
const { participantAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(participantAuth);

router.get('/me', getMe);
router.get('/status', getParticipantStatus);
router.get('/qr', getParticipantQR);
router.get('/unapproved-map', getUnapprovedMap);
router.get('/events', getEvents);
router.get('/alerts', getAlerts);

module.exports = router;
