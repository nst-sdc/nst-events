const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAlert = async (req, res) => {
    const { message, isEmergency } = req.body;
    const senderRole = req.user.role;

    try {
        const alert = await prisma.alert.create({
            data: {
                message,
                senderRole,
                isEmergency: isEmergency || false
            }
        });

        // In a real app, you would trigger push notifications here
        // if (isEmergency) sendPushNotificationToAll(message);

        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ message: 'Error creating alert', error: error.message });
    }
};

const getAlerts = async (req, res) => {
    try {
        const alerts = await prisma.alert.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error: error.message });
    }
};

module.exports = { createAlert, getAlerts };
