const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const submitFeedback = async (req, res) => {
    const { eventId, rating, comment } = req.body;
    const participantId = req.user.id;

    try {
        // Check if already submitted
        const existing = await prisma.feedback.findFirst({
            where: { participantId, eventId }
        });

        if (existing) {
            return res.status(400).json({ message: 'Feedback already submitted for this event' });
        }

        const feedback = await prisma.feedback.create({
            data: {
                participantId,
                eventId,
                rating,
                comment
            }
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

const getEventFeedback = async (req, res) => {
    const { eventId } = req.params;
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: { eventId },
            include: { participant: { select: { name: true } } }
        });

        const total = feedbacks.length;
        const average = total > 0
            ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total
            : 0;

        res.json({ total, average, feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

module.exports = { submitFeedback, getEventFeedback };
