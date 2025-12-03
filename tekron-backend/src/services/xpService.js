const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// XP Constants
const XP_VALUES = {
    CHECK_IN: 20,
    EVENT_COMPLETION: 50,
    FEEDBACK_SUBMISSION: 10,
    WINNING_EVENT: 100
};

// Level calculation: Level = 1 + floor(XP / 100)
const calculateLevel = (xp) => {
    return 1 + Math.floor(xp / 100);
};

/**
 * Add XP to a participant and update level if needed
 * @param {string} participantId 
 * @param {number} amount 
 * @returns {Promise<object>} Updated participant
 */
const addXp = async (participantId, amount) => {
    const participant = await prisma.participant.findUnique({
        where: { id: participantId }
    });

    if (!participant) {
        throw new Error('Participant not found');
    }

    const newXp = participant.xp + amount;
    const newLevel = calculateLevel(newXp);

    const updatedParticipant = await prisma.participant.update({
        where: { id: participantId },
        data: {
            xp: newXp,
            level: newLevel
        }
    });

    return {
        participant: updatedParticipant,
        leveledUp: newLevel > participant.level,
        oldLevel: participant.level,
        newLevel: newLevel
    };
};

module.exports = {
    addXp,
    XP_VALUES
};
