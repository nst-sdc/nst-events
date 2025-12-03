const { verifyToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = require('../utils/prismaClient');

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
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    req.user = decoded;
    next();
};

const requireApproval = async (req, res, next) => {
    if (req.user.role !== 'participant') {
        // Admins/SuperAdmins don't need "approval" in this context, but this middleware is for participants.
        // If an admin hits a participant route protected by this, we might want to allow or block.
        // Given the requirements: "View dashboard, events, schedule ONLY if approved" (Participant permissions).
        // So this is specific to participants.
        return next();
    }

    try {
        const participant = await prisma.participant.findUnique({
            where: { id: req.user.id },
            select: { approved: true }
        });

        if (!participant || !participant.approved) {
            return res.status(403).json({ message: 'Forbidden: Account not approved' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error checking approval status' });
    }
};

const participantAuth = (req, res, next) => authenticate(req, res, next, 'participant');
const adminAuth = (req, res, next) => authenticate(req, res, next, 'admin');
const superAdminAuth = (req, res, next) => authenticate(req, res, next, 'superadmin');

module.exports = { participantAuth, adminAuth, superAdminAuth, requireApproval };
