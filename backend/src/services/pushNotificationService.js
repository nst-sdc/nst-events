const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

/**
 * Send push notifications to a list of tokens
 * @param {string[]} pushTokens - Array of Expo push tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Extra data to send with notification
 */
const sendPushNotifications = async (pushTokens, title, body, data = {}) => {
    let messages = [];
    for (let pushToken of pushTokens) {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: data,
        });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            // console.log('Notification tickets:', ticketChunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending notification chunk:', error);
        }
    }

    // Ideally, we should also handle receipts to check for delivery errors
    // But for now, just returning tickets is enough
    return tickets;
};

module.exports = {
    sendPushNotifications
};
