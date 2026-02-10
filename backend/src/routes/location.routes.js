const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Public routes (authenticated users)
router.get('/', authenticateToken, locationController.getLocations);
router.get('/:id', authenticateToken, locationController.getLocationById);

// Admin routes
router.post('/', authenticateToken, authorizeRole(['admin', 'superadmin']), locationController.createLocation);

module.exports = router;
