import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import { dirname } from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4545;

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("user_join", (data) => {
    socket.username = data;
    socket.broadcast.emit("user_join", data);
  });

  socket.on("chat_message", (data) => {
    data.username = socket.username;
    socket.broadcast.emit("chat_message", data);
  });

  socket.on("disconnect", (data) => {
    socket.broadcast.emit("user_leave", socket.username);
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
