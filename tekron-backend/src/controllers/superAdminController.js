const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAdmin = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'Admin created', admin: { id: admin.id, name: admin.name, email: admin.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, name: true, email: true, createdAt: true }
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const { title, description, location, startTime, endTime } = req.body;

        const event = await prisma.event.create({
            data: {
                title,
                description,
                location,
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null
            }
        });

        res.status(201).json({ message: 'Event created', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const sendAlert = async (req, res) => {
    try {
        const { title, message } = req.body;
        const alert = await prisma.alert.create({
            data: {
                senderId: req.user.id,
                senderRole: 'superadmin',
                title,
                message
            }
        });
        res.json({ message: 'Alert sent', alert });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createAdmin, getAdmins, createEvent, getEvents, sendAlert };
