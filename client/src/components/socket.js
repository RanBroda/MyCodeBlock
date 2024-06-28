import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io('https://mycodeblock-backend.onrender.com'); // Adjust the URL as needed
        console.log('Socket initialized');
    }
    return socket;
};
