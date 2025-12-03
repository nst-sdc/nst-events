const { verifyToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = async (req, res, next, role) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    if (role && decoded.role !== role) {
        // Allow superadmin to access admin routes if needed, but strict separation requested.
        // User requested: "Each role has isolated login endpoints and protected routes."
        // So we enforce strict role check.
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    req.user = decoded;
    next();
};

const participantAuth = (req, res, next) => authenticate(req, res, next, 'participant');
const adminAuth = (req, res, next) => authenticate(req, res, next, 'admin');
const superAdminAuth = (req, res, next) => authenticate(req, res, next, 'superadmin');

module.exports = { participantAuth, adminAuth, superAdminAuth };
