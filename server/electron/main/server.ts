import express from "express";
import { Server } from "socket.io";
const app = express();

const server = require("http").createServer(app);
const io = new Server(server);
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});
server.listen(4000, () => {
    console.log("listening on *:4000");
});
io.on("connection", (socket) => {
    console.log("a user connected");
});
