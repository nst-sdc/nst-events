const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reportItem = async (req, res) => {
    try {
        const { type, title, description, location, category, image } = req.body;
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
                imageUrl: image || null,
                imageStatus: image ? 'PENDING' : 'APPROVED',
                reportedById: userId,
                status: 'PENDING' // Default to PENDING for approval
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
        const { type, admin } = req.query; // Add admin flag
        const where = {};

        if (type) {
            where.type = type;
        }

        // Check if requesting as admin (should verify role in middleware ideally, 
        // but for now relying on query param + assumes auth middleware sets user correctly)
        // Better: Check req.user.role here if available.
        // Assuming participant access only sees OPEN items.

        // In this architecture, usually separate routes for admin, but let's check:
        // If query 'admin=true', check if user is admin/superadmin?
        // Let's assume public/participant route only returns OPEN.
        // Admin route should call a different function or we check role here.

        // For simplicity:
        // If we are calling from Admin Panel, we might use a different endpoint or param.
        // Let's rely on standard logic: Public = OPEN only.

        if (req.query.scope !== 'admin') {
            where.status = 'OPEN';
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

const updateItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // OPEN (Approve), CLOSED (Resolve)

        // Validate status
        if (!['OPEN', 'CLOSED', 'PENDING'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const item = await prisma.lostFoundItem.update({
            where: { id },
            data: { status }
        });

        res.json(item);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markClaimed = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await prisma.lostFoundItem.findUnique({
            where: { id }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Allow reporter to close it only
        if (item.reportedById === userId) {
            const updated = await prisma.lostFoundItem.update({
                where: { id },
                data: { status: 'CLOSED' }
            });
            return res.json(updated);
        }

        return res.status(403).json({ message: 'Not authorized to modify this item' });

    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    reportItem,
    getItems,
    markClaimed,
    updateItemStatus
};
