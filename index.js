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
        const {error , user} = users.addUser({ id: socket.id, name, room });
        
        console.log('user is ',user);
        

        if (error) {
            return callback({ message: 'error unda'  });
        }

        socket.join(user.room);
        socket.broadcast.emit('newuseradded',user);
        

        socket.emit('message', { user: 'admin',text: `You joined to the ${user.room}` });
        socket.broadcast.emit('message', {user: 'admin', text: `${user.name} joined to the ${user.room}` });

        
    });

    socket.on('sendMessage',(message , callback)=>{
        const user = users.getUser(socket.id);
        console.log('user name is : ' ,user.name);


        socket.emit('message',{user: user.name , text: message});
        socket.broadcast.emit('message',{user: user.name , text: message});

        callback();
    })

    socket.on('disconnect', (socket) => {
        users.removeUser(socket.id);
    })

})

app.use(router);

server.listen(PORT, () => console.log(`server is on ${PORT}`));

