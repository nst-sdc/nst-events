const express = require('express');
const router = express.Router();
const { uploadPhoto, getPublicPhotos, getAdminPhotos, updatePhotoStatus } = require('../controllers/photoController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole(['participant']), uploadPhoto);
router.get('/public', getPublicPhotos);
router.get('/admin', authenticateToken, authorizeRole(['admin', 'superadmin']), getAdminPhotos);
router.patch('/:id/status', authenticateToken, authorizeRole(['admin', 'superadmin']), updatePhotoStatus);

module.exports = router;
