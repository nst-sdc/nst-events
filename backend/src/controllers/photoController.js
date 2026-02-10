const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadPhoto = async (req, res) => {
    const { url, caption } = req.body;
    const uploaderId = req.user.id;

    try {
        const photo = await prisma.photo.create({
            data: {
                uploaderId,
                url,
                caption,
                status: 'PENDING'
            }
        });
        res.status(201).json(photo);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading photo', error: error.message });
    }
};

const getPublicPhotos = async (req, res) => {
    try {
        const photos = await prisma.photo.findMany({
            where: { status: 'APPROVED' },
            include: { uploader: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching photos', error: error.message });
    }
};

const getAdminPhotos = async (req, res) => {
    try {
        const { status } = req.query;
        const where = status ? { status } : {};

        const photos = await prisma.photo.findMany({
            where,
            include: { uploader: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin photos', error: error.message });
    }
};

const updatePhotoStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const photo = await prisma.photo.update({
            where: { id },
            data: { status }
        });
        res.json(photo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating photo status', error: error.message });
    }
};

const approvePhoto = async (req, res) => {
    const { id } = req.params;
    try {
        const photo = await prisma.photo.update({
            where: { id },
            data: { approved: true }
        });
        res.json(photo);
    } catch (error) {
        res.status(500).json({ message: 'Error approving photo', error: error.message });
    }
};

module.exports = { uploadPhoto, getPublicPhotos, getAdminPhotos, updatePhotoStatus };
