const express = require('express');
const router = express.Router();
const { createVolunteer, loginVolunteer, getAssignedEvent } = require('../controllers/volunteerController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, authorizeRole(['admin', 'superadmin']), createVolunteer);
router.post('/login', loginVolunteer);
router.get('/event', authenticateToken, authorizeRole(['volunteer']), getAssignedEvent);

module.exports = router;
