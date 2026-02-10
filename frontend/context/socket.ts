import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants/config';

// Initialize socket connection
export const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    timeout: 20000,
});

socket.on('connect', () => {

});

socket.on('disconnect', () => {

});

socket.on('connect_error', (err) => {

});
