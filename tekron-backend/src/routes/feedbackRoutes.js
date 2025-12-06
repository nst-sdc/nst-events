const express = require('express');
const router = express.Router();
const { submitFeedback, getEventFeedback } = require('../controllers/feedbackController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole(['participant']), submitFeedback);
router.get('/event/:eventId', authenticateToken, authorizeRole(['admin', 'superadmin']), getEventFeedback);

module.exports = router;
