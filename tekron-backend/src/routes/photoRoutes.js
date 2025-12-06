const express = require('express');
const router = express.Router();
const { uploadPhoto, getPublicPhotos, getPendingPhotos, approvePhoto } = require('../controllers/photoController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole(['participant']), uploadPhoto);
router.get('/public', getPublicPhotos);
router.get('/pending', authenticateToken, authorizeRole(['admin', 'superadmin']), getPendingPhotos);
router.post('/:id/approve', authenticateToken, authorizeRole(['admin', 'superadmin']), approvePhoto);

module.exports = router;
