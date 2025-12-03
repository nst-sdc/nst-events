import { io } from 'socket.io-client';
import { BACKEND_URL } from '../constants/config';



// Initialize socket connection
export const socket = io(BACKEND_URL, {
    autoConnect: true,
    transports: ['polling', 'websocket'], // Allow polling as fallback
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

socket.on('connect_error', (err) => {
    console.log('Socket connection error:', err);
});
