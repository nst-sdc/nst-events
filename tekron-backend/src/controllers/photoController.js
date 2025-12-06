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
                approved: false // Requires moderation
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
            where: { approved: true },
            include: { uploader: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching photos', error: error.message });
    }
};

const getPendingPhotos = async (req, res) => {
    try {
        const photos = await prisma.photo.findMany({
            where: { approved: false },
            include: { uploader: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending photos', error: error.message });
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

module.exports = { uploadPhoto, getPublicPhotos, getPendingPhotos, approvePhoto };
