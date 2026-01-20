const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// Public
router.get('/live', eventController.getLiveEvents);
router.get('/leaderboard/:id', eventController.getLeaderboard);

// Admin (Should add middleware later, but keeping open for now per current structure or add verifyToken)
// Admin (Should add middleware later, but keeping open for now per current structure or add verifyToken)
const { adminAuth } = require('../middleware/authMiddleware');
router.put('/:id/status', adminAuth, eventController.updateEventStatus);
router.post('/:id/score', adminAuth, eventController.updateParticipantScore);

module.exports = router;


