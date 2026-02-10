const generateQRCodeString = (participantId, createdAt) => {
    const data = {
        id: participantId,
        timestamp: new Date(createdAt).toISOString(),
        type: 'participant_qr'
    };
    return JSON.stringify(data);
};

module.exports = { generateQRCodeString };
