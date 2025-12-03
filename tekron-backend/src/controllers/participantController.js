const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MAP_IFRAME = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d699.6968808032617!2d73.91286237932246!3d18.621136861780464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7007ca391d7%3A0x9da4723c416a8ee5!2sNewton%20school%20of%20technology%20pune%20campus!5e1!3m2!1sen!2sin!4v1764750287016!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

// Get Current Participant Profile
const getMe = async (req, res) => {
    try {
        const participant = await prisma.participant.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                approved: true,
                qrCode: true,
                createdAt: true
            }
        });

        if (!participant) return res.status(404).json({ message: 'Participant not found' });
        res.json(participant);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Participant Status
const getParticipantStatus = async (req, res) => {
    try {
        const participant = await prisma.participant.findUnique({
            where: { id: req.user.id },
            include: { approvedBy: { select: { id: true, name: true } } }
        });

        if (!participant) return res.status(404).json({ message: 'Participant not found' });

        res.json({
            approved: participant.approved,
            approvedBy: participant.approvedBy,
            approvedAt: participant.approvedAt,
            canAccessMap: true,
            mapIframe: MAP_IFRAME,
            canAccessEvents: participant.approved
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get QR Code
const getParticipantQR = async (req, res) => {
    try {
        const participant = await prisma.participant.findUnique({
            where: { id: req.user.id }
        });

        if (!participant) return res.status(404).json({ message: 'Participant not found' });

        res.json({
            approved: participant.approved,
            qrCode: participant.qrCode,
            mapIframe: MAP_IFRAME,
            message: participant.approved
                ? "Access Granted"
                : "You are not approved yet. Please show this QR code at the event desk to get approved."
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Unapproved Map Details
const getUnapprovedMap = async (req, res) => {
    try {
        const participant = await prisma.participant.findUnique({
            where: { id: req.user.id }
        });

        if (!participant) return res.status(404).json({ message: 'Participant not found' });

        res.json({
            approved: participant.approved,
            mapIframe: MAP_IFRAME,
            qrCode: participant.qrCode,
            locationName: "Newton School of Technology, Pune Campus",
            instructions: "Go to 4th Floor of MCA Building for approval."
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Events (Restricted)
const getEvents = async (req, res) => {
    try {
        const participant = await prisma.participant.findUnique({ where: { id: req.user.id } });

        if (!participant.approved) {
            return res.status(403).json({
                approved: false,
                message: "You are not approved yet. Only the QR code and event location map are accessible."
            });
        }

        const events = await prisma.event.findMany();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Alerts (Restricted)
const getAlerts = async (req, res) => {
    try {
        const participant = await prisma.participant.findUnique({ where: { id: req.user.id } });

        if (!participant.approved) {
            return res.status(403).json({
                approved: false,
                message: "You are not approved yet. Only the QR code and event location map are accessible."
            });
        }

        const alerts = await prisma.alert.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getMe,
    getParticipantStatus,
    getParticipantQR,
    getUnapprovedMap,
    getEvents,
    getAlerts
};
