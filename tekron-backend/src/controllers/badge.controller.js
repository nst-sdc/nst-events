const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendPushNotifications } = require('../services/pushNotificationService');

// Create a new badge (SuperAdmin)
const createBadge = async (req, res) => {
    try {
        const { name, description, iconUrl, type } = req.body;

        const badge = await prisma.badge.create({
            data: {
                name,
                description,
                iconUrl,
                type
            }
        });

        res.status(201).json(badge);
    } catch (error) {
        console.error('Error creating badge:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all badges (SuperAdmin)
const getAllBadges = async (req, res) => {
    try {
        const badges = await prisma.badge.findMany();
        res.json(badges);
    } catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Award badge to participant (Admin/SuperAdmin)
const awardBadge = async (req, res) => {
    try {
        const { participantId, badgeId } = req.body;

        // Check if already awarded
        const existing = await prisma.participantBadge.findFirst({
            where: {
                participantId,
                badgeId
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Badge already awarded to this participant' });
        }

        const participantBadge = await prisma.participantBadge.create({
            data: {
                participantId,
                badgeId
            },
            include: {
                badge: true,
                participant: true
            }
        });

        // Send notification
        if (participantBadge.participant.pushToken) {
            await sendPushNotifications(
                [participantBadge.participant.pushToken],
                'New Badge Earned!',
                `You have earned the "${participantBadge.badge.name}" badge!`,
                { type: 'badge', badgeId: badgeId }
            );
        }

        res.status(201).json(participantBadge);
    } catch (error) {
        console.error('Error awarding badge:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get participant badges
const getParticipantBadges = async (req, res) => {
    try {
        const participantId = req.user.id;

        const badges = await prisma.participantBadge.findMany({
            where: { participantId },
            include: { badge: true },
            orderBy: { awardedAt: 'desc' }
        });

        res.json(badges);
    } catch (error) {
        console.error('Error fetching participant badges:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createBadge,
    getAllBadges,
    awardBadge,
    getParticipantBadges
};
