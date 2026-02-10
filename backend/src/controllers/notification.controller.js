const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendPushNotifications } = require('../services/pushNotificationService');

// Register push token
const registerPushToken = async (req, res) => {
    try {
        const { pushToken } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (!pushToken) {
            return res.status(400).json({ message: 'Push token is required' });
        }

        if (role === 'participant') {
            await prisma.participant.update({
                where: { id: userId },
                data: { pushToken }
            });
        } else if (role === 'admin') {
            await prisma.admin.update({
                where: { id: userId },
                data: { pushToken }
            });
        }

        res.json({ message: 'Push token registered successfully' });
    } catch (error) {
        console.error('Error registering push token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Notify participants of an event
const notifyEventParticipants = async (req, res) => {
    try {
        const { id } = req.params; // Event ID
        const { title, message } = req.body;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                participants: true
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const pushTokens = event.participants
            .map(p => p.pushToken)
            .filter(token => token); // Filter out null/undefined tokens

        if (pushTokens.length > 0) {
            await sendPushNotifications(pushTokens, title || `Event Update: ${event.title}`, message, { eventId: id });
        }

        res.json({ message: `Notification sent to ${pushTokens.length} participants` });
    } catch (error) {
        console.error('Error notifying participants:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Broadcast notification
const broadcastNotification = async (req, res) => {
    try {
        const { title, message, targets } = req.body; // targets: 'participants', 'admins', 'all'

        let pushTokens = [];

        if (targets === 'participants' || targets === 'all') {
            const participants = await prisma.participant.findMany({
                where: { pushToken: { not: null } },
                select: { pushToken: true }
            });
            pushTokens.push(...participants.map(p => p.pushToken));
        }

        if (targets === 'admins' || targets === 'all') {
            const admins = await prisma.admin.findMany({
                where: { pushToken: { not: null } },
                select: { pushToken: true }
            });
            pushTokens.push(...admins.map(a => a.pushToken));
        }

        if (pushTokens.length > 0) {
            await sendPushNotifications(pushTokens, title, message);
        }

        res.json({ message: `Broadcast sent to ${pushTokens.length} users` });
    } catch (error) {
        console.error('Error broadcasting notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerPushToken,
    notifyEventParticipants,
    broadcastNotification
};
