const express = require('express');
const router = express.Router();
const { reportItem, getItems, markClaimed, updateStatus } = require('../controllers/lostFoundController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes (or protected? usually protected for participants)
router.get('/', authenticateToken, getItems);
router.post('/report', authenticateToken, reportItem);
router.post('/:id/claim', authenticateToken, markClaimed);
router.put('/:id/status', authenticateToken, updateStatus);

module.exports = router;
