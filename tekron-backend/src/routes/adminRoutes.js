const express = require('express');
const { getParticipants, getPendingParticipants, approveParticipant, rejectParticipant, validateQR, sendAlert } = require('../controllers/adminController');
const { updateEventStatus, updateParticipantScore, getLeaderboard } = require('../controllers/event.controller');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(adminAuth);

router.get('/participants', getParticipants);
router.get('/participants/pending', getPendingParticipants);
router.post('/approve/:participantId', approveParticipant);
router.post('/reject/:participantId', rejectParticipant);
router.post('/validate-qr', validateQR);
router.post('/alerts/send', sendAlert);

// Event Management
router.patch('/events/:id/status', updateEventStatus);
router.post('/events/:id/score', updateParticipantScore);
router.get('/events/:id/leaderboard', getLeaderboard);

module.exports = router;
