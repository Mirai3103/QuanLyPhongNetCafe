import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import realtimeService from "../services/RealtimeService";
const app = express();
const server = http.createServer(app);
app.get("/", (req, res) => {
    res.send("Cút đi");
});
server.listen(4444, () => {
    console.log("listening on *:4444");
});

const io = new Server(server);

io.use((socket, next) => {
    // get machine_id from socket.handshake.query
    // check if machine_id is valid
    // if valid, call next()
    // else, call next(new Error("invalid machine_id"))
    const handshakeData = socket.request;
    const machineId = (handshakeData as any)._query.machine_id;
    if (machineId) {
        return next();
    } else {
        return next(new Error("invalid machine_id"));
    }
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
