const express = require('express');
const { login, registerParticipant } = require('../controllers/authController');

const router = express.Router();

// Unified login route
router.post('/login', login);

// Keep register route but it returns 403
router.post('/participant/register', registerParticipant);

// Legacy routes (optional, can remove if frontend is fully updated, but keeping for safety/compatibility if needed, though plan said to replace)
// Actually, plan said "Replace individual login routes with a single /login route".
// So I will remove the old specific ones to enforce the new logic.

module.exports = router;
