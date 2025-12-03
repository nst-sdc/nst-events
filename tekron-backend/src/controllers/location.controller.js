const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLocations = async (req, res) => {
    try {
        const locations = await prisma.location.findMany({
            where: { isPublic: true },
            include: { events: true }
        });
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Failed to fetch locations' });
    }
};

const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await prisma.location.findUnique({
            where: { id },
            include: { events: true }
        });
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(location);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ message: 'Failed to fetch location' });
    }
};

const createLocation = async (req, res) => {
    const { name, building, floor, mapCode, isPublic } = req.body;
    try {
        const location = await prisma.location.create({
            data: {
                name,
                building,
                floor,
                mapCode,
                isPublic: isPublic !== undefined ? isPublic : true
            }
        });
        res.status(201).json(location);
    } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ message: 'Failed to create location' });
    }
};

module.exports = {
    getLocations,
    getLocationById,
    createLocation
};
