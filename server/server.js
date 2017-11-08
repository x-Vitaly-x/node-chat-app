const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user!");

    // socket.emit from Admin text - Welcome to chat app
    // socket.broadcast.emit from Admin - New user joined

    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app!"));

    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined!"));

    socket.on("createMessage", (message, callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text)); // broadcast to everyone
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords, callback) => {
        socket.broadcast.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longitude));
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(port, () => {
    console.log(`server started on ${port}`);
});

