const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 5000;
const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const users = require('./users');

io.on('connection', (socket) => {
    console.log('we had a new connection');

    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = users.addUser({ id: socket.id, name, room });

        console.log('user is ', user);


        if (error) {
            return callback({ message: 'error unda' });
        }

        socket.join(user.room);
        socket.broadcast.emit('newuseradded', user);


        socket.emit('message', { user: 'admin', text: `You joined to the ${user.room}` });
        socket.broadcast.emit('message', { user: 'admin', text: `${user.name} joined to the ${user.room}` });
    });

    socket.on('fetchFeed', async (name) => {
        const userFeed = await users.getVideo(name);
        socket.emit('userFeed' , userFeed);
        console.log('userFeed', userFeed);
    })

    socket.on('sendMessage', (data, callback) => {
        const user = users.getUser(socket.id);
        users.addMessage(data);
        console.log('user name is : ', user);


        socket.emit('message', { user: user.name, text: data.message, time: data.time });
        socket.broadcast.emit('message', { user: user.name, text: data.message, time: data.time });

        callback();
    })
    socket.on('addUrl', ({ name, url }) => {
        users.addVideo({ name, url });

    })
    socket.on('disconnect', (socket) => {
        console.log('in disconnect socket id is : ', socket.id);
        users.removeUser(socket.id);
    })

})

app.use(router);

server.listen(PORT, () => console.log(`server is on ${PORT}`));

