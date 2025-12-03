const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');
const { generateQRCodeString } = require('../utils/qr');

const prisma = new PrismaClient();

// Unified Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        let user;
        let role;

        // Determine role based on email domain
        if (email.endsWith('@superadmin.com')) {
            role = 'superadmin';
            user = await prisma.superAdmin.findUnique({ where: { email } });
        } else if (email.endsWith('@admin.com')) {
            role = 'admin';
            user = await prisma.admin.findUnique({ where: { email } });
        } else {
            role = 'participant';
            user = await prisma.participant.findUnique({ where: { email } });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, role });

        // Return user data based on role
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role, // Explicitly return role for frontend
        };

        if (role === 'participant') {
            userData.approved = user.approved;
            userData.qrCode = user.qrCode;
        }

        res.json({ token, user: userData, role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Register (Disabled)
const registerParticipant = async (req, res) => {
    return res.status(403).json({ message: 'User registration is not allowed. Contact Event Management.' });
};

module.exports = { login, registerParticipant };
