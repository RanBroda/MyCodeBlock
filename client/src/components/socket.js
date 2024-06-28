import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io('https://mycodeblock.onrender.com'); // Adjust the URL as needed
        console.log('Socket initialized');
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initSocket first.');
    }
    return socket;
};
