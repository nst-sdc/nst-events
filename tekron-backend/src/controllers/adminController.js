const { PrismaClient } = require('@prisma/client');
const prisma = require('../utils/prismaClient');
const { generateQRCodeString } = require('../utils/qr');

// Get All Participants
const getParticipants = async (req, res) => {
    try {
        const participants = await prisma.participant.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Pending Participants
const getPendingParticipants = async (req, res) => {
    try {
        const participants = await prisma.participant.findMany({
            where: { approved: false },
            orderBy: { createdAt: 'desc' }
        });
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Validate QR
const validateQR = async (req, res) => {
    try {
        const { qrData } = req.body;
        const code = qrData || req.body.qrCode;

        if (!code) return res.status(400).json({ message: 'QR Code is required' });

        const participant = await prisma.participant.findFirst({
            where: { qrCode: code }
        });

        if (!participant) return res.status(404).json({ message: 'Invalid QR code' });

        res.json({
            participant: {
                id: participant.id,
                name: participant.name,
                email: participant.email,
                approved: participant.approved
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Approve Participant
const approveParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const adminId = req.user.id;

        const participant = await prisma.participant.findUnique({ where: { id } });
        if (!participant) return res.status(404).json({ message: 'Participant not found' });

        if (participant.approved) {
            return res.json({
                success: true,
                message: 'Participant already approved',
                participantId: participant.id
            });
        }

        // Update participant and create log in transaction
        const result = await prisma.$transaction(async (prisma) => {
            const updatedParticipant = await prisma.participant.update({
                where: { id },
                data: {
                    approved: true,
                    approvedById: adminId,
                    approvedAt: new Date(),
                    qrCode: generateQRCodeString(participant.id, participant.createdAt)
                },
                include: { approvedBy: true }
            });

            await prisma.approvalLog.create({
                data: {
                    participantId: id,
                    adminId: adminId,
                    notes: notes || 'Approved via Admin Panel'
                }
            });

            return updatedParticipant;
        });

        res.json({
            success: true,
            participantId: result.id,
            approvedBy: { id: result.approvedBy.id, name: result.approvedBy.name },
            approvedAt: result.approvedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reject Participant
const rejectParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.participant.update({
            where: { id },
            data: { approved: false, approvedById: null, approvedAt: null }
        });
        res.json({ message: 'Participant rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send Alert
const sendAlert = async (req, res) => {
    try {
        const { title, message } = req.body;
        const alert = await prisma.alert.create({
            data: {
                title,
                message,
                senderRole: 'admin'
            }
        });
        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getParticipants,
    getPendingParticipants,
    validateQR,
    approveParticipant,
    rejectParticipant,
    sendAlert
};
