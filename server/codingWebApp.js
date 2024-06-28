const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import cors
const path = require('path');
const originRemote = "http://localhost:3001"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://mycodeblock.onrender.com", // Allowing requests from this origin
        methods: ["GET", "POST"] // Allowing only GET and POST methods
    }
});

const { MongoClient, ObjectId} = require('mongodb');
const uri = "mongodb+srv://ranbroda:WHWg7cJth5pVL5Ui@cluster0.vvzvvix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {});

// Object to keep track of users in each room
const roomUsers = {};

let db;

//Connecting to the DB
client.connect().then(() => {
    db = client.db('CodeBlocksDB');
    console.log('Connected to MongoDB');
}).catch(err => console.error('Failed to connect to MongoDB', err));

app.use(cors({
    origin: "https://mycodeblock.onrender.com",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// API to get a specific code block

app.get('/code-block/:id', async (req, res) => {
        const codeBlock = await db.collection('CodeBlocks').findOne({_id: new ObjectId(req.params.id)});
        if (codeBlock) {
            res.json(codeBlock);
        } else {
            res.status(404).send('Error: Code block not found');
        }
});

app.get('/code-block', async (req, res) => {
    const codeBlock = await db.collection('CodeBlocks').find({}).toArray();
    if (codeBlock) {
        res.json(codeBlock);
    } else {
        res.status(404).send('Error: Code block not found');
    }
});

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});