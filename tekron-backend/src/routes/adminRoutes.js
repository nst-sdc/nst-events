const express = require('express');
const { getParticipants, getPendingParticipants, approveParticipant, rejectParticipant, validateQR, sendAlert } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(adminAuth);

router.get('/participants', getParticipants);
router.get('/participants/pending', getPendingParticipants);
router.post('/approve/:participantId', approveParticipant);
router.post('/reject/:participantId', rejectParticipant);
router.post('/validate-qr', validateQR);
router.post('/alerts/send', sendAlert);

module.exports = router;
