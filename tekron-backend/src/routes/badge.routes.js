const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Create badge (SuperAdmin)
router.post('/superadmin/badges', authenticateToken, authorizeRole(['superadmin']), badgeController.createBadge);

// Get all badges (SuperAdmin)
router.get('/superadmin/badges', authenticateToken, authorizeRole(['superadmin']), badgeController.getAllBadges);

// Award badge (Admin & SuperAdmin)
router.post('/admin/badges/award', authenticateToken, authorizeRole(['admin', 'superadmin']), badgeController.awardBadge);

// Get my badges (Participant)
router.get('/participant/badges', authenticateToken, authorizeRole(['participant']), badgeController.getParticipantBadges);

module.exports = router;
