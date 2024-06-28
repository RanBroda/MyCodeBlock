import { io } from 'socket.io-client';
const originRemote = 'https://mycodeblock-backend.onrender.com'
let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io('https://mycodeblock-backend.onrender.com'); // Adjust the URL as needed
        console.log('Socket initialized');
    }
    return socket;
};
