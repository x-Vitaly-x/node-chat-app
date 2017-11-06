const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

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

    socket.emit("newMessage", {
        from: "Admin",
        text: "Welcome to the chat app!",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newMessage", {
        from: "Admin",
        text: "New user joined!",
        createdAt: new Date().getTime()
    });

    socket.on("createMessage", (message) => {
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // }); // broadcast to entire socket

        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        }); // broadcast to everyone but you
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(port, () => {
    console.log(`server started on ${port}`);
});

