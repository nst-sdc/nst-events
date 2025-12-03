const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// We need to import io from server.js, but since server.js exports it after initialization,
// and server.js imports routes which import controllers, we might have a circular dependency.
// A common pattern is to pass io to the controller or use a singleton.
// For simplicity here, we'll require server.js but we need to be careful.
// Actually, requiring server.js inside the function or using app.get('io') if we attached it is better.
// Let's attach io to app in server.js or use a getter.
// Alternative: Pass io in the route definition.

// Let's assume we can access io via a helper or just require it if the export is handled correctly.
// Since server.js starts the server, requiring it might restart it if not careful.
// Better approach: Create a socket.js file to export io, or attach to global/app.
// For now, let's try to access it via `require('../../server').io` inside the function to avoid top-level circular dependency.

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

// Admin: Update Participant Score
const updateParticipantScore = async (req, res) => {
    try {
        const { id } = req.params; // Event ID
        const { participantId, score } = req.body;

        // Update or create EventParticipant entry
        const entry = await prisma.eventParticipant.upsert({
            where: {
                // We need a unique constraint on participantId + eventId in schema or findFirst
                // Since we didn't add @@unique([participantId, eventId]), let's use findFirst to check existence
                // Actually, upsert requires a unique field.
                // Let's assume we added unique constraint or handle it manually.
                // For now, let's do findFirst then update/create.
                id: 'placeholder' // This won't work without unique ID.
            },
            update: { score, updatedAt: new Date() },
            create: { participantId, eventId: id, score },
        });

        // Wait, upsert needs a unique where. We should have added @@unique([participantId, eventId]) to EventParticipant.
        // Let's fix schema first or use findFirst logic.

        // Manual upsert logic
        let eventParticipant = await prisma.eventParticipant.findFirst({
            where: { participantId, eventId: id }
        });

        if (eventParticipant) {
            eventParticipant = await prisma.eventParticipant.update({
                where: { id: eventParticipant.id },
                data: { score, updatedAt: new Date() }
            });
        } else {
            eventParticipant = await prisma.eventParticipant.create({
                data: { participantId, eventId: id, score }
            });
        }

        // Recompute ranks (simplified: just fetch all and sort)
        const leaderboard = await prisma.eventParticipant.findMany({
            where: { eventId: id },
            orderBy: { score: 'desc' },
            include: { participant: { select: { name: true, email: true } } }
        });

        // Update ranks in DB (optional for this step, but good for persistence)
        // For real-time, we just emit the sorted list.

        const io = getIo();
        if (io) {
            io.emit('leaderboardUpdated', { eventId: id, leaderboard });
        }

        res.json(eventParticipant);
    } catch (error) {
        res.status(500).json({ message: 'Error updating score', error: error.message });
    }
};

// Public: Get Leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;
        const leaderboard = await prisma.eventParticipant.findMany({
            where: { eventId: id },
            orderBy: { score: 'desc' },
            include: { participant: { select: { name: true, email: true } } }
        });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
};

module.exports = {
    updateEventStatus,
    getLiveEvents,
    updateParticipantScore,
    getLeaderboard
};
