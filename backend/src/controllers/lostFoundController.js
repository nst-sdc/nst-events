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
                status: 'PENDING' // Default to PENDING for admin approval
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

        const items = await prisma.lostFoundItem.findMany({
            where: {
                ...where,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                reportedBy: {
                    select: { name: true, email: true }
                }
            }
        });

        // Enrich items with isApproved flag for frontend compatibility
        const enrichedItems = items.map(item => ({
            ...item,
            isApproved: item.status !== 'PENDING' && item.status !== 'REJECTED'
        }));

        res.json(enrichedItems);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markClaimed = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // current user

        const item = await prisma.lostFoundItem.findUnique({
            where: { id }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Allow reporter to close
        if (item.reportedById === userId) {
            const updated = await prisma.lostFoundItem.update({
                where: { id },
                data: { status: 'CLOSED' }
            });
            return res.json(updated);
        }

        // TODO: Admin check logic if needed
        return res.status(403).json({ message: 'Not authorized to modify this item' });

    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isApproved } = req.body;

        // Admin Only Check (optional but recommended)
        // For now, assuming middleware handles it or we trust the endpoint

        let newStatus = status;
        if (isApproved === true && !newStatus) newStatus = 'OPEN';
        if (isApproved === false && !newStatus) newStatus = 'REJECTED';

        if (!newStatus) {
            return res.status(400).json({ message: 'No status provided' });
        }

        const updated = await prisma.lostFoundItem.update({
            where: { id },
            data: { status: newStatus }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    reportItem,
    getItems,
    markClaimed,
    updateStatus
};
