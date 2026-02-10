const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

const createVolunteer = async (req, res) => {
    const { email, name, password, assignedEventId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const volunteer = await prisma.volunteer.create({
            data: {
                email,
                name,
                password: hashedPassword,
                assignedEventId
            }
        });
        res.status(201).json({ message: 'Volunteer created', volunteerId: volunteer.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating volunteer', error: error.message });
    }
};

const loginVolunteer = async (req, res) => {
    const { email, password } = req.body;
    try {
        const volunteer = await prisma.volunteer.findUnique({ where: { email } });
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        const validPassword = await bcrypt.compare(password, volunteer.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken({ id: volunteer.id, role: 'volunteer' });
        res.json({ token, user: volunteer, role: 'volunteer' });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

const getAssignedEvent = async (req, res) => {
    try {
        const volunteer = await prisma.volunteer.findUnique({
            where: { id: req.user.id },
            include: { event: { include: { participants: true } } }
        });
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        res.json(volunteer.event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

module.exports = { createVolunteer, loginVolunteer, getAssignedEvent };
