const bcrypt = require('bcrypt');

const { generateToken } = require('../utils/jwt');
const { generateQRCodeString } = require('../utils/qr');
const prisma = require('../utils/prismaClient');

// Unified Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;



        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        let user;
        let role;

        // Determine role based on email domain or specific test accounts
        if (email.endsWith('@superadmin.com') || email === 'superadmin@gmail.com') {
            role = 'superadmin';
            user = await prisma.superAdmin.findUnique({ where: { email } });
        } else if (email.endsWith('@admin.com') || email === 'admin@gmail.com') {
            role = 'admin';
            user = await prisma.admin.findUnique({ where: { email } });
        } else if (email === 'volunteer@gmail.com') {
            role = 'volunteer';
            user = await prisma.volunteer.findUnique({ where: { email } });
        } else {
            role = 'participant';
            user = await prisma.participant.findUnique({ where: { email } });
        }


        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

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
        console.error('Login error details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Register (Disabled)
// Register Participant
const registerParticipant = async (req, res) => {
    try {
        const { name, email, password, eventIds } = req.body;

        if (!name || !email || !password || !eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
            return res.status(400).json({ message: 'Name, email, password, and at least one event are required' });
        }

        const existingUser = await prisma.participant.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to create user and link events
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.participant.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    approved: false, // Default pending
                }
            });

            // Create Event links
            const eventLinks = eventIds.map(eventId => ({
                participantId: user.id,
                eventId: eventId
            }));

            await prisma.eventParticipant.createMany({
                data: eventLinks
            });

            // Set primary event (legacy field support)
            if (eventIds.length > 0) {
                await prisma.participant.update({
                    where: { id: user.id },
                    data: { assignedEventId: eventIds[0] }
                });
            }

            return user;
        });

        res.status(201).json({
            message: 'Registration successful. Waiting for approval.',
            userId: result.id
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const crypto = require('crypto');

// Magic Login: Generate Token
const magicLogin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Check if user exists (any role)
        let role = 'participant';
        let user = await prisma.participant.findUnique({ where: { email } });

        if (!user) {
            if (email.endsWith('@superadmin.com')) {
                role = 'superadmin';
                user = await prisma.superAdmin.findUnique({ where: { email } });
            } else if (email.endsWith('@admin.com')) {
                role = 'admin';
                user = await prisma.admin.findUnique({ where: { email } });
            }
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found. Check your email or contact support.' });
        }

        // Generate Secure Token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        // Store Token
        await prisma.magicLinkToken.create({
            data: {
                email,
                token,
                expiresAt
            }
        });

        // Mock Email Sending (Log Deep Link)
        const deepLink = `tekron://auth/callback?token=${token}`;



        res.json({ message: 'Magic link sent to your email (check console for now)' });

    } catch (error) {
        console.error('Magic Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify Token & Login
const verifyMagicToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'Token is required' });

        // Find Token
        const magicToken = await prisma.magicLinkToken.findUnique({ where: { token } });

        if (!magicToken) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Check Expiration Explicitly
        if (new Date() > new Date(magicToken.expiresAt)) {
            await prisma.magicLinkToken.delete({ where: { id: magicToken.id } }); // Cleanup
            return res.status(400).json({ message: 'Token expired' });
        }

        const email = magicToken.email;

        // Find User again to generate JWT
        let role = 'participant';
        let user = await prisma.participant.findUnique({ where: { email } });

        if (!user) {
            if (email.endsWith('@superadmin.com')) {
                role = 'superadmin';
                user = await prisma.superAdmin.findUnique({ where: { email } });
            } else if (email.endsWith('@admin.com')) {
                role = 'admin';
                user = await prisma.admin.findUnique({ where: { email } });
            }
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Session JWT
        const sessionToken = generateToken({ id: user.id, role });

        // Cleanup Used Token (One-time use)
        await prisma.magicLinkToken.delete({ where: { id: magicToken.id } });

        // Return same response structure as normal login
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role,
        };

        if (role === 'participant') {
            userData.approved = user.approved;
            userData.qrCode = user.qrCode;
        }

        res.json({
            message: 'Login successful',
            token: sessionToken,
            user: userData,
            role
        });

    } catch (error) {
        console.error('Verify Token Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, registerParticipant, magicLogin, verifyMagicToken };
