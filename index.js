const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const router = require("./router");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = socketio(server);

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");
const { callbackify } = require("util");

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined !` });

    socket.join(user.room);
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {user: 'admin', text: `${user.name} has left`});
    }
    console.log("User has left !!!");
  });
});

app.use(router);

server.listen(PORT, () => console.log("connect successfully !!!"));
