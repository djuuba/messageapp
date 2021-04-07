const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cors = require('cors');
const {addUser, getUser, deleteUser, getUsers} = require('./users');

const app = express();

app.use(cors());
/*app.options('*', cors());  // enable pre-flight*/

const port = process.env.PORT || 4001
const index = require('./routes/index');
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
