const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getIo = () => require('../../server').io;

// Admin: Update Event Status
const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, currentRound } = req.body;

        const event = await prisma.event.update({
            where: { id },
            data: { status, currentRound },
        });

        const io = getIo();
        if (io) {
            io.emit('eventStatusUpdated', event);
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error: error.message });
    }
};

// Public: Get Live Events
const getLiveEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { status: 'LIVE' },
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live events', error: error.message });
    }
};

module.exports = {
    updateEventStatus,
    getLiveEvents
};
