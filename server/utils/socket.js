const { Server } = require('socket.io');
const constants = require('../constants');

let io;

const initSocket = (server) => {
        const io = new Server(server, {
        cors: {
            origin: constants.localClientURL, // Allowing requests from this origin
            methods: ["GET", "POST"] // Allowing only GET and POST methods
        }
    });

    const roomUsers = {};

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join-room', (room) => {
            if (!roomUsers[room]) {
                roomUsers[room] = [];
            }

            const isMentor = roomUsers[room].length === 0; // First user in the room is the mentor
            roomUsers[room].push(socket.id); // Add user to the room

            socket.join(room); // Join the user to the room
            console.log(`User ${socket.id} joined room ${room} as ${isMentor ? 'mentor' : 'student'}`);

            // Send the role to the client
            io.to(socket.id).emit('set-role', isMentor ? 'mentor' : 'student');

            socket.on('code-change', (data) => {
                const { room, code } = data;
                io.to(room).emit('code-update', code);
            });

            // Handle 'leave-room' event when a user leaves the room
            socket.on('leave-room', () => {
                try {
                    console.log(`User ${socket.id} left room ${room}`);
                    roomUsers[room] = roomUsers[room].filter(id => id !== socket.id); // Remove the user from the room
                    socket.leave(room); // Leave the socket room
                    if (roomUsers[room].length === 0) {
                        delete roomUsers[room]; // Delete the room if it's empty
                    }
                } catch (error) {
                    console.log('All ok we just tried to clean the room');
                }
            });

            // Handle 'disconnect' event when a user disconnects
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                try {
                    roomUsers[room] = roomUsers[room].filter(id => id !== socket.id); // Remove the user from the room
                    if (roomUsers[room].length === 0) {
                        console.log('room deleted');
                        delete roomUsers[room]; // Delete the room if it's empty
                    }
                } catch (error) {
                    console.log('All ok we just tried to clean the room');
                }
            });
        });
    });
    return io
}

module.exports = initSocket;


