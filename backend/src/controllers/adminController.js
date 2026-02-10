const { PrismaClient } = require('@prisma/client');
const prisma = require('../utils/prismaClient');
const { generateQRCodeString } = require('../utils/qr');

// Get All Participants
const getParticipants = async (req, res) => {
    try {
        const participants = await prisma.participant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                approvedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
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
            where: { qrCode: code },
            include: {
                eventParticipants: {
                    include: {
                        event: true
                    }
                }
            }
        });

        if (!participant) return res.status(404).json({ message: 'Invalid QR code' });

        res.json({
            participant: {
                id: participant.id,
                name: participant.name,
                email: participant.email,
                approved: participant.approved,
                events: participant.eventParticipants.map(ep => ep.event)
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

        if (!adminId) {
            console.error('[Admin] Error: req.user.id is missing or undefined');
            return res.status(401).json({ message: 'Unauthorized: Invalid admin session' });
        }

        console.log(`[Admin] Approving participant: ${id} by ${req.user.role}: ${adminId}`);

        const participant = await prisma.participant.findUnique({ where: { id } });
        if (!participant) {
            console.log(`[Admin] Participant not found: ${id}`);
            return res.status(404).json({ message: 'Participant not found' });
        }

        if (participant.approved) {
            return res.json({
                success: true,
                message: 'Participant already approved',
                participantId: participant.id
            });
        }

        // Update participant and create log in transaction
        const result = await prisma.$transaction(async (prisma) => {
            const updateData = {
                approved: true,
                approvedAt: new Date(),
                qrCode: generateQRCodeString(participant.id, participant.createdAt)
            };

            // Only link to Admin table if the user is actually an Admin (not SuperAdmin)
            // SuperAdmins are in a separate table and cannot satisfy the Foreign Key constraint to Admin table.
            if (req.user.role === 'admin') {
                updateData.approvedById = adminId;
            }

            const updatedParticipant = await prisma.participant.update({
                where: { id },
                data: updateData,
                include: { approvedBy: true }
            });

            // Only create ApprovalLog if user is Admin, because ApprovalLog requires a valid Admin ID
            if (req.user.role === 'admin') {
                await prisma.approvalLog.create({
                    data: {
                        participantId: id,
                        adminId: adminId,
                        notes: notes || 'Approved via Admin Panel'
                    }
                });
            }

            return updatedParticipant;
        });

        res.json({
            success: true,
            participantId: result.id,
            approvedBy: result.approvedBy ? { id: result.approvedBy.id, name: result.approvedBy.name } : null,
            approvedAt: result.approvedAt
        });

        // Realtime Update
        if (req.io) {
            req.io.emit('participantUpdated', {
                id: result.id,
                approved: true,
                approvedBy: result.approvedBy ? { id: result.approvedBy.id, name: result.approvedBy.name } : null,
                approvedAt: result.approvedAt
            });
        }
    } catch (error) {
        console.error('[Admin] Error in approveParticipant:', error);
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

        // Realtime Update
        if (req.io) {
            req.io.emit('participantUpdated', {
                id,
                approved: false,
                approvedBy: null,
                approvedAt: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send Alert
const sendAlert = async (req, res) => {
    try {
        const { title, message, targetScope = 'all', targetEventIds = [] } = req.body;
        const senderRole = req.user.role; // 'admin' or 'superadmin'

        // Create Alert Record
        const alert = await prisma.alert.create({
            data: {
                title,
                message,
                senderRole,
                targetScope,
                targetEventIds
            }
        });

        // Send Push Notifications
        let pushTokens = [];

        if (targetScope === 'all') {
            // Get all participants with push tokens
            const participants = await prisma.participant.findMany({
                where: { pushToken: { not: null } },
                select: { pushToken: true }
            });
            pushTokens = participants.map(p => p.pushToken);
        } else if (targetScope === 'event' && targetEventIds.length > 0) {
            // Get participants linked to specific events
            const participants = await prisma.participant.findMany({
                where: {
                    pushToken: { not: null },
                    eventParticipants: {
                        some: {
                            eventId: { in: targetEventIds }
                        }
                    }
                },
                select: { pushToken: true },
                distinct: ['id'] // Avoid duplicates if user in multiple target events
            });
            pushTokens = participants.map(p => p.pushToken);
        }

        if (pushTokens.length > 0) {
            // Send in batches handled by service
            const { sendPushNotifications } = require('../services/pushNotificationService');
            await sendPushNotifications(pushTokens, title, message, { alertId: alert.id });
        }

        res.status(201).json({
            ...alert,
            recipientCount: pushTokens.length
        });

    } catch (error) {
        console.error('Send Alert Error:', error);
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
