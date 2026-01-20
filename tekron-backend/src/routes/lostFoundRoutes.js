const express = require('express');
const router = express.Router();
const lostFoundController = require('../controllers/lostFoundController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes (or protected? usually protected for participants)
router.get('/', authenticateToken, lostFoundController.getItems);
router.post('/report', authenticateToken, lostFoundController.reportItem);
router.post('/:id/claim', authenticateToken, lostFoundController.markClaimed);
router.patch('/:id/status', authenticateToken, lostFoundController.updateItemStatus);

module.exports = router;
