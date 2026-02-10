const express = require('express');
const { login, registerParticipant } = require('../controllers/authController');

const router = express.Router();

// Unified login route
router.post('/login', login);

// Magic Link Routes
router.post('/magic-login', require('../controllers/authController').magicLogin);
router.post('/verify-token', require('../controllers/authController').verifyMagicToken);

// Keep register route but it returns 403
router.post('/participant/register', registerParticipant);

module.exports = router;
