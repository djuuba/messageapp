const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cors = require('cors');
const {addUser, getUser, deleteUser, getUsers, getRoomList} = require('./users');

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

    console.log(`Client with id ${socket.id} connected.`);

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id} said ${message}`);
    });

    socket.on('username', (username) => {
        console.log(`Client ID ${socket.id} created user ${username}.`);
        addUser(socket.id, username);
    });

    socket.on('joinroom', (roomname) => {
        console.log(`User ${getUser(socket.id)} joined room ${roomname}.`)
        socket.join(roomname);
        socket.to(roomname).emit('joinroom', `${getUser(socket.id)} joined the room.`)
    })

    socket.on('leaveroom', (roomname) => {
        console.log(`User ${getUser(socket.id)} left room ${roomname}.`)
        socket.leave(roomname);
        socket.to(roomname).emit('leaveroom', `${getUser(socket.id)} left the room.`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Client ID ${socket.id} with username ${getUser(socket.id)} disconnected.`);
      deleteUser(socket.id);
    });

   
});

app.get('/roomlist', (req, res) => {
    res.send(getRoomList());
})


server.listen(port, () => console.log(`Listening on port ${port}`));
