const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Register push token (Participant & Admin)
router.post('/push-token', authenticateToken, notificationController.registerPushToken);

// Notify event participants (Admin & SuperAdmin)
router.post('/events/:id/notify-participants', authenticateToken, authorizeRole(['admin', 'superadmin']), notificationController.notifyEventParticipants);

// Broadcast notification (SuperAdmin)
router.post('/broadcast', authenticateToken, authorizeRole(['superadmin']), notificationController.broadcastNotification);

module.exports = router;
