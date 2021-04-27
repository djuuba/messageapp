const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cors = require('cors');
const {addUser, getUser, deleteUser, getUsers, getRoomList, joinRoom, leaveRoom, getCurrentRoom, saveMessage, getMessageList} = require('./users');

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
        saveMessage(getUser(socket.id), getCurrentRoom(socket.id), message);
        io.to(getCurrentRoom(socket.id)).emit('message', getMessageList(getCurrentRoom(socket.id)))
    });

    socket.on('username', (username) => {
        console.log(`Client ID ${socket.id} created user ${username}.`);
        addUser(socket.id, username);
    });

    socket.on('joinroom', (roomname, currentRoom) => {
        if (currentRoom) {
          socket.leave(currentRoom);
        }
        console.log(`User ${getUser(socket.id)} joined room ${roomname}.`)
        joinRoom(socket.id, roomname);
        socket.join(roomname);
        io.to(getCurrentRoom(socket.id)).emit('message', getMessageList(getCurrentRoom(socket.id)))
        socket.to(roomname).emit('joinroom', `${getUser(socket.id)} joined ${roomname}`)
    })

    socket.on('leaveroom', (roomname) => {
        console.log(`User ${getUser(socket.id)} left room ${roomname}.`);
        leaveRoom(socket.id, roomname);
        socket.leave(roomname);
        socket.to(roomname).emit('leaveroom', getUser(socket.id))
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
