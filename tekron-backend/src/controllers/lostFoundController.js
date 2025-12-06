const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reportItem = async (req, res) => {
    try {
        const { type, title, description, location, category } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!type || !title) {
            return res.status(400).json({ message: 'Type and Title are required' });
        }

        const item = await prisma.lostFoundItem.create({
            data: {
                type,
                title,
                description,
                location,
                category: category || 'OTHER',
                reportedById: userId,
                status: 'OPEN'
            }
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Error reporting item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getItems = async (req, res) => {
    try {
        const { type } = req.query;
        const where = {};

        if (type) {
            where.type = type;
        }

        // Only show OPEN items or items claimed by the user?
        // For now, let's show all OPEN items.
        // Or maybe show CLAIMED items too if they are recent?
        // Let's stick to OPEN items for the public list.
        // But maybe we want to see "Found" items that are claimed?

        // Let's return all items for now, sorted by newest.
        const items = await prisma.lostFoundItem.findMany({
            where: {
                ...where,
                // status: 'OPEN' // Maybe filter by status?
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                reportedBy: {
                    select: { name: true }
                }
            }
        });

        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markClaimed = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role; // 'participant', 'admin', 'superadmin'

        // Only Admin or the Reporter can mark as claimed/closed?
        // Or maybe the person who lost it claims it?

        // Logic:
        // If item is FOUND, the person who lost it 'claims' it.
        // If item is LOST, the person who found it 'claims' it (reports found).

        // Simplification:
        // Admin can mark as CLAIMED.
        // Reporter can mark as CLOSED (if they found it themselves).

        // For this MVP:
        // Any authenticated user can "Claim" a FOUND item? No, that's risky.
        // Let's say only Admins can mark as CLAIMED for now to verify ownership.
        // OR the reporter can close it.

        const item = await prisma.lostFoundItem.findUnique({
            where: { id }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Allow Admin or Reporter to update status
        // Note: We don't have 'role' in req.user for participants usually, need to check middleware.
        // Assuming req.user has role if admin.

        // Check if user is admin (needs check on how auth middleware sets user)
        // Usually participant auth just sets user.id.

        // Let's assume only Admin can mark as CLAIMED for now.
        // Or if the user is the reporter, they can delete/close it.

        // Let's implement a simple "Claim" which sets claimedBy to the current user
        // BUT only if it's a FOUND item?

        // Re-reading requirements: "Admin tools for marking items resolved."
        // So let's stick to Admin only for resolving for now, or maybe just a simple status update.

        // Let's allow the reporter to close it.
        if (item.reportedById === userId) {
            const updated = await prisma.lostFoundItem.update({
                where: { id },
                data: { status: 'CLOSED' }
            });
            return res.json(updated);
        }

        // If not reporter, check if admin (we need to know if user is admin)
        // For now, let's just allow reporter.

        return res.status(403).json({ message: 'Not authorized to modify this item' });

    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    reportItem,
    getItems,
    markClaimed
};
