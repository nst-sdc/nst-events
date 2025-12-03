const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get participant XP and Level
const getXp = async (req, res) => {
    try {
        const participantId = req.user.id;

        const participant = await prisma.participant.findUnique({
            where: { id: participantId },
            select: {
                xp: true,
                level: true
            }
        });

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        // Calculate progress to next level (assuming 100 XP per level)
        const xpForNextLevel = participant.level * 100;
        const currentLevelBaseXp = (participant.level - 1) * 100;
        const progress = participant.xp - currentLevelBaseXp;

        res.json({
            xp: participant.xp,
            level: participant.level,
            progress,
            nextLevelXp: 100 // Fixed 100 XP per level for simplicity
        });
    } catch (error) {
        console.error('Error fetching XP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getXp
};
