const express = require('express');
const { getMe, getParticipantStatus, getParticipantQR, getUnapprovedMap, getEvents, getAlerts } = require('../controllers/participantController');
const { getLiveEvents, getLeaderboard } = require('../controllers/event.controller');
const { participantAuth, requireApproval } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(participantAuth);

// Public (to participant) routes - No approval needed
router.get('/me', getMe);
router.get('/status', getParticipantStatus);
router.get('/qr', getParticipantQR);
router.get('/unapproved-map', getUnapprovedMap);
router.get('/events/live', getLiveEvents);

// Protected routes - Approval required
router.get('/events', requireApproval, getEvents);
router.get('/events/:id/leaderboard', requireApproval, getLeaderboard);
router.get('/alerts', requireApproval, getAlerts);

module.exports = router;
