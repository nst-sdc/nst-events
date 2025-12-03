const express = require('express');
const router = express.Router();
const xpController = require('../controllers/xp.controller');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Get my XP (Participant)
router.get('/participant/xp', authenticateToken, authorizeRole(['participant']), xpController.getXp);

module.exports = router;
