const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user!");

    // socket.emit from Admin text - Welcome to chat app
    // socket.broadcast.emit from Admin - New user joined
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room should not be blank.');
            return;
        }
        socket.join(params.room);
        // socket.leave(room)
        // io.emit -> io.to(room).emit
        // socket.broadcast.emit -> socket.broadcast.to(room).emit
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.')); // broadcast to you
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`)); // broadcast to everyone

        callback();
    });

    socket.on("createMessage", (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); // broadcast to everyone
        }
        callback();
    });

    socket.on('createLocationMessage', (coords, callback) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on("disconnect", () => {
        console.log("DISCONN!");
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the building!`));
        }
    });
});

server.listen(port, () => {
    console.log(`server started on ${port}`);
});

