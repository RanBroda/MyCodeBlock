const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
// const { Server } = require('socket.io');
const cors = require('cors'); // Import cors
// const path = require('path');
const constants = require('./constants');
const connectDB = require('./utils/database');
const initSocket = require('./utils/socket')
const app = express();
const server = http.createServer(app);
const path = require('path');

app.use(cors({
    origin: constants.remoteClientURL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

//Connecting to the DB
connectDB.initConnectDB().then(() => {
    const codeBlockRoutes = require('./routes/codeBlockRoutes');
    // Use routes after the database connection is established
    app.use('/api', codeBlockRoutes);

    app.get('/', (_, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    const io = initSocket(server);

    server.listen(constants.PORT, () => {
        console.log(`Server running on port ${constants.PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
  });;

